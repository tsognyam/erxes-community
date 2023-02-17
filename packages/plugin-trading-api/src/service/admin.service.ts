import moment = require("moment");
import fs = require("fs");
import UserRepository from "../repository/user/user.repository";
import { OrderTxnType, OrderStatus, StockTypeConst, OrderType, OrderCondition, TxnSourceConst } from "../constants/stock";
import { CurrencyConst, TransactionConst } from "../constants/wallet";
import ContractNoteRepository from "../repository/contractNote.repository";
import StockRepository from "../repository/stock.repository";
import OrderRepository from "../repository/order.repository";
import CustFeeService from "./custfee.service";
import WalletService from "./wallet/wallet.service";
import { CustomException, ErrorCode } from "../exception/error-code";
import TransactionService from "./wallet/transaction.service";
import StockTransactionService from "./wallet/stock.transaction.service";

export default class AdminService {
    #userRepository: UserRepository;
    #contractNoteRepository: ContractNoteRepository;
    #stockRepository: StockRepository;
    #orderRepository: OrderRepository;
    #custFeeService: CustFeeService;
    #walletService: WalletService;
    #transactionService: TransactionService;
    #stockTransactionService: StockTransactionService;
    constructor(){
        this.#userRepository = new UserRepository();
        this.#contractNoteRepository = new ContractNoteRepository();
        this.#stockRepository = new StockRepository();
        this.#orderRepository = new OrderRepository();
        this.#custFeeService = new CustFeeService();
        this.#walletService = new WalletService();
        this.#transactionService = new TransactionService();
        this.#stockTransactionService = new StockTransactionService();
    }
    getContractNote = async (params) => {
        let contractNote = await this.#contractNoteRepository.findAll(params);
        return contractNote;
    }
    contractNote = async (params) => {

        let file = fs.readFileSync('./data/uploads/' + params.file.filename, "utf8");
        let arr:any = file.split("\n");
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split(",");
        }

        let row0 = arr[0];
        let runDate = row0[1];
        let settlementDate = row0[2];
        let downloadAt = moment(runDate, "DDMMYYYY").format();
        let settlementAt = moment(settlementDate, "DDMMYYYY").format();
        console.log(downloadAt, settlementAt)
        if (downloadAt == "Invalid date" && settlementAt == "Invalid date") {
            return "Please, fix date types.";
        }
        let custTotal:any = row0[3];
        let obligationTotal = row0[4];
        let orders:any = [];
        let nextRow = 1;
        let error = "";
        for (let i = 0; i < custTotal; i++) {
            let rowi = arr[nextRow];
            let registerNumber = rowi[4];
            let rowCount = arr[nextRow + 1][1];

            let user = await this.#userRepository.findByRegisterNumber(registerNumber);
            if (!user) {
                error += "\n--! Харилцагчийн мэдээлэл олдсонгүй. РД:" + registerNumber
                continue;
            }
            for (let j = 0; j < rowCount; j++) {
                let jTradeDate = arr[nextRow + 2 + j][0];
                let mainTradeDate = moment(jTradeDate, "DDMMYYYY");
                let mTradeDate = mainTradeDate.format();
                if (mTradeDate == "Invalid date") {
                    error += "-! Please, fix date types." + mTradeDate;
                    continue;
                }
                let jSymbol = arr[nextRow + 2 + j][1];
                let jSecurityId = arr[nextRow + 2 + j][2];
                let jTradeId = arr[nextRow + 2 + j][3];
                let jBuySell = arr[nextRow + 2 + j][4];
                let orderType;
                if (jBuySell == "B") {
                    orderType = OrderTxnType.Buy;
                } else if (jBuySell == "S") {
                    orderType = OrderTxnType.Sell;
                }
                let jSize = arr[nextRow + 2 + j][5];
                let jPrice = arr[nextRow + 2 + j][6];
                let jTradeValue = arr[nextRow + 2 + j][7];
                let jAccruedValue = arr[nextRow + 2 + j][8];
                let jTotalValue = arr[nextRow + 2 + j][9];
                let to = mainTradeDate.add(1, 'days').format()
                let contract = await this.#contractNoteRepository.findbyTradeId(jTradeId, jBuySell);
                console.log('jTradeId', jTradeId)
                console.log('jBuySell', jBuySell)
                console.log('contract', contract)
                if (contract.length > 0) {
                    error += "-! Already inserted:" + jTradeId;
                    continue;
                }


                let stock = await this.#stockRepository.getByExternalId(jSymbol);
                if (stock.length == 0) {
                    error += "-! Stock not found:" + jSymbol;
                    continue;
                }
                stock = stock[0];

                let findOrders = await this.#orderRepository.findAll({
                    userId: user.id,
                    stockcode: stock.stockcode,
                    txntype: orderType,
                    donecnt: parseInt(jSize),
                    doneprice: parseFloat(jPrice),
                    status: OrderStatus.STATUS_FILLED,
                    donedate: {
                        gte: mTradeDate,
                        lte: to
                    },
                    OR: [
                        {
                            mseTradeId: "1"
                        },
                        { mseTradeId: jTradeId },
                    ],
                })
                if (findOrders.total != 0) {
                    error += "-! Already inserted order:" + jTradeId;
                    continue;
                }

