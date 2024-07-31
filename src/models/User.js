const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const mongoosePaginate = require("mongoose-paginate-v2");
const jwt = require('jsonwebtoken');


const MongooseHelper = require('../utils/mongoose');
const { addUserToLocalADB2CWithPassword, authenticateUserUsingPassword } = require('../utils/azure-adb2c');
const { encryptPassword, decryptPassword, getFullName } = require('../utils/functions');
const { Database1 } = require('../utils/database');
const { transformImageUrl } = require('../utils/transform');
const { PROFILE_PRIVACY_STATUS } = require('../utils/constant');
const config = require('../config/config');
const { transformUser } = require('../transform/user.transform');
const UserPreferredContent = require('./UserPreferredContent');
const { array } = require('joi');

const ActionHistorySchema = new mongoose.Schema({
    actionType: String,
    details: String,
    date: { type: Date, default: Date.now },
  });

const Adb2cSchema = new mongoose.Schema({
    _id: false,
    username: {
        type: String,
        index: true
    },
    sub: {
        type: String,
        index: true
    },
    subsss: {
        type: String,
        index: true
    },
    subs: Array,
    passKey: {
        type: String
    }
});

const BankAccountSchema = new mongoose.Schema({
    name: {
        type: String
    },
    accountNo: {
        type: String
    },
    type: {
        type: String,
        enum: ['GCASH', 'MAYA', 'BPI', 'BDO']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
});

const FilesSchema = new mongoose.Schema(
    {
        fileType: {
            type: String,
            enum: ['profile-picture', 'merchant-picture', 'merchant-logo', 'front-banner', 'main-banner', 'diploma', 'signiture', 'signed-moa', 'digital-signed-marketing-consent']
        },
        filePath: String,
        filename: String,
        container: String,
        originalFilename: String,
        fileSize: Number,
        ...MongooseHelper.timeStamps
    }
);

const VetSchema = new mongoose.Schema(
    {
        specialty: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Cms',
                required: true
            }
        ],
        prc: {
            number: String,
            startDate: String,
            endDate: String,
        },
        ptrNumber: String,
        s2Number: String,
        hasAffiliatedWithHospital: {
            type: Boolean,
            default: false
        },
        medicalAssociations: {
            type: mongoose.Schema.ObjectId,
            ref: 'Cms',
        },
        hmoAffiliation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Cms',
        },
        nameSuffix: {
            type: String,
            default: "",
        },
        titleSuffix: {
            type: String,
            default: "",
        },
        documents: [FilesSchema]
    }
);

const AddressShippingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        phoneNumberPrefix: {
            type: String,
            trim: true,
            default: ''
        },
        phoneNumber: {
            type: String,
            trim: true,
            default: ''
        },
        houseAndUnitNumber: {
            type: String,
            trim: true
        },
        street: {
            type: String,
            trim: true
        },
        barangay: {
            type: String,
            trim: true
        },
        cityOrMunicipality: {
            type: String,
            trim: true
        },
        province: {
            type: String,
            trim: true
        },
        zipCode: {
            type: String,
            trim: true
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        islandGroupCode: {
            type: String,
            enum: ['luzon', 'visayas', 'mindanao']
        },
        region: {
            type: String,
            default: ""
        }
    },
    {
        select: false
    }
);

const SubscriptionPostCategorySchema = new mongoose.Schema({
        category: {
            type: mongoose.Schema.ObjectId,
            required: true
        },
        subCategories: [
            {
                type: mongoose.Schema.ObjectId
            }
        ]
    }
)

const FingerPrintSchema = new mongoose.Schema({
    uid: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false,
});

const FaceIdSchema = new mongoose.Schema({
    uid: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: false,
});

