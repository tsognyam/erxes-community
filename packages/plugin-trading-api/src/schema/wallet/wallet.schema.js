const UserRepository = require('../../repository/user/user.repository');

const BaseSchema = require('../base.schema');
const ErrorCode = require('../../exception/error-code');

class WalletSchema extends BaseSchema {
  #walletRepository = WalletRepository.get();
  #userRepository = new UserRepository();

  #checkWallet = async id => {
    const wallet = await this.#walletRepository.findById(id);
    if (!wallet) {
      throw new Error(ErrorCode.InvalidWalletId);
    }

    return wallet;
  };

  #checkUser = async id => {
    const user = await this.#userRepository.findById(id);
    if (!user) {
      throw new Error(ErrorCode.InvalidParam);
    }

    return user;
  };

  validateCreateParams = async data => {
    const { error } = this.Joi.object({
      currency: this.Joi.string().min(3).max(6).required(),
      name: this.Joi.string().min(2).max(30),
      andWalletId: this.Joi.custom(this.helper.isNumber, 'custom validation').required(),
    }).validate(data);

    this.helper.checkError(error);

    await this.#checkUser(data.userId);
  };
}

module.exports = WalletSchema;
