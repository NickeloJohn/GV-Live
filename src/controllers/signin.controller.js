const httpStatus = require('http-status');

const { asyncHandler } = require('../middlewares/asyncHandler');
const { userService } = require('../services');
const { transformUser } = require('../transform/user.transform');

class SignInController {

  loginEmailAndPassword = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userService.loginEmailAndPassword(email, password);
    const { token, refreshToken } = await user.generateTokens();
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

  loginPhoneNumber = asyncHandler(async (req, res, next) => {
    const payload = req.body;
    payload.req = req;

    const user = await authService.loginPhoneNumber(payload);

    res.status(httpStatus.OK).send({
      c: httpStatus.OK,
      m: null,
      d: {
        userId: user?.id,
        isPhoneNumberVerified: user?.isPhoneNumberVerified
      }
    });
  });

  verifySMSPhoneNumber = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const user = await authService.verifySMSPhoneNumber(payload);
    const token = await tokenService.getSignedJwToken(user);

    res.status(httpStatus.OK).send({
      c: httpStatus.OK,
      m: null,
      d: {
        token: token?.access_token,
        refreshToken: token?.refresh_token,
        ...(await transformSignInInformation(user))
      }
    });
  });

  signAsGoogle = asyncHandler(async (req, res, next) => {
    const auth = await authService.signAsGoogle(req);
    const token = await tokenService.getSignedJwToken(auth);

    res.status(httpStatus.OK).send({
      c: httpStatus.OK,
      m: null,
      d: {
        ...(await transformSignInInformation(auth)),
        tokens: {
          access: token?.access_token,
          refresh: token?.refresh_token
        }
      }
    });
  });

  signAsFacebook = asyncHandler(async (req, res, next) => {
    const auth = await authService.signAsFacebook(req);
    const token = await tokenService.getSignedJwToken(auth);

    res.status(httpStatus.OK).send({
      c: httpStatus.OK,
      m: null,
      d: {
        ...(await transformSignInInformation(auth)),
        tokens: {
          access: token?.access_token,
          refresh: token?.refresh_token
        }
      }
    });
  });

  signAsApple = asyncHandler(async (req, res, next) => {
    const auth = await authService.signAsApple(req);
    const token = await tokenService.getSignedJwToken(auth);

    res.status(httpStatus.OK).send({
      c: httpStatus.OK,
      m: null,
      d: {
        ...(await transformSignInInformation(auth)),
        tokens: {
          access: token?.access_token,
          refresh: token?.refresh_token
        }
      }
    });
  });

  getAppleIdData = asyncHandler(async (req, res, next) => {
    const auth = await authService.getAppleIdData(req);

    res.redirect(302, auth);
  });

  forgotPasswordStep1 = asyncHandler(async (req, res, next) => {
    results = await userService.forgotPasswordStep1(req);

    return res.status(200).json({
      c: httpStatus.OK,
      m: 'Successfully sent to your email password change',
      d: results
    });
  });

  forgotPasswordStep2 = asyncHandler(async (req, res, next) => {
    const user = await userService.forgotPasswordStep2(req);
    const { token, refreshToken } = await user.generateTokens(results);

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

  refreshToken = asyncHandler(async (req, res, next) => {
    const token = await tokenService.refreshToken(req);

    res.status(httpStatus.OK).send({
      c: httpStatus.OK,
      m: null,
      d: {
        tokens: {
          access: token?.access_token,
          refresh: token?.refresh_token
        }
      }
    });
  });
}



module.exports = new SignInController();
