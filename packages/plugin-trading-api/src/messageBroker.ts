import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery } from './configs';
import OrderService from './service/order.service';
let client;

export const initBroker = async cl => {
  client = cl;
  const { consumeQueue, consumeRPCQueue } = client;
  let orderService = new OrderService();
  consumeRPCQueue('trading:receive', async ({ data }) => {
    console.log('rec:', data);
    await orderService.receive(data);
    return {
      status: 'success'
    };
  });

  consumeRPCQueue('trading:collect', async ({ data }) => {
    console.log('collect:', data);
    await orderService.collect();
    return {
      status: 'success'
    };
  });
};

export const sendCoreMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'core',
    ...args
  });
};

export const sendMITMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'trading-mit',
    ...args
  });
};

export const sendCPMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'clientportal',
    ...args
  });
};

export const sendContactsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'contacts',
    ...args
  });
};

export const sendSegmentsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'segments',
    ...args
  });
};

export const sendNotificationsMessage = async (
  args: ISendMessageArgs
): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'clientportal',
    ...args
  });
};

export const fetchSegment = async (
  subdomain: string,
  segmentId: string,
  options?
) =>
  await sendSegmentsMessage({
    subdomain,
    action: 'fetchSegment',
    data: { segmentId, options },
    isRPC: true
  });

export const sendNotification = (subdomain: string, data) => {
  return sendNotificationsMessage({
    subdomain,
    action: 'sendNotification',
    data
  });
};

export const sendLogsMessage = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    client,
    serviceDiscovery,
    serviceName: 'logs',
    ...args
  });
};

export default function() {
  return client;
}
