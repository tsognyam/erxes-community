export const ROW_INSIDE = [
  {
    _id: '10',
    stock: 'Lend',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Pending',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'Lend',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Success',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'Lend',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Success',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'Lend',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Success',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'Lend',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Canceled',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  }
];

export const ROW_INSIDE1 = [
  {
    _id: '10',
    stock: 'CU',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Pending',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'CU',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Success',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'CU',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Canceled',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'CU',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Success',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  },
  {
    _id: '10',
    stock: 'CU',
    quantity: 400,
    successful: 400,
    left: 0,
    status: 'Pending',
    createdDate: '2022-12-23',
    total: 17600,
    commission: 176
  }
];

export const DATA = [
  {
    _id: '1',
    prefix: '676767',
    stock: 'Lend',
    orderType: 'Conditional',
    frequency: 'Weekly',
    orderDay: 'Monday',
    orderTime: '11:00',
    amount: 100000,
    isActive: true,
    inside: ROW_INSIDE
  },
  {
    _id: '2',
    prefix: '454545',
    stock: 'CU',
    orderType: 'Stop Limit',
    frequency: 'Monthly',
    orderDay: 'Monday',
    orderTime: '11:00',
    amount: 200000,
    amountTo: 300000,
    isActive: true,
    inside: ROW_INSIDE1
  }
];

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

export const STATUS = [
  { value: 'Success', label: 'Success' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Canceled', label: 'Canceled' }
];

export const STOCK_COUNTS = {
  all: '3',
  cu: '1',
  apu: '1',
  lend: '0',
  gobi: '1',
  golomt: '0',
  tdb: '0',
  khan: '0',
  adx: '0',
  aaa: '0'
};

export const STATUS_COUNTS = { success: '1', sent: '1', cancel: '1' };

export const FREQUENCY = [
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Yearly', value: 'Yearly' }
];

export const ORDER_TYPE = [
  { label: 'Conditional', value: 'Conditional' },
  { label: 'Stop Limit', value: 'Stop Limit' }
];

export const ORDER_DAY = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' }
];

export const ORDER_TIME = [
  { label: '11:00', value: '11:00' },
  { label: '12:00', value: '12:00' },
  { label: '10:00', value: '10:00' }
];
