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
        ContAccount: this._joi.string().required(),
        Account: this._joi.string().required(),
        RecAccount: this._joi.string().allow(''),
        AccountName: this._joi.string().allow(''),
        bankCode: this._joi.string().allow(''),
        Currency: this._joi.string().required(),
        Amount: this._joi.number().required(),
        Date: this._joi.string(),
        TXNSIGN: this._joi.string(),
        JRNO: this._joi.string(),
        JRITEMNO: this._joi.string(),
        AvailableBalance: this._joi.string(),
        Desc: this._joi.string().required()
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
    return wallet;
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
