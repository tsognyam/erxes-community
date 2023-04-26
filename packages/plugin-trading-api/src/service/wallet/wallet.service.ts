import WalletRepository from '../../repository/wallet/wallet.repository';
import { WalletNumberService } from './wallet.number.service';
import { Prisma } from '@prisma/client';
import WalletValidator from '../validator/wallet/wallet.validator';
import { getUsers, getUser } from '../../models/utils';
import { WalletConst } from '../../constants/wallet';
import { ErrorCode, CustomException } from '../../exception/error-code';
class WalletService {
  private walletNumberService: WalletNumberService;
  private walletRepository: WalletRepository;
  private walletValidator: WalletValidator;
  constructor() {
    this.walletNumberService = new WalletNumberService();
    this.walletRepository = new WalletRepository();
    this.walletValidator = new WalletValidator();
  }
  createWallet = async (params: any, subdomain: string) => {
    let { data } = await this.walletValidator.validateCreate(params, subdomain);
    await this.createNominal(data.currencyCode);
    let walletNumber = await this.walletNumberService.generate();
    let wallet: any = {
      name: data.name,
      currencyCode: data.currencyCode,
      userId: data.userId,
      status: data.status,
      type: data.type,
      walletBalance: {
        create: {
          balance: 0,
          holdBalance: 0,
          incomingBalance: 0
        }
      },
      walletNumber: walletNumber.number,
      walletNumberId: walletNumber.id
    };
    wallet = await this.walletRepository.create(wallet);
    let query = {
      _id: wallet.userId
    };
    let user = await getUser(query);
    console.log(user);
    wallet.user = user;
    return wallet;
  };

  edit = async (params: any) => {};
  remove = async () => {};
  getWalletList = async (params, subdomain) => {
    let where: any = {};
    if (params.type != null) where.type = params.type;
    if (params.status != null) where.status = params.status;
    if (params.walletIds != null) where.id = { in: params.walletIds };
    if (!!params.currencyCode) where.currencyCode = { in: params.currencyCode };
    where.AND = [];
    if (!!params.companyIds)
      where.AND.push({ userId: { in: params.companyIds } });
    if (!!params.userIds) where.AND.push({ userId: { in: params.userIds } });
    if (!!params.prefix) where.user = { prefix: { in: params.prefix } };
    if (where.AND.length == 0) where.AND = undefined;
    if (!!params.sortField)
      params.orderBy = {
        [params.sortField]: params.sortDirection == '-1' ? 'asc' : 'desc'
      };
    if (params.sortField == 'balance') {
      params.orderBy = {
        walletBalance: {
          [params.sortField]: params.sortDirection == '-1' ? 'asc' : 'desc'
        }
      };
    }
    let include = {
      walletNumberModel: true,
      walletBalance: true,
      stockBalances: {
        select: {
          id: true,
          stockCode: true,
          walletId: true,
          balance: true,
          holdBalance: true,
          createdAt: true,
          updatedAt: true,
          stock: true
        }
      },
      //stockTransactions: true,
      user: true
    };
    let options: any = {
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy
    };
    let wallets = await this.walletRepository.findAll(where, include, options);
    let userIds = wallets.values.map(function(obj: any) {
      return obj.userId;
    });
    let query = {
      _id: { $in: userIds }
    };
    let users = await getUsers(query, subdomain);
    let user: any;
    wallets.values.forEach((el: any, index) => {
      user = users.find((x: any) => x._id == el.userId);
      if (user != undefined) {
        wallets.values[index].user.firstName = user.firstName;
        wallets.values[index].user.lastName = user.lastName;
      }
    });
    return wallets;
  };
  getWallet = async params => {
    var { wallet } = await this.walletValidator.validateGet(params);

    return wallet;
  };

  getWalletWithUser = async params => {
    var userWallet = await this.walletValidator.validateGetWalletWithUser(
      params
    );
    let i = 0;
    if (userWallet.length > 0) {
      for (i = 0; i < userWallet.length; i++) {
        userWallet[i].walletBalance.availableBalance =
          parseFloat(userWallet[i].walletBalance.balance) -
          parseFloat(userWallet[i].walletBalance.holdBalance);
        userWallet[i].walletBalance.tradeBalance =
          userWallet[i].walletBalance.availableBalance +
          parseFloat(userWallet[i].walletBalance.incomingBalance);
      }
    }
    return userWallet;
  };
  getNominalWallet = async params => {
    let nominalWallet = await this.walletValidator.validateGetNominalWallet(
      params
    );
    if (!nominalWallet)
      CustomException(ErrorCode.NominalWalletNotFoundException);
    return nominalWallet;
  };
  getNominalWalletBalance = async (params: any) => {
    let nominalWallet = await this.walletValidator.validateGetNominalWallet(
      params
    );
    if (!nominalWallet)
      CustomException(ErrorCode.NominalWalletNotFoundException);
    let nominalBalance = await this.walletRepository.getNominalWalletBalance(
      nominalWallet.currencyCode
    );
    nominalWallet.walletBalance.balance = nominalBalance.balance;
    nominalWallet.walletBalance.holdBalance = nominalBalance.holdBalance;
    nominalWallet.walletBalance.incomingBalance =
      nominalBalance.incomingBalance;
    nominalWallet.walletBalance.availableBalance =
      nominalBalance.balance - nominalBalance.holdBalance;
    nominalWallet.walletBalance.tradeBalance =
      parseFloat(nominalWallet.walletBalance.availableBalance) +
      parseFloat(nominalWallet.walletBalance.incomingBalance);
    return nominalWallet;
  };
  getBalance = async params => {
    var wallet = await this.walletValidator.validateGet(params, true);

    return {
      balance: wallet.walletBalance.balance,
      holdBalance: wallet.walletBalance.holdBalance,
      availableBalance:
        wallet.walletBalance.balance - wallet.walletBalance.holdBalance,
      tradeBalance:
        wallet.walletBalance.balance -
        wallet.walletBalance.holdBalance +
        wallet.walletBalance.incomingBalance
    };
  };
  createNominal = async (currencyCode: string) => {
    let wallet = await this.walletRepository.findNominalWallet(currencyCode);
    let feeWallet = await this.walletRepository.findNominalFeeWallet(
      currencyCode
    );
    if (!wallet && !feeWallet) {
      let walletNumberNominal = await this.walletNumberService.generate();
      let walletNumberNominalFee = await this.walletNumberService.generate();
      let nominalWallet = {
        name: 'Үндсэн номинал ' + currencyCode,
        currencyCode: currencyCode,
        userId: null,
        status: WalletConst.STATUS_ACTIVE,
        type: WalletConst.NOMINAL,
        walletBalance: {
          create: {
            balance: 0,
            holdBalance: 0,
            incomingBalance: 0
          }
        },
        walletNumber: walletNumberNominal.number,
        walletNumberId: walletNumberNominal.id
      };
      await this.walletRepository.create(nominalWallet);
      let nominalWalletFee = {
        name: 'Шимтгэлийн номинал ' + currencyCode,
        currencyCode: currencyCode,
        userId: null,
        status: WalletConst.STATUS_ACTIVE,
        type: WalletConst.NOMINAL_FEE,
        walletBalance: {
          create: {
            balance: 0,
            holdBalance: 0,
            incomingBalance: 0
          }
        },
        walletNumber: walletNumberNominalFee.number,
        walletNumberId: walletNumberNominalFee.id
      };
      await this.walletRepository.create(nominalWalletFee);
      return 'success';
    } else return 'Already created';
  };
}
export default WalletService;
