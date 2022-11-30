export const DATA = [
  {
    _id: '1',
    type: 'UTSTKHT',
    firstName: 'Azzaya',
    lastName: 'Bold',
    registry: 'aa12121212',
    cashAmount: 400000,
    currency: 'MNT',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Pending',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: ''
  },
  {
    _id: '2',
    type: 'UTSTKHT',
    firstName: 'Azaaa',
    lastName: 'Boldoo',
    registry: 'aa12121212',
    cashAmount: 4000,
    currency: 'USD',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Transfered',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: ''
  },
  {
    _id: '3',
    type: 'UTSTKHT',
    firstName: 'kokoooo',
    lastName: 'jojojojojojo',
    registry: 'aa12121212',
    cashAmount: 400000,
    currency: 'MNT',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Canceled',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: 'Reason reason'
  }
];
export const DATA1 = [
  {
    _id: '1',
    type: 'International',
    firstName: 'ooo',
    lastName: 'Bold',
    registry: 'aa12121212',
    cashAmount: 400000,
    currency: 'MNT',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Pending',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: ''
  },
  {
    _id: '2',
    type: 'International',
    firstName: 'llll',
    lastName: 'Boldoo',
    registry: 'aa12121212',
    cashAmount: 4000,
    currency: 'USD',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Transfered',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: ''
  },
  {
    _id: '3',
    type: 'International',
    firstName: 'kvkvkvkvkvkv',
    lastName: 'jojojojojojo',
    registry: 'aa12121212',
    cashAmount: 400000,
    currency: 'MNT',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Canceled',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: 'Reason reason'
  }
];
export const DATA2 = [
  {
    _id: '1',
    type: 'Secondary',
    firstName: 'Azzeeeeaya',
    lastName: 'Bold',
    registry: 'aa12121212',
    cashAmount: 400000,
    currency: 'MNT',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Pending',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: ''
  },
  {
    _id: '2',
    type: 'Secondary',
    firstName: 'Azeeeeeaaa',
    lastName: 'Boldoo',
    registry: 'aa12121212',
    cashAmount: 4000,
    currency: 'USD',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Transfered',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: ''
  },
  {
    _id: '3',
    type: 'Secondary',
    firstName: 'eeeeeeeêéèêëkokoooo',
    lastName: 'jojojojojojo',
    registry: 'aa12121212',
    cashAmount: 400000,
    currency: 'MNT',
    receivingBank: 'Khan',
    accountNumber: 5099873945,
    createdDate: '2022-02-21',
    status: 'Canceled',
    settledDate: '2022-02-21',
    settledEmployee: 'Khongorzul',
    trasnferedDate: '2022-02-21',
    reason: 'Reason reason'
  }
];

export const STATUS = [
  { value: 'transfered', label: 'Transfered' },
  { value: 'pending', label: 'Pending' },
  { value: 'canceled', label: 'Canceled' }
];

export const TYPE = [
  { value: 'UTSTKHT', label: 'Money for UTSTKHT Account', data: DATA },
  {
    value: 'International',
    label: 'Money for International Trading',
    data: DATA1
  },
  { value: 'Secondary', label: 'Money for Secondary Trading', data: DATA2 }
];

export const BANK = [
  { value: 'Khan', label: 'Khan Bank' },
  { value: 'Golomt', label: 'Golomt Bank' },
  { value: 'TDB', label: 'Trade and Development Bank' }
];

export const LIST = [
  { label: 'Cash Amount', name: 'applications.cash' },
  { label: 'Currency', name: 'applications.currency' },
  { label: 'Receiving Bank', name: 'applications.receivingBank' },
  { label: 'Account Number', name: 'applications.accountNumber' },
  { label: 'Created Date', name: 'applications.createdDate' },
  { label: 'Status', name: 'applications.status' },
  { label: 'Settled Date', name: 'applications.settledDate' },
  { label: 'Settled Employee', name: 'applications.settledEmployee' },
  { label: 'Transfered Date', name: 'applications.transferedDate' }
];

export const TYPE_COUNTS = { UTSTKHT: '1', International: '1', Secondary: '1' };
export const STATUS_COUNTS = { transfered: '1', pending: '1', canceled: '1' };

export const BANK_COUNTS = { Khan: '2', Golomt: '1', TDB: '4' };
