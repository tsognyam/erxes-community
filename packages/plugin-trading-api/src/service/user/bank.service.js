const { getValueR } = require('../../middleware/helper.middleware');
const BankRepository = require('../../repository/user/bank.repository');
const { BankValidator } = require('../validator/user/bank.validator');
const BaseService = require('./base.service');

class BankService extends BaseService {
  constructor() {
    super({
      repository: new BankRepository(),
      validator: new BankValidator(),
    });
  }
  getList = async () => {
    let where = undefined;

    let data = await this.repository.findAll(where);
    data.fee = await getValueR('BankTransactionFee') || 500;
    console.log(data);
    return data;
  }
}

module.exports = BankService;
