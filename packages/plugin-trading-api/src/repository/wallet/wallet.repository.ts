import BaseRepository from '../base.repository';
import { WalletConst } from '../../constants/wallet';
import { getUser } from '../../models/utils';
export default class WalletRepository extends BaseRepository {
  static instance: WalletRepository;

  static get() {
    if (this.instance == null) {
      this.instance = new WalletRepository();
    }

    return this.instance;
  }
  constructor() {
    super('wallet');
  }
  findbyUserId = async (userId: string, currencyCode: string) => {
    return await this._prisma[this._model].findMany({
      where: {
        userId: userId,
        currencyCode: currencyCode
      },
      include: {
        walletBalance: {
          select: {
            balance: true,
            holdBalance: true,
            tradeBalance: true
          }
        }
      }
    });
  };
  findByType = async (currencyCode: string) => {
    return await this._prisma[this._model].findFirst({
      where: {
        currencyCode: currencyCode,
        type: WalletConst.NOMINAL
      },
      include: {
        walletBalance: true
      }
    });
  };
  findStock = async (
    walletId: number,
    status: number,
    stockId: number | undefined = undefined
  ) => {
    return await this._prisma[this._model].findFirst({
      where: {
        id: walletId,
        status: status,
        stockBalances: {
          stockId: stockId
        }
      },
      include: {
        stockBalances: true
      }
    });
  };

  findWithRegisterNumber = async (
    registerNumber: string,
    currencyCode: string
  ) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        currencyCode: currencyCode,
        user: {
          registerNumber: registerNumber
        }
      }
    });
  };

  findWithWalletNumber = async (walletNumber: string) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        walletNumber: walletNumber
      }
    });
  };
  findNominalFeeWallet = async (currencyCode: string) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        type: WalletConst.NOMINAL_FEE,
        currencyCode: currencyCode
      },
      include: {
        walletBalance: true
      }
    });
  };
  findNominalWallet = async (currencyCode: string) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        type: WalletConst.NOMINAL,
        currencyCode: currencyCode
      },
      include: {
        walletBalance: true
      }
    });
  };
  findUserByWalletNumber = async (walletNumber: string, subdomain: string) => {
    let wallet = await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        walletNumber: walletNumber
      },
      include: {
        walletBalance: true
      }
    });
    if (wallet) {
      let user = await getUser({ _id: wallet.userId });
      wallet.user = user;
    }
    return wallet;
  };

  findUserByWalletId = async (walletId: number, subdomain: string) => {
    let wallet = await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        id: walletId
      }
    });
    if (wallet) {
      let user = await getUser({ _id: wallet.userId });
      wallet.user = user;
    }
    return wallet;
  };

  findUserByWalletNumberId = async (walletNumberId: number) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        walletNumberId: walletNumberId
      },
      include: {
        user: true
      }
    });
  };
}
