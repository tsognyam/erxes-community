export interface IOrder {
  tnxid: number;
  ordertype: number;
  txntype: number;
  walletId: number;
  wallet: JSON;
  orderno: string;
  stockno: number;
  stock: JSON;
  txndate: Date;
  price: number;
}
export type OrderQueryResponse = {
  tradingOrders: IOrder[];
  refetch: () => void;
  loading: boolean;
};
