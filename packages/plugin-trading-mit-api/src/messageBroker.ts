import { ISendMessageArgs, sendMessage } from '@erxes/api-utils/src/core';
import { serviceDiscovery, fixSocket } from './configs';
// import { Trading-mits } from "./models";

let client;

export const initBroker = async cl => {
  client = cl;

  const { consumeQueue, consumeRPCQueue } = client;

  consumeQueue('trading-mit:send', async ({ data }) => {
    // Trading-mits.send(data);
    console.log('send:', data);
    if (fixSocket.isConnected()) {
      fixSocket.request(data);
    }
    return {
      status: 'success'
    };
  });
};

export const sendCommonMessage = async (
  args: ISendMessageArgs & { serviceName: string }
) => {
  return sendMessage({
    serviceDiscovery,
    client,
    ...args
  });
};

export const sendMITReceive = async (args: ISendMessageArgs): Promise<any> => {
  return sendMessage({
    serviceDiscovery,
    client,
    serviceName: 'trading',
    ...args
  });
};

export default function() {
  return client;
}
