import * as dotenv from 'dotenv';
import { Socket } from 'net';
import { sendMITReceive } from './messageBroker';
dotenv.config();
export default class MSESocket {
  _client;
  _state = 5;
  _host = 'localhost';
  _port = 3001;
  constructor() {
    // console.log('_host',this._host)
    // this._host = process.env.FIX_HOST;
    // this._port = process.env.FIX_PORT;
    // console.log('process.env.FIX_PORT',process.env.FIX_PORT)
    this._client = new Socket();
    this.init();
  }

  init = () => {
    this.connect();
    this._client.on('connect', () => {
      this._state = 1;
      console.log('Connection established with mit server...');
      this._client.emit('readable');
    });

    this._client.setEncoding('utf8');
    this._client.on('readable', async () => {
      let str;

      while ((str = this._client.read(10)) != null) {
        let data = this._client.read(parseInt(str));
        if (data != null) {
          await this.processData(data);
        }
      }
    });
    this._client.on('error', e => {
      this._state = 2;
      console.log(e);
    });

    this._client.on('close', e => {
      this._state = 3;
      console.log('mse connection closed', e);
      //Check connection to mse and try connect again
      // setInterval(()=>{
      //     console.log(mseSocket.isConnected())
      // },5000)
    });
  };

  isConnected = () => {
    return this._state == 1 ? true : false;
  };
  connect = () => {
    console.log('Called connection attempt to MIT');
    this._client.connect({
      host: this._host,
      port: this._port
    });
  };

  request = data => {
    // let str = JSON.stringify(data);
    console.log(data);
    let toStr = JSON.stringify(data);
    console.log('length0: ', toStr.length);
    let length = toStr.length.toString().padStart(10, '0');
    console.log('length', length);
    let lengthBuffer = Buffer.from(length);

    let bufferData = Buffer.from(JSON.stringify(data));
    let arr = [lengthBuffer, bufferData];
    let mergedBuffer = Buffer.concat(arr);
    console.log('merged:', mergedBuffer.toString());
    this._client.write(mergedBuffer);
    console.log('state', this._state);
    if (this._state == 1) {
      console.log('Calling request to mit');
    } else {
      console.log('Disconnected from mit.');
    }
  };

  processData = async data => {
    let received = data;
    received = JSON.parse(received);
    // loggerMIT.log('info', received);
    console.log(received);
    if (received.type == 100) {
      await sendMITReceive({
        subdomain: 'localhost',
        action: 'collect',
        data: received
      });
    }
    if (received.type == 8 || received.type == 9) {
      await sendMITReceive({
        subdomain: 'localhost',
        action: 'receive',
        data: received
      });
    }
  };
}
