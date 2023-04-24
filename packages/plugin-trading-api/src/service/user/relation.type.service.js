const RelationTypeRepository = require('../../repository/user/relation.type.repository');
const BaseService = require('./base.service');

class RelationTypeService extends BaseService {
  constructor() {
    super({
      repository: new RelationTypeRepository(),
    });
  }
}

module.exports = RelationTypeService;
