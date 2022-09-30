import WalletRepository from '../../../repository/wallet/wallet.repository';
import BaseValidator from '../base.validator';
import WalletValidator from './wallet.validator';
export class BankTransactionValidator extends BaseValidator {
  private walletRepository: WalletRepository = new WalletRepository();
  private walletValidator: WalletValidator = new WalletValidator();
  validateCharge = async params => {
    var { data } = this.validate(
      {
        walletId: this._joi.number().required(),
        amount: this._joi.number().required()
      },
      params
    );
    let wallet = await this.walletValidator.checkWallet(data.walletId);

    return { data, wallet };
  };
  validateRequest = params => {
    var { data } = this.validate(
      {
        contAccount: this._joi.string().required(),
        account: this._joi.string().required(),
        recAccount: this._joi.string().allow(''),
        accountName: this._joi.string().allow(''),
        bankCode: this._joi.string().allow(''),
        currencyCode: this._joi.string().required(),
        amount: this._joi.number().required(),
        date: this._joi.string(),
        txnsign: this._joi.string(),
        jrno: this._joi.string(),
        jritemno: this._joi.string(),
        availableBalance: this._joi.string(),
        desc: this._joi.string().required()
        // type: this._joi.number().required(),
      },
      params
    );
    data.Amount = parseFloat(data.Amount);
    return data;
  };

  validateBankTransaction = async (bankTransaction: any, subdomain: string) => {
    let walletIdentity = bankTransaction.description;
    var wallet = await this.walletRepository.findUserByWalletNumber(
      walletIdentity,
      subdomain
    );
    if (wallet == undefined) {
      throw new Error('Wallet not found');
    }
    let nominalWallet = await this.walletRepository.findNominalWallet(
      wallet.currencyCode
    );
    return { wallet, nominalWallet };
  };

  validateTransactionBankGW = async params => {
    var { data } = this.validate(
      {
        bank_transaction_out_id: this._joi.number().required(),
        account_no: this._joi.number().required(),
        account_name: this._joi.string().required(),
        bank_code: this._joi.string().required(),
        description: this._joi.string().required(),
        amount: this._joi.number().required(),
        type: this._joi
          .string()
          .required()
          .valid('0', '1', '2')
      },
      params
    );

    return data;
  };
}
