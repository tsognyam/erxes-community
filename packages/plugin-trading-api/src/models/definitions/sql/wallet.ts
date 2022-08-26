export interface IWallet {
  currencyCode: string;
  name: string;
  type: number;
  status: number;
  userId: string;
  walletNumber: string;
}
export interface IWalletParams {
  currencyCode?: string;
  name?: string;
  type?: number;
  status?: number;
  userId?: string;
  walletNumber: string;
}
export interface IWalletDocument extends IWallet {
  id: number;
  createdAt: Date;
}
