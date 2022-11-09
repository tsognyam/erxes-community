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

export const STOCK_LIST = [
  {
    symbol: 'APU',
    yesterdaysLastPrice: 6700,
    startingPrice: 6700,
    peak: 6900,
    bottom: 6200,
    change: -374,
    changePercent: -5.42,
    quantity: 7768,
    bullish: 70,
    bearish: 50
  },
  {
    symbol: 'LEND',
    yesterdaysLastPrice: 4000,
    startingPrice: 4000,
    peak: 5000,
    bottom: 3500,
    change: 1000,
    changePercent: 10.9,
    quantity: 7000,
    bullish: 50,
    bearish: 20
  },
  {
    symbol: 'GOBI',
    yesterdaysLastPrice: 800,
    startingPrice: 1000,
    peak: 2000,
    bottom: 500,
    change: 1800,
    changePercent: 40.34,
    quantity: 80000,
    bullish: 80,
    bearish: 30
  },
  {
    symbol: 'CU',
    yesterdaysLastPrice: 6000,
    startingPrice: 6700,
    peak: 9000,
    bottom: 5000,
    change: -5090,
    changePercent: -40.23,
    quantity: 7000,
    bullish: 40,
    bearish: 5
  },
  {
    symbol: 'APEX',
    yesterdaysLastPrice: 800,
    startingPrice: 1000,
    peak: 4000,
    bottom: 700,
    change: 0,
    changePercent: 0,
    quantity: 9000,
    bullish: 75,
    bearish: 34
  },
  {
    symbol: 'ADX',
    yesterdaysLastPrice: 500,
    startingPrice: 400,
    peak: 700,
    bottom: 70,
    change: -709,
    changePercent: -61,
    quantity: 40808,
    bullish: 21,
    bearish: 34
  },
  {
    symbol: 'KHAN',
    yesterdaysLastPrice: 300,
    startingPrice: 300,
    peak: 400,
    bottom: 400,
    change: 60,
    changePercent: 23,
    quantity: 4678,
    bullish: 34,
    bearish: 43
  }
];
