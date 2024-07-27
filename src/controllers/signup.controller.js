const httpStatus = require('http-status');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { userService } = require('../services');
const { createEmailOTP } = require('../utils/user');
const ErrorResponse = require('../utils/ErrorResponse');
const { sendVerifyEmailOTP } = require('../utils/mailer_template');
const { transformUser } = require('../transform/user.transform');

const signUpUsingEmailAndPassword = asyncHandler(async (req, res, next) => {
  const payload = req.body;

  const { email, password } = payload;

  let user = await userService.getUserByEmail(email);
  if (user && user?.isEmailVerified) {
    throw new ErrorResponse(httpStatus.BAD_REQUEST, 'Account already exists. Please sign in.');
  }

  const emailOTP = createEmailOTP();

  // if user exists but email is not verified, update the user
  if (user && !user?.isEmailVerified) {
    user = await userService.updateUserByEmail(email, { emailOTP, password });
  } else {
		const username = email.split('@')[0];
    user = await userService.createUser({
      email,
			username,
      password,
      referralCode: await userService.generateUserReferralCode(),
      emailOTP
    });
  }

  const emailSendData = {
    email,
    code: emailOTP.code
  };

  await sendVerifyEmailOTP(emailSendData);

  res.status(httpStatus.OK).send({
    c: httpStatus.OK,
    m: null,
    d: {
      userId: user?.id,
      isEmailVerified: user?.isEmailVerified
    }
  });
});

const verifyEmailOTP = asyncHandler(async (req, res, next) => {
  const payload = req.body;

  const user = await userService.verifyEmailOtp(payload);

  const { 
		token,
		refreshToken
	} = await user.generateTokens();

  res.status(httpStatus.OK).send({
    c: httpStatus.OK,
    m: null,
    d: {
      ...transformUser(user),
      tokens: {
        access: token,
        refresh: refreshToken
      }
    }
  });
});

const resendEmailOTP = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  const user = await userService.resendEmailOtp(userId);

	const emailSendData = {
    email: user.email,
    code: emailOTP.code
  };

  await sendVerifyEmailOTP(emailSendData);

  res.status(httpStatus.OK).send({
    c: httpStatus.OK,
    m: null,
    d: {}
  });
});

module.exports = {
  signUpUsingEmailAndPassword,
  verifyEmailOTP,
  resendEmailOTP
};
