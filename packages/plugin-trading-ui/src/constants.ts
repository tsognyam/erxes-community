export const PREFIX = [
  { value: '676767', label: '676767' },
  { value: '453423', label: '453423' },
  { value: '786543', label: '786543' },
  { value: '790865', label: '790865' },
  { value: '342112', label: '342112' }
];

export const LIST = [
  { label: 'Prefix', name: 'order.prefix' },
  { label: 'Register number', name: 'order.register' },
  { label: 'IPO', name: 'order.ipo' },
  { label: 'Created date', name: 'order.date' },
  { label: 'Price', name: 'order.price' },
  { label: 'Quantity', name: 'order.quantity' },
  { label: 'Provision', name: 'order.provision' },
  { label: 'Total', name: 'order.total' }
];

export const STATUS_COUNTS = { success: '1', sent: '1', cancel: '1' };

export const SECONDARY_DATA = [
  {
    _id: '1',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Saruul',
    stock: 'LEND',
    type: 'Buy',
    orderType: 'Conditional',
    price: 60,
    quantity: 500,
    successful: 0,
    status: 'Successful',
    timeFrame: 'GTC',
    createdUser: 'Chantsal',
    commission: 300
  },
  {
    _id: '2',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Tugs',
    stock: 'LEND',
    type: 'Sell',
    orderType: 'Market Price',
    price: 50,
    quantity: 200,
    successful: 0,
    status: 'Pending',
    timeFrame: 'GTC',
    createdUser: 'Tugs',
    commission: 1000
  },
  {
    _id: '3',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Bold',
    stock: 'LEND',
    type: 'Buy',
    orderType: 'Stop Limit',
    price: 202,
    quantity: 100,
    successful: 50,
    status: 'Successful',
    timeFrame: 'GTC',
    commission: 202,
    createdUser: 'Bat'
  },
  {
    _id: '4',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Anu',
    stock: 'LEND',
    type: 'Sell',
    orderType: 'Stop Loss',
    price: 200,
    quantity: 100,
    successful: 100,
    status: 'Successful',
    timeFrame: 'GTC',
    commission: 200,
    createdUser: 'Chantsal'
  },
  {
    _id: '5',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Zaya',
    stock: 'CU',
    type: 'Buy',
    orderType: 'Conditional',
    price: 39,
    quantity: 40,
    successful: 20,
    status: 'Successful',
    timeFrame: 'GTC',
    commission: 15.6,
    createdUser: 'Chantsal'
  },
  {
    _id: '6',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Bat',
    stock: 'CU',
    type: 'Sell',
    orderType: 'Stop Loss',
    price: 40,
    quantity: 500,
    successful: 300,
    status: 'New',
    timeFrame: 'GTC',
    commission: 2000,
    createdUser: 'Chantsal'
  },
  {
    _id: '7',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Tuuguu',
    stock: 'CU',
    type: 'Buy',
    orderType: 'Conditional',
    price: 42,
    quantity: 40,
    successful: 150,
    status: 'Canceled',
    timeFrame: 'GTC',
    commission: 16.8,
    createdUser: 'Chantsal'
  },
  {
    _id: '8',
    prefix: '909090',
    register: 'aa12121212',
    name: 'Tuvshuu',
    stock: 'CU',
    type: 'Sell',
    orderType: 'Conditional',
    price: 44,
    quantity: 500,
    successful: 165,
    status: 'Pending',
    timeFrame: 'GTC',
    commission: 220,
    createdUser: 'Chantsal'
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

export const TYPE = [
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' }
];

export const ORDER_TYPE = [
  { label: 'Conditional', value: 'conditional' },
  { label: 'Market Price', value: 'marketPrice' },
  { label: 'Stop Limit', value: 'stopLimit' },
  { label: 'Stop Loss', value: 'stopLoss' }
];
export const TYPE_ARRAY = ['Buy', 'Sell'];

export const ORDER_TYPE_ARRAY = [
  'Conditional',
  'Market Price',
  'Stop Limit',
  'Stop Loss'
];

export const STOCK_ARRAY = [
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

export const SEC_STATUS = [
  { value: 'success', label: 'Success' },
  { value: 'pending', label: 'Pending' },
  { value: 'new', label: 'New' },
  { value: 'cancel', label: 'Canceled' }
];
