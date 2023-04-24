import BankTransactionRepository from '../../repository/wallet/bank.transaction.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
import BankTransactionValidator from '../validator/wallet/bank.transaction.validator';
import { TransactionConst } from '../../constants/wallet';
import { UserConst } from '../../constants/user';
import TransactionService from './transaction.service';
import { Prisma } from '@prisma/client';
import NotificationService from '../notification.service';
import WalletService from './wallet.service';
import { CustomException, ErrorCode } from '../../exception/error-code';
class BankTransactionService {
  private bankTransactionRepository: BankTransactionRepository;
  private bankTransactionValidator: BankTransactionValidator;
  private transactionService: TransactionService;
  private notificationService: NotificationService;
  private walletService: WalletService;
  constructor() {
    this.bankTransactionRepository = new BankTransactionRepository();
    this.bankTransactionValidator = new BankTransactionValidator();
    this.transactionService = new TransactionService();
    this.notificationService = new NotificationService();
    this.walletService = new WalletService();
  }
  chargeV2 = async (params: any, subdomain: string) => {
    // if (process.env.NODE_ENV !== 'development') {
    //   throw new Error('This service only working dev mode');
    // }
    var {
      data,
      wallet,
      nominalWallet
    } = await this.bankTransactionValidator.validateCharge(params);
    var bankTransactionParam = {
      type: TransactionConst.TYPE_CHARGE,
      status: TransactionConst.STATUS_PENDING,
      amount: data.amount,
      description: 'Орлого',
      dater: new Date(),
      bankCode: '01',
      contAccountNo: '0',
      recAccountNo: '0',
      accountNo: '0',
      accountName: 'Харилцагч',
      currencyCode: wallet.currencyCode,
      jrno: '0',
      txnSign: '+',
      walletId: wallet.id
    };
    let bankTransaction = await this.bankTransactionRepository.create(
      bankTransactionParam,
      undefined,
      {
        wallet: {
          include: {
            walletBalance: true
          }
        },
        withdraw: true,
        order: true
      }
    );
    bankTransaction.wallet.walletBalance.balance =
      parseFloat(bankTransaction.wallet.walletBalance.balance) +
      parseFloat(bankTransaction.amount);
    let order = await this.transactionService.createTransactionOrder(
      undefined,
      wallet,
      {
        amount: bankTransaction.amount,
        feeAmount: 0,
        type: TransactionConst.TYPE_CHARGE,
        description: bankTransaction.description
      }
    );
    order = await this.transactionService.confirmTransaction({
      orderId: order.id,
      confirm: 1
    });
    await this.bankTransactionRepository.update(bankTransaction.id, {
      status: TransactionConst.STATUS_SUCCESS,
      message: 'test success',
      orderId: order.id
    });
    let sendParams = {
      subdomain: subdomain,
      subject: 'Орлого',
      content: 'Deposit',
      action: 'deposit',
      data:
        'Таны данс ' +
        data.amount +
        ' ' +
        (wallet.currencyCode == 'MNT' ? 'MNT' : 'USD') +
        '  цэнэглэгдлээ.',
      userId: wallet.userId,
      createdUserId: '1'
    };
    this.notificationService.send(sendParams);
    return bankTransaction;
  };
  chargeRequest = async (params: any, subdomain: string) => {
    let data = this.bankTransactionValidator.validateRequest(params);
    let NOMINAL_MNT = '100000';
    let NOMINAL_USD = '200000';
    let REG_MNT = '100000';
    let FEE_AMOUNT = 5000;
    let bankTransaction: any;
    if (data.account == NOMINAL_USD && data.txnsign == '+') {
      bankTransaction = {
        type: TransactionConst.TYPE_CHARGE,
        status: TransactionConst.STATUS_PENDING,
        amount: data.amount,
        description: data.desc,
        dater: new Date(),
        bankCode: data.bankCode,
        contAccountNo: data.contAccount,
        recAccountNo: data.recAccount,
        accountNo: data.account,
        accountName: 'Харилцагч',
        currencyCode: data.currency,
        jrno: data.jrno,
        txnSign: data.txnsign
      };
      bankTransaction = await this.bankTransactionRepository.create(
        bankTransaction
      );
      await this.checkRequest(bankTransaction, subdomain);
    } else if (data.account == NOMINAL_MNT && data.txnsign == '+') {
      bankTransaction = {
        type: TransactionConst.TYPE_CHARGE,
        status: TransactionConst.STATUS_PENDING,
        amount: data.amount,
        description: data.desc,
        dater: new Date(),
        bankCode: data.bankCode,
        contAccountNo: data.contAccount,
        recAccountNo: data.recAccount,
        accountNo: data.account,
        accountName: 'Харилцагч',
        currencyCode: data.currencyCode,
        jrno: data.jrno,
        txnSign: data.txnsign
      };
      bankTransaction = await this.bankTransactionRepository.create(
        bankTransaction
      );
      await this.checkRequest(bankTransaction, subdomain);
    } else if (
      data.account == REG_MNT &&
      data.txnsign == '+' &&
      data.amount == FEE_AMOUNT
    ) {
      bankTransaction = await this.registrationFee(params);
    } else {
      bankTransaction = {
        type: TransactionConst.TYPE_UNDEFINED,
        status: TransactionConst.STATUS_PENDING,
        amount: data.amount,
        description: data.desc,
        dater: new Date(),
        bank: data.bankCode,
        contAccountNo: data.contAccount,
        recAccountNo: data.recAccount,
        accountNo: data.account,
        accountName: 'Харилцагч',
        currencyCode: data.currencyCode,
        jrno: data.jrno,
        txnSign: data.txnsign
      };
      bankTransaction = await this.bankTransactionRepository.create(
        bankTransaction
      );
    }
    return bankTransaction;
  };

