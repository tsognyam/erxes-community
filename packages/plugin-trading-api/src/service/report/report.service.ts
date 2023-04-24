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
    return await this.reportRepository.getNominalStockBalancesWithAmount(
      nominalWallet.id
    );
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
