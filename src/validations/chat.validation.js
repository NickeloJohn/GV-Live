const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createChatRoomValidation = {
  body: Joi.object().keys({
    userIds: Joi.array().items(Joi.string().custom(objectId)).optional(),
  })
};

module.exports = {
  createChatRoomValidation
}
