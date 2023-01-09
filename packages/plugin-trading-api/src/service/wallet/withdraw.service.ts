import {
  TransactionConst,
  WalletConst,
  WithdrawConst
} from '../../constants/wallet';
import BankTransactionRepository from '../../repository/wallet/bank.transaction.repository';
import TransactionOrderRepository from '../../repository/wallet/transaction.order.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
import WithdrawRepository from '../../repository/wallet/withdraw.repository';
import WithdrawValidator from '../validator/wallet/withdraw.validator';
import BankTransactionService from './bank.transaction.service';
import TransactionService from './transaction.service';
import WalletService from './wallet.service';
import { ErrorCode, CustomException } from '../../exception/error-code';
export default class WithdrawService {
  private transactionOrderRepository: TransactionOrderRepository;
  private bankTransactionRepository: BankTransactionRepository;
  private withdrawValidator: WithdrawValidator;
  private withdrawRepository: WithdrawRepository;
  private transactionService: TransactionService;
  private bankTransactionService: BankTransactionService;
  private walletRepository: WalletRepository;
  private walletService: WalletService;
  constructor() {
    this.transactionOrderRepository = new TransactionOrderRepository();
    this.bankTransactionRepository = new BankTransactionRepository();
    this.withdrawRepository = new WithdrawRepository();
    this.withdrawValidator = new WithdrawValidator();
    this.transactionService = new TransactionService();
    this.bankTransactionService = new BankTransactionService();
    this.walletRepository = new WalletRepository();
    this.walletService = new WalletService();
  }
  getWithdrawList = async params => {
    let data = await this.withdrawValidator.validateList(params);

    return await this.withdrawRepository.getWithdrawList(data);
  };

  cancelWithdraw = async params => {
    var { withdraw } = await this.withdrawValidator.validateCancel(params);
    console.log(withdraw);
    if (withdraw.type == WithdrawConst.TYPE_WALLET) {
      if (
        withdraw.bankTransaction == undefined ||
        withdraw.bankTransaction.orderId == null
      )
        CustomException({
          status: 500,
          message: 'BankTransaction Not found'
        });
      let cancelParams = {
        orderId: withdraw.bankTransaction.orderId,
        confirm: 0
      };
      const canceltran = await this.transactionService.confirmTransaction(
        cancelParams
      );

      await this.bankTransactionRepository.update(withdraw.bankTransaction.id, {
        status: TransactionConst.STATUS_CANCELED
      });
      return await this.withdrawRepository.update(withdraw.id, {
        status: WithdrawConst.STATUS_CANCELED
      });
    } else {
      return await this.withdrawRepository.update(withdraw.id, {
        status: WithdrawConst.STATUS_CANCELED
      });
    }
  };

  requestWithdraw = async params => {
    var {
      wallet,
      userBankAccount,
      data
    } = await this.withdrawValidator.validateRequest(params);
    if (data.description == undefined) {
      data.description = 'Зарлагын хүсэлт илгээлээ';
    }
    let withdraw;
    if (data.type == WithdrawConst.TYPE_WALLET) {
      withdraw = await this.createTransactionWithdraw(
        wallet,
        userBankAccount,
        data
      );
    } else if (data.type == WithdrawConst.TYPE_MCSD_ACCOUNT) {
      //checkbalance

      // let mcsdBalance = await this.walletService.getMCSDBalance({ userId: wallet.userId });
      // let avBalance = mcsdBalance[0].walletBalance - mcsdBalance[0].holdBalance;
      // if (avBalance < data.amount) {
      //     throw new WalletBalanceException();
      // }

      var withdrawData = {
        walletId: wallet.id,
        amount: data.amount,
        type: data.type,
        status: WithdrawConst.STATUS_NEW,
        description: data.description,
        dater: new Date(),
        createUserId: wallet.userId
      };

      withdraw = await this.withdrawRepository.create(withdrawData);
    }

    return withdraw;
  };

