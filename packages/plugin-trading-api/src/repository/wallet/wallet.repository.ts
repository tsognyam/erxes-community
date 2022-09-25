import BaseRepository from '../base.repository';
import { WalletConst } from '../../constants/wallet';
import { sendCoreMessage } from '../../messageBroker';
export default class WalletRepository extends BaseRepository {
  constructor() {
    super('wallet');
  }
  findbyUserId = async (userId: string, currencyCode: string) => {
    return await this._prisma[this._model].findMany({
      include: {
        walletBalance: {
          select: {
            balance: true,
            holdBalance: true
          }
        }
      },
      where: {
        userId: userId,
        currencyCode: currencyCode
      }
    });
  };
  findByType = async (currencyCode: string) => {
    return await this._prisma[this._model].findFirst({
      where: {
        currencyCode: currencyCode,
        type: WalletConst.WALLET_TYPES.NOMINAL
      },
      include: {
        walletBalance: true,
        currency: true
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

  findUserByWalletNumber = async (walletNumber: string) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        id: walletNumber
      },
      include: {
        user: true
      }
    });
  };

  findUserByWalletId = async (walletId: number) => {
    return await this._prisma[this._model].findFirst({
      where: {
        status: WalletConst.STATUS_ACTIVE,
        id: walletId
      },
      include: {
        user: true
      }
    });
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
