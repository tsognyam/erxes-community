import { QueryResponse } from '@erxes/ui/src/types';
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
  transactionOrder: JSON;
  contid: number;
}
export interface IOrderList {
  values: IOrder[];
  count: number;
  total: number;
}
export type OrderQueryResponse = {
  tradingOrders: IOrderList;
} & QueryResponse;
