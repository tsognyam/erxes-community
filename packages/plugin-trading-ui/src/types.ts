export interface IOrder {
  _id: string;
}
export type OrderCancelMutationResponse = {
  tradingOrderCancelMutation: (params: {
    variables: { txnid: number; stockcode: number; userId: string };
  }) => Promise<any>;
};
