const moment = require('moment');
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const { generateReferralCode, decryptData, defaultPaginate, ObjectId, getFullName, encryptPassword, decryptPassword } = require("../utils/functions");
const { createEmailOTP, createOTPNumber } = require('../utils/user');
const { sendEMAILChangePassword, sendEMAILOTP, sendEMAILOTPForgotPassword } = require('../utils/mailer_template');
const config = require('../config/config');
const Role = require('../models/Role');

class UserService {
  async getUserByEmail(email, select = null) {
    let results = User.findOne({ email }).select(select);
    if (select) {
      results = results.select(select);
    }

    return await results;
  }

  async getUserById(id, select = null) {
    let user = User.findById(id);
    if (select) {
      user = user.select(select);
    }

    user = await user;
    return user;
  }

  async getUserByIds(ids, select = null) {
    let user = User.find({
      _id: {
        $in: ids,
      },
    });
    if (select) {
      user = user.select(select);
    } else {
      user = user.select(
        "firstName middleName lastName fullName profilePicture email phoneNumber phoneNumberPrefix username totalFollowing totalFollower"
      );
    }
    return await user;
  }

  async updateUserByEmail(email, payload) {
    return User.findOneAndUpdate({ email }, payload, { new: true });
  }

  async getIsExistReferralCode(referralCode) {
    const referral = await User.exists({
      referralCode: referralCode,
    });
    return referral;
  }

  async createUser(payload) {
    const user = new User(payload);
    return await user.save();
  }

  async generateUserReferralCode() {
    let referralCode;
    let isReferralCodeExist;
    do {
      referralCode = generateReferralCode(10);
      isReferralCodeExist = await this.getIsExistReferralCode(referralCode);
    } while (isReferralCodeExist);

    return referralCode;
  }