                if (stock.stocktypeId == StockTypeConst.COMPANY_BOND || stock.stocktypeId == StockTypeConst.GOV_BOND) {
                    let multiplier = 1;
                    if (stock.stocktypeId == StockTypeConst.COMPANY_BOND) {
                        if (stock.currencyCode == CurrencyConst.DEFAULT) {
                            multiplier = 1000;
                        }
                        if (stock.currencyCode == CurrencyConst.USD) {
                            multiplier = 100;
                        }
                    }
                    jPrice = parseFloat(jPrice) * multiplier;
                }
                let order;
                let data:any = {
                    ordertype: OrderType.LIMIT,
                    txntype: orderType,
                    condid: OrderCondition.Day,
                    enddate: mTradeDate,
                    txndate: mTradeDate,
                    regdate: mTradeDate,
                    txnsource: TxnSourceConst.ContractNote,
                    stockcode: stock.stockcode,
                    price: parseFloat(jPrice),
                    cnt: parseInt(jSize),
                    userId: user.id,
                    mseTradeId: jTradeId
                }
                data.fee = await this.#custFeeService.getFee(data.userId, data.stockcode);
                try {
                    //live = false so cannot send order message to mse
                    // order = await this.#orderService.create(params, false);
                    let params:any = {
                        userId: data.userId,
                        currencyCode: stock.currencyCode
                    };
                    const wallets = await this.#walletService.getWalletWithUser(params);
                    if (wallets.length == 0) {
                        CustomException(ErrorCode.WalletNotFoundException);
                    }
                    let nominalWallet = await this.#walletService.getNominalWallet({ currencyCode: stock.currencyCode });
                    data.walletId = wallets[0].id;

                    let camount = data.price * data.cnt;
                    let feeamount:any = camount * (data.fee / 100);

                    if (data.txntype == OrderTxnType.Buy) {
                        params = {
                            senderWalletId: wallets[0].id,
                            receiverWalletId: nominalWallet.id,
                            type: TransactionConst.TYPE_W2W,
                            amount: parseFloat(camount.toFixed(2)),
                            feeAmount: parseFloat(feeamount)
                        };
                        const transaction = await this.#transactionService.w2w(params);
                        data.tranOrderId = transaction.id;

                        params = {
                            senderWalletId: nominalWallet.id,
                            receiverWalletId: wallets[0].id,
                            stockCount: data.cnt,
                            stockCode: data.stockcode
                        };
                        const stockTransaction = await this.#stockTransactionService.w2w(params);

                        data.stockOrderId = stockTransaction.id;
                    } else {
                        params = {
                            senderWalletId: nominalWallet.id,
                            receiverWalletId: wallets[0].id,
                            type: TransactionConst.TYPE_W2W,
                            amount: parseFloat(camount.toFixed(2)),
                            feeAmount: parseFloat(feeamount),
                            feeType: TransactionConst.FEE_TYPE_RECEIVER
                        };
                        const transaction = await this.#transactionService.w2w(params);
                        data.tranOrderId = transaction.id;

                        params = {
                            senderWalletId: wallets[0].id,
                            receiverWalletId: nominalWallet.id,
                            stockCount: data.cnt,
                            stockCode: data.stockcode
                        };
                        const stockTransaction = await this.#stockTransactionService.w2w(params);

                        data.stockOrderId = stockTransaction.id;
                    }

                    data.originalCnt = data.cnt;
                    data.originalPrice = data.price;
                    data.status = OrderStatus.STATUS_FILLED;
                    data.doneprice = data.price;
                    data.donecnt = data.cnt;
                    data.donedate = mTradeDate;
                    data.enddate = mTradeDate
                    data.descr = "Биелсэн";
                    data.descr2 = "Filled";
                    data.ipo = stock.ipo;
                    order = await this.#orderRepository.create(data);

                    params = {
                        orderId: parseInt(order.tranOrderId),
                        confirm: TransactionConst.STATUS_SUCCESS
                    }
                    await this.#transactionService.confirmTransaction(params);
                    orders.push(order);

                    params = {
                        orderId: parseInt(order.stockOrderId),
                        confirm: TransactionConst.STATUS_SUCCESS
                    }
                    await this.#stockTransactionService.confirmTransaction(params);
                }
                catch (ex) {
                    console.log('ex', ex)
                    error += "-! " + ex._message + " РД:" + registerNumber + " Symbol:" + jSymbol;
                    continue;
                }
                params = {
                    tradeId: jTradeId,
                    externalId: jSymbol,
                    securityId: jSecurityId,
                    tradeDate: mTradeDate,
                    buySell: jBuySell,
                    size: parseInt(jSize),
                    price: parseFloat(jPrice),
                    tradeValue: parseFloat(jTradeValue),
                    accruedValue: parseFloat(jAccruedValue),
                    totalValue: parseFloat(jTotalValue),
                    orderId: order.txnid,
                    downloadAt: downloadAt,
                    settlementAt: settlementAt
                }
                await this.#contractNoteRepository.create(params);



            }
            nextRow += parseInt(rowCount) + 7;
        }

        return {
            error: error,
            orders: orders
        };
    }
}