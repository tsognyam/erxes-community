export const DATA = [
  {
    _id: '1',
    prefix: '676767',
    registry: 'aa12121212',
    firstName: 'Zulaa',
    lastName: 'Bold',
    sentDate: '2022-02-21',
    status: 'Pending',
    contractNumber: 34567,
    signedDate: ''
  },
  {
    _id: '2',
    prefix: '676767',
    registry: 'aa12121212',
    firstName: 'Zultsagaan',
    lastName: 'Bold',
    sentDate: '2022-02-21',
    status: 'Contract Signed',
    contractNumber: 34567,
    signedDate: '2022-02-21'
  },
  {
    _id: '3',
    prefix: '676767',
    registry: 'aa12121212',
    firstName: 'Zulbayar',
    lastName: 'Bold',
    sentDate: '2022-02-21',
    status: 'Contract Signed',
    contractNumber: 34567,
    signedDate: '2022-02-21'
  }
];

export const STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'Contract Signed', label: 'Contract signed' }
];

export const LIST = [
  { label: 'First Name', name: 'order.firstName' },
  { label: 'Registry number', name: 'order.registry' },
  { label: 'Sent Date', name: 'order.sentDate' },
  { label: 'Contract Number', name: 'order.contractNumber' }
];
