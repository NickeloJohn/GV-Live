const express = require('express');
const { loginEmailAndPassword, loginPhoneNumber, verifySMSPhoneNumber, signAsGoogle, signAsFacebook, forgotPasswordStep1, signAsApple, forgotPasswordStep2, refreshToken, getAppleIdData } = require('../../controllers/signin.controller');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const { uploadSingleFile } = require('../../utils/multer-upload');

const router = express.Router();

router.post('/get-apple-data/', uploadSingleFile, validate(authValidation.appleIdWebhhok), getAppleIdData);
router.post('/email', validate(authValidation.login), loginEmailAndPassword);
router.post('/number', validate(authValidation.loginPhoneNumber), loginPhoneNumber);
router.post('/google', validate(authValidation.loginAsGoogle), signAsGoogle);
router.post('/facebook', validate(authValidation.loginAsFacebook), signAsFacebook);
router.post('/apple', validate(authValidation.loginAsApple), signAsApple);
router.post('/refresh-token', validate(authValidation.refreshToken), refreshToken);

router.post('/verify-otp-sms', validate(authValidation.verifySMSPhoneNumber), verifySMSPhoneNumber);
router.post('/email/forgot-password-step-1', validate(authValidation.forgotPasswordStep1), forgotPasswordStep1);
router.post('/email/forgot-password-step-2', validate(authValidation.forgotPasswordStep2), forgotPasswordStep2);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /signin/email:
 *   post:
 *     summary: Sign as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               email: bataljade9614@gmail.com
 *               password: Password!@#$1
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 c:
 *                  $ref: '#/components/schemas/C'
 *                 m:
 *                  $ref: '#/components/schemas/M'
 *                 d:
 *                  type: object
 *                  properties:
 *                      user:
 *                          $ref: '#/components/schemas/User'
 *                      tokens:
 *                          $ref: '#/components/schemas/AuthTokens'
 */