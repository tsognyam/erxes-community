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
}
