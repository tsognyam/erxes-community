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
}
