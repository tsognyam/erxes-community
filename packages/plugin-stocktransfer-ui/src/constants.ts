export const DATA = [
  {
    _id: '1',
    firstName: 'Bold',
    lastName: 'Saruul',
    register: 'aa12121212',
    phone: 99887766,
    address: 'Sukhbaatar district',
    requestBy: 'Chantsal',
    stockCompany: 'Golomt Capital',
    stockAccount: '1212121212',
    stock: 'APU',
    quantity: 20000,
    price: 300000,
    stockCompanyToReceive: 'Apex',
    stockAccountToReceive: '2323232323232',
    requestedDate: '2022-02-15',
    status: 'Transfered',
    approvedDate: '2022-02-15'
  },
  {
    _id: '2',
    firstName: 'Bulgaa',
    lastName: 'Tomor',
    register: 'aa12121212',
    phone: 99887766,
    address: 'Sukhbaatar district',
    requestBy: 'Chantsal',
    stockCompany: 'Golomt Capital',
    stockAccount: '1212121212',
    stock: 'APU',
    quantity: 20000,
    price: 300000,
    stockCompanyToReceive: 'Apex',
    stockAccountToReceive: '2323232323232',
    requestedDate: '2022-02-15',
    status: 'Pending',
    approvedDate: '2022-02-15'
  },
  {
    _id: '3',
    firstName: 'Tenger',
    lastName: 'Gazar',
    register: 'aa12121212',
    phone: 99887766,
    address: 'Sukhbaatar district',
    requestBy: 'Chantsal',
    stockCompany: 'Golomt Capital',
    stockAccount: '1212121212',
    stock: 'APU',
    quantity: 20000,
    price: 300000,
    stockCompanyToReceive: 'Apex',
    stockAccountToReceive: '2323232323232',
    requestedDate: '2022-02-15',
    status: 'Transfered',
    approvedDate: '2022-02-15'
  },
  {
    _id: '4',
    firstName: 'Ovs',
    lastName: 'Nogoo',
    register: 'aa12121212',
    phone: 99887766,
    address: 'Sukhbaatar district',
    requestBy: 'Chantsal',
    stockCompany: 'Golomt Capital',
    stockAccount: '1212121212',
    stock: 'APU',
    quantity: 20000,
    price: 300000,
    stockCompanyToReceive: 'Apex',
    stockAccountToReceive: '2323232323232',
    requestedDate: '2022-02-15',
    status: 'Pending',
    approvedDate: '2022-02-15'
  },
  {
    _id: '5',
    firstName: 'Bold',
    lastName: 'NENE',
    register: 'aa232322323',
    phone: 99887766,
    address: 'Sukhbaatar district',
    requestBy: 'Chantsal',
    stockCompany: 'Golomt Capital',
    stockAccount: '1212121212',
    stock: 'APU',
    quantity: 20000,
    price: 300000,
    stockCompanyToReceive: 'Apex',
    stockAccountToReceive: '2323232323232',
    requestedDate: '2022-02-15',
    status: 'New',
    approvedDate: '2022-02-15'
  }
];

export const PREFIX = [
  { value: '676767', label: '676767' },
  { value: '453423', label: '453423' },
  { value: '786543', label: '786543' },
  { value: '790865', label: '790865' },
  { value: '342112', label: '342112' }
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
  { value: 'Transfered', label: 'Transfered' },
  { value: 'Pending', label: 'Pending' },
  { value: 'New', label: 'New' }
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

export const STOCK_COMPANY = [
  { value: 'Golomt', label: 'Golomt Capital' },
  { value: 'TDB', label: 'TDB' },
  { value: 'Ard', label: 'Ard' }
];
