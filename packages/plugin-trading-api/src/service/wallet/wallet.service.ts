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
  create = async (params: Prisma.WalletCreateInput, subdomain: string) => {
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
          tradeBalance: 0
        }
      },
      walletNumber: walletNumber.number,
      walletNumberId: walletNumber.id
    };
    wallet = await this.walletRepository.create(wallet);
    let query = {
      _id: wallet.userId
    };
    let user = await getUser(subdomain, query);
    console.log(user);
    wallet.user = user;
    return wallet;
  };

  edit = async (params: any) => {};
  remove = async () => {};
  getWalletList = async (
    subdomain: string,
    type?: Number,
    status?: Number,
    walletIds?: Number[]
  ) => {
    let where: any = {};
    if (type != null) where.type = type;
    if (status != null) where.status = status;
    if (walletIds != null) where.id = { in: walletIds };
    let include = {
      walletNumberModel: true,
      walletBalance: true,
      stockBalances: true,
      stockTransactions: true
    };
    let wallets = await this.walletRepository.findMany(where, include);
    let userIds = wallets.map(function(obj: any) {
      return obj.userId;
    });
    let query = {
      query: {
        _id: { $in: userIds }
      }
    };
    let users = await getUsers(subdomain, query);
    let user: any;
    wallets.forEach((el: any) => {
      user = users.find((x: any) => x._id == el.userId);
      if (user != undefined && user.details != undefined) {
        el.user = user.details;
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
    // for (i = 0; i < userWallet.length; i++) {
    //   userWallet[i].walletBalance.availableBalance =
    //     userWallet[i].walletBalance.balance -
    //     userWallet[i].walletBalance.holdBalance;
    // }
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

  getBalance = async params => {
    var wallet = await this.walletValidator.validateGet(params, true);

    return {
      balance: wallet.walletBalance.balance,
      holdBalance: wallet.walletBalance.holdBalance,
      availableBalance:
        wallet.walletBalance.balance - wallet.walletBalance.holdBalance
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
        name: 'Үндсэн номинал',
        currencyCode: currencyCode,
        userId: null,
        status: WalletConst.STATUS_ACTIVE,
        type: WalletConst.WALLET_TYPES.NOMINAL,
        walletBalance: {
          create: {
            balance: 0,
            holdBalance: 0,
            tradeBalance: 0
          }
        },
        walletNumber: walletNumberNominal.number,
        walletNumberId: walletNumberNominal.id
      };
      await this.walletRepository.create(nominalWallet);
      let nominalWalletFee = {
        name: 'Шимтгэлийн номинал',
        currencyCode: currencyCode,
        userId: null,
        status: WalletConst.STATUS_ACTIVE,
        type: WalletConst.WALLET_TYPES.NOMINAL_FEE,
        walletBalance: {
          create: {
            balance: 0,
            holdBalance: 0,
            tradeBalance: 0
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
