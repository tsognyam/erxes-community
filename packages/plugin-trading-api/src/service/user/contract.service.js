const ContractRepository = require('../../repository/user/contract.repository');
const ContractValidator = require('../validator/user/contract.validator');
const BaseService = require('./base.service');

const { encode, decode } = require('html-entities');

class ContractService extends BaseService {
  constructor() {
    super({
      repository: new ContractRepository(),
      validator: new ContractValidator(),
    });
  }

  get = async (id) => {
    
    await this.validator.validateId(id);

    const contract = await this.repository.findById(id);
    contract.content = decode(contract.content);
    contract.content2 = decode(contract.content2);
    contract.fillableContent = decode(contract.fillableContent);
    contract.fillableContent2 = decode(contract.fillableContent2);

    return contract;
  };

  getList = async (params) => {

    let data = await this.validator.validateGet(params);
    console.log(data);
    let options = [];
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
    data.orderBy = undefined;
    let contracts = await this.repository.findAll(data, undefined, options);

    contracts.values = contracts.values.map((contract) => {
      contract.content = decode(contract.content);
      contract.content2 = decode(contract.content2);
      contract.fillableContent = decode(contract.fillableContent);
      contract.fillableContent2 = decode(contract.fillableContent2);
      return contract;
    });

    return contracts;
  };

  create = async (user, params) => {
    const { data } = await this.validator.validateParams(params);
    data.content = encode(data.content);
    if (data.content2) {
      data.content2 = encode(data.content2);
      console.log("content2")
    }
    if (data.fillableContent) {
      data.fillableContent = encode(data.fillableContent);
    }
    if (data.fillableContent2) {
      data.fillableContent2 = encode(data.fillableContent2);
    }

    const contract = await this.repository.create({ ...data, createdUserId: user.id });
    contract.content = decode(contract.content);
    contract.content2 = decode(contract.content2);
    contract.fillableContent = decode(contract.fillableContent);
    contract.fillableContent2 = decode(contract.fillableContent2);

    return contract;
  };

  update = async (user, params) => {
    const { data } = await this.validator.validateUpdateParams(params);

    data.content = encode(data.content);
    if (data.content2) {
      data.content2 = encode(data.content2);

    }
    if (data.fillableContent) {
      data.fillableContent = encode(data.fillableContent);
    }
    if (data.fillableContent2) {
      data.fillableContent2 = encode(data.fillableContent2);
    }

    const contract = await this.repository.update(data.id, { ...data, updatedAt: new Date(), updatedUserId: user.id });
    contract.content = decode(contract.content);
    contract.content2 = decode(contract.content2);
    contract.fillableContent = decode(contract.fillableContent);
    contract.fillableContent2 = decode(contract.fillableContent2);

    return contract;
  };
}

module.exports = ContractService;
