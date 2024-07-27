
const Joi = require('joi');

class PostCommentValidation {

  savePostComment = {
    body: Joi.object().keys({
      content: Joi.string().required()
    })
  };

}

module.exports = new PostCommentValidation();