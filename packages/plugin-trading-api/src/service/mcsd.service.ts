import HttpService from './request/http.service';
import Helper from '../middleware/helper.service';
import validator = require('../schema/mcsd.schema');
import TransactionMCSDRepository from '../repository/mcsd.repository';
// let { loggerMCSD } = require('../middleware/logger');
import TransactionMCSDValidator from './validator/mcsd.validator';
import StockRepository from '../repository/stock.repository';
import StockTransactionService from './wallet/stock.transaction.service';
import UserRepository from '../repository/user/user.repository';
import { WalletConst } from '../constants/wallet';
export default class Securities {
  http;
  baseUrl;
  username;
  password;
  repository;
  transactionValidator;
  stockRepository;
  stockTransactionService;
  userRepository;
  constructor() {
    this.init();
  }
  init = async () => {
    this.baseUrl = await Helper.getValueR('MCSD_BASEURL');
    this.username = await Helper.getValueR('MCSD_USERNAME');
    this.password = await Helper.getValueR('MCSD_PASSWORD');
    this.http = new HttpService(this.baseUrl);
    this.repository = new TransactionMCSDRepository();
    this.transactionValidator = new TransactionMCSDValidator();
    this.stockRepository = new StockRepository();
    this.stockTransactionService = new StockTransactionService();
    this.userRepository = new UserRepository();
  };

