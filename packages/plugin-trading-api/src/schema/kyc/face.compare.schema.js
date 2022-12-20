const FaceCompareRepository = require('../../repository/kyc/face.compare.repository');
const BaseSchema = require('../base.schema');

class FaceCompareSchema extends BaseSchema {
  validateParams = async (data) => {
    const { error } = this.Joi.object({
      image: this.Joi.string().required(),
      type: this.Joi.custom(this.helper.isNumber, 'custom validation')
        .valid(
          FaceCompareRepository.TYPE_NORMAL,
          FaceCompareRepository.TYPE_SMILE,
          FaceCompareRepository.TYPE_SAD
        )
        .required(),
    }).validate(data);

    this.helper.checkError(error);
  };
}

module.exports = FaceCompareSchema;
