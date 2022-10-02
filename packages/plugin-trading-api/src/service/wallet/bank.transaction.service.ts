import BankTransactionRepository from '../../repository/wallet/bank.transaction.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
import BankTransactionValidator from '../validator/wallet/bank.transaction.validator';
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
      let nominalOrder = await this.transactionService.createTransactionOrder(
        undefined,
        nominalWallet,
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
      nominalOrder = await this.transactionService.confirmTransaction({
        orderId: nominalOrder.id,
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