  checkRequest = async (bankTransaction: any, subdomain: string) => {
    let {
      wallet,
      nominalWallet
    } = await this.bankTransactionValidator.validateBankTransaction(
      bankTransaction,
      subdomain
    );

    if (wallet != undefined) {
      var order = await this.transactionService.createTransactionOrder(
        undefined,
        wallet,
        {
          amount: bankTransaction.amount,
          feeAmount: 0,
          type: TransactionConst.TYPE_CHARGE,
          description: bankTransaction.description
        }
      );
      await this.bankTransactionRepository.update(bankTransaction.id, {
        orderId: order.id,
        status: TransactionConst.STATUS_BLOCKED,
        message: 'create transaction error'
      });

      order = await this.transactionService.confirmTransaction({
        orderId: order.id,
        confirm: 1
      });
      if (
        order != undefined &&
        order.status === TransactionConst.STATUS_SUCCESS
      ) {
        await this.bankTransactionRepository.update(bankTransaction.id, {
          status: TransactionConst.STATUS_SUCCESS,
          message: 'success'
        });
      }
    } else {
      this.bankTransactionRepository.update(bankTransaction.id, {
        status: TransactionConst.STATUS_FAILED,
        message: 'Invalid description'
      });
    }
  };
  registrationFee = async (params: any) => {
    let data = this.bankTransactionValidator.validateRequest(params);
    let bankTransaction: any = {
      type: TransactionConst.TYPE_REGFEE,
      status: TransactionConst.STATUS_PENDING,
      amount: data.amount,
      description: data.desc,
      dater: new Date(),
      bankCode: params.bankCode,
      contAccountNo: data.contAccount,
      recAccountNo: data.recAccount,
      accountNo: data.account,
      accountName: 'Харилцагч',
      currencyCode: data.currencyCode,
      jrno: data.jrno,
      txnSign: data.txnsign
    };
    bankTransaction = await this.bankTransactionRepository.create(
      bankTransaction
    );
    let resRegex = UserConst.REGISTER_NUMBER_PATTERN.exec(
      bankTransaction.description
    );
    if (resRegex == null) {
      throw new Error('RegisterNumber is invalid');
    }
    let regNumber = resRegex[0];
    await this.bankTransactionRepository.update(bankTransaction.id, {
      status: TransactionConst.STATUS_SUCCESS,
      message: 'success'
    });
    return bankTransaction;
  };
  getBankTransactionList = async params => {
    var data = await this.bankTransactionValidator.validateBankTransactionList(
      params
    );
    let where: any = {};
    let options: any = {};
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    let dateFilter;
    if (data.startDate != undefined && data.endDate != undefined) {
      dateFilter = {
        dater: {
          gte: data.startDate,
          lte: data.endDate
        }
      };
    }
    where = {
      ...dateFilter,
      status: data.status
    };
    let include: Prisma.BankTransactionInclude = {
      order: true,
      withdraw: true,
      wallet: {
        include: {
          user: true
        }
      }
      // bank: true
    };
    let bankTransactionList = await this.bankTransactionRepository.findAll(
      where,
      include,
      options
    );
    return bankTransactionList;
  };
  getBankTransaction = async (id: Number) => {
    let where: any = {};
    where.id = id;
    let include = {
      order: true,
      withdraw: true,
      Wallet: true
    };
    let wallets = await this.bankTransactionRepository.findUnique(
      where,
      include
    );
    return wallets;
  };
  editBankTransactionWallet = async (params: any) => {
    let bankTransaction = await this.bankTransactionRepository.findById(
      params.id
    );
    if (!bankTransaction) throw new Error('Bank transaction cannot find');
    if (
      bankTransaction.status == TransactionConst.STATUS_PENDING &&
      bankTransaction.walletId == undefined &&
      bankTransaction.orderId == undefined
    ) {
      let wallet = await this.walletService.getWalletWithUser({
        userId: params.userId,
        currencyCode: bankTransaction.currencyCode
      });
      if (wallet.length == 0)
        CustomException(ErrorCode.WalletNotFoundException);
      var order = await this.transactionService.createTransactionOrder(
        undefined,
        wallet[0],
        {
          amount: bankTransaction.amount,
          feeAmount: 0,
          type: TransactionConst.TYPE_CHARGE,
          description: bankTransaction.description
        }
      );
      bankTransaction = await this.bankTransactionRepository.update(
        bankTransaction.id,
        {
          orderId: order.id,
          walletId: wallet[0].id,
          status: TransactionConst.STATUS_BLOCKED,
          message: 'create transaction error'
        },
        {
          order: true,
          withdraw: true,
          wallet: {
            include: {
              user: true
            }
          }
        }
      );

      order = await this.transactionService.confirmTransaction({
        orderId: order.id,
        confirm: 1
      });
      if (
        order != undefined &&
        order.status === TransactionConst.STATUS_SUCCESS
      ) {
        bankTransaction = await this.bankTransactionRepository.update(
          bankTransaction.id,
          {
            status: TransactionConst.STATUS_SUCCESS,
            message: 'Хэрэглэгчийг гараар тохируулав'
          },
          {
            order: true,
            withdraw: true,
            wallet: {
              include: {
                user: true
              }
            }
          }
        );
      }
      return bankTransaction;
    } else throw new Error('Cannot edit bank transaction');
  };
}
export default BankTransactionService;
