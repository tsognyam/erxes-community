import WalletNumberRepository from '../../repository/wallet/wallet.number.repository';
export class WalletNumberService {
  private walletNumberRepository: WalletNumberRepository;
  private prefix: number;
  private digitCount: number;
  constructor() {
    this.walletNumberRepository = new WalletNumberRepository();
    this.prefix = Number(process.env.PREFIX);
    this.digitCount = Math.max(Number(process.env.WALLET_NUMBER_DIGIT), 10);
  }
  getPrefix = () => {
    let prefix = this.prefix * 10;
    return prefix * Math.pow(10, this.digitCount - this.numDigits(prefix));
  };
  generate = async () => {
    let walletNumber = await this.walletNumberRepository.create({
      number: null
    });
    let upNumber = walletNumber.id;
    return await this.walletNumberRepository.update(walletNumber.id, {
      number: upNumber + this.getPrefix()
    });
  };
  numDigits = x => {
    return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
  };
}
