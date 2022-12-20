import HttpService from './request/http.service';
import Helper from '../middleware/helper.service';
// const FormData = require('form-data');
const { Http } = require('winston/lib/winston/transports');
import UserRepository from '../repository/user/user.repository';
import OrderRepository from '../repository/order.repository';
import { OrderTxnType } from '../constants/stock';

export default class Clearing {
    baseUrl;
    http;
    token;
    headers;
    userRepository;
    orderRepository;
    constructor() {
        this.init();
    }
    init = async () => {
        this.baseUrl = await Helper.getValueR("MSCC_BASEURL");
        this.http = new HttpService(this.baseUrl);
        this.token = await Helper.getValueR("MSCC_TOKEN");
        this.userRepository = new UserRepository();
        this.orderRepository = new OrderRepository();

        this.headers = {
            Authorization: this.token
        }
    }

    Auth = async () => {
        //   validator.id(id);
        console.log("Calling MSCC auth..")
        let username = await Helper.getValueR("MSCC_USERNAME");
        let password = await Helper.getValueR("MSCC_PASSWORD");
        console.log(this.baseUrl, username, password);

        let data:any = {
            username: username,
            password: password
        }
        data = JSON.stringify(data);
        let headers = {
            "Content-Type": "application/json"
        }
        let res = await this.http.request('/Login', data, HttpService.METHOD_POST, headers);
        this.token = res.data;
        await Helper.setValueR("MSCC_TOKEN", res.data);
        console.log('token', res.data)
        return this.token;
    };

    MarginRequest = async (data) => {
        let form = {
            Type: data.type,
            cCurrency: data.currency,
            cmSendingAccount: data.sendAcc,
            cmReceiveBankCode: data.receiveBankCode,
            cmReceiveBankName: data.receiveBankName,
            cmReceiveAccount: data.receiveAcc,
            cmReceiveCusName: data.receiveCustName,
            marginAmount: data.marginAmount,
            tradeDate: data.tradeDate,
            settleDate: data.settleDate,
            mdescription: data.description
        }
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/Margin/request', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    CancelMarginRequest = async (data) => {
        let form = {
            cID: data.id
        }
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/Margin/cancel', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    getTotalCurrent = async (data) => {
        let form = {
            date: data.date,
            currency: data.currency
        }
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/getTotalCurrent', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    getHistoryMarginRequest = async (data) => {
        let form = {
            date: data.date
        }
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/getMarginList', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    GetCurrent = async (data) => {

        console.log('baseUrl', this.baseUrl)
        console.log('data', data)
        let form = {
            date: data.date,
            prefix: data.prefix,
            currency: data.currency
        }
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }
        let res = await this.http.request('/getcurrent', form, HttpService.METHOD_GET, this.headers);
        console.log(res);
        return res.data;
    }

    CustStatement = async (data) => {
        let form = {
            prefix: data.prefix,
            startdate: data.startdate,
            enddate: data.enddate
        }
        // let form = new FormData();
        // form.append('prefix', data.prefix);
        // form.append('startdate', data.startdate);
        // form.append('enddate', data.enddate);
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }
        let res = await this.http.request('/customer/statement', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    GetTrade = async (data) => {

        let form = {
            date: data.date
        }
        // let form = new FormData();
        // form.append('date', data.date);
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }
        let res = await this.http.request('/gettrade', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    GetTransactionTotal = async (data) => {

        // let form = new FormData();
        // form.append('date', data.date);
        let form = {
            startDate: data.startDate,
            endDate: data.endDate
        }
        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/gettransaction', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    GetPaymentClient = async (data) => {

        let form = {
            tradeDate: data.tradeDate
        }
        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }
        let res = await this.http.request('/getPaymentInstruction/client', form, HttpService.METHOD_GET, this.headers);

        for (let i = 0; i < res.data.length; i++) {
            let user = await this.userRepository.findByPrefix(res.data[i].ClientPrefix.toString());
            if (user.length != 0) {

                res.data[i].walletNumber = user[0].UserMCSDAccount[0].bdcAccountId;
            } else {
                res.data[i].walletNumber = null;
            }
        }

        return res.data;
    }


    GetPaymentBroker = async (data) => {

        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        let form = {
            tradeDate: data.tradeDate
        }
        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }
        let res = await this.http.request('/getPaymentInstruction/broker', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }


    GetPaymentMember = async (data) => {

        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        let form = {
            tradeDate: data.tradeDate
        }
        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/getPaymentInstruction/member', form, HttpService.METHOD_GET, this.headers);

        return res.data;
    }

    GetPaymentFee = async (data) => {

        // let form = new FormData();
        // form.append('tradeDate', data.tradedate);
        let form = {
            startdate: data.beginDate,
            enddate: data.endDate
        }
        
        this.token = await this.Auth();
        this.headers = {
            Authorization: this.token
        }

        let res = await this.http.request('/getPaymentFee', form, HttpService.METHOD_GET, this.headers);
        
        for (let i = 0; i < res.data.length; i++) {
            let user = await this.userRepository.findWithWalletByPrefix(res.data[i].prefix.toString());
            
            if (user.length != 0) {

                let orders = await this.orderRepository.getOrderList(user[0].id, Helper.dateToString(new Date(res.data[i].tradeDate), true));
                
                
                let rhinosBuyAmount = 0;
                let rhinosBuyFee = 0;
                let rhinosSellAmount = 0;
                let rhinosSellFee = 0;
                for (let j = 0; j < orders.length; j++) {
                    if (orders[j].txntype == OrderTxnType.Buy) {
                        rhinosBuyAmount += parseFloat(orders[j].transactionOrder.amount);
                        rhinosBuyFee += parseFloat(orders[j].transactionOrder.feeAmount);
                    }else{
                        rhinosSellAmount += parseFloat(orders[j].transactionOrder.amount);
                        rhinosSellFee += parseFloat(orders[j].transactionOrder.feeAmount);
                    }
                }
                res.data[i].rhinosBuyAmount = rhinosBuyAmount;
                res.data[i].rhinosBuyFee = rhinosBuyFee;
                res.data[i].rhinosSellAmount = rhinosSellAmount;
                res.data[i].rhinosSellFee = rhinosSellFee;
            } else {
                res.data[i].rhinosBuyAmount = 0;
                res.data[i].rhinosBuyFee = 0;
                res.data[i].rhinosSellAmount = 0;
                res.data[i].rhinosSellFee = 0;
            }
        }
        return res.data;
    }
}
