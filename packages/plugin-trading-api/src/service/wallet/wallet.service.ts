import WalletRepository from '../../repository/wallet/wallet.repository';
import { WalletNumberService } from './wallet.number.service';
import { Prisma } from '@prisma/client';
import WalletValidator from '../validator/wallet/wallet.validator';
import { getUsers } from '../../models/utils';
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
    let walletNumber = await this.walletNumberService.generate();
    let wallet = {
      name: data.name,
      currencyCode: data.currencyCode,
      userId: data.userId,
      status: data.status,
      type: data.type,
      walletBalance: {
        create: {
          balance: 0,
          holdBalance: 0
        }
      },
      walletNumber: walletNumber.number,
      walletNumberId: walletNumber.id
    };
    return await this.walletRepository.create(wallet);
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
}
export default WalletService;
