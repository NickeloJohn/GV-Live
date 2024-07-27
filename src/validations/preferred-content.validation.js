

const Joi = require('joi');

const createUserPreferredContentValidation = {
    body: Joi.object().keys({
      tags: Joi.array().items(Joi.string()).optional()
    })
};

module.exports = {
  createUserPreferredContentValidation
}