const SettingsSchema = new mongoose.Schema({
    isPasswordSet: {
        type: Boolean,
        default: false,
    },
    isFaceIdSet: {
        type: Boolean,
        default: false,
    },
    isFingerPrintSet: {
        type: Boolean,
        default: false,
    },
    isUseAlreadyReferralCode: {
        type: Boolean,
        default: false,
    }
}, 
{
    _id: false
});

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      index: true,
    },
    middleName: {
      type: String,
      default: "",
      index: true,
    },
    lastName: {
      type: String,
      default: "",
      index: true,
    },
    fullName: {
      type: String,
      default: "",
      index: true,
    },
    email: {
      type: String,
      default: "",
      index: true,
      unique: true,
    },
    username: {
      type: String,
      default: "",
      index: true,
      unique: true,
    },
    phoneNumberPrefix: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    birthday: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isNewUser: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      select: false,
    },
    passwordChangeExpiredAt: {
      type: Date,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      index: true,
    },
    facebookId: {
      type: String,
      index: true,
    },
    appleId: {
      type: String,
      index: true,
    },
    fingerprint: FingerPrintSchema,
    faceId: FaceIdSchema,
    emailOTP: {
      code: String,
      resendAt: Date,
      expiredAt: Date,
    },
    smsOTP: {
      code: String,
      resendAt: Date,
      expiredAt: Date,
    },
    emailOTPForgotPassword: {
      isVerified: Boolean,
      code: String,
      resendAt: Date,
      expiredAt: Date,
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },
    roles: {
      type: Array,
      default: "user",
    },
    permissions: { 
      type: [String],
      required: true },
    status: {
      type: String,
      enum: ["ACTIVE", "IN_ACTIVE", "DEACTIVATED", "DELETED"],
      default: "ACTIVE",
    },
    profile: {
      type: mongoose.Schema.ObjectId,
      ref: "Upload",
    },
    profilePicture: {
      type: Object,
    },
    country: {
      type: String,
      trim: true,
      uppercase: true,
      default: "PH",
    },
    adb2c: Adb2cSchema,
    address: {
      houseNumber: String,
      street: String,
      stateOrRegion: String,
      province: String,
      townCity: String,
      barangay: String,
      zipCode: String,
    },
    languages: {
      type: Array,
      default: [],
    },
    sign: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    addressShipping: [AddressShippingSchema],
    postCategories: {
      type: Array,
    },
    postSubCategories: {
      type: Array,
    },
    subscriptionPostCategories: [SubscriptionPostCategorySchema],
    interests: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
      },
    ],
    referralCode: {
      type: String,
      index: true,
      unique: true,
    },
    referralCount: {
      type: Number,
      default: 0,
      index: true,
    },
    isProfileFinish: {
      type: Boolean,
      default: false,
    },
    isRequestDeletedAccount: {
      type: Boolean,
      default: false,
    },
    profilePrivacy: {
      type: String,
      default: "private",
      enum: ["private", "public", "friends"],
      index: true,
    },
    updateCount: {
      type: Number,
      default: 0,
    },
    totalFollowers: {
      type: Number,
      default: 0,
      index: true,
    },
    totalFollowing: {
      type: Number,
      default: 0,
      index: true,
    },
    moderationActions: {
      type: Array,
      index: true,
    },
    accountHistory: [
      {
        actionType: { type: String, enum: ["warning", "timeout", "ban"] },
        actionDate: { type: Date, default: Date.now },
        details: String,
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    actionHistory: [ActionHistorySchema],
    isSuspended: { type: Boolean, default: false },
    suspension: {
      suspendedAt: { type: Date },
      suspensionEnds: { type: Date },
      reason: { type: String },
    },
    settings: SettingsSchema,
    ...MongooseHelper.timeStamps,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre('save', async function (next) {
    this.fullname = '';
    if (this?.firstName) this.fullname += this.firstName;
    if (this?.middleName) this.fullname += ' ' + this.middleName;
    if (this?.lastName) this.fullname += ' ' + this.lastName;

    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        this.salt = salt;
    }

    next();
});

UserSchema.statics.isPasswordExpired = (user) => {
    return (moment().toDate() > moment(user.passwordChangeExpiredAt).toDate())
}

UserSchema.statics.isAccountRegisteredViaNormalSignUp = (user) => {
    return (user.password && user.salt);
}

UserSchema.statics.generatePassword = (password) => {
    const passwordSalt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, passwordSalt);
    return {
        passwordHash,
        passwordSalt
    }
}

UserSchema.methods.isPasswordMatch = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
};

UserSchema.methods.generateTokens = async function () {
    const payload = transformUser(this);

    const preferredContent = await UserPreferredContent.findOne({ userId: payload.id });
    payload.preferredContent = preferredContent?.preferredContent || [];

    const token = jwt.sign(payload, config.jwt.secretExpirationKey, { expiresIn: '1d' });
    const refreshToken = jwt.sign(payload, config.jwt.secretRefreshKey, { expiresIn: '7d' });

    return {
      token, refreshToken
    }
};

UserSchema.methods.getSignedJwToken = async function () {
    const authenticate = await authenticateUserUsingPassword(this.adb2c.username, decryptPassword(this.adb2c.passKey));

    return { 
        token: authenticate?.access_token, 
        refreshToken: authenticate?.refresh_token,
        user: {
            role: this.role,
            id: this.id,
        }
    };
};

UserSchema.methods.addUserAdb2c = async function () {
    this.adb2c = {
        username: this.id,
        passKey: encryptPassword(this.id)
    };

    const results = await addUserToLocalADB2CWithPassword(this);
    if (results?.id) {
        this.adb2c = {
            username: this.id,
            passKey: encryptPassword(this.id),
            subs: [results.id],
            sub: results.id
        };
        this.save();
    }

    const authenticate = await authenticateUserUsingPassword(this.adb2c.username, decryptPassword(this.adb2c.passKey)); //authenticate user after adding in adb2c
    return { 
        results, 
        token: authenticate?.id_token, 
        refreshToken: authenticate?.refresh_token,
        user: {
            role: this.role,
            id: this.id,
        }
    };
};

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(require('mongoose-aggregate-paginate-v2'));

module.exports = Database1.model('User', UserSchema);
