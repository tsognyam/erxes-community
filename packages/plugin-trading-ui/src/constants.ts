export const PREFIX = [
  { value: '676767', label: 'TEST1' },
  { value: '453423', label: 'TEST' }
];

export const LIST = [
  { label: 'Prefix', name: 'order.prefix' },
  { label: 'Registry number', name: 'order.registry' },
  { label: 'IPO', name: 'order.ipo' },
  { label: 'Created date', name: 'order.date' },
  { label: 'Price', name: 'order.price' },
  { label: 'Quantity', name: 'order.quantity' },
  { label: 'Provision', name: 'order.provision' },
  { label: 'Total', name: 'order.total' }
];

export const STATUS_COUNTS = { success: '1', sent: '1', cancel: '1' };
export const STOCK = [
  { label: 'APU', value: '90' },
  { label: 'LEND', value: '545' },
  { label: 'TUM', value: '549' }
];
export const TYPE = [
  { label: 'Авах', value: 1 },
  { label: 'Зарах', value: 2 }
];

export const ORDER_TYPE = [
  { label: 'Зах зээл', value: 1 },
  { label: 'Нөхцөлт', value: 2 }
];
export const TYPE_ARRAY = ['Buy', 'Sell'];

export const ORDER_TYPE_ARRAY = [
  'Conditional',
  'Market Price',
  'Stop Limit',
  'Stop Loss'
];

export const STOCKTYPE = [
  {
    value: 1,
    label: 'Хувьцаа'
  },
  {
    value: 2,
    label: 'Компанийн бонд'
  },
  {
    value: 3,
    label: 'Засгийн газрын бонд'
  }
];

export const EXCHANGE = [
  {
    value: 1,
    label: 'MSE - Монголын хөрөнгийн бирж'
  }
];

export const IPO = [
  {
    value: 0,
    label: 'Тийм'
  },
  {
    value: 1,
    label: 'Үгүй'
  }
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

export const STOCK_DATA = [
  {
    name: 'LEND',
    change: 15,
    changePercent: -1.99,
    quantity: 39
  },
  {
    name: 'CU',
    change: 20,
    changePercent: -2.33,
    quantity: 55
  },
  {
    name: 'APU',
    change: 20,
    changePercent: 5.98,
    quantity: 1597
  },
  {
    name: 'SUU',
    change: 14,
    changePercent: 2.33,
    quantity: 300
  },
  {
    name: 'MNP',
    change: 10,
    changePercent: -1.99,
    quantity: 39
  },
  {
    name: 'INV',
    change: 8,
    changePercent: -2.33,
    quantity: 55
  },
  {
    name: 'GOV',
    change: 22,
    changePercent: 5.98,
    quantity: 1597
  },
  {
    name: 'BOGD',
    change: 10,
    changePercent: 1.99,
    quantity: 300
  },
  {
    name: 'LEND',
    change: 15,
    changePercent: -1.99,
    quantity: 39
  },
  {
    name: 'CU',
    change: 20,
    changePercent: -2.33,
    quantity: 55
  },
  {
    name: 'APU',
    change: 20,
    changePercent: 5.98,
    quantity: 1597
  },
  {
    name: 'SUU',
    change: 14,
    changePercent: 2.33,
    quantity: 300
  },
  {
    name: 'MNP',
    change: 10,
    changePercent: -1.99,
    quantity: 39
  },
  {
    name: 'INV',
    change: 8,
    changePercent: -2.33,
    quantity: 55
  },
  {
    name: 'GOV',
    change: 22,
    changePercent: 5.98,
    quantity: 1597
  },
  {
    name: 'BOGD',
    change: 10,
    changePercent: 1.99,
    quantity: 300
  }
];

export const ORDER_BUY_SELL = [
  {
    price: 30,
    quantity: 3000
  },
  {
    price: 200,
    quantity: 300
  },
  {
    price: 55,
    quantity: 1000
  },
  {
    price: 100,
    quantity: 5
  },
  {
    price: 50,
    quantity: 250
  },
  {
    price: 10,
    quantity: 200
  },
  {
    price: 20,
    quantity: 300
  },
  {
    price: 15,
    quantity: 2
  },
  {
    price: 30,
    quantity: 55
  },
  {
    price: 100,
    quantity: 5
  }
];

export const TIME_FRAME = [
  { label: 'Until the order is cancelled', value: 'cancel' },
  { label: 'Until the order is cancelled', value: 'cancel' }
];

export const STOCK_ORDER = [
  {
    prefix: '9099090',
    stock: 'CU',
    type: 'Buy',
    orderType: 'Conditional',
    price: 200,
    successful: 0,
    left: 0,
    status: 'Pending',
    total: 40040,
    commission: 40,
    timeFrame: 'GTC',
    timeframe: 'Until the order is cancelled',
    lowestPrice: 200,
    highestPrice: 400,
    balance: 2540,
    quantity: 200,
    commissionPercent: 1
  },
  {
    prefix: '80808080',
    stock: 'CU',
    type: 'Sell',
    orderType: 'Conditional',
    price: 200,
    successful: 0,
    left: 0,
    status: 'Successful',
    total: 40040,
    commission: 40,
    timeFrame: 'GTC',
    timeframe: 'Until the order is cancelled',
    lowestPrice: 200,
    highestPrice: 400,
    balance: 2540,
    quantity: 200,
    commissionPercent: 1
  },
  {
    prefix: '707070707070',
    stock: 'CU',
    type: 'Buy',
    orderType: 'Conditional',
    price: 200,
    successful: 0,
    left: 0,
    status: 'Pending',
    total: 40040,
    commission: 40,
    timeFrame: 'GTC',
    timeframe: 'Until the order is cancelled',
    lowestPrice: 200,
    highestPrice: 400,
    balance: 2540,
    quantity: 200,
    commissionPercent: 1
  },
  {
    prefix: '606060600',
    stock: 'CU',
    type: 'Sell',
    orderType: 'Conditional',
    price: 200,
    successful: 0,
    left: 0,
    status: 'Canceled',
    total: 40040,
    commission: 40,
    timeFrame: 'GTC',
    timeframe: 'Until the order is cancelled',
    lowestPrice: 200,
    highestPrice: 400,
    balance: 2540,
    quantity: 200,
    commissionPercent: 1
  },
  {
    prefix: '5050505050',
    stock: 'CU',
    type: 'Buy',
    orderType: 'Conditional',
    price: 200,
    successful: 0,
    left: 0,
    status: 'Pending',
    total: 40040,
    commission: 40,
    timeFrame: 'GTC',
    timeframe: 'Until the order is cancelled',
    lowestPrice: 200,
    highestPrice: 400,
    balance: 2540,
    quantity: 200,
    commissionPercent: 1
  }
];

export const chartColors = [
  '#6569DF',
  '#63D2D6',
  '#FF7C78',
  '#81CC49',
  '#7c2bba',
  '#d1a924',
  '#503b2c'
];
