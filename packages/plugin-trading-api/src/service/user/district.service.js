const DistrictRepository = require('../../repository/user/district.repository');
const DistrictValidator = require('../validator/user/district.validator');
const BaseService = require('./base.service');

class DistrictService extends BaseService {
  constructor() {
    super({
      repository: new DistrictRepository(),
      validator: new DistrictValidator(),
    });
  }

  get = async (id) => {
    // await this.validator.validateId(this.repository, id);

    return this.repository.findAll({
      cityId: parseInt(id)
    });
  };
}

module.exports = DistrictService;
