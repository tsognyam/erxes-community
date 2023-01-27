import StockWalletValidator from '../validator/wallet/stock.wallet.validator';

export default class StockWalletService {
  private stockWalletValidator: StockWalletValidator;
  constructor() {
    this.stockWalletValidator = new StockWalletValidator();
  }
  getBalance = async params => {
    var wallet = await this.stockWalletValidator.validateBalance(params);

    return wallet;
  };
  getStockWalletList = async params => {
    return await this.stockWalletValidator.validateWalletList(params);
  };
}
