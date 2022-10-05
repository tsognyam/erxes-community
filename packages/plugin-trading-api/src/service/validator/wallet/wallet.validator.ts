import { WalletConst } from '../../../constants/wallet';
import WalletRepository from '../../../repository/wallet/wallet.repository';
import { defaultCurrency } from '../../../models/utils';
import BaseValidator from '../base.validator';
class WalletValidator extends BaseValidator {
  private walletRepository: WalletRepository = new WalletRepository();
  checkWallet = async (where: any, include: any = undefined) => {
    let wallet = await this.walletRepository.findFirst(where, include);
    if (!wallet) throw new Error('Wallet not found');
    return wallet;
  };
  checkNominalWallet = async (currencyCode: string) => {
    let wallet = await this.walletRepository.findNominalWallet(currencyCode);
    if (!wallet) throw new Error('Nominal wallet not found');
    return wallet;
  };
  validateCreate = async (params: any, subdomain: string) => {
    let currency = await defaultCurrency(subdomain);
    var { data } = this.validate(
      {
        currencyCode: this._joi
          .string()
          .min(3)
          .max(6)
          .default(currency),
        name: this._joi
          .string()
          .min(2)
          .max(30)
          .required(),
        type: this._joi
          .any()
          .allow(
            WalletConst.WALLET_TYPES.NOMINAL,
            WalletConst.WALLET_TYPES.ADMIN,
            WalletConst.WALLET_TYPES.MCSD,
            WalletConst.WALLET_TYPES.USER
          )
          .default(WalletConst.WALLET_TYPES.USER),
        status: this._joi
          .any()
          .allow(WalletConst.STATUS_ACTIVE, WalletConst.STATUS_INACTIVE)
          .default(WalletConst.STATUS_ACTIVE),
        userId: this._joi.string().required()
      },
      params
    );
    let wallet = await this.walletRepository.findFirst(
      {
        currencyCode: data.currencyCode,
        userId: data.userId,
        status: WalletConst.STATUS_ACTIVE
      },
      undefined
    );
    if (wallet) throw new Error('User wallet duplicated');
    return { data };
  };
  validateEdit = async params => {
    var { error, data } = this.validate(
      {
        walletId: this._joi.number().required(),
        name: this._joi
          .string()
          .min(2)
          .max(30),
        status: this._joi
          .any()
          .allow(
            WalletConst.STATUS_ACTIVE,
            WalletConst.STATUS_INACTIVE,
            WalletConst.STATUS_BLOCKED,
            WalletConst.STATUS_PENDING
          )
      },
      params
    );

    var wallet = await this.checkWallet({
      id: data.walletId
    });

    return { wallet, data };
  };

  validateGet = async (params: any, balance = false) => {
    var { error, data } = this.validate(
      {
        walletId: this._joi.number().required(),
        userId: this._joi.string().required()
      },
      params
    );

    return await this.checkWallet(
      {
        id: data.walletId,
        status: WalletConst.STATUS_ACTIVE,
        userId: data.userId
      },
      {
        walletBalance: balance
      }
    );
  };

  validateGetWalletWithUser = async params => {
    var { error, data } = this.validate(
      {
        userId: this._joi.string().required(),
        currencyCode: this._joi
          .string()
          .min(3)
          .max(6)
      },
      params
    );
    console.log(params);
    return await this.walletRepository.findbyUserId(
      data.userId,
      data.currencyCode
    );
  };
  validateGetNominalWallet = async params => {
    var { error, data } = this.validate(
      {
        currencyCode: this._joi
          .string()
          .min(3)
          .max(6)
      },
      params
    );
    return await this.walletRepository.findByType(data.currencyCode);
  };
}
export default WalletValidator;