  options = (data, type = 1) => {
    let args;
    if (type == 1) {
      args = {
        request: data
      };
      args.request.LoginUser = {
        Password: this.password,
        Username: this.username
      };
    } else {
      args = {
        request: {}
      };
      args.request.LoginUser = {
        Password: this.password,
        Username: this.username
      };
    }
    return args;
  };
  GetAccounts = async data => {
    await this.transactionValidator.GetAccounts(data);

    var args = this.options(data, 1);
    return await this.http.requestSOAP('GetAccounts', args);
  };
  SetAccounts = async data => {
    let buildData = {
      Accounts: {
        Account: [{}]
      }
    };
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        await this.transactionValidator.SetAccounts(data[i]);
        buildData.Accounts.Account[i] = data[i];
      }
    }
    var args = this.options(buildData, 1);
    return await this.http.requestSOAP('SetAccounts', args);
  };

  GetAccountStatus = async data => {
    let buildData = {
      BDCAccountIds: {
        'arr:string': data.BDCAccountIds
      }
    };
    var args = this.options(buildData, 1);
    // await validator.GetAccounts(data);
    console.log('MCSD options', args);
    return await this.http.requestSOAP('GetAccountStatus', args);
  };

  UpdateAccounts = async data => {
    let buildData = {
      Accounts: {
        Account: [{}]
      }
    };
    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        await this.transactionValidator.UpdateAccounts(data[i]);
        buildData.Accounts.Account[i] = data[i];
      }
    }
    var args = this.options(buildData, 1);
    return await this.http.requestSOAP('UpdateAccounts', args);
  };

  GetBalance = async data => {
    var args = this.options(data, 2);
    args.request.MITPrefix = data.MITPrefix;
    return await this.http.requestSOAP('GetBalance', args);
  };

  SetPledge = async data => {
    var args: any = {
      request: {
        AccountNumber: data.AccountNumber,
        BDCId: data.BDCId,
        BeginDate: data.BeginDate,
        CustomerFirstName: data.CustomerFirstName,
        CustomerLastName: data.CustomerLastName,
        CustomerRegistryNumber: data.CustomerRegistryNumber,
        EndDate: data.EndDate
      }
    };
    args.request.LoginUser = {
      Password: this.password,
      Username: this.username
    };

    args.request.MITPrefix = data.MITPrefix;
    args.request.PledgeContractNumber = data.PledgeContractNumber;
    args.request.PledgeDayCount = data.PledgeDayCount;
    args.request.PledgeId = data.PledgeId;
    args.request.PledgeOfficialLetter = data.PledgeOfficialLetter;
    args.request.PledgeQuantity = data.PledgeQuantity;
    args.request.SecuritiesCode = data.SecuritiesCode;
    args.request.SecuritiesName = data.SecuritiesName;

    // args.request.MITPrefix = data.MITPrefix;
    return await this.http.requestSOAP('SetPledge', args);
  };

  ReleasePledge = async data => {
    var args: any = {
      request: {
        AccountNumber: data.AccountNumber,
        BDCId: data.BDCId,
        CustomerFirstName: data.CustomerFirstName,
        CustomerLastName: data.CustomerLastName,
        CustomerRegistryNumber: data.CustomerRegistryNumber
      }
    };
    args.request.LoginUser = {
      Password: this.password,
      Username: this.username
    };

    args.request.MITPrefix = data.MITPrefix;
    args.request.PledgeContractNumber = data.PledgeContractNumber;
    args.request.PledgeId = data.PledgeId;
    args.request.ReleaseDate = data.ReleaseDate;
    args.request.ReleaseOfficialLetter = data.ReleaseOfficialLetter;
    args.request.ReleaseQuantity = data.ReleaseQuantity;
    args.request.SecuritiesCode = data.SecuritiesCode;
    args.request.SecuritiesName = data.SecuritiesName;

    // args.request.MITPrefix = data.MITPrefix;
    return await this.http.requestSOAP('ReleasePledge', args);
  };

  GetPledgeStatus = async data => {
    var args = this.options(data, 2);
    args.request.PledgeId = data.PledgeId;
    return await this.http.requestSOAP('GetPledgeStatus', args);
  };

  GetInvestorFinalityNet = async data => {
    var args = this.options(data, 2);
    args.request.SettlementDate = data.SettlementDate;
    return await this.http.requestSOAP('GetInvestorFinalityNet', args);
  };

  GetSecuritiesCompanyFinalityNet = async data => {
    var args = this.options(data, 2);
    args.request.SettlementDate = data.SettlementDate;
    return await this.http.requestSOAP('GetSecuritiesCompanyFinalityNet', args);
  };

  GetClearingMemberFinalityNet = async data => {
    var args = this.options(data, 2);
    args.request.SettlementDate = data.SettlementDate;
    return await this.http.requestSOAP('GetClearingMemberFinalityNet', args);
  };

  GetClearingMemberObligationNet = async data => {
    var args = this.options(data, 2);
    args.request.SettlementDate = data.SettlementDate;
    return await this.http.requestSOAP('GetClearingMemberObligationNet', args);
  };

  GetAccountDetail = async data => {
    var args = this.options(data, 2);
    args.request.MITPrefix = data.MITPrefix;
    return await this.http.requestSOAP('GetAccountDetail', args);
  };

  SetBankInformation = async data => {
    var args: any = {
      request: {
        BankInfo: {
          BankAccountNumber: data.BankAccountNumber,
          BankCode: data.BDCId,
          BankInformationId: data.BankInformationId,
          BankName: data.BankName,
          MITPrefix: data.MITPrefix
        }
      }
    };
    args.request.LoginUser = {
      Password: this.password,
      Username: this.username
    };

    args.request.MITPrefix = data.MITPrefix;
    args.request.Type = data.Type;

    return await this.http.requestSOAP('SetBankInformation', args);
  };

  GetTransactions = async data => {
    var args = this.options(data, 1);

    return await this.http.requestSOAP('GetTransactions', args);
  };

  GetOneTransaction = async params => {
    let data = await this.transactionValidator.validateSaveTransaction(params);
    var args = this.options(data, 1);

    let res = await this.http.requestSOAP('GetTransactions', args);

    let transactions = res.GetTransactionsResult.Transactions.Transaction;

    let bulk: any = [];
    for (let i = 0; i < transactions.length; i++) {
      let transaction: any = {};

      transaction.accountId = parseInt(transactions[i].AccountId);
      transaction.accountNumber = transactions[i].AccountNumber;
      transaction.additional = transactions[i].Additional;
      transaction.bdcId = parseInt(transactions[i].BDCId);
      transaction.commission = parseFloat(transactions[i].Commission);
      transaction.description = transactions[i].Description;
      transaction.mitPrefix = transactions[i].MITPrefix;
      transaction.perPrice = parseFloat(transactions[i].PerPrice);
      transaction.securitiesCode = transactions[i].SecuritiesCode;
      transaction.securitiesName = transactions[i].SecuritiesName;
      transaction.securitiesQuantity = parseFloat(
        transactions[i].SecuritiesQuantity
      );
      transaction.tradeId = parseInt(transactions[i].TradeId);
      transaction.transactionDate = new Date(transactions[i].TransactionDate);
      transaction.transactionId = parseInt(transactions[i].TransactionId);
      transaction.transactionTypeId = parseInt(
        transactions[i].TransactionTypeId
      );
      transaction.transactionTypeName = transactions[i].TransactionTypeName;

      bulk[i] = transaction;
    }
    await this.repository.createMany(bulk);

    for (let i = 0; i < transactions.length; i++) {
      let transaction: any = {};

      transaction.accountId = parseInt(transactions[i].AccountId);
      transaction.accountNumber = transactions[i].AccountNumber;
      transaction.additional = transactions[i].Additional;
      transaction.bdcId = parseInt(transactions[i].BDCId);
      transaction.commission = parseFloat(transactions[i].Commission);
      transaction.description = transactions[i].Description;
      transaction.mitPrefix = transactions[i].MITPrefix;
      transaction.perPrice = parseFloat(transactions[i].PerPrice);
      transaction.securitiesCode = transactions[i].SecuritiesCode;
      transaction.securitiesName = transactions[i].SecuritiesName;
      transaction.securitiesQuantity = parseFloat(
        transactions[i].SecuritiesQuantity
      );
      transaction.tradeId = parseInt(transactions[i].TradeId);
      transaction.transactionDate = new Date(transactions[i].TransactionDate);
      transaction.transactionId = parseInt(transactions[i].TransactionId);
      transaction.transactionTypeId = parseInt(
        transactions[i].TransactionTypeId
      );
      transaction.transactionTypeName = transactions[i].TransactionTypeName;

      let stock = await this.stockRepository.getByStockcode(
        transaction.securitiesCode.toString()
      );
      if (stock) {
        if (
          transaction.transactionTypeId == 10 ||
          transaction.transactionTypeId == 11 ||
          transaction.transactionTypeId == 40 ||
          transaction.transactionTypeId == 41
        ) {
          try {
            let userWallet = await this.userRepository.findWithWalletByPrefix(
              transaction.mitPrefix.toString()
            );
            if (userWallet.length != 0) {
              let stockTran;
              if (
                transaction.transactionTypeId == 11 ||
                transaction.transactionTypeId == 40
              ) {
                stockTran = await this.stockTransactionService.w2w({
                  senderWalletId: WalletConst.NOMINAL,
                  receiverWalletId: userWallet[0].wallets[0].id,
                  stockCount: parseInt(transaction.securitiesQuantity),
                  stockCode: parseInt(transaction.securitiesCode)
                });
              } else if (
                transaction.transactionTypeId == 10 ||
                transaction.transactionTypeId == 41
              ) {
                stockTran = await this.stockTransactionService.w2w({
                  senderWalletId: userWallet[0].wallets[0].id,
                  receiverWalletId: WalletConst.NOMINAL,
                  stockCount: parseInt(transaction.securitiesQuantity),
                  stockCode: parseInt(transaction.securitiesCode)
                });
              }

              await this.stockTransactionService.confirmTransaction({
                orderId: stockTran.id,
                confirm: 1
              });
            }
          } catch (ex) {
            console.log('GetOneTransaction', transaction.mitPrefix);
          }
        }
      }
    }
    return res;
  };

  GetTransactionQuery = async params => {
    let data = await this.transactionValidator.validateGet(params);
    return data;
  };
  SetFeeAmount = async data => {
    var args: any = {
      request: {
        FeeAmount: data.FeeAmount,
        FeeDescription: data.FeeDescription,
        FeeType: data.FeeType
      }
    };
    args.request.LoginUser = {
      Password: this.password,
      Username: this.username
    };

    args.request.MITPrefix = data.MITPrefix;

    return await this.http.requestSOAP('SetFeeAmount', args);
  };

  SetTransfer = async data => {
    var args: any = {
      request: {
        Amount: data.Amount,
        Description: data.Description
      }
    };
    args.request.LoginUser = {
      Password: this.password,
      Username: this.username
    };

    args.request.RecieverBankAccountNumber = data.ReceiverBankAccountNumber;
    args.request.RecieverBankCode = data.ReceiverBankCode;
    args.request.RecieverIBAN = data.ReceiverIBAN;
    args.request.RecieverName = data.ReceiverName;
    args.request.SenderAccountNumber = data.SenderAccountNumber;
    args.request.SenderIBAN = data.SenderIBAN;
    args.request.ShareCode = data.ShareCode;
    args.request.TransferId = data.TransferId;

    return await this.http.requestSOAP('SetTransfer', args);
  };

  GetTransferStatus = async data => {
    var args = this.options(data, 2);
    args.request.TransferDate = data.TransferDate;
    args.request.TransferId = data.TransferId;
    return await this.http.requestSOAP('GetTransferStatus', args);
  };
}
