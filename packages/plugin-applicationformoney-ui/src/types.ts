export interface IApplications {
  _id: string;
  firstName: string;
  lastName?: string;
  registry: string;
  cash: number;
  currency: string;
  receivingBank: string;
  accountNumber: number;
  createdDate: any;
  status: string;
  settledDate: any;
  settledEmployee: string;
  transferedDate?: string;
  reason?: string;
}