export const DATA = [
  {
    _id: '1',
    prefix: '676767',
    registry: 'aa12121212',
    createdDate: '2022-02-21',
    bondName: 'APEX',
    type: 'Buy',
    unitPrice: 200000,
    quantity: 100,
    total: 2000000,
    timeFrame: 12,
    interestRate: 20,
    interestPayment: 'Season',
    interestDay: 365,
    mainPayment: 'End of Term',
    status: 'Pending',
    isEntryMade: true,
    closePrice: 200000,
    closedDate: '2022-12-21',
    orderPrice: 'Market Value',
    potentialBalance: 5000,
    expire: 'Till Order is Cancelled',
    commission: '1'
  },
  {
    _id: '2',
    prefix: '898989',
    registry: 'aa11332244',
    createdDate: '2022-02-21',
    bondName: 'Lend',
    type: 'Sell',
    unitPrice: 200000,
    quantity: 100,
    total: 2000000,
    timeFrame: 12,
    interestRate: 20,
    interestPayment: 'Half year',
    interestDay: 365,
    mainPayment: 'End of Term',
    status: 'Successful',
    isEntryMade: false,
    price: 200000,
    closedDate: '2022-12-21',
    orderPrice: 'Market Value',
    potentialBalance: 4000,
    expire: 'Till Order is Cancelled',
    commission: '1'
  },
  {
    _id: '3',
    prefix: '898989',
    registry: 'aa11332244',
    createdDate: '2022-02-21',
    bondName: 'Omni Capital',
    type: 'Buy',
    unitPrice: 200000,
    quantity: 100,
    total: 2000000,
    timeFrame: 12,
    interestRate: 20,
    interestPayment: 'End of Term',
    interestDay: 365,
    mainPayment: 'End of Term',
    status: 'Canceled',
    isEntryMade: true,
    price: 200000,
    closedDate: '2022-12-21',
    orderPrice: 'Market Value',
    potentialBalance: 6000,
    expire: 'Till Order is Cancelled',
    commission: '1'
  }
];

export const PREFIX = [
  { value: '676767', label: '676767' },
  { value: '453423', label: '453423' },
  { value: '786543', label: '786543' },
  { value: '790865', label: '790865' },
  { value: '342112', label: '342112' }
];

export const TYPE = [
  { value: 'Buy', label: 'Buy' },
  { value: 'Sell', label: 'Sell' }
];

export const IPO = [
  { label: 'CU', value: 'CU', price: 200000, closedDate: '2022-12-21' },
  { label: 'APU', value: 'APU', price: 210000, closedDate: '2022-12-21' },
  { label: 'LEND', value: 'LEND', price: 220000, closedDate: '2022-12-21' },
  { label: 'GOBI', value: 'GOBI', price: 230000, closedDate: '2022-12-21' },
  { label: 'GOLOMT', value: 'GOLOMT', price: 240000, closedDate: '2022-12-21' },
  { label: 'TDB', value: 'TDB', price: 250000, closedDate: '2022-12-21' },
  { label: 'KHAN', value: 'KHAN', price: 260000, closedDate: '2022-12-21' },
  { label: 'ADX', value: 'ADX', price: 270000, closedDate: '2022-12-21' },
  { label: 'AAA', value: 'AAA', price: 280000, closedDate: '2022-12-21' }
];

export const STATUS = [
  { value: 'Success', label: 'Success' },
  { value: 'Pending', label: 'Enquiry sent' },
  { value: 'Canceled', label: 'Canceled' }
];

export const INTEREST_PAYMENT = [
  { value: 'Season', label: 'Season' },
  { value: 'Half Year', label: 'Half Year' },
  { value: 'End of Term', label: 'End of Term' }
];

export const MAIN_PAYMENT = [
  { value: 'Season', label: 'Season' },
  { value: 'Half Year', label: 'Half Year' },
  { value: 'End of Term', label: 'End of Term' }
];

export const IPO_COUNTS = {
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

export const LIST = [
  { label: 'Prefix', name: 'order.prefix' },
  { label: 'Registry number', name: 'order.registry' },
  { label: 'Created date', name: 'order.date' },
  { label: 'Bond Name', name: 'order.bondName' },
  { label: 'Type', name: 'order.type' },
  { label: 'UnitPrice', name: 'order.unitPrice' },
  { label: 'Quantity', name: 'order.quantity' },
  { label: 'Total', name: 'order.total' },
  { label: 'Time Frame', name: 'order.timeFrame' },
  { label: 'Interest Rate', name: 'order.interestRate' },
  { label: 'Interest Payment', name: 'order.interestPayment' },
  { label: 'Interest Day', name: 'order.interestDay' },
  { label: 'Main Payment', name: 'order.mainPayment' }
];

export const STATUS_COUNTS = { success: '1', sent: '1', cancel: '1' };

export const PROVISION_COUNTS = { provided: '2', notProvided: '1' };

export const ORDER_PRICE = [
  { label: 'Market value', value: 'marketValue' },
  { label: 'Market value', value: 'marketValue' },
  { label: 'Market value', value: 'marketValue' }
];

export const EXPIRE = [
  { label: 'Till Order is Cancelled', value: 'orderCancel' },
  { label: 'Till Order is Cancelled', value: 'orderCancel' },
  { label: 'Till Order is Cancelled', value: 'orderCancel' }
];
