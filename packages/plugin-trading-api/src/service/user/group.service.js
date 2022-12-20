const GroupRepository = require('../../repository/user/group.repository');
const { GroupValidator } = require('../validator/user/group.validator');
const BaseService = require('./base.service');

class GroupService extends BaseService {
  constructor() {
    super({
      repository: new GroupRepository(),
      validator: new GroupValidator(),
    });
  }
}

module.exports = GroupService;
