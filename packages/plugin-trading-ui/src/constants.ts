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
export const TIME_FRAME = [
  { label: 'Захиалга оруулсан өдөр', value: '0' },
  { label: 'Захиалга цуцлагдах хүртэл', value: '1' },
  { label: 'Заасан өдөр хүртэл', value: '6' }
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
export const STATE_LIST = [
  { status: 0, statusName: 'Цуцлагдсан', styleName: 'danger' },
  { status: 1, statusName: 'Шинэ', styleName: 'primary' },
  { status: 2, statusName: 'Хүлээн авсан', styleName: 'primary' },
  { status: 3, statusName: 'Review', styleName: 'warning' },
  { status: 4, statusName: 'Хэсэгчилж биелсэн', styleName: 'success' },
  { status: 5, statusName: 'Биелсэн', styleName: 'success' },
  { status: 6, statusName: 'Түтгэлзсэн', styleName: 'danger' },
  { status: 7, statusName: 'CALCULATED', styleName: 'warning' },
  { status: 8, statusName: 'Хугацаа дууссан', styleName: 'danger' },
  { status: 9, statusName: 'Шинэчлэгдсэн', styleName: 'default' }
];

export const USER_STATUS = [
  { status: 0, description: 'Идэвхигүй' },
  { status: 1, description: 'Идэвхитэй' },
  { status: 5, description: 'Төлбөр төлөгдсөн' },
  { status: 6, description: 'ҮЦТХТ данс нээх хүсэлт илгээгдсэн' },
  { status: 7, description: 'ҮЦТХТ дансны мэдээлэл алдаатай' }
];

export const WITHDRAW_STATUS = [
  { status: 1, description: 'Амжилттай', styleName: 'success' },
  { status: 3, description: 'Түтгэлзсэн', styleName: 'warning' },
  { status: 4, description: 'Алдаа гарсан', styleName: 'danger' },
  { status: 5, description: 'Шинэ', styleName: 'default' },
  { status: 6, description: 'Шинэ', styleName: 'primary' },
  { status: 7, description: 'Түтгэлзсэн', styleName: 'warning' }
];

export const WITHDRAW_TYPE = [
  { value: 1, label: 'Номинал', styleName: 'primary' },
  { value: 2, label: 'ҮЦТХТ', styleName: 'warning' }
];
export const TRANSACTION_STATUS = [
  { status: 0, statusName: 'Идэвхгүй', styleName: 'default' },
  { status: 1, statusName: 'Амжилттай', styleName: 'success' },
  { status: 2, statusName: 'Хүлээгдэж буй', styleName: 'warning' },
  { status: 3, statusName: 'Цуцлагдсан', styleName: 'danger' },
  { status: 4, statusName: 'Failed', styleName: 'danger' },
  { status: 5, statusName: 'Blocked', styleName: 'danger' }
];
