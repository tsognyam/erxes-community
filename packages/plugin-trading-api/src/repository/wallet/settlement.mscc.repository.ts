import BaseRepository from '../base.repository';
import BaseConst from '../../constants/base';
export default class SettlementMSCCRepository extends BaseRepository {
  constructor() {
    super('settlementMSCC');
  }
  findByDate = async params => {
    let startDate = new Date(params.settlementDate);
    startDate.setUTCHours(0, 0, 0, 0);
    let endDate = new Date(params.settlementDate);
    endDate.setUTCHours(24, 0, 0, 0);
    let where = {
      settlementDate: {
        gte: startDate,
        lt: endDate
      },
      status: BaseConst.STATUS_ACTIVE
    };

    return await this.findMany(where);
  };
}
