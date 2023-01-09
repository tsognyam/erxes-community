import { WithdrawConst } from '../../../constants/wallet';
import UserBankAccountRepository from '../../../repository/user/user.bank.account.repository';
import BankTransactionRepository from '../../../repository/wallet/bank.transaction.repository';
import WalletRepository from '../../../repository/wallet/wallet.repository';
import WithdrawRepository from '../../../repository/wallet/withdraw.repository';
import BaseValidator from '../base.validator';
import WalletValidator from './wallet.validator';
import { ErrorCode, CustomException } from '../../../exception/error-code';
import { getUser } from '../../../models/utils';
export default class WithdrawValidator extends BaseValidator {
  private walletRepository: WalletRepository;
  private withdrawRepository: WithdrawRepository;
  private bankTransactionRepository: BankTransactionRepository;
  private userBankAccountRepository: UserBankAccountRepository;
  private walletValidator: WalletValidator;
  constructor() {
    super();
    this.bankTransactionRepository = new BankTransactionRepository();
    this.userBankAccountRepository = new UserBankAccountRepository();
    this.walletRepository = new WalletRepository();
    this.withdrawRepository = new WithdrawRepository();
    this.walletValidator = new WalletValidator();
  }
  validateList = async params => {
    var { error, data } = this.validate(
      {
        type: this._joi.number(),
        status: this._joi.number(),
        take: this._joi.number(),
        skip: this._joi.number(),
        orderBy: this._joi.any(),
        userId: this._joi.number()
      },
      params
    );
    return data;
  };
  validateRequest = async params => {
    var { error, data } = this.validate(
      {
        walletId: this._joi.number().required(),
        type: this._joi
          .number()
          .required()
          .valid(WithdrawConst.TYPE_WALLET, WithdrawConst.TYPE_MCSD_ACCOUNT),
        userBankAccountId: this._joi.number(),
        amount: this._joi
          .number()
          .positive()
          .required(),
        description: this._joi.string()
      },
      params
    );

    var wallet = await this.walletValidator.checkWallet(
      {
        id: data.walletId
      },
      {
        walletBalance: true
      }
    );
    // var userBankAccount = await this.userBankAccountRepository.findUnique({
    //   id: data.userBankAccountId
    // });
    let user = await getUser({
      _id: wallet.userId
    });
    if (
      user.customFieldsDataByFieldCode.userBank == undefined ||
      user.customFieldsDataByFieldCode.userBankAccountNo == undefined
    ) {
      CustomException(ErrorCode.UserBankNotFoundException);
    }
    let bankAccount = {
      bank: user.customFieldsDataByFieldCode.userBank.value,
      accountNo: user.customFieldsDataByFieldCode.userBankAccountNo.value
    };
    let userBankAccount = {
      id: undefined,
      accountNo: user.customFieldsDataByFieldCode.userBankAccountNo.value,
      accountName: user.firstName
    };
    // if (
    //   data.userBankAccountId !== userBankAccount.userId
    // ) {
    //   CustomException(ErrorCode.InvalidUserAccountException);
    // }

    return { wallet, userBankAccount, data };
  };

  validateConfirm = async params => {
    var { error, data } = this.validate(
      {
        requestId: this._joi.number().required(),
        confirm: this._joi
          .number()
          .valid(0, 1)
          .required()
      },
      params
    );

    var withdraw = await this.withdrawRepository.findUnique(
      { id: data.requestId },
      {
        wallet: {
          select: {
            user: true
          }
        },
        bankTransaction: true
      }
    );
    if (withdraw == undefined) {
      CustomException(ErrorCode.WithdrawNotFoundException);
    }
    if (withdraw.status !== WithdrawConst.STATUS_NEW) {
      CustomException(ErrorCode.WithdrawAlreadyConfirmedException);
    }

    return { withdraw, data };
  };

  validateCancel = async params => {
    var { error, data } = this.validate(
      {
        requestId: this._joi.number().required(),
        userId: this._joi.string().required()
      },
      params
    );

    var withdraw = await this.withdrawRepository.findUnique(
      { id: data.requestId },
      {
        wallet: true,
        bankTransaction: true
      }
    );
    if (withdraw == undefined || withdraw.wallet.userId != data.userId) {
      CustomException(ErrorCode.WithdrawNotFoundException);
    }
    if (withdraw.status !== WithdrawConst.STATUS_NEW) {
      CustomException(ErrorCode.WithdrawAlreadyConfirmedException);
    }

    return { withdraw };
  };
}
