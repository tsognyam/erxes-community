export interface IOrder {
  _id: string;
}
export type OrderCancelMutationResponse = {
  tradingOrderCancelMutation: (params: {
    variables: { txnid: number };
  }) => Promise<any>;
};
