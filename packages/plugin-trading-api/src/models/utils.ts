import {
  sendContactsMessage,
  sendCoreMessage,
  sendCPMessage
} from '../messageBroker';
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
export const defaultCurrencies = async (subdomain: string) => {
  let dealCurrency = await sendCoreMessage({
    subdomain,
    action: 'configs.getValues',
    data: {
      code: 'dealCurrency'
    },
    isRPC: true,
    defaultValue: []
  });
  if (dealCurrency.length <= 0)
    throw new Error('Please choose currency from general settings!');
  return dealCurrency;
};
export const getUsers = async (data: any, subdomain: string = 'localhost') => {
  const users = await sendContactsMessage({
    subdomain,
    action: 'customers.find',
    data: data,
    isRPC: true,
    defaultValue: []
  });
  return users;
};
export const getUser = async (data: any, subdomain: string = 'localhost') => {
  const user = await sendContactsMessage({
    subdomain,
    action: 'customers.findOne',
    data: data,
    isRPC: true,
    defaultValue: []
  });
  return user;
};
export const getSystemUsers = async (
  data: any,
  subdomain: string = 'localhost'
) => {
  const users = await sendCoreMessage({
    subdomain,
    action: 'users.find',
    data: data,
    isRPC: true
  });
  return users;
};
export const getClientPortalUser = async (
  data: any,
  subdomain: string = 'localhost'
) => {
  let cpUser = await sendCPMessage({
    subdomain,
    action: 'clientPortalUsers.findOne',
    data: {
      _id: data.userId
    },
    isRPC: true
  });
  return cpUser;
};
