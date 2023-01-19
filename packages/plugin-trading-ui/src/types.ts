export interface IOrder {
  _id: string;
}
export type OrderCancelMutationResponse = {
  removeMutation: (params: {
    variables: { txnid: number; stockcode: number; userId: string };
  }) => Promise<any>;
};
