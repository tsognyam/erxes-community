import BaseConst from '../constants/base';
import { StockTypeConst } from '../constants/stock';
import CustfeeRepository from '../repository/custfee.repository';
import StockRepository from '../repository/stock.repository';
import CustfeeValidator from './validator/custfee.validator';

export default class CustFeeService {
  private custFeeRepository: CustfeeRepository;
  private custFeeValidator: CustfeeValidator;
  private stockRepository: StockRepository;
  constructor() {
    this.custFeeRepository = new CustfeeRepository();
    this.custFeeValidator = new CustfeeValidator();
    this.stockRepository = new StockRepository();
  }
  get = async data => {
    let res = await this.custFeeValidator.validateGetFee(data);
    return res;
  };
  getFee = async (userId, stockcode) => {
    let fee: number;
    let stock = await this.stockRepository.getByStockcode(stockcode);
    if (stock.ipo == 0) {
      fee = stock.stockfee;
    } else {
      let res = await this.getbyUserIdWithType(userId, stock.stocktypeId);

      if (res.length == 0) {
        // res = await this._custFeeRepository.getFee(stock.stocktypeId);
        // fee = res[0].feevalue;
        if (stock.stocktypeId == StockTypeConst.SEC) fee = 0.1;
        else if (stock.stocktypeId == StockTypeConst.COMPANY_BOND) fee = 0.1;
        else if (stock.stocktypeId == StockTypeConst.GOV_BOND) fee = 0.1;
        else {
          fee = stock.stockfee;
        }
      } else {
        fee = res[0].value;
      }
    }
    return fee;
  };

  getbyUserId = async id => {
    return this.custFeeRepository.findbyUserId(id);
  };

  getbyUserIdWithType = async (id, stocktypeId) => {
    return this.custFeeRepository.findbyUserIdWithType(id, stocktypeId);
  };

  getList = async data => {
    let res = await this.custFeeValidator.validateGet(data);
    return res;
  };

  create = async data => {
    let res = await this.custFeeValidator.validateCreate(data);
    res.status = BaseConst.STATUS_ACTIVE;
    return await this.custFeeRepository.create(res);
  };

  update = async data => {
    let res = await this.custFeeValidator.validateUpdate(data);

    return await this.custFeeRepository.update(res.id, res);
  };

  remove = async id => {
    return await this.custFeeRepository.delete(id);
  };
}
