const NationRepository = require('../../repository/user/nation.repository');
const BaseService = require('./base.service');

class NationService extends BaseService {
  constructor() {
    super({
      repository: new NationRepository(),
    });
  }
}

module.exports = NationService;
