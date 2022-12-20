import BaseValidator from '../base.validator';
const Joi = require('joi');

import UserRepository from '../../../repository/user/user.repository';
// const NationRepository = require('../../../repository/user/nation.repository');
// const NationalCardRepository = require('../../../repository/user/national.card.repository');
// const DistrictRepository = require('../../../repository/user/district.repository');
// const CityRepository = require('../../../repository/user/city.repository');
// const CountryRepository = require('../../../repository/user/country.repository');
import UserBankAccountRepository from '../../../repository/user/user.bank.account.repository';
import UserMCSDAccountRepository from '../../../repository/user/user.mcsd.repository';

const {
  RegisterNumberDuplicatedException,
  UserNotFoundException,
  InvalidParamException,
  UnconfirmedUserException,
  UserActivatedException,
  UserCreatedException,
  BankNotFoundException,
  UserMCSDAccountNotFoundException
} = require('../../../exception/error');

const { UserConst, UserFilesConst } = require('../../../typing/user.const');
const Helper = require('../../../middleware/helper.middleware');
const BaseConst = require('../../../typing/base.const');
const { McsdConst } = require('../../../typing/mcsd.const');
const ErrorException = require('../../../exception/error-exception');

export default class UserValidator extends BaseValidator {
  #userRepository = new UserRepository();
  // #nationRepository = new NationRepository();
  // #countryRepository = new CountryRepository();
  // #cityRepository = new CityRepository();
  // #districtRepository = new DistrictRepository();
  // #nationalCardRepository = NationalCardRepository.get();
  #userBankAccountRepository = new UserBankAccountRepository();
  #userMCSDAccountRepository = new UserMCSDAccountRepository();

  #checkUserByEmail = async ({ email }) => {
    const user = await this.#userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  };

