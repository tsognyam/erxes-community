//import { IWallet } from '../../models/definitions/wallet';
import WalletRepository from '../../repository/wallet/wallet.repository';
import { WalletNumberService } from './wallet.number.service';
import { Prisma } from '@prisma/client';
import WalletValidator from '../validator/wallet/wallet.validator';
import { getUsers } from '../../models/utils';
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
}
export default WalletService;
