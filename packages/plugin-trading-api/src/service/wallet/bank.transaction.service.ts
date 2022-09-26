import BankTransactionRepository from '../../repository/wallet/bank.transaction.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
import { BankTransactionValidator } from '../validator/wallet/bank.transaction.validator';
import { TransactionConst } from '../../constants/wallet';
import { UserConst } from '../../constants/user';
import TransactionService from './transaction.service';
class BankTransactionService {
  private bankTransactionRepository: BankTransactionRepository;
  private bankTransactionValidator: BankTransactionValidator;
  private transactionService: TransactionService;
  constructor() {
    this.bankTransactionRepository = new BankTransactionRepository();
    this.bankTransactionValidator = new BankTransactionValidator();
    this.transactionService = new TransactionService();
  }
  chargeRequest = async (params: any, subdomain: string) => {
    let data = this.bankTransactionValidator.validateRequest(params);
    let NOMINAL_MNT = '100000';
    let NOMINAL_USD = '200000';
    let REG_MNT = '100000';
    let FEE_AMOUNT = 5000;
    let bankTransaction: any;
    if (data.Account == NOMINAL_USD && data.TXNSIGN == '+') {
      bankTransaction = {
        type: TransactionConst.TYPE_CHARGE,
        status: TransactionConst.STATUS_PENDING,
        amount: data.Amount,
        description: data.Desc,
        dater: new Date(),
        bank: data.bankCode,
        contAccountNo: data.ContAccount,
        recAccountNo: data.RecAccount,
        accountNo: data.Account,
        accountName: 'Харилцагч',
        currencyCode: data.Currency,
        jrno: data.JRNO,
        txnSign: data.TXNSIGN
      };
      bankTransaction = await this.bankTransactionRepository.create(
        bankTransaction
      );
      await this.checkRequest(bankTransaction, subdomain);
    } else if (data.Account == NOMINAL_MNT && data.TXNSIGN == '+') {
      bankTransaction = {
        type: TransactionConst.TYPE_CHARGE,
        status: TransactionConst.STATUS_PENDING,
        amount: data.Amount,
        description: data.Desc,
        dater: new Date(),
        bank: data.bankCode,
        contAccountNo: data.ContAccount,
        recAccountNo: data.RecAccount,
        accountNo: data.Account,
        accountName: 'Харилцагч',
        currencyCode: data.Currency,
        jrno: data.JRNO,
        txnSign: data.TXNSIGN
      };
      bankTransaction = await this.bankTransactionRepository.create(
        bankTransaction
      );
      await this.checkRequest(bankTransaction, subdomain);
    } else if (
      data.Account == REG_MNT &&
      data.TXNSIGN == '+' &&
      data.Amount == FEE_AMOUNT
    ) {
      bankTransaction = await this.registrationFee(params);
    } else {
      bankTransaction = {
        type: TransactionConst.TYPE_UNDEFINED,
        status: TransactionConst.STATUS_PENDING,
        amount: data.Amount,
        description: data.Desc,
        dater: new Date(),
        bank: data.bankCode,
        contAccountNo: data.ContAccount,
        recAccountNo: data.RecAccount,
        accountNo: data.Account,
        accountName: 'Харилцагч',
        currencyCode: data.Currency,
        jrno: data.JRNO,
        txnSign: data.TXNSIGN
      };
      bankTransaction = await this.bankTransactionRepository.create(
        bankTransaction
      );
    }
    return bankTransaction;
  };
  checkRequest = async (bankTransaction: any, subdomain: string) => {
    var wallet = await this.bankTransactionValidator.validateBankTransaction(
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
  registrationFee = async params => {
    let data = this.bankTransactionValidator.validateRequest(params);
    let bankTransaction: any = {
      type: TransactionConst.TYPE_REGFEE,
      status: TransactionConst.STATUS_PENDING,
      amount: data.Amount,
      description: data.Desc,
      dater: new Date(),
      bank: 'TDB',
      contAccountNo: data.ContAccount,
      recAccountNo: data.RecAccount,
      accountNo: data.Account,
      accountName: 'Харилцагч',
      currencyCode: data.Currency,
      jrno: data.JRNO,
      txnSign: data.TXNSIGN
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
  getBankTransactionList = async (ids?: Number[]) => {
    let where: any = {};
    if (ids != null) where.id = { in: ids };
    let include = {
      order: true,
      withdraw: true,
      Wallet: true
    };
    let wallets = await this.bankTransactionRepository.findMany(where, include);
    return wallets;
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
}
export default BankTransactionService;
