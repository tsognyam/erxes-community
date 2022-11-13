export const DATA_DOMESTIC = [
  {
    _id: '1',
    createdDate: '2022-02-21',
    type: 'Buy',
    prefix: '676767',
    register: 'aa12344556',
    name: 'Saruul',
    stock: 'CU',
    total: 2000000,
    commission: 20000,
    pending: '-'
  },
  {
    _id: '2',
    createdDate: '2022-02-22',
    type: 'Sell',
    prefix: '767676',
    register: 'aa12345678',
    name: 'Tuul',
    stock: 'LEND',
    total: 200000,
    commission: '-',
    pending: 2000
  },
  {
    createdDate: '2022-02-23',
    type: 'Sell',
    prefix: '898989',
    register: 'aa87654332',
    name: 'Bold',
    stock: 'APEX',
    total: 25000,
    commission: 250,
    pending: '-'
  }
];

export const DATA_IPO = [
  {
    _id: '1',
    createdDate: '2022-02-24',
    type: 'Sell',
    prefix: '676767',
    register: 'aa12344556',
    name: 'Saruul',
    stock: 'CU',
    total: 2000000,
    commission: 20000,
    pending: '-'
  },
  {
    _id: '2',
    createdDate: '2022-02-25',
    type: 'Sell',
    prefix: '767676',
    register: 'aa12345678',
    name: 'Tuul',
    stock: 'LEND',
    total: 200000,
    commission: '-',
    pending: 2000
  },
  {
    createdDate: '2022-02-26',
    type: 'Sell',
    prefix: '898989',
    register: 'aa87654332',
    name: 'Bold',
    stock: 'APEX',
    total: 25000,
    commission: 250,
    pending: '-'
  }
];

export const DATA_INTERNATIONAL = [
  {
    _id: '1',
    createdDate: '2022-02-27',
    type: 'Buy',
    prefix: '676767',
    register: 'aa12344556',
    name: 'Saruul',
    stock: 'CU',
    total: 2000000,
    commission: 20000,
    pending: '-'
  },
  {
    _id: '2',
    createdDate: '2022-02-28',
    type: 'Buy',
    prefix: '767676',
    register: 'aa12345678',
    name: 'Tuul',
    stock: 'LEND',
    total: 200000,
    commission: '-',
    pending: 2000
  },
  {
    createdDate: '2022-02-29',
    type: 'Buy',
    prefix: '898989',
    register: 'aa87654332',
    name: 'Bold',
    stock: 'APEX',
    total: 25000,
    commission: 250,
    pending: '-'
  }
];

export const DATA_BOND = [
  {
    _id: '1',
    createdDate: '2022-03-21',
    type: 'Buy',
    prefix: '676767',
    register: 'aa12344556',
    name: 'Toogoo',
    stock: 'CU',
    total: 2000000,
    commission: 20000,
    pending: '-'
  },
  {
    _id: '2',
    createdDate: '2022-03-22',
    type: 'Sell',
    prefix: '767676',
    register: 'aa12345678',
    name: 'Toogoo',
    stock: 'LEND',
    total: 200000,
    commission: '-',
    pending: 2000
  },
  {
    createdDate: '2022-03-23',
    type: 'Sell',
    prefix: '898989',
    register: 'aa87654332',
    name: 'Toogoo',
    stock: 'APEX',
    total: 25000,
    commission: 250,
    pending: '-'
  }
];

export const DATA_AUTOMATED = [
  {
    _id: '1',
    createdDate: '2022-04-21',
    type: 'Buy',
    prefix: '676767',
    register: 'aa12344556',
    name: 'Saruul',
    stock: 'CU',
    total: 2000000,
    commission: 20000,
    pending: '-'
  },
  {
    _id: '2',
    createdDate: '2022-04-22',
    type: 'Sell',
    prefix: '767676',
    register: 'aa12345678',
    name: 'Tuul',
    stock: 'CU',
    total: 200000,
    commission: '-',
    pending: 2000
  },
  {
    createdDate: '2022-04-23',
    type: 'Sell',
    prefix: '898989',
    register: 'aa87654332',
    name: 'Bold',
    stock: 'CU',
    total: 25000,
    commission: 250,
    pending: '-'
  }
];

export const PREFIX = [
  { value: '676767', label: '676767' },
  { value: '453423', label: '453423' },
  { value: '786543', label: '786543' },
  { value: '790865', label: '790865' },
  { value: '342112', label: '342112' }
];

export const IPO_ARRAY = [
  'CU',
  'APU',
  'LEND',
  'GOBI',
  'GOLOMT',
  'TDB',
  'KHAN',
  'ADX',
  'AAA'
];

export const STATUS_ARRAY = ['Success', 'Enquiry sent', 'Canceled'];

export const STATUS = [
  { value: 'Success', label: 'Success' },
  { value: 'Enquiry sent', label: 'Enquiry sent' },
  { value: 'Canceled', label: 'Canceled' }
];

export const PROVISION_ARRAY = ['Provided', 'Not provided'];

export const PROVISION = [
  { value: 'Provided', label: 'Provided' },
  { value: 'Not provided', label: 'Not provided' }
];

export const LIST = [
  { label: 'Created date', name: 'order.date' },
  { label: 'Type', name: 'order.type' },
  { label: 'Prefix', name: 'order.prefix' },
  { label: 'Register number', name: 'order.register' },
  { label: 'Name', name: 'order.name' },
  { label: 'Stock', name: 'order.stock' },
  { label: 'Total', name: 'order.total' },
  { label: 'Commission', name: 'order.commission' },
  { label: 'Pending Commission', name: 'order.pendingCommission' }
];

export const STATUS_COUNTS = { success: '1', sent: '1', cancel: '1' };

export const PROVISION_COUNTS = { provided: '2', notProvided: '1' };

export const TRADING_TYPE = [
  { value: 'IPO', label: 'IPO', data: DATA_IPO },
  { value: 'DomesticTrading', label: 'Domestic Trading', data: DATA_DOMESTIC },
  {
    value: 'InternationalTrading',
    label: 'International Trading',
    data: DATA_INTERNATIONAL
  },
  { value: 'BondTrading', label: 'Bond Trading', data: DATA_BOND },
  { value: 'AutomaticOrder', label: 'Automatic Order', data: DATA_AUTOMATED }
];

export const TYPE_ARRAY = ['Buy', 'Sell'];
export const TYPE_COUNTS = { Buy: '1', Sell: '2' };

export const STOCK = [
  { label: 'CU', value: 'CU' },
  { label: 'APU', value: 'APU' },
  { label: 'LEND', value: 'LEND' },
  { label: 'GOBI', value: 'GOBI' },
  { label: 'GOLOMT', value: 'GOLOMT' },
  { label: 'TDB', value: 'TDB' },
  { label: 'KHAN', value: 'KHAN' },
  { label: 'ADX', value: 'ADX' },
  { label: 'AAA', value: 'AAA' }
];
