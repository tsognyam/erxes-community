const EducationRepository = require('../../repository/user/education.repository');
const BaseService = require('./base.service');

class EducationService extends BaseService {
  constructor() {
    super({
      repository: new EducationRepository(),
    });
  }
}

module.exports = EducationService;
