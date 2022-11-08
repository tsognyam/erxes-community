export const DATA = [
  {
    _id: '1',
    prefix: '676767',
    register: 'aa12121212',
    ipo: 'CU',
    createdDate: '2022-02-21',
    price: 200,
    amount: 10000,
    provision: 'Provided',
    commission: '1%',
    total: 2000000,
    status: 'Success',
    name: 'Saruul'
  },
  {
    _id: '2',
    prefix: '898989',
    register: 'aa11332244',
    ipo: 'GOBI',
    createdDate: '2022-02-22',
    price: 210,
    amount: 2000,
    provision: 'Provided',
    commission: '1%',
    total: 420000,
    status: 'Enquiry sent',
    name: 'Nomio'
  },
  {
    _id: '3',
    prefix: '909090',
    register: 'aa12121212',
    ipo: 'APU',
    createdDate: '2022-02-23',
    price: 220,
    amount: 1000,
    provision: 'Not provided',
    commission: '1%',
    total: 220000,
    status: 'Canceled',
    name: 'Bold'
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

export const IPO = [
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
  { label: 'Register number', name: 'order.register' },
  { label: 'IPO', name: 'order.ipo' },
  { label: 'Created date', name: 'order.date' },
  { label: 'Price', name: 'order.price' },
  { label: 'Quantity', name: 'order.quantity' },
  { label: 'Provision', name: 'order.provision' },
  { label: 'Total', name: 'order.total' }
];

export const STATUS_COUNTS = { success: '1', sent: '1', cancel: '1' };

export const PROVISION_COUNTS = { provided: '2', notProvided: '1' };