  checkUserMCSDAccount = async (userId) => {
    let userMCSDAccount = await this.#userMCSDAccountRepository.find({
      userId: userId
    })

    if (userMCSDAccount.length == 0) {
      throw new UserMCSDAccountNotFoundException();
    }

    return userMCSDAccount[0];

  }

  #checkUserByRegisterNumber = async ({ registerNumber }) => {
    const user = await this.#userRepository.findByRegisterNumber(registerNumber);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  };

  /**
   * Админаас хэрэглэгчийн мэдээллийг өөрчилж байгаа тохиолдолд
   * хэрэглэгчийн дугаараар баталгаажисан хэрэглэгч мөн эсхийг шалгана.
   *
   * @param userId - Хэрэглэгчийн дугаар
   *
   * @throws UserNotFoundException    - Дугаараар хэрэглэгч олдоогүй
   * @throws UnconfirmedUserException - Баталгаажаагүй буюу pending төлөвтэй хэрэглэгч
   *
   * @return user - хэрэглэгч
   */
  #checkSecondUser = async ({ userId }) => {
    const user = await this.#userRepository.findById(userId);

    if (user) {
      if (!user.uuid) {
        throw new UnconfirmedUserException();
      }

      return user;
    }

    throw new UserNotFoundException();
  };

  #getUserMCSDAccount = async ({ userId }) => {
    const user = await this.#userRepository.findMCSDAccountById(userId);

    if (user) {
      if (!user.uuid) {
        throw new UnconfirmedUserException();
      }

      return user;
    }

    throw new UserNotFoundException();
  };

  validateStatus = async (status) => {
    const { data } = this.validate(
      {
        status: Joi.custom(Helper.isNumber, 'custom validation').valid(
          UserConst.STATUS_ACTIVE,
          UserConst.STATUS_INACTIVE,
          UserConst.STATUS_PENDING,
          UserConst.STATUS_PENDING_PAYMENT
        ),
      },
      { status: +status }
    );

    return { data };
  };

  validateUserDuplicated = async ({ registerNumber }) => {
    const user = await this.#userRepository.findByRegisterNumber(registerNumber);

    if (user) {
      throw new RegisterNumberDuplicatedException();
    }

    return false;
  };
  validateRegisterPut = async (params) => {
    const { data } = this.validate(
      {
        uuid: Joi.string().required(),
        identity: Joi.string().required(),
        identityType: Joi.string().required(),
        additional: Joi.object({
          oldIdentity: Joi.string()
        }).required(),
      },
      params
    );

    

    return { data };
  };
  validateRegister = async (params) => {
    const { data } = this.validate(
      {
        uuid: Joi.string().required(),
        identity: Joi.string().required(),
        identityType: Joi.string().required(),
        additional: Joi.object({
          regNumber: Joi.string().regex(UserConst.REGISTER_NUMBER_PATTERN),
          passportNumber: Joi.string(),
          extra_identity: Joi.string(),
          type: Joi.custom(Helper.isNumber, 'custom validation'),
        }).required(),
      },
      params
    );

    if(data.additional.regNumber != undefined){
      await this.validateUserDuplicated({ registerNumber: data.additional.regNumber });
    }

    return { data };
  };

  validateEditUser = async (params) => {
    // let nations = await this.#nationRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // nations = nations.map((nation) => nation.id);

    // let countries = await this.#countryRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // countries = countries.map((country) => country.id);

    // let cities = await this.#cityRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // cities = cities.map((city) => city.id);

    // let districts = await this.#districtRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // districts = districts.map((district) => district.id);

    // const {
    //   userId,
    //   handphone,
    //   birthday,
    //   educationId,
    //   gender,
    //   nationId,
    //   profession,
    //   position,
    //   workphone,
    //   ...adminParams
    // } = params;

    const { data } = this.validate(
      {
        userId: Joi.custom(Helper.isNumber, 'custom validation'),
        familyName: Joi.string().min(1),
        firstName: Joi.string().min(1),
        lastName: Joi.string().min(1),
        registerNumber: Joi.string().allow(''),
        phone: Joi.string().allow(''),
        handphone: Joi.string().allow(''),
        birthday: Joi.date(),
        educationId: Joi.custom(Helper.isNumber, 'custom validation'),
        gender: Joi.custom(Helper.isNumber, 'custom validation').valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE),
        // nationId: Joi.custom(Helper.isNumber, 'custom validation').valid(...nations),
        profession: Joi.string().allow(''),
        position: Joi.string().allow(''),
        workphone: Joi.string().allow(''),
        custType: Joi.custom(Helper.isNumber, 'custom validation').valid(
          UserConst.TYPE_ADULT_CUSTOMER,
          UserConst.TYPE_FOREIGN_CUSTOMER,
          UserConst.TYPE_ORGINIZATION_CUSTOMER,
          UserConst.TYPE_CHILD_CUSTOMER
        ),
        passportNumber: Joi.string().allow(''),
        // country: Joi.custom(Helper.isNumber, 'custom validation').valid(...countries),
        // city: Joi.custom(Helper.isNumber, 'custom validation').valid(...cities),
        // district: Joi.custom(Helper.isNumber, 'custom validation').valid(...districts),
        subDistrict: Joi.string().allow(''),
        address: Joi.string().allow(''),
      },
      params
    );

    // if (userId) {


    //   const { data: adminData } = this.validate(
    //     {
    //       familyName: Joi.string().min(1),
    //       firstName: Joi.string().min(1),
    //       lastName: Joi.string().min(1),
    //       registerNumber: Joi.string().allow(''),
    //       phone: Joi.string().allow(''),
    //       country: Joi.custom(Helper.isNumber, 'custom validation').valid(...countries),
    //       city: Joi.custom(Helper.isNumber, 'custom validation').valid(...cities),
    //       district: Joi.custom(Helper.isNumber, 'custom validation').valid(...districts),
    //       subDistrict: Joi.string().allow(''),
    //       address: Joi.string().allow(''),
    //       custType: Joi.custom(Helper.isNumber, 'custom validation').valid(
    //         McsdConst.CUSTOMER_TYPE_AAN,
    //         McsdConst.CUSTOMER_TYPE_CITIZEN
    //       ),
    //       passportNumber: Joi.string().allow(''),
    //     },
    //     adminParams
    //   );

    //   const user = await this.#checkSecondUser({ userId: data.userId });
    //   console.log('adminData', adminData)
    //   return data;
    // }

    return { data };
  };

  validateUserInfo = async (user, params) => {
    // if (UserConst.STATUS_CONFIRMED !== user.status) {
    //   throw new UserCreatedException();
    // }
    // if(params.registerNumber){
    //   await this.validateUserDuplicated({ registerNumber: params.registerNumber });
    // }
    let schema:any = {
      userId: Joi.custom(Helper.isNumber, 'custom validation'),
      type: Joi.custom(Helper.isNumber, 'custom validation')
        .valid(
          UserConst.TYPE_ADULT_CUSTOMER,
          UserConst.TYPE_FOREIGN_CUSTOMER,
          UserConst.TYPE_ORGINIZATION_CUSTOMER,
          UserConst.TYPE_CHILD_CUSTOMER
        )
        .required(),
    };

    // let nations = await this.#nationRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // nations = nations.map((nation) => nation.id);

    // let countries = await this.#countryRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // countries = countries.map((country) => country.id);

    // let cities = await this.#cityRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // cities = cities.map((city) => city.id);

    // let districts = await this.#districtRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    // districts = districts.map((district) => district.id);

    switch (params.type) {
      case UserConst.TYPE_ADULT_CUSTOMER:
        schema.firstName = Joi.string().min(1);
        schema.lastName = Joi.string().min(1);
        schema.nationId = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...nations);
        schema.birthday = Joi.date().required();
        schema.country = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...countries)
          .required();
        schema.city = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...cities)
          .required();
        schema.district = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...districts)
          .required();
        schema.subDistrict = Joi.string().required();
        schema.address = Joi.string().required();
        schema.workphone = Joi.string().required();
        schema.profession = Joi.string().required();
        schema.position = Joi.string().required();
        schema.companyName = Joi.string();
        schema.gender = Joi.string().valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE).required();
        break;
      case UserConst.TYPE_FOREIGN_CUSTOMER:
        schema.firstName = Joi.string().min(1);
        schema.lastName = Joi.string().min(1);
        schema.passportNumber = Joi.string().min(1);
        schema.gender = Joi.string().valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE);
        schema.nationId = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...nations);
        schema.birthday = Joi.date();
        schema.country = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...countries)
          ;
        schema.city = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...cities)
          ;
        schema.district = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...districts)
          ;
        schema.subDistrict = Joi.string();
        schema.address = Joi.string();
        schema.position = Joi.string();
        schema.profession = Joi.string();
        schema.workphone = Joi.string();
        break;
      case UserConst.TYPE_ORGINIZATION_CUSTOMER:
        schema.companyName = Joi.string().min(1).required();
        schema.companyRegisterNumber = Joi.string().min(1).required();
        break;
      case UserConst.TYPE_CHILD_CUSTOMER:
        schema.familyName = Joi.string().min(1);
        schema.firstName = Joi.string().min(1);
        schema.lastName = Joi.string().min(1);
        schema.registerNumber = Joi.string().min(1);
        schema.gender = Joi.string().valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE);
        schema.nationId = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...nations);
        schema.birthday = Joi.date();
        schema.country = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...countries)
          ;
        schema.city = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...cities)
          ;
        schema.district = Joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...districts)
          ;
        schema.subDistrict = Joi.string();
        schema.address = Joi.string();
        schema.position = Joi.string();
        schema.profession = Joi.string();
        schema.workphone = Joi.string();
        break;
      default:
        throw new InvalidParamException();
    }

    const { data } = this.validate(schema, params);

    return { data };
  };

  validateAdditionalInfo = async (params) => {
    const { data } = this.validate(
      {
        userId: Joi.custom(Helper.isNumber, 'custom validation').required(),
        monthlyIncome: Joi.string().allow(''),
        employ: Joi.string().allow(''),
        hasBusiness: Joi.boolean(),
        companyName: Joi.string().allow(''),
        companyType: Joi.string().allow(''),
        yearlySales: Joi.string().allow(''),
        politician: Joi.boolean().allow(''),
        relation: Joi.string().allow(''),
        relationName: Joi.string().allow(''),
        salesAndBusinessIncome: Joi.string().allow(''),
        contractIncome: Joi.string().allow(''),
        investmentIncome: Joi.string().allow(''),
        assetSoldIncome: Joi.string().allow(''),
        salaryIncome: Joi.string().allow(''),
        familyIncome: Joi.string().allow(''),
        familyCharityIncome: Joi.string().allow(''),
        otherIncome: Joi.string().allow(''),
        anket: Joi.array().items(
          Joi.object({
            lastName: Joi.string(),
            firstName: Joi.string(),
            registerNumber: Joi.string(),
            relation: Joi.string(),
            employ: Joi.string(),
            position: Joi.string(),
            businessType: Joi.string(),
            country: Joi.string()
          })
        )
      },
      params
    );

    if (data.userId) {
      const user = await this.#checkSecondUser({ userId: data.userId });

      return { data, sUser: user };
    }

    return { data };
  };

  validateUserRelation = async (params) => {
    const { data } = this.validate(
      {
        userId: Joi.custom(Helper.isNumber, 'custom validation'),
        ankets: Joi.array().items(
          Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
            registerNumber: Joi.string(),
            relation: Joi.string(),
            employ: Joi.string(),
            position: Joi.string(),
            businessType: Joi.string(),
            country: Joi.string(),
          })
        ),
      },
      params
    );

    if (data.userId) {
      const user = await this.#checkSecondUser({ userId: data.userId });

      return { data, sUser: user };
    }

    return { data };
  };

  validateActivateUser = async (params) => {
    const { data } = this.validate(
      {
        identity: Joi.string().email().required(),
        code: Joi.string().required(),
      },
      params
    );

    const user = await this.#checkUserByEmail({ email: params.identity });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (UserConst.STATUS_PENDING !== user.status) {
      throw new UserActivatedException();
    }

    return { user, data };
  };
  validateUpdateBankAccount = async (params) => {
    const { data } = this.validate(
      {
        id: Joi.custom(Helper.isNumber, 'custom validation').required(),
        bankCode: Joi.string().required(),
        accountNo: Joi.string().required(),
        accountName: Joi.string().required(),
        userId: Joi.custom(Helper.isNumber, 'custom validation'),
      },
      params
    );
    if (McsdConst.bankGWGetTypes(data.bankCode) == undefined) {
      throw new BankNotFoundException();
    }
    if (data.userId) {
      const user = await this.#checkSecondUser({ userId: data.userId });

      return { data, sUser: user };
    }

    return { data };
  };
  validateUserBankAccount = async (params) => {
    const { data } = this.validate(
      {
        bankCode: Joi.string().required(),
        accountNo: Joi.string().required(),
        accountName: Joi.string().required(),
        userId: Joi.custom(Helper.isNumber, 'custom validation'),
      },
      params
    );
    if (McsdConst.bankGWGetTypes(data.bankCode) == undefined) {
      throw new BankNotFoundException();
    }
    if (data.userId) {
      const user = await this.#checkSecondUser({ userId: data.userId });

      return { data, sUser: user };
    }

    return { data };
  };

  validateMCSDTransactions = async (params) => {
    const { data } = this.validate(
      {
        BeginDate: Joi.date().required(),
        EndDate: Joi.date().required(),
        userId: Joi.custom(Helper.isNumber, 'custom validation').required(),
      },
      params
    );


    const user = await this.#getUserMCSDAccount({ userId: data.userId });


    return { user, data };
  };

  validateGetAccountStatus = async params => {
    let today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setUTCHours(0, 0, 0, 0);
    var { error, data } = this.validate({
      BeginDate: Joi.date().default(today),
      EndDate: Joi.date().default(tomorrow)
    }, params);

    return data;
  };

  validateRemoveBankAccount = async (user, params) => {
    const { data } = this.validate(
      {
        id: Joi.custom(Helper.isNumber, 'custom validation').required(),
        userId: Joi.custom(Helper.isNumber, 'custom validation'),
      },
      params
    );

    const account = await this.#userBankAccountRepository.findById(data.id);
    if (!account) {
      throw new InvalidParamException();
    }

    let sUser = user;
    if (data.userId) {
      sUser = await this.#checkSecondUser({ userId: data.userId });
    }

    if (sUser.id !== account.userId) {
      throw new InvalidParamException();
    }

    return { data, account, sUser: sUser || user };
  };

  validateEditNationalCard = async (user, params) => {
    const { data } = this.validate(
      {
        registerNumber: Joi.string().regex(UserConst.REGISTER_NUMBER_PATTERN).required(),
        lastName: Joi.string().required(),
        firstName: Joi.string().required(),
        familyName: Joi.string().required(),
        birthday: Joi.date().required(),
      },
      params
    );
    const nationalCard = {}
    // const nationalCard = await this.#nationalCardRepository.findByUserId(user.id);

    // if (!nationalCard) {
    //   throw new ErrorException(500, 'National Card not found');
    // }

    return { data, nationalCard };
  };

  validateStoreFile = async (params) => {
    const { data } = this.validate(
      {
        type: Joi.custom(Helper.isNumber, 'custom validation')
          .valid(...UserFilesConst.getTypes())
          .required(),
        imageBase64: Joi.string().required(),
        userId: Joi.custom(Helper.isNumber, 'custom validation'),
      },
      params
    );

    if (data.userId) {
      const user = await this.#checkSecondUser({ userId: data.userId });

      return { data, sUser: user };
    }

    return { data };
  };

  validateMCSDAccount = async (params) => {
    const { data } = this.validate(
      {
        registerNumber: Joi.string().required(),
      },
      params
    );

    const user = await this.#checkUserByRegisterNumber({ registerNumber: data.registerNumber });
    if (user.status == UserConst.STATUS_ACTIVE || user.status == UserConst.STATUS_MCSD_PENDING) {
      throw new UserCreatedException();
    }
    return { data, user };
  };
}

module.exports = UserValidator;
