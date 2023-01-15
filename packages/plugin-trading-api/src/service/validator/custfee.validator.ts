import { StockTypeConst } from '../../constants/stock';
import { ErrorCode, CustomException } from '../../exception/error-code';
import CustfeeRepository from '../../repository/custfee.repository';
import StockRepository from '../../repository/stock.repository';
import BaseValidator from './base.validator';
export default class CustfeeValidator extends BaseValidator {
  private stockRepository = new StockRepository();
  private custFeeRepository = new CustfeeRepository();

  validateGetFee = async params => {
    var { error, data } = this.validate(
      {
        stockcode: this._joi.number().required(),
        userId: this._joi.string().required()
      },
      params
    );
    let fee = 0.1;
    let stock = await this.stockRepository.getByStockcode(data.stockcode);
    if (stock.ipo == 0) {
      fee = stock.stockfee;
    } else {
      let res = await this.validateGet({
        userId: data.userId,
        stocktypeId: stock.stocktypeId
      });
      if (res.count == 0) {
        res = await this.custFeeRepository.getFee(stock.stocktypeId);
        fee = res[0].feevalue;
      } else {
        fee = res.values[0].value;
      }
    }
    return fee;
  };
  validateGet = async params => {
    var { error, data } = this.validate(
      {
        stocktypeId: this._joi.number(),
        userId: this._joi.string(),
        // sidetype: this._joi.number().allow(0,1),
        // stockcode: this._joi.number(),
        value: this._joi.number(),
        status: this._joi.number(),
        skip: this._joi.number(),
        take: this._joi.number(),
        orderBy: this._joi.any()
      },
      params
    );
    let options: any = [];
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
    data.orderBy = undefined;
    // if(data.stockcode != undefined){
    //     let custfee = this._custfeeService.getFee(data.userId, data.stockcode);
    //     return custfee;
    // }
    let custfee = this.checkCustfee(data, options);
    return custfee;
  };
  validateUpdate = async params => {
    var { error, data } = this.validate(
      {
        id: this._joi.number().required(),
        name: this._joi.string(),
        name2: this._joi.string(),
        stocktypeId: this._joi.number().allow(...StockTypeConst.getTypes()),
        userId: this._joi.number(),
        // sidetype: this._joi.number().allow(0,1),
        value: this._joi.number()
      },
      params
    );

    if (data.stocktypeId && data.userId) {
      let custfee = await this.custFeeRepository.findAll({
        id: data.userId,
        stocktypeId: data.stocktypeId
      });
      if (custfee.values.length == 0)
        CustomException(ErrorCode.CustFeeNotFoundException);
    }
    return data;
  };
  validateCreate = async params => {
    var { error, data } = this.validate(
      {
        name: this._joi.string().required(),
        name2: this._joi.string().required(),
        stocktypeId: this._joi.number().required(),
        userId: this._joi.string().required(),
        // sidetype: this._joi.number().allow(0,1),
        value: this._joi.number().required()
      },
      params
    );

    let custfee = await this.custFeeRepository.findAll({
      userId: data.userId,
      stocktypeId: data.stocktypeId
    });
    if (custfee.count != 0) CustomException(ErrorCode.CustFeeAlreadyException);
    return data;
  };

  checkStock = async stockcode => {
    var stock = await this.stockRepository.getByStockcode(stockcode);

    return stock;
  };
  checkCustfee = async (data, options) => {
    let custfee = await this.custFeeRepository.findAll(
      data,
      undefined,
      options
    );

    return custfee;
  };
}