  createTransactionWithdraw = async (wallet, userBankAccount, data) => {
    let feeAmount: number = 0;
    // calculate fee
    if (wallet.currencyCode == 'MNT') {
      // let transactionLimit = await Helper.getValueR('TransactionLimit');
      // if (data.amount > transactionLimit) {
      //     if (userBankAccount.bankCode == McsdConst.BANK_CODE_TDB) {
      //         feeAmount = await Helper.getValueR('TDBTransactionFeeLarge');
      //     } else {
      //         feeAmount = await Helper.getValueR('BankTransactionFeeLarge');
      //     }
      // } else {
      //     if (userBankAccount.bankCode == McsdConst.BANK_CODE_TDB) {
      //         feeAmount = await Helper.getValueR('TDBTransactionFee');
      //     } else {
      //         feeAmount = await Helper.getValueR('BankTransactionFee');
      //     }
      // }
    }
    if (wallet.currencyCode == 'USD') {
      // let transactionLimit = await Helper.getValueR('TransactionLimit');
      // if (data.amount > transactionLimit) {
      //     if (userBankAccount.bankCode == McsdConst.BANK_CODE_TDB) {
      //         feeAmount = await Helper.getValueR('TDBTransactionFeeLarge');
      //     } else {
      //         feeAmount = await Helper.getValueR('BankTransactionFeeLarge');
      //     }
      // } else {
      //     if (userBankAccount.bankCode == McsdConst.BANK_CODE_TDB) {
      //         feeAmount = await Helper.getValueR('TDBTransactionFee');
      //     } else {
      //         feeAmount = await Helper.getValueR('BankTransactionFee');
      //     }
      // }
    }

    data.amount = parseFloat(data.amount);

    var order = await this.transactionService.w2w({
      senderWalletId: wallet.id,
      receiverWalletId: undefined,
      amount: data.amount,
      feeAmount: feeAmount,
      type: TransactionConst.TYPE_WITHDRAW,
      description: data.description
    });

    let withdraw: any = {
      walletId: wallet.id,
      userBankAccountId: userBankAccount.id,
      amount: data.amount,
      feeAmount: feeAmount,
      type: data.type,
      status: WithdrawConst.STATUS_NEW,
      description: data.description,
      dater: new Date(),
      createUserId: wallet.userId
    };
    let bankName = '';
    withdraw = await this.withdrawRepository.create(withdraw);
    let bankTransaction = {
      type: TransactionConst.TYPE_WITHDRAW,
      amount: data.amount,
      currencyCode: wallet.currencyCode,
      status: TransactionConst.STATUS_PENDING,
      description: data.description,
      dater: new Date(),
      orderId: order.id,
      accountNo: userBankAccount.accountNo,
      accountName: userBankAccount.accountName,
      withdraw: {
        connect: { id: withdraw.id }
      }
    };
    await this.bankTransactionRepository.create(bankTransaction);

    return withdraw;
  };

  confirmWithdraw = async params => {
    var { withdraw, data } = await this.withdrawValidator.validateConfirm(
      params
    );
    let tran = false;
    if (withdraw.type == WithdrawConst.TYPE_WALLET) {
      if (data.confirm == 1) {
        withdraw = await this.withdrawRepository.update(
          withdraw.id,
          {
            status: WithdrawConst.STATUS_CONFIRMED
          },
          {
            wallet: true,
            // userBankAccount: true,
            bankTransaction: true
          }
        );
        tran = await this.doTransactionWithdraw(withdraw);
      } else {
        params.userId = withdraw.wallet.user.userId;
        delete params.confirm;
        tran = await this.cancelWithdraw(params);
      }
    } else if (withdraw.type == WithdrawConst.TYPE_MCSD_ACCOUNT) {
      if (data.confirm == 1) {
        await this.withdrawRepository.update(withdraw.id, {
          status: WithdrawConst.STATUS_SUCCESS
        });
        tran = true;
      }
    }
    return tran;
  };
  doTransactionWithdraw = async params => {
    //required to doing transaction on bank
    let isTransaction = true;
    if (isTransaction) {
      let withdraw = await this.withdrawRepository.findById(params.id, {
        bankTransaction: true
      });
      let paramTransaction = {
        orderId: withdraw.bankTransaction.orderId,
        confirm: 1
      };
      let transaction = await this.transactionService.confirmTransaction(
        paramTransaction
      );
      await this.bankTransactionRepository.update(withdraw.bankTransaction.id, {
        status: TransactionConst.STATUS_SUCCESS
      });
      return await this.withdrawRepository.update(withdraw.id, {
        status: WithdrawConst.STATUS_SUCCESS
      });
    }
    return isTransaction;
  };
}
