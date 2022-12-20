const CountryRepository = require('../../repository/user/country.repository');
const CountryValidator = require('../validator/user/country.validator');
const BaseService = require('./base.service');

class CountryService extends BaseService {
  constructor() {
    super({
      repository: new CountryRepository(),
      validator: new CountryValidator(),
    });
  }
}

module.exports = CountryService;
