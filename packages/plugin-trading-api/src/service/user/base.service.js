const CrudValidator = require('../validator/user/crud.validator');
const { CannotRemoveException } = require('../../exception/error');
class BaseService {
  repository = null;
  validator;

  constructor({ repository, validator }) {
    this.repository = repository;
    if(validator != undefined){
      this.validator = validator;
    }else{
      this.validator = new CrudValidator({repository: repository});
    }
  }

  get = async (id) => {
    await this.validator.validateId(id);

    return this.repository.findById(id);
  };

  getList = (params) => {

    // if (status) {
    //   this.validator.validateStatus(status);

    //   where = {
    //     status: +status,
    //   };
    // }

    return this.repository.findAll();
  };

  create = async (user, params) => {
    const { data } = await this.validator.validateParams(params);

    return this.repository.create({ ...data, createdUserId: user.id });
  };

  update = async (user, params) => {
    const { data } = await this.validator.validateUpdateParams(params);

    return this.repository.update(data.id, { ...data, updatedAt: new Date(), updatedUserId: user.id });
  };

  remove = async (id) => {
    await this.validator.validateId(id);

    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new CannotRemoveException();
    }

    return 'Success';
  };
}

module.exports = BaseService;
