const Joi = require('joi');
const { objectId } = require('./custom.validation');

const buyCoinValidation = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId).required(),
  })
};

module.exports = {
  buyCoinValidation
}
