import BaseValidator from '../base.validator';
// const Joi = require('joi');

import UserRepository from '../../../repository/user/user.repository';
// const NationRepository = require('../../../repository/user/nation.repository');
// const NationalCardRepository = require('../../../repository/user/national.card.repository');
// const DistrictRepository = require('../../../repository/user/district.repository');
// const CityRepository = require('../../../repository/user/city.repository');
// const CountryRepository = require('../../../repository/user/country.repository');
import UserBankAccountRepository from '../../../repository/user/user.bank.account.repository';
import UserMCSDAccountRepository from '../../../repository/user/user.mcsd.repository';

// const {
//   RegisterNumberDuplicatedException,
//   UserNotFoundException,
//   InvalidParamException,
//   UnconfirmedUserException,
//   UserActivatedException,
//   UserCreatedException,
//   BankNotFoundException,
//   UserMCSDAccountNotFoundException
// } = require('../../../exception/error');

// const { UserConst, UserFilesConst } = require('../../../typing/user.const');
import { UserConst } from '../../../constants/user';
// const Helper = require('../../../middleware/helper.middleware');
import Helper from '../../../middleware/helper.service';
// const BaseConst = require('../../../typing/base.const');
import BaseConst from '../../../constants/base';
// const { McsdConst } = require('../../../typing/mcsd.const');
import { McsdConst } from '../../../constants/mcsd';
import { getUser } from '../../../models/utils';
import ErrorException from '../../../exception/error-exception';
import { CustomException, ErrorCode } from '../../../exception/error-code';
// const ErrorException = require('../../../exception/error-exception');

class UserValidator extends BaseValidator {
  // #userRepository: UserRepository;
  // #userBankAccountRepository: UserBankAccountRepository;
  // #userMCSDAccountRepository: UserMCSDAccountRepository;
  #userRepository = new UserRepository();
  // #nationRepository = new NationRepository();
  // #countryRepository = new CountryRepository();
  // #cityRepository = new CityRepository();
  // #districtRepository = new DistrictRepository();
  // #nationalCardRepository = NationalCardRepository.get();
  #userBankAccountRepository = new UserBankAccountRepository();
  #userMCSDAccountRepository = new UserMCSDAccountRepository();
  // constructor() {
  //   super();
  //   this.#userRepository = new UserRepository();
  //   // #nationRepository = new NationRepository();
  //   // #countryRepository = new CountryRepository();
  //   // #cityRepository = new CityRepository();
  //   // #districtRepository = new DistrictRepository();
  //   // #nationalCardRepository = NationalCardRepository.get();
  //   this.#userBankAccountRepository = new UserBankAccountRepository();
  //   this.#userMCSDAccountRepository = new UserMCSDAccountRepository();
  // }
  #checkUserByEmail = async ({ email }) => {
    const user = await this.#userRepository.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  };

