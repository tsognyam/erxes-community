import { CustomException, ErrorCode } from '../../exception/error-code';
import ReportRepository from '../../repository/report/report.repository';
import WalletService from '../wallet/wallet.service';

export default class ReportService {
  private reportRepository: ReportRepository;
  private walletService: WalletService;
  constructor() {
    this.reportRepository = new ReportRepository();
    this.walletService = new WalletService();
  }
  getNominalStockBalancesWithAmount = async params => {
    let nominalWallet = await this.walletService.getNominalWallet(params);
    let data = await this.reportRepository.getNominalStockBalancesWithAmount(
      nominalWallet.id
    );
    const limit = 20;
    const sortedData = data.sort((a, b) => b.amount - a.amount);
    const topValues = sortedData.slice(0, limit);
    const remainingValues = sortedData.slice(limit);
    let result = [...topValues];
    if (remainingValues.length > 0) {
      const sumOtherAmountValues = remainingValues.reduce(
        (accumulator, currentValue) =>
          accumulator + parseFloat(currentValue.amount),
        0
      );
      const sumOtherCntValues = remainingValues.reduce(
        (accumulator, currentValue) =>
          accumulator + parseFloat(currentValue.cnt),
        0
      );
      const sumOtherPriceValues = remainingValues.reduce(
        (accumulator, currentValue) =>
          accumulator + parseFloat(currentValue.price),
        0
      );
      result.push({
        symbol: 'Other',
        cnt: sumOtherCntValues,
        amount: sumOtherAmountValues,
        price: sumOtherPriceValues
      });
    }
    return result;
  };
  getStockBalancesWithAmount = async params => {
    let nominalWallet = await this.walletService.getNominalWallet({
      currencyCode: 'MNT'
    });
    let userWallet = await this.walletService.getWalletWithUser({
      userId: params.userId,
      currencyCode: 'MNT'
    });
    if (userWallet.length == 0)
      CustomException(ErrorCode.WalletNotFoundException);
    return await this.reportRepository.getStockBalancesWithAmount(
      nominalWallet.id,
      userWallet[0].id
    );
  };
}
