import StockBalanceRepository from '../../../repository/wallet/stock.balance.repository';
import BaseValidator from '../base.validator';
import StockValidator from '../stock.validator';
import { WalletConst } from '../../../constants/wallet';
import WalletValidator from './wallet.validator';
export default class StockWalletValidator extends BaseValidator {
  private stockBalanceRepository: StockBalanceRepository;
  private stockValidator: StockValidator;
  private walletValidator: WalletValidator;
  constructor() {
    super();
    this.stockBalanceRepository = new StockBalanceRepository();
    this.stockValidator = new StockValidator();
    this.walletValidator = new WalletValidator();
  }
  validateBalance = async params => {
    var { error, data } = this.validate(
      {
        walletId: this._joi.number().required(),
        stockCode: this._joi.number(),
        skip: this._joi.number(),
        take: this._joi.number(),
        orderBy: this._joi.any()
      },
      params
    );
    let options: any = [];
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
    data.orderBy = undefined;
    if (data.stockCode)
      await this.stockValidator.validateGetStockCode({
        stockcode: data.stockCode
      });
    let stockBalances: any = undefined;

    // var stockBalances = await this.#stockBalanceRepository.findByWalletId(data.walletId, WalletConst.STATUS_ACTIVE, data.stockCode, { stock: true });
    if (data.stockCode != undefined) {
      stockBalances = await this.stockBalanceRepository.findMany(
        {
          walletId: data.walletId,
          wallet: { status: WalletConst.STATUS_ACTIVE },
          stockCode: data.stockCode
        },
        { stock: true, wallet: true },
        options
      );
      if (stockBalances.length > 0) {
        return stockBalances.values[0];
      } else {
        return {
          id: undefined,
          balance: 0,
          holdBalance: 0,
          walletId: data.walletId,
          stockCode: data.stockCode
        };
      }
    } else {
      stockBalances = await this.stockBalanceRepository.findAll(
        {
          walletId: data.walletId,
          wallet: { status: WalletConst.STATUS_ACTIVE },
          stockCode: data.stockCode
        },
        { stock: true, wallet: true },
        options
      );
    }
    return stockBalances;
  };
  validateBalanceWithWallet = async params => {
    var { error, data } = this.validate(
      {
        walletId: this._joi.number().required(),
        stockCode: this._joi.number().required()
      },
      params
    );

    await this.stockValidator.validateGetStockCode({
      stockcode: data.stockCode
    });
    var stockBalances = await this.stockBalanceRepository.findByWalletId(
      data.walletId,
      WalletConst.STATUS_ACTIVE,
      data.stockCode,
      {
        wallet: {
          include: {
            currency: true
          }
        }
      }
    );
    if (data.stockCode != undefined) {
      if (stockBalances.length > 0) {
        return stockBalances[0];
      } else {
        return {
          id: undefined,
          balance: 0,
          holdBalance: 0,
          walletId: data.walletId,
          stockCode: data.stockCode,
          wallet: await this.walletValidator.checkWallet(
            { id: data.walletId },
            undefined
          )
        };
      }
    }
    return stockBalances;
  };
}