  checkUserMCSDAccount = async (userId) => {
    let userMCSDAccount = await this.#userMCSDAccountRepository.find({
      userId: userId
    })

    if (userMCSDAccount.length == 0) {
      throw new Error('User MCSD account not found');
    }

    return userMCSDAccount[0];

  }

  #checkUserByRegisterNumber = async ({ registerNumber }) => {
    const user = await this.#userRepository.findByRegisterNumber(registerNumber);

    if (!user) {
      throw new Error('User not found');
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
    // const user = await this.#userRepository.findById(userId);
    let query = {
      _id: userId
    };
    let user = await getUser(query);
    console.log('getUser', user)
    if (user) {
      if (!user.uuid) {
        throw new Error('Unconfirmed user');
      }

      return user;
    }

    throw new Error('User not found');
  };

  #getUserMCSDAccount = async ({ userId }) => {
    const user = await this.#userRepository.findMCSDAccountById(userId);

    if (user) {
      if (!user.uuid) {
        throw new Error('Unconfirmed user');
      }

      return user;
    }

    throw new Error('User not found');
  };

  validateStatus = async (status) => {
    const { data } = this.validate(
      {
        status: this._joi.custom(Helper.isNumber, 'custom validation').valid(
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
      throw new Error('Register number duplicated');
    }

    return false;
  };
  validateRegisterPut = async (params) => {
    const { data } = this.validate(
      {
        uuid: this._joi.string().required(),
        identity: this._joi.string().required(),
        identityType: this._joi.string().required(),
        additional: this._joi.object({
          oldIdentity: this._joi.string()
        }).required(),
      },
      params
    );



    return { data };
  };
  validateRegister = async (params) => {
    const { data } = this.validate(
      {
        uuid: this._joi.string().required(),
        identity: this._joi.string().required(),
        identityType: this._joi.string().required(),
        additional: this._joi.object({
          regNumber: this._joi.string().regex(UserConst.REGISTER_NUMBER_PATTERN),
          passportNumber: this._joi.string(),
          extra_identity: this._joi.string(),
          type: this._joi.custom(Helper.isNumber, 'custom validation'),
        }).required(),
      },
      params
    );

    if (data.additional.regNumber != undefined) {
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
    //   handPhone,
    //   birthday,
    //   educationId,
    //   gender,
    //   nationId,
    //   profession,
    //   position,
    //   workPhone,
    //   ...adminParams
    // } = params;

    const { data } = this.validate(
      {
        userId: this._joi.custom(Helper.isNumber, 'custom validation'),
        familyName: this._joi.string().min(1),
        firstName: this._joi.string().min(1),
        lastName: this._joi.string().min(1),
        registerNumber: this._joi.string().allow(''),
        phone: this._joi.string().allow(''),
        handPhone: this._joi.string().allow(''),
        birthday: this._joi.date(),
        educationId: this._joi.custom(Helper.isNumber, 'custom validation'),
        gender: this._joi.custom(Helper.isNumber, 'custom validation').valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE),
        // nationId: this._joi.custom(Helper.isNumber, 'custom validation').valid(...nations),
        profession: this._joi.string().allow(''),
        position: this._joi.string().allow(''),
        workPhone: this._joi.string().allow(''),
        custType: this._joi.custom(Helper.isNumber, 'custom validation').valid(
          UserConst.TYPE_ADULT_CUSTOMER,
          UserConst.TYPE_FOREIGN_CUSTOMER,
          UserConst.TYPE_ORGINIZATION_CUSTOMER,
          UserConst.TYPE_CHILD_CUSTOMER
        ),
        passportNumber: this._joi.string().allow(''),
        // country: this._joi.custom(Helper.isNumber, 'custom validation').valid(...countries),
        // city: this._joi.custom(Helper.isNumber, 'custom validation').valid(...cities),
        // district: this._joi.custom(Helper.isNumber, 'custom validation').valid(...districts),
        subDistrict: this._joi.string().allow(''),
        address: this._joi.string().allow(''),
      },
      params
    );

    // if (userId) {


    //   const { data: adminData } = this.validate(
    //     {
    //       familyName: this._joi.string().min(1),
    //       firstName: this._joi.string().min(1),
    //       lastName: this._joi.string().min(1),
    //       registerNumber: this._joi.string().allow(''),
    //       phone: this._joi.string().allow(''),
    //       country: this._joi.custom(Helper.isNumber, 'custom validation').valid(...countries),
    //       city: this._joi.custom(Helper.isNumber, 'custom validation').valid(...cities),
    //       district: this._joi.custom(Helper.isNumber, 'custom validation').valid(...districts),
    //       subDistrict: this._joi.string().allow(''),
    //       address: this._joi.string().allow(''),
    //       custType: this._joi.custom(Helper.isNumber, 'custom validation').valid(
    //         McsdConst.CUSTOMER_TYPE_AAN,
    //         McsdConst.CUSTOMER_TYPE_CITIZEN
    //       ),
    //       passportNumber: this._joi.string().allow(''),
    //     },
    //     adminParams
    //   );

    //   const user = await this.#checkSecondUser({ userId: data.userId });
    //   console.log('adminData', adminData)
    //   return data;
    // }

    return { data };
  };

  validateUserInfo = async (params) => {
    // if (UserConst.STATUS_CONFIRMED !== user.status) {
    //   throw new Error('User created');
    // }

    if (params.registerNumber) {
      await this.validateUserDuplicated({ registerNumber: params.registerNumber });
    }
    let user = getUser({
      _id: params.uuid
    })
    if (!user) {
      // throw new Error('User not found');
    }
    params.birthday = '2010-05-05';
    let schema: any = {
      // userId: this._joi.custom(Helper.isNumber, 'custom validation'),
      uuid: this._joi.string(),
      email: this._joi.string(),
      phone: this._joi.string(),
      type: this._joi.custom(Helper.isNumber, 'custom validation')
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
        schema.firstName = this._joi.string().min(1);
        schema.lastName = this._joi.string().min(1);
        schema.registerNumber = this._joi.string().min(1);
        schema.nationId = this._joi.custom(Helper.isNumber, 'custom validation')
        // .valid(...nations);
        schema.birthday = this._joi.date().required();
        schema.country = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...countries)
          .required();
        schema.city = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...cities)
          .required();
        schema.district = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...districts)
          .required();
        schema.subDistrict = this._joi.string().required();
        schema.address = this._joi.string().required();
        schema.workPhone = this._joi.string().required();
        schema.profession = this._joi.string().required();
        schema.position = this._joi.string().required();
        schema.companyName = this._joi.string();
        schema.gender = this._joi.string().valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE).required();
        break;
      case UserConst.TYPE_FOREIGN_CUSTOMER:
        schema.firstName = this._joi.string().min(1);
        schema.lastName = this._joi.string().min(1);
        schema.passportNumber = this._joi.string().min(1);
        schema.gender = this._joi.string().valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE);
        schema.nationId = this._joi.custom(Helper.isNumber, 'custom validation')
        // .valid(...nations);
        schema.birthday = this._joi.date();
        schema.country = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...countries)
          ;
        schema.city = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...cities)
          ;
        schema.district = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...districts)
          ;
        schema.subDistrict = this._joi.string();
        schema.address = this._joi.string();
        schema.position = this._joi.string();
        schema.profession = this._joi.string();
        schema.workPhone = this._joi.string();
        break;
      case UserConst.TYPE_ORGINIZATION_CUSTOMER:
        schema.companyName = this._joi.string().min(1).required();
        schema.companyRegisterNumber = this._joi.string().min(1).required();
        break;
      case UserConst.TYPE_CHILD_CUSTOMER:
        schema.familyName = this._joi.string().min(1);
        schema.firstName = this._joi.string().min(1);
        schema.lastName = this._joi.string().min(1);
        schema.registerNumber = this._joi.string().min(1);
        schema.gender = this._joi.string().valid(UserConst.GENDER_MALE, UserConst.GENDER_FEMALE);
        schema.nationId = this._joi.custom(Helper.isNumber, 'custom validation')
        // .valid(...nations);
        schema.birthday = this._joi.date();
        schema.country = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...countries)
          ;
        schema.city = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...cities)
          ;
        schema.district = this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...districts)
          ;
        schema.subDistrict = this._joi.string();
        schema.address = this._joi.string();
        schema.position = this._joi.string();
        schema.profession = this._joi.string();
        schema.workPhone = this._joi.string();
        break;
      default:
        throw new Error('Invalid param exception');
    }

    const { data } = this.validate(schema, params);

    return { data };
  };

  validateAdditionalInfo = async (params) => {
    const { data } = this.validate(
      {
        userId: this._joi.custom(Helper.isNumber, 'custom validation').required(),
        monthlyIncome: this._joi.string().allow(''),
        employ: this._joi.string().allow(''),
        hasBusiness: this._joi.boolean(),
        companyName: this._joi.string().allow(''),
        companyType: this._joi.string().allow(''),
        yearlySales: this._joi.string().allow(''),
        politician: this._joi.boolean().allow(''),
        relation: this._joi.string().allow(''),
        relationName: this._joi.string().allow(''),
        salesAndBusinessIncome: this._joi.string().allow(''),
        contractIncome: this._joi.string().allow(''),
        investmentIncome: this._joi.string().allow(''),
        assetSoldIncome: this._joi.string().allow(''),
        salaryIncome: this._joi.string().allow(''),
        familyIncome: this._joi.string().allow(''),
        familyCharityIncome: this._joi.string().allow(''),
        otherIncome: this._joi.string().allow(''),
        anket: this._joi.array().items(
          this._joi.object({
            lastName: this._joi.string(),
            firstName: this._joi.string(),
            registerNumber: this._joi.string(),
            relation: this._joi.string(),
            employ: this._joi.string(),
            position: this._joi.string(),
            businessType: this._joi.string(),
            country: this._joi.string()
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
        userId: this._joi.custom(Helper.isNumber, 'custom validation'),
        ankets: this._joi.array().items(
          this._joi.object({
            firstName: this._joi.string(),
            lastName: this._joi.string(),
            registerNumber: this._joi.string(),
            relation: this._joi.string(),
            employ: this._joi.string(),
            position: this._joi.string(),
            businessType: this._joi.string(),
            country: this._joi.string(),
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
        identity: this._joi.string().email().required(),
        code: this._joi.string().required(),
      },
      params
    );

    const user = await this.#checkUserByEmail({ email: params.identity });

    if (!user) {
      throw new Error('User not found');
    }

    if (UserConst.STATUS_PENDING !== user.status) {
      throw new Error('User activated');
    }

    return { user, data };
  };
  validateUpdateBankAccount = async (params) => {
    const { data } = this.validate(
      {
        id: this._joi.custom(Helper.isNumber, 'custom validation').required(),
        bankCode: this._joi.string().required(),
        accountNo: this._joi.string().required(),
        accountName: this._joi.string().required(),
        userId: this._joi.custom(Helper.isNumber, 'custom validation'),
      },
      params
    );
    if (McsdConst.bankGWGetTypes(data.bankCode) == undefined) {
      throw new Error('Bank not found');
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
        bankCode: this._joi.string().required(),
        accountNo: this._joi.string().required(),
        accountName: this._joi.string().required(),
        userId: this._joi.string().required(),
      },
      params
    );
    if (McsdConst.bankGWGetTypes(data.bankCode) == undefined) {
      throw new Error('Bank not found');
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
        BeginDate: this._joi.date().required(),
        EndDate: this._joi.date().required(),
        userId: this._joi.custom(Helper.isNumber, 'custom validation').required(),
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
      BeginDate: this._joi.date().default(today),
      EndDate: this._joi.date().default(tomorrow)
    }, params);

    return data;
  };

  validateRemoveBankAccount = async (user, params) => {
    const { data } = this.validate(
      {
        id: this._joi.custom(Helper.isNumber, 'custom validation').required(),
        userId: this._joi.custom(Helper.isNumber, 'custom validation'),
      },
      params
    );

    const account = await this.#userBankAccountRepository.findById(data.id);
    if (!account) {
      throw new Error('Invalid param exception');
    }

    let sUser = user;
    if (data.userId) {
      sUser = await this.#checkSecondUser({ userId: data.userId });
    }

    if (sUser.id !== account.userId) {
      throw new Error('Invalid param exception');
    }

    return { data, account, sUser: sUser || user };
  };

  validateEditNationalCard = async (user, params) => {
    const { data } = this.validate(
      {
        registerNumber: this._joi.string().regex(UserConst.REGISTER_NUMBER_PATTERN).required(),
        lastName: this._joi.string().required(),
        firstName: this._joi.string().required(),
        familyName: this._joi.string().required(),
        birthday: this._joi.date().required(),
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
        type: this._joi.custom(Helper.isNumber, 'custom validation')
          // .valid(...UserFilesConst.getTypes())
          .required(),
        imageBase64: this._joi.string().required(),
        userId: this._joi.custom(Helper.isNumber, 'custom validation'),
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
        registerNumber: this._joi.string(),
        userId: this._joi.string()
      },
      params
    );
    let user;
    if (data.registerNumber)
      user = await this.#checkUserByRegisterNumber({ registerNumber: data.registerNumber });
    if (data.userId)
      user = await getUser({
        _id: data.userId
      })
      console.log('user',user)
     
    return { data, user };
  };
}

export default UserValidator;