  validateIsOtpExpired(expiredAt) {
    const dateToday = moment().toDate();
    expiredAt = moment(expiredAt).toDate();

    if (dateToday > expiredAt)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "The verification code has expired, please request a new one."
      );
  }

  validateIsCodeMatched(code, emailOTPCode) {
    if (code !== emailOTPCode)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "You entered the wrong verification code, please try again."
      );
  }

  async _isOtpNumberMatched(otpNumber, userOtpNumber) {}

  async verifyEmailOtp(payload) {
    const { userId, otpNumber } = payload;

    const user = await this.getUserById(userId);
    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );

    this.validateIsOtpExpired(user?.emailOTP?.expiredAt);
    this.validateIsCodeMatched(otpNumber, user?.emailOTP?.code);

    user.isEmailVerified = true;
    user.isVerified = true;
    user.updatedAt = moment().toDate();

    return await user.save();
  }

  async resendEmailOtp(userId) {
    const user = await this.getUserById(userId);
    if (!user)
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "User not found");
    if (user.isEmailVerified)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account is already verified please login your account"
      );

    const dateToday = new Date();
    const resendAt = new Date(user.emailOTP?.resendAt);

    if (dateToday > resendAt) {
      const otpNumber = createOTPNumber();
      user.emailOTP = {
        code: otpNumber,
        createdAt: new Date(),
        resendAt: moment().add(1, "minutes").toDate(),
        expiredAt: moment().add(5, "minutes").toDate(),
      };
      await user.save();
    }

    return user;
  }

  async loginEmailAndPassword(email, password) {
    const user = await this.getUserByEmail(email, "+password");
    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Invalid Username and Password"
      );

    const isPasswordMatch = user?.isPasswordMatch(password);
    if (!isPasswordMatch)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Invalid Username and Password"
      );

    if (!user?.isEmailVerified)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Please verify your email address"
      );

    return user;
  }

  async forgotPasswordStep1(req) {
    const { email, type } = req.body;

    const user = await this.getUserByEmail(email, "isEmailVerified email");
    if (!user || !user?.isEmailVerified)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );

    user.passwordChangeExpiredAt = moment().add(20, "minutes");

    // type: verify send otp to email
    // type: deeplink send email to change password
    if (type === "verify") {
      const otpNumber = createOTPNumber();
      user.emailOTPForgotPassword = {
        isVerified: false,
        code: otpNumber,
        createdAt: new Date(),
        resendAt: moment().add(1, "minutes").toDate(),
        expiredAt: moment().add(10, "minutes").toDate(),
      };
      await sendEMAILOTPForgotPassword(user);
    } else {
      await sendEMAILChangePassword(user);
    }
    await user.save();

    return {
      userId: user.id,
      passwordChangeExpiredAt: user.passwordChangeExpiredAt,
    };
  }

  async verifyEmailForgotPassword(payload) {
    const { userId, otpNumber } = payload;

    const user = await this.getUserById(userId, "+passwordChangeExpiredAt");

    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );

    console.log(user);
    this.validateIsOtpExpired(user?.emailOTPForgotPassword?.expiredAt);
    this.validateIsCodeMatched(otpNumber, user?.emailOTPForgotPassword?.code);

    user.emailOTPForgotPassword.isVerified = true;

    await user.save();

    return {
      userId: user.id,
      passwordChangeExpiredAt: user.passwordChangeExpiredAt,
    };
  }

  async forgotPasswordStep3(req) {
    const { password, token, userId } = req.body;

    let myUserId = null;
    if (token && !userId) {
      const id = decryptData(decodeURIComponent(token));
      myUserId = id;
    } else {
      myUserId = userId;
    }

    const user = await this.getUserById(myUserId, "+password +salt");

    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );
    if (User.isPasswordExpired(user))
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Password change expired"
      );
    if (!User.isAccountRegisteredViaNormalSignUp(user))
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not registered via sign up"
      );

    if (!user.emailOTPForgotPassword.isVerified)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Please verify your email otp first"
      );

    const { passwordSalt, passwordHash } = User.generatePassword(password);

    const payloadData = {
      password: passwordHash,
      salt: passwordSalt,
      passwordChangeExpiredAt: null,
      emailOTPForgotPassword: {
        isVerified: false,
        code: null,
        createdAt: null,
        resendAt: null,
        expiredAt: null,
      },
    };

    const result = await User.findByIdAndUpdate(myUserId, payloadData, {
      new: true,
    });

    return result;
  }

  async getAllUserSuggestToFollow(req) {
    const userId = req.user.id;

    const options = { ...defaultPaginate(req.query) };

    const aggregate = User.aggregate([
      { $sample: { size: await User.countDocuments() } },
      { $match: { _id: { $ne: new ObjectId(userId) } } },
      {
        $project: {
          _id: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          fullName: 1,
          email: 1,
          phoneNumber: 1,
          phoneNumberPrefix: 1,
          profilePicture: 1,
        },
      },
    ]);

    const paginatedResult = await User.aggregatePaginate(aggregate, options);

    return paginatedResult;
  }

  async getMe(req) {
    let { user } = req;
    user = await this.getUserById(user.id);
    return user;
  }

  async updateProfile(req) {
    const { body, user, params } = req;

    if (params.userId !== "me" && user.id !== params.userId)
      throw new ErrorResponse(
        httpStatus.FORBIDDEN,
        "You are not allowed to update this user profile."
      );
    const userId = params.userId === "me" ? user.id : params.userId;

    const {
      firstName,
      middleName,
      lastName,
      birthday,
      gender,
      address,
      languages,
      sign,
      bio,
    } = body;

    const setPayload = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      fullName: `${getFullName(body)}`,
      birthday: birthday,
      gender: gender,
      address: {
        houseNumber: address.houseNumber,
        street: address.street,
        stateOrRegion: address.stateOrRegion,
        province: address.province,
        townCity: address.townCity,
        barangay: address.barangay,
        zipCode: address.zipCode,
      },
      languages: languages,
      sign: sign,
      bio: bio,
    };

    await User.findOneAndUpdate({ _id: userId }, setPayload, { new: true });
    return {};
  }

  async signupPassword(req) {
    const { password } = req.body;

    const user = await this.getUserById(req.user.id, "+password");
    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );

    if (user.password)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Password already created"
      );

    user.password = password;

    if (!user.settings) {
      user.settings = {
        isPasswordSet: true,
      };
    } else {
      user.settings.isPasswordSet = true;
    }

    return await user.save();
  }

  async getUserByReferralCode(referralCode, select = null) {
    const user = User.findOne({ referralCode });
    if (select) {
      user.select(select);
    }
    return await user;
  }

  async updateSettingsByUserId(userId, payload) {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          settings: payload,
        },
      },
      { new: true }
    );

    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );

    return user;
  }

  validateFingerprint(fingerprintUID, storedFingerprintUID) {
    if (!storedFingerprintUID) {
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Fingerprint not set yet"
      );
    }
    if (fingerprintUID !== decryptPassword(storedFingerprintUID)) {
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Fingerprint not matched"
      );
    }
  }

  validateFaceId(faceIdUID, storedFaceIdUID) {
    if (!storedFaceIdUID) {
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "Face ID not set yet");
    }
    if (faceIdUID !== decryptPassword(storedFaceIdUID)) {
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "Face ID not matched");
    }
  }

  async setFingerprint(req) {
    const { fingerprintUID, type } = req.body;

    const user = await this.getUserById(req.user.id, "+fingerprint.uid");
    if (!user) {
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );
    }

    switch (type) {
      case "set":
        user.fingerprint = { uid: encryptPassword(fingerprintUID) };
        if (!user.settings?.isFingerPrintSet)
          user.settings.isFingerPrintSet = true;

        break;
      case "login":
        this.validateFingerprint(fingerprintUID, user.fingerprint?.uid);
        user.lastLoginAt = new Date();
        break;
      default:
        throw new ErrorResponse(
          httpStatus.BAD_REQUEST,
          "Invalid type specified"
        );
    }

    await user.save();
    return user;
  }

  async setFaceId(req) {
    const { faceIdUID, type } = req.body;

    const user = await this.getUserById(req.user.id, "+faceId.uid");
    if (!user) {
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );
    }

    switch (type) {
      case "set":
        user.faceId = { uid: encryptPassword(faceIdUID) };
        user.settings.isFaceIdSet = true;
        if (!user.settings?.isFaceIdSet) user.settings.isFaceIdSet = true;

        break;
      case "login":
        this.validateFaceId(faceIdUID, user.faceId?.uid);
        user.lastLoginAt = new Date();
        break;
      default:
        throw new ErrorResponse(
          httpStatus.BAD_REQUEST,
          "Invalid type specified"
        );
    }

    await user.save();
    return user;
  }

  checkIfProfileIsCompleted(user) {
    const result = {};
    if (!user?.isEmailVerified) {
      result.isEmailVerified = false;
    }

    if (!user?.fingerprint?.uid) {
      result.isFingerprintSet = false;
    }

    if (!user?.faceId?.uid) {
      result.isFaceIdSet = false;
    }

    if (!user?.password) {
      result.isPasswordSet = false;
    }

    return result;
  }

  async chooseInterest(req) {
    const { interests } = req.body;
    console.log(req.user);
    const user = await this.getUserById(req.user.id);
    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account not found. Please sign up."
      );

    user.interests = interests;
    await user.save();

    return {};
  }

  async refreshToken(req) {
    const { refreshToken } = req.body;

    // catch to defined the specific error
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.secretRefreshKey);

      const user = await this.getUserById(
        decoded.id,
        "-emailOTP -emailOTPForgotPassword"
      );
      if (!user)
        throw new ErrorResponse(
          httpStatus.BAD_REQUEST,
          "Account not found. Please sign up."
        );

      return user;
    } catch (error) {
      if (error.name === "JsonWebTokenError") {
        throw new ErrorResponse(httpStatus.BAD_REQUEST, "Invalid token");
      }
    }
  }

  async getUserHistory(userId, actionType) {
    const user = await User.findById(userId).select("actionHistory");
    if (!user)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Account history not found"
      );

    let actionHistory = user.actionHistory;

    if (actionType) {
      actionHistory = actionHistory.filter(
        (action) => action.actionType === actionType
      );
    }

    actionHistory.sort((a, b) => b.date - a.date);
    return actionHistory;
  }

  async getUsersWithRoles() {
    const user = await User.find().select("username role permissions");
    if (!user)
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "User not found");

    return user;
  }

  async assignRoleToUser(userId, role) {
    const user = await User.findById(userId);
    if (!user)
      throw new ErrorResponse(httpStatus.BAD_REQUEST, "User not found");
    user.role = role;
    await user.save();
    return { message: "Role assigned successfully" };
  }

  async adjustPermissions(userId, permissions) {
    const user = await User.findById(userId);
    if (!user) throw new ErrorResponse(httpStatus.BAD_REQUEST, "User not found");
    user.permissions = permissions;
    await user.save();
    return { message: "Permissions adjusted successfully" };
  }

  async logRoleChange(userId, role) {
    const log = new RoleChangeLog({ userId, role, changedAt: new Date() });
    if (!log)
      throw new ErrorResponse(
        httpStatus.BAD_REQUEST,
        "Error logging role change"
      );
    await log.save();
  }
}

module.exports = new UserService();