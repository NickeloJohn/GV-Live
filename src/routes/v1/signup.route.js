const express = require('express');
const { signUpUsingEmailAndPassword, verifyEmailOTP, resendEmailOTP } = require('../../controllers/signup.controller');
const validate = require('../../middlewares/validate');
const signUpValidation = require('../../validations/signup.validation');

const router = express.Router();


router.post('/email', validate(signUpValidation.signupEmailAndPassword), signUpUsingEmailAndPassword);
router.post('/verify-otp-email', validate(signUpValidation.verifyEmailOTP), verifyEmailOTP);
router.post('/resend-otp-email', validate(signUpValidation.resendEmailOTP), resendEmailOTP);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Sign Up
 *   description: Sign Up
 */

/**
 * @swagger
 * /signup/email:
 *   post:
 *     summary: Sign up as user
 *     tags: [Sign Up]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - cpassword
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
 *               cpassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               email: fake@gmail.com
 *               password: Password!@#$1
 *               cpassword: Password!@#$1
 * 
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
 *                  $ref: '#/components/schemas/SignupEmail'
 */