import ReportRepository from '../../repository/report/report.repository';

export default class ReportService {
  private reportRepository: ReportRepository;
  constructor() {
    this.reportRepository = new ReportRepository();
  }
  getNominalStockBalancesWithAmount = async () => {
    return await this.reportRepository.getNominalStockBalancesWithAmount();
  };
}
