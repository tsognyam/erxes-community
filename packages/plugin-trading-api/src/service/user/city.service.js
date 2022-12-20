const CityRepository = require('../../repository/user/city.repository');
const CityValidator = require('../validator/user/city.validator');
const BaseService = require('./base.service');

class CityService extends BaseService {
  constructor() {
    super({
      repository: new CityRepository(),
      validator: new CityValidator(),
    });
  }

  get = async (id) => {
    // await this.validator.validateId(this.repository, id);

    return this.repository.findAll({
      countryId: parseInt(id)
    });
  };
}

module.exports = CityService;
