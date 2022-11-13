import OrderRepository from '../../repository/order.repository';
import SettlementMCSDRepository from '../../repository/wallet/settlement.mcsd.repository';
import SettlementMSCCRepository from '../../repository/wallet/settlement.mscc.repository';
import SettlementValidator from '../validator/wallet/settlement.validator';
import StockTransactionService from './stock.transaction.service';
import TransactionService from './transaction.service';
import WalletService from './wallet.service';

export default class SettlementService {
  private settlementValidator: SettlementValidator;
  private settlementMCSDRepository: SettlementMCSDRepository;
  private settlementMSCCRepository: SettlementMSCCRepository;
  private transactionService: TransactionService;
  private stockTransactionService: StockTransactionService;
  private orderRepository: OrderRepository;
  private walletService: WalletService;
  constructor() {
    this.settlementValidator = new SettlementValidator();
    this.settlementMCSDRepository = new SettlementMCSDRepository();
    this.settlementMSCCRepository = new SettlementMSCCRepository();
    this.transactionService = new TransactionService();
    this.stockTransactionService = new StockTransactionService();
    this.orderRepository = new OrderRepository();
    this.walletService = new WalletService();
  }
  loadMCSDData = async (params: any) => {
    //mcsd data unshij db ruu hadgalah user bureer
    // let data = await this.settlementValidator.validateMCSD(params);
    // let res = await MCSDService.GetInvestorFinalityNet({ SettlementDate: params.SettlementDate });
    // if (!Object.prototype.hasOwnProperty.call(res, 'GetInvestorFinalityNetResult')) {
    //   throw new ErrorException(500, 'Error at MCSD GetInvestorFinalityNetResult method');
    // }
    // if (res.GetInvestorFinalityNetResult.Response.Code != 1) {
    //   throw new ErrorException(404, res.GetInvestorFinalityNetResult.Response.Message);
    // }
    // let settlementData = res.GetInvestorFinalityNetResult.InvestorFinalities.InvestorFinality;
    // let settlementDate = new Date(res.GetInvestorFinalityNetResult.SettlementDate);
    // let tradeDate = new Date(res.GetInvestorFinalityNetResult.TradeDate);
    // if (!Array.isArray(settlementData)) {
    //   settlementData = [settlementData];
    // }
    // await Promise.all(
    //   settlementData.map(async (settlement) => {
    //     let user = await this.userRepository.findByPrefix(settlement.ClientPrefix);
    //     if (user.length != 0) {
    //       let data = {
    //         userId: user[0].id,
    //         tradeDate: tradeDate,
    //         settlementDate: settlementDate,
    //         cmId: settlement.ClearingMemberId,
    //         participantId: settlement.ParticipantId,
    //         participantType: settlement.ParticipantType,
    //         clientPrefix: settlement.ClientPrefix,
    //         clientSuffix: settlement.ClientSuffix,
    //         clientJointNo: parseInt(settlement.ClientJointNo),
    //         securityMCategory: settlement.SecurityMainCategory,
    //         securityCategory: settlement.SecurityCategory,
    //         issuerCode: settlement.IssuerCode,
    //         debtType: settlement.DebtType,
    //         securityDesc: settlement.SecurityDesc,
    //         mainType: settlement.MainType,
    //         subType: settlement.SubType,
    //         quantity: parseInt(settlement.Quantity),
    //         obligation: parseFloat(settlement.Obligation),
    //         status: parseInt(settlement.Status.Code),
    //         statusDescription: settlement.Status.Message,
    //         settlementStatus: parseInt(settlement.Status.Code),
    //         createdAt: new Date()
    //       }
    //       await this.settlementMCSDRepository.create(data);
    //     }
    //   })
    // );
    // return BaseConst.MSG_SUCCESS;
  };
}
