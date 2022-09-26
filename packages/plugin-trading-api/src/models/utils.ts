import { sendCoreMessage } from '../messageBroker';
export const defaultCurrency = async (subdomain: string) => {
  let dealCurrency = await sendCoreMessage({
    subdomain,
    action: 'configs.getValues',
    data: {
      code: 'dealCurrency'
    },
    isRPC: true,
    defaultValue: []
  });
  if (dealCurrency.length > 0) {
    dealCurrency = dealCurrency[0];
  } else {
    throw new Error('Please choose currency from general settings!');
  }
  return dealCurrency;
};
export const getUsers = async (subdomain: string, data: any) => {
  const users = await sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: data,
    isRPC: true,
    defaultValue: []
  });
  return users;
};
export const getUser = async (subdomain: string, data: any) => {
  const user = await sendCoreMessage({
    subdomain,
    action: 'users.findOne',
    data: data,
    isRPC: true,
    defaultValue: []
  });
  return user;
};
