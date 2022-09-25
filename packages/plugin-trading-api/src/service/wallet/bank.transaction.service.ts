import BankTransactionRepository from '../../repository/wallet/bank.transaction.repository';
import { WalletRepository } from '../../repository/wallet/wallet.repository';

class BankTransactionService {
  private walletRepository: WalletRepository;
  private bankTransactionRepository: BankTransactionRepository;
  constructor() {
    this.walletRepository = new WalletRepository();
    this.bankTransactionRepository = new BankTransactionRepository();
  }
  chargeRequest = async params => {};
}
export default BankTransactionService;
