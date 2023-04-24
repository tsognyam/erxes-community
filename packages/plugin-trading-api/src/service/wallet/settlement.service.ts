import BaseConst from '../../constants/base';
import { OrderTxnType } from '../../constants/stock';
import { SettlementConst, TransactionConst } from '../../constants/wallet';
import { CustomException } from '../../exception/error-code';
import OrderRepository from '../../repository/order.repository';
import SettlementMCSDRepository from '../../repository/wallet/settlement.mcsd.repository';
import SettlementMSCCRepository from '../../repository/wallet/settlement.mscc.repository';
import SettlementValidator from '../validator/wallet/settlement.validator';
import StockTransactionService from './stock.transaction.service';
import TransactionService from './transaction.service';
import WalletService from './wallet.service';
export default class SettlementService {
  private settlementValidator: SettlementValidator;
  private settlementMCSDRepository: SettlementMCSDRepository;
  private settlementMSCCRepository: SettlementMSCCRepository;
  private transactionService: TransactionService;
  private stockTransactionService: StockTransactionService;
  private orderRepository: OrderRepository;
  private walletService: WalletService;
  constructor() {
    this.settlementValidator = new SettlementValidator();
    this.settlementMCSDRepository = new SettlementMCSDRepository();
    this.settlementMSCCRepository = new SettlementMSCCRepository();
    this.transactionService = new TransactionService();
    this.stockTransactionService = new StockTransactionService();
    this.orderRepository = new OrderRepository();
    this.walletService = new WalletService();
  }
  loadMSCCData = async params => {
    //mcsd data unshij db ruu hadgalah user bureer
    let data = await this.settlementValidator.validateMCSD(params);
    // let res = await MCSDService.GetInvestorFinalityNet({ SettlementDate: params.SettlementDate });
    let res: any = [];
    //let res = await this.#msccService.GetPaymentClient({ tradeDate: data.tradeDate });
    //loggerMSCC.info({ result: res })
    if (res.length == 0) {
      CustomException('Мэдээлэл олдсонгүй.');
    }
    let settlementData = res;
    if (!Array.isArray(settlementData)) {
      settlementData = [settlementData];
    }
    //loggerMSCC.info({ settlementData: settlementData })
    await Promise.all(
      settlementData.map(async settlement => {
        let user: any;
        //user = await this.userRepository.findByPrefix(settlement.ClientPrefix.toString());
        if (user.length != 0) {
          let data = {
            userId: user[0].id,
            tradeDate: new Date(settlement.TradeDate.split('T')[0]),
            settlementDate: new Date(settlement.SettleDate.split('T')[0]),
            custodianID: settlement.CustodianID,
            cmId: '0',
            participantId: settlement.Participant_ID,
            participantType: settlement.Participant_Type,
            clientPrefix: settlement.ClientPrefix.toString(),
            clientSuffix: settlement.Suffix,
            securityMCategory: settlement.Security_Main_Category,
            issuerCode: settlement.IssuerCode,
            debtType: settlement.DebtType,
            securityDesc: settlement.Securities_Description,
            buyQuantity: settlement.BuyQty,
            buyObligation: settlement.BuyObl,
            sellQuantity: settlement.SellQty,
            sellObligation: settlement.SellObl,
            quantity: parseInt(settlement.SecuritiesNetQty),
            obligation: parseFloat(settlement.PaymentNetObl),
            minMargin: parseFloat(settlement.MinRequiredMargin),
            mseFee: parseFloat(settlement.mse_fee),
            msccFee: parseFloat(settlement.mscc_fee),
            frcFee: parseFloat(settlement.frc_bdk),
            status: BaseConst.STATUS_ACTIVE,
            createdAt: new Date()
          };
          console.log('settlement', data);
          await this.settlementMSCCRepository.create(data);
        }
      })
    );
    return BaseConst.MSG_SUCCESS;
  };
  executeSettlementMSCC = async params => {
    var settlements = await this.settlementValidator.validateSettlementMSCC(
      params
    );

    for (let i = 0; i < settlements.values.length; i++) {
      let settlement = settlements.values[i];
      var orderList = await this.orderRepository.getOrderListBySettlement(
        settlement.userId,
        settlement.tradeDate,
        settlement.issuerCode
      );
      console.log('orderList', orderList);
      if (orderList.length == 0) {
        await this.settlementMSCCRepository.update(settlement.id, {
          status: SettlementConst.STATUS_INACTIVE,
          statusDescription: 'Харгалзах захиалгын мэдээлэл олдсонгүй.'
        });
        continue;
        // throw new OrderNotFoundException();
      }
      var quantity = 0;
      var obligation = 0;

      for (let i in orderList) {
        if (orderList[i].txntype == OrderTxnType.Buy) {
          obligation +=
            parseFloat(orderList[i].doneprice) * orderList[i].donecnt;
          quantity += orderList[i].donecnt;
        }
        if (orderList[i].txntype == OrderTxnType.Sell) {
          quantity -= orderList[i].donecnt;
          obligation -=
            parseFloat(orderList[i].doneprice) * orderList[i].donecnt;
        }
      }

      console.log(
        '==',
        quantity,
        settlement.quantity,
        obligation.toFixed(2),
        settlement.obligation
      );
      if (
        quantity == settlement.quantity &&
        obligation.toFixed(2) == settlement.obligation.toFixed(2)
      ) {
        let nominalWallet = await this.walletService.getNominalWallet({
          currencyCode: orderList[0].stock.currencyCode
        });
        await this.settlementMSCCRepository.update(settlement.id, {
          status: SettlementConst.STATUS_PENDING
        });

        for (const order of orderList) {
          if (order.settlementMSCCId == null) {
            if (order.tranOrderId == null) {
              let orderTotalPrice = order.doneprice * order.donecnt;
              let feeAmount = (orderTotalPrice * parseFloat(order.fee)) / 100;
              let tranAmount = orderTotalPrice;
              let tranOrder = await this.transactionService.w2w({
                senderWalletId: nominalWallet.id,
                receiverWalletId: order.stockOrder.walletIdFrom,
                amount: tranAmount,
                feeAmount: feeAmount,
                feeType: TransactionConst.FEE_TYPE_RECEIVER,
                type: TransactionConst.TYPE_W2W
              });
              order.tranOrderId = tranOrder.id;
            } else if (order.stockOrderId == null) {
              // let stockOrder = await this.#stockTransactionService.w2w({
              //     senderWalletId: WalletConst.NOMINAL,
              //     receiverWalletId: order.transactionOrder.walletIdFrom,
              //     stockCount: order.donecnt,
              //     stockCode: order.stockcode
              // });
              // order.stockOrderId = stockOrder.id;
            }
            await this.transactionService.confirmTransaction({
              orderId: order.tranOrderId,
              confirm: TransactionConst.STATUS_SUCCESS
            });
            // await this.#stockTransactionService.confirmTransaction({
            //     orderId: order.stockOrderId,
            //     confirm: TransactionConst.STATUS_SUCCESS
            // });
            order.settlementMSCCId = settlement.id;
            order.transactionOrder = undefined;
            order.stockOrder = undefined;
            order.stock = undefined;
            await this.orderRepository.update(order);
          }
        }
        await this.settlementMSCCRepository.update(settlement.id, {
          status: SettlementConst.STATUS_DONE,
          executedDate: new Date()
        });
      } else {
        await this.settlementMSCCRepository.update(settlement.id, {
          status: SettlementConst.STATUS_FAILED
        });
      }
    }
    return 'Success';
  };
}
