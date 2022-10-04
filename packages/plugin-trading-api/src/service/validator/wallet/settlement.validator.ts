import SettlementMCSDRepository from '../../../repository/wallet/settlement.mcsd.repository';
import SettlementMSCCRepository from '../../../repository/wallet/settlement.mscc.repository';
import BaseValidator from '../base.validator';
import Helper from '../../helper.service';
import { ErrorCode, CustomException } from '../../../exception/error-code';
export default class SettlementValidator extends BaseValidator {
  private settlementMCSDRepository: SettlementMCSDRepository = new SettlementMCSDRepository();
  private settlementMSCCRepository: SettlementMSCCRepository = new SettlementMSCCRepository();
  check = async (id: number) => {
    var settlement = await this.settlementMCSDRepository.findUnique({ id: id });
    if (!settlement) {
      CustomException(ErrorCode.SettlementNotFoundException);
    }

    return settlement;
  };

  checkMSCC = async params => {
    var settlements = await this.settlementMSCCRepository.findByDate(params);
    if (settlements.length == 0) {
      CustomException(ErrorCode.SettlementNotFoundException);
    }

    return settlements;
  };

  validateSettlement = async params => {
    var { error, data } = this.validate(
      {
        settlementId: this._joi.number().required()
      },
      params
    );
    var settlement = await this.check(data.settlementId);
    return settlement;
  };

  validateSettlementMSCC = async params => {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setUTCHours(0, 0, 0, 0);
    var { error, data } = this.validate(
      {
        settlementDate: this._joi.date().default(today)
      },
      params
    );
    var settlements = await this.checkMSCC(data);
    return settlements;
  };

  validateMCSD = async params => {
    var { error, data } = this.validate(
      {
        tradeDate: this._joi.date().default(new Date())
      },
      params
    );
    data.tradeDate = Helper.dateToString(data.tradeDate, true);

    return data;
  };
}
