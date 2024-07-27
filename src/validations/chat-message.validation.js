const Joi = require('joi');
const { objectId } = require('./custom.validation');

const sendMessageValidation = {
  body: Joi.object().keys({
    message: Joi.string().optional().allow(""),
    roomId: Joi.string().required().messages({
      'string.base': `"roomId" should be a type of 'text'`,
      'string.empty': `"roomId" cannot be an empty field`,
      'any.required': `"roomId" is a required field`
    })
  })
};

module.exports = {
  sendMessageValidation
}
