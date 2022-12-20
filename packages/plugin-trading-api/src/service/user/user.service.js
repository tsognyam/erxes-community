const FileService = require('../file.service');
const WalletService = require('../wallet/wallet.service');
const MCSDService = require('../mcsd.service');
const MSCCService = require('../mscc.service');
const CustFeeService = require('../custfee.service');
const UserRepository = require('../../repository/user/user.repository');
const UserFilesRepository = require('../../repository/user/user.files.repository');
const UserBankAccountRepository = require('../../repository/user/user.bank.account.repository');
const NationalCardRepository = require('../../repository/user/national.card.repository');
const WalletRepository = require('../../repository/wallet/wallet.repository');
const UserRelationRepository = require('../../repository/user/user.relation.repository');
const UserAdditionalInfoRepository = require('../../repository/user/user.additional.info.repository');

const UserValidator = require('../validator/user/user.validator');

const Helper = require('../../middleware/helper.middleware');

const { UserConst, UserGroupConst, UserFilesConst, UserStepConst } = require('../../typing/user.const');
const { McsdConst, McsdAccountConst } = require('../../typing/mcsd.const');
const BaseConst = require('../../typing/base.const');
const { CurrencyConst, WalletConst } = require('../../typing/wallet.const');
const { UserNotFoundException, UserBankNotFoundException, NotRequireToUpdate } = require('../../exception/error');
const UserAddressRepository = require('../../repository/user/user.address.repository');
const ErrorException = require('../../exception/error-exception');
const { getValueR } = require('../../middleware/helper.middleware');
const NotificationService = require('../notification.service');
const { StockConst, StockTypeConst } = require('../../typing/stock.const');
const { logger, loggerMCSD, loggerID } = require('../../middleware/logger');
const { MSG_SUCCESS } = require('../../typing/base.const');
const moment = require('moment');

class UserService {
  #validator = new UserValidator();
  #mcsdService = new MCSDService();
  #fileService = new FileService();
  #walletService = new WalletService();
  #custFeeService = new CustFeeService();
  #userRepository = new UserRepository();
  #userFilesRepository = new UserFilesRepository();
  #userBankAccountRepository = UserBankAccountRepository.get();
  #nationalCardRepository = NationalCardRepository.get();
  #walletRepository = WalletRepository.get();
  #userRelationRepository = UserRelationRepository.get();
  #userAdditionalInfoRepository = UserAdditionalInfoRepository.get();
  #userAddressRepository = UserAddressRepository.get();
  _notificationService = new NotificationService();
  #msccService = new MSCCService();

  getFullInfo = (user) => this.#userRepository.findById(+user.id, true);

  changeStep = async (user, step = UserStepConst.STEP_1) =>
    await this.#userRepository.update({ id: +user.id }, { externalId: step });

  getUserInfoById = async (userId) => {
    const user = await this.#userRepository.findById(+userId, true);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  };

  getUser = async (userUuid) => {
    let user = this.#userRepository.findByUuid(userUuid);
    return user;
  };
  registerUserPut = async (params) => {

    loggerID.info(params);
    const { data } = await this.#validator.validateRegisterPut(params);

    const { uuid, identityType, identity, additional } = data;

    if (identityType == 'email') {


      await this.#userRepository.update(
        { uuid: uuid },
        {
          identityType: identityType,
          email: identity
        }
      );
    } else {
      await this.#userRepository.update(
        { uuid: uuid },
        {
          identityType: identityType,
          handphone: identity
        }
      );

    }


    return BaseConst.MSG_SUCCESS;
  };
  registerUser = async (params) => {

    loggerID.info(params);
    const { data } = await this.#validator.validateRegister(params);

    const { uuid, identityType, identity, additional } = data;
    let groupId = UserGroupConst.GROUP_USER;
    if (additional.type == UserConst.TYPE_ADMIN) {
      groupId = UserGroupConst.GROUP_ADMIN;
    }
    if (identityType == 'email') {


      await this.#userRepository.create({
        uuid,
        identityType,
        email: identity,
        handphone: additional.extra_identity,
        registerNumber: additional.regNumber,
        passportNumber: additional.passportNumber,
        status: UserConst.STATUS_CONFIRMED,

        UserGroup: {
          create: [
            {
              groupId: groupId,
            },
          ],
        },

      });
    } else {

      await this.#userRepository.create({
        uuid,
        identityType,
        email: additional.extra_identity,
        handphone: identity,
        registerNumber: additional.regNumber,
        passportNumber: additional.passportNumber,
        status: UserConst.STATUS_CONFIRMED,

        UserGroup: {
          create: [
            {
              groupId: groupId,
            },
          ],
        },


      });
    }


    return BaseConst.MSG_SUCCESS;
  };

  createAccount = async (params) => {

    let user = await this.#userRepository.findById(+params.userId);
    const { data } = await this.#validator.validateUserInfo(user, params);

    data.custType = data.type;
    // data.custType = McsdConst.CUSTOMER_TYPE_CITIZEN;
    // if (UserConst.TYPE_ORGINIZATION_CUSTOMER === data.type) {
    //   data.custType = McsdConst.CUSTOMER_TYPE_AAN;
    // }
    delete data.userId;
    delete data.type;
    let updatedUser;

    const { country, city, district, subDistrict, address, ...userData } = data;
    if (data.custType == UserConst.TYPE_FOREIGN_CUSTOMER) {
      userData.registerNumber = userData.passportNumber;
    }
    if (country && city && district && subDistrict && address) {
      const userAddress = await this.#userAddressRepository.updateMany(

        {
          userId: user.id,
          status: BaseConst.STATUS_ACTIVE
        },
        {
          status: BaseConst.STATUS_INACTIVE
        },

      )
      updatedUser = await this.#userRepository.update(
        { uuid: user.uuid },
        {
          ...userData,
          status: UserConst.STATUS_PENDING_PAYMENT,
          UserAddress: {
            create: [
              {
                countryId: country,
                cityId: city,
                districtId: district,
                address,
                subDistrict,
                status: BaseConst.STATUS_ACTIVE,
              },
            ],
          },
        }
      );
    } else {
      updatedUser = await this.#userRepository.update(
        { uuid: user.uuid },
        {
          ...userData,
          status: UserConst.STATUS_PENDING_PAYMENT
        }
      );
    }

    await this.changeStep(user, UserStepConst.STEP_3);

    return updatedUser;
  };

  additionalInfo = async (user, params) => {

    const { data } = await this.#validator.validateAdditionalInfo(params);

    const { anket, ...additionalInfo } = data;

    await this.#userAdditionalInfoRepository.participateTransaction(
      {
        where: {
          userId: data.userId,
          status: BaseConst.STATUS_ACTIVE,
        },
        data: {
          status: BaseConst.STATUS_INACTIVE,
          updatedUserId: user.id,
          updatedAt: new Date(),
        },
      },
      {
        data: {
          ...additionalInfo, createdUserId: +user.id, updatedUserId: +user.id,
          updatedAt: new Date(),
        }
      }
    );

    let ankets = [];
    if (anket != undefined) {
      anket.forEach((el) => {
        el.userId = +data.userId;
        el.createdUserId = +data.userId;
        ankets.push(el);
      });

      await this.#userRelationRepository.participateTransaction(
        {
          where: {
            userId: +data.userId,
            status: +BaseConst.STATUS_ACTIVE,
          },
          data: {
            status: +BaseConst.STATUS_ACTIVE,
            updatedUserId: +user.id,
            updatedAt: new Date(),
          },
        },
        { data: ankets }
      );
    }
    await this.#userRepository.update(
      { id: +data.userId },
      {
        isAdditional: true
      })

    return BaseConst.MSG_SUCCESS;
  };

  cooperateGW = async (params) => {
    const { data, user } = await this.#validator.validateMCSDAccount(params);
    if (user.status == UserConst.STATUS_MCSD_ERROR) {
      return await this.updateMCSDAccount({ userId: user.id });
    }
    //Компанийн бондын шимтгэл
    const feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    const feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    const feeEquity = await Helper.getValue('FeeEquity');


    if (user.status == UserConst.STATUS_PENDING_PAYMENT) {
      try {
        await this.#userRepository.update(
          { email: user.email },
          {
            status: UserConst.STATUS_PAID,
            UserMCSDAccount: {
              create: {
                createdAt: new Date(),
              },
            },
          }
        );
        await this.#custFeeService.create({
          name: "Хувьцааны шимтгэл",
          name2: "Securities fee",
          userId: user.id,
          stocktypeId: StockTypeConst.SEC,
          value: parseFloat(feeEquity)
        });
        await this.#custFeeService.create({
          name: "Компанийн бондын шимтгэл",
          name2: "Company bond fee",
          userId: user.id,
          stocktypeId: StockTypeConst.COMPANY_BOND,
          value: parseFloat(feeCorpDebt)
        });
        await this.#custFeeService.create({
          name: "ЗГ-ын бондын шимтгэл",
          name2: "Government bond fee",
          userId: user.id,
          stocktypeId: StockTypeConst.GOV_BOND,
          value: parseFloat(feeDebt)
        });
      }
      catch (ex) {
        logger.info("Already created fee on " + user.id);
      }

      await this.#walletService.createWallet({
        name: user.firstName,
        userId: user.id,
      });

      await this.#walletService.createWallet({
        name: user.firstName,
        userId: user.id,
        currency: CurrencyConst.USD,
      });

      await this.changeStep(user, UserStepConst.STEP_5);
    }





    await this.mcsdAccountOne({ userId: user.id });
    return MSG_SUCCESS;
  };

  mcsdAccountOne = async (params) => {
    let userId = params.userId;
    const rawUsers = await this.#userRepository.findAll(
      {
        id: userId,
        status: UserConst.STATUS_PAID
      },
      {
        UserBankAccounts: true,
        UserMCSDAccount: true,
        UserAddress: {
          select: { district: true, country: true, city: true, address: true, subDistrict: true, status: true },
        },
      }
    );
    let user = rawUsers.values[0];
    if (user == undefined) {
      throw new UserNotFoundException();
    }

    const feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    const feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    const feeEquity = await Helper.getValue('FeeEquity');

    let accounts = [];


    // const wallet = user.wallets.find(
    //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
    // );
    const bankAccount = user.UserBankAccounts.find((account) => BaseConst.STATUS_ACTIVE === account.status);
    if (bankAccount == undefined) {
      throw new UserBankNotFoundException();
    }
    // const birthdate = new Date(user.birthday).toISOString().slice(0, 10);
    const birthdate = moment(new Date(user.birthday), 'YYYY-MM-DD').format().slice(0, 10);
    const address = user.UserAddress.find((address) => BaseConst.STATUS_ACTIVE === address.status);
    // * BDCAccountNumber: 8 тэмдэгтээс бага эсвэл тэнцүү байх ёстой!
    let MCSDaccount = {
      // BDCAccountId: wallet.walletNumberId.toString(),
      // BDCAccountNumber: wallet.walletNumberId.toString(),
      BDCAccountId: user.UserMCSDAccount[0].id.toString(),
      BDCAccountNumber: user.UserMCSDAccount[0].id.toString(),
      BankAccountNumber: bankAccount.accountNo.toString(),
      BankCode: bankAccount.bankCode,
      BankName: McsdConst.getTypes(bankAccount.bankCode),
      BirthDate: birthdate,
      Country: address.country.code,
      CustomerType: user.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER ? 1 : 0,
      FeeCorpDebt: feeCorpDebt,
      FeeDebt: feeDebt,
      FeeEquity: feeEquity,
      FirstName: user.firstName,
      Gender: user.gender,
      HomeAddress: `${address.address}, ${address.subDistrict}, ${address.district.name2} district, ${address.city.name2}, ${address.country.name2}`,
      HomePhone: user.handphone,
      LastName: user.lastName,
      MobilePhone: user.handphone,
      Occupation: user.profession,
      RegistryNumber: user.registerNumber,
    }
    loggerMCSD.info('info', MCSDaccount)
    accounts.push(MCSDaccount);


    const res = await this.#mcsdService.SetAccounts(accounts);

    if (!Object.prototype.hasOwnProperty.call(res, 'SetAccountsResult')) {
      throw new ErrorException(500, 'Error at MCSD SetAccounts method');
    }

    if (
      !Object.prototype.hasOwnProperty.call(res.SetAccountsResult, 'ResponseCode') ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.SetAccountsResult.ResponseCode
    ) {
      await this.#userRepository.update(
        { id: +user.id },
        {
          description: res.SetAccountsResult.ResponseMessage,
        }
      );
      throw new ErrorException(500, res.SetAccountsResult.ResponseMessage || 'Error while SetAccounts');

    }
    await this.#userRepository.update(
      { id: +user.id },
      {
        status: UserConst.STATUS_MCSD_PENDING,
        description: "ҮЦТХТ данс нээх хүсэлт илгээгдсэн"
      }
    );

    return BaseConst.MSG_SUCCESS;
  }
  updateMCSDAccount = async (params) => {
    let userId = params.userId;
    const rawUsers = await this.#userRepository.findAll(
      {
        id: userId,
        // status: UserConst.STATUS_MCSD_ERROR
      },
      {
        UserMCSDAccount: true,
        UserBankAccounts: true,
        UserAddress: {
          select: { district: true, country: true, city: true, address: true, subDistrict: true, status: true },
        },
      }
    );
    let user = rawUsers.values[0];
    if (user == undefined) {
      throw new UserNotFoundException();
    }
    if(user.status != UserConst.STATUS_MCSD_ERROR){
      throw new NotRequireToUpdate();
    }

    let feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    let feeEquity = await Helper.getValue('FeeEquity');
    let feeDebt = await Helper.getValue('FeeDebt');
    const feeCorp = await this.#custFeeService.getbyUserIdWithType(user.id, StockTypeConst.COMPANY_BOND);
    if (feeCorp.length != 0) {
      feeCorpDebt = parseFloat(feeCorp[0].value);
    }
    //ЗГ бондын шимтгэл

    const feeGov = await this.#custFeeService.getbyUserIdWithType(user.id, StockTypeConst.GOV_BOND);
    if (feeGov.length != 0) {
      feeDebt = parseFloat(feeGov[0].value);
    }
    //Хувьцааны шимтгэл

    const feeSec = await this.#custFeeService.getbyUserIdWithType(user.id, StockTypeConst.SEC);
    if (feeSec.legnth != 0) {
      feeEquity = parseFloat(feeSec[0].value);
    }

    let accounts = [];


    // const wallet = user.wallets.find(
    //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
    // );
    const bankAccount = user.UserBankAccounts.find((account) => BaseConst.STATUS_ACTIVE === account.status);
    // const birthdate = new Date(user.birthday).toISOString().slice(0, 10);
    const birthdate = moment(new Date(user.birthday), 'YYYY-MM-DD').format().slice(0, 10);
    const address = user.UserAddress.find((address) => BaseConst.STATUS_ACTIVE === address.status);

    // * BDCAccountNumber: 8 тэмдэгтээс бага эсвэл тэнцүү байх ёстой!
    let MCSDaccount = {
      BDCAccountId: user.UserMCSDAccount[0].id.toString(),
      BDCAccountNumber: user.UserMCSDAccount[0].id.toString(),
      BankAccountNumber: bankAccount.accountNo.toString(),
      BankCode: bankAccount.bankCode,
      BankName: McsdConst.getTypes(bankAccount.bankCode),
      BirthDate: birthdate,
      Country: address.country.code,
      CustomerType: user.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER ? 1 : 0,
      FeeCorpDebt: feeCorpDebt,
      FeeDebt: feeDebt,
      FeeEquity: feeEquity,
      FirstName: user.firstName,
      Gender: user.gender,
      HomeAddress: `${address.address}, ${address.subDistrict}, ${address.district.name2} district, ${address.city.name2}, ${address.country.name2}`,
      HomePhone: user.handphone,
      LastName: user.lastName,
      MobilePhone: user.handphone,
      Occupation: user.profession,
      RegistryNumber: user.registerNumber,
    }
    loggerMCSD.info('info', MCSDaccount)
    accounts.push(MCSDaccount);


    const res = await this.#mcsdService.UpdateAccounts(accounts);

    if (!Object.prototype.hasOwnProperty.call(res, 'UpdateAccountsResult')) {
      throw new ErrorException(500, 'Error at MCSD UpdateAccountsResult method');
    }

    if (
      !Object.prototype.hasOwnProperty.call(res.UpdateAccountsResult, 'ResponseCode') ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.UpdateAccountsResult.ResponseCode
    ) {
      await this.#userRepository.update(
        { id: +user.id },
        {
          description: res.UpdateAccountsResult.ResponseMessage,
        }
      );
      throw new ErrorException(500, res.UpdateAccountsResult.ResponseMessage || 'Error while UpdateAccountsResult');

    }
    await this.#userRepository.update(
      { id: +user.id },
      {
        status: UserConst.STATUS_MCSD_PENDING,
        description: "ҮЦТХТ данс засварлах хүсэлт илгээгдсэн"
      }
    );

    return BaseConst.MSG_SUCCESS;
  }
  mcsdAccount = async () => {
    const rawUsers = await this.#userRepository.findAll(
      {
        status: UserConst.STATUS_PAID
      },
      {
        UserMCSDAccount: true,
        UserBankAccounts: true,
        UserAddress: {
          select: { district: true, country: true, city: true, address: true, subDistrict: true, status: true },
        },
      }
    );

    const users = rawUsers.values;
    if (users.length == 0) {
      return BaseConst.MSG_SUCCESS;
    }

    // Компанийн бондын шимтгэл
    const feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    const feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    const feeEquity = await Helper.getValue('FeeEquity');

    let accounts = [];

    users.forEach((user) => {
      // const wallet = user.wallets.find(
      //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
      // );
      const bankAccount = user.UserBankAccounts.find((account) => BaseConst.STATUS_ACTIVE === account.status);
      // const birthdate = new Date(user.birthday).toISOString().slice(0, 10);
      const birthdate = moment(new Date(user.birthday), 'YYYY-MM-DD').format().slice(0, 10);
      const address = user.UserAddress.find((address) => BaseConst.STATUS_ACTIVE === address.status);

      // * BDCAccountNumber: 8 тэмдэгтээс бага эсвэл тэнцүү байх ёстой!
      let MCSDaccount = {
        BDCAccountId: user.UserMCSDAccount[0].id.toString(),
        BDCAccountNumber: user.UserMCSDAccount[0].id.toString(),
        BankAccountNumber: bankAccount.accountNo.toString(),
        BankCode: bankAccount.bankCode,
        BankName: McsdConst.getTypes(bankAccount.bankCode),
        BirthDate: birthdate,
        Country: address.country.code,
        CustomerType: user.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER ? 1 : 0,
        FeeCorpDebt: feeCorpDebt,
        FeeDebt: feeDebt,
        FeeEquity: feeEquity,
        FirstName: user.firstName,
        Gender: user.gender,
        HomeAddress: `${address.address}, ${address.subDistrict}, ${address.district.name2} district, ${address.city.name2}, ${address.country.name2}`,
        HomePhone: user.handphone,
        LastName: user.lastName,
        MobilePhone: user.handphone,
        Occupation: user.profession,
        RegistryNumber: user.registerNumber,
      }
      loggerMCSD.info('info', MCSDaccount)
      accounts.push(MCSDaccount);
    });

    const res = await this.#mcsdService.SetAccounts(accounts);

    if (!Object.prototype.hasOwnProperty.call(res, 'SetAccountsResult')) {
      throw new ErrorException(500, 'Error at MCSD SetAccounts method');
    }

    if (
      !Object.prototype.hasOwnProperty.call(res.SetAccountsResult, 'ResponseCode') ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.SetAccountsResult.ResponseCode
    ) {
      throw new ErrorException(500, res.SetAccountsResult.ResponseMessage || 'Error while SetAccounts');

    }

    await Promise.all(
      users.map(async (user) => {
        await this.#userRepository.update(
          { id: +user.id },
          {
            status: UserConst.STATUS_MCSD_PENDING,
            description: "ҮЦТХТ данс нээх хүсэлт илгээгдсэн"
          }
        );
      })
    );

    return BaseConst.MSG_SUCCESS;
  };

  mcsdAccountStatus = async (params) => {
    // const rawUsers = await this.#userRepository.findAll({ status: UserConst.STATUS_MCSD_PENDING }, { wallets: true });
    let data = await this.#validator.validateGetAccountStatus(params);
    const rawUsers = await this.#userRepository.findAll({
      status: UserConst.STATUS_MCSD_PENDING
    }, { UserMCSDAccount: true });

    const users = rawUsers.values;

    let accountIds = [];

    users.forEach((user) => {
      // const wallet = user.wallets.find(
      //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
      // );

      accountIds.push(user.UserMCSDAccount[0].id.toString());
    });

    const res = await this.#mcsdService.GetAccountStatus({ BDCAccountIds: accountIds });

    if (!Object.prototype.hasOwnProperty.call(res, 'GetAccountStatusResult')) {
      throw new ErrorException(500, 'Error at MCSD GetAccountsStatus method');
    }

    if (
      !Object.prototype.hasOwnProperty.call(res.GetAccountStatusResult, 'ResponseCode') ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.GetAccountStatusResult.ResponseCode
    ) {
      throw new ErrorException(500, res.GetAccountStatusResult.ResponseMessage || 'Error while GetAccountsStatus');
    }

    let accounts = res.GetAccountStatusResult.AccountsStatus.AccountStatus;

    if (!Array.isArray(accounts)) {
      accounts = [accounts];
    }

    await Promise.all(
      accounts.map(async (account) => {
        const data = {
          description: account.ErrorMessage,
          updatedAt: new Date(),
        };

        if (McsdAccountConst.STATUS_ERROR == account.Status) {
          data.status = UserConst.STATUS_MCSD_ERROR;
        }
        loggerMCSD.log('info', account);

        const user = await this.#userRepository.findByMCSDId(parseInt(account.BDCAccountId));
        await this.#userRepository.update({ id: user[0].id }, data);
      })
    );

    await this.mcsdOpenedAccounts(params);

    return BaseConst.MSG_SUCCESS;
  };

  mcsdOpenedAccounts = async (params) => {
    let data = await this.#validator.validateGetAccountStatus(params);
    let companySymbol = await getValueR("CompanySymbol");
    let companyParticipantType = await getValueR("CompanyParticipantType");
    const res = await this.#mcsdService.GetAccounts({
      BeginDate: Helper.dateToString(data.BeginDate, true),
      EndDate: Helper.dateToString(data.EndDate, true)
    });

    if (!Object.prototype.hasOwnProperty.call(res, 'GetAccountsResult')) {
      throw new ErrorException(500, 'Error at MCSD GetAccounts method');
    }

    if (
      !Object.prototype.hasOwnProperty.call(res.GetAccountsResult, 'ResponseCode') ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.GetAccountsResult.ResponseCode
    ) {
      throw new ErrorException(500, res.GetAccountsResult.ResponseMessage || 'Error while GetAccounts');
    }

    let openedAccounts = res.GetAccountsResult.OpenedAccounts.OpenedAccount;
    console.log('res GetAccounts:', openedAccounts);
    if (!Array.isArray(openedAccounts)) {
      openedAccounts = [openedAccounts];
    }
    for (let i = 0; i < openedAccounts.length; i++) {
      let account = openedAccounts[i];
      const user = await this.#userRepository.findByMCSDId(parseInt(account.AccountNumber));
      if (user.length == 0 || user[0].status == BaseConst.STATUS_ACTIVE) {
        continue;
      }
      let fullPrefix = companySymbol + "-" + companyParticipantType + "/" + account.MITPrefix + "-" + account.ClientSuffix + "/0";
      await this.#userRepository.update(
        { id: user[0].id },
        {
          status: UserConst.STATUS_ACTIVE,
          description: "ҮЦТХТ-д данс нээгдсэн.",
          updatedAt: new Date(),
          UserMCSDAccount: {
            updateMany: {
              where: {
                userId: user[0].id
              },
              data: {
                prefix: account.MITPrefix,
                clientSuffix: account.ClientSuffix,
                fullPrefix: fullPrefix,
                bdcAccountId: account.BDCId.toString() + account.AccountNumber.toString().padStart(8, 0)
              }
            }
          },
          UserGroup: {
            updateMany: {
              where: {
                userId: user[0].id,
                groupId: UserGroupConst.GROUP_USER,
              },
              data: {
                groupId: UserGroupConst.GROUP_CONFIRMED_USER,
                updatedAt: new Date(),
                updatedUserId: 1,
              },
            },
          },
        }
      );

      let params = {
        key: "account-open",
        uuid: user[0].uuid,
        subject: "Данс",
        type: "success",
        content: "Таны үнэт цаасны данс нээгдсэн байна.",
        data: user[0]
      }
      this._notificationService.send(params);
    }
    return MSG_SUCCESS;
  };

  editUser = async (params) => {
    const { data } = await this.#validator.validateEditUser(params);
    let user = await this.#userRepository.findById(data.userId);

    user = { ...data };
    if (data.custType == UserConst.TYPE_FOREIGN_CUSTOMER) {
      user.registerNumber = userData.passportNumber;
    }
    if (data.country != undefined && data.city != undefined && data.district != undefined && data.subDistrict != undefined) {
      user.UserAddress = {

        updateMany: [{
          where: {
            userId: data.userId,
            status: BaseConst.STATUS_ACTIVE
          },
          data: {
            status: BaseConst.STATUS_INACTIVE
          }
        }],
        create: [
          {
            countryId: data.country,
            cityId: data.city,
            districtId: data.district,
            subDistrict: data.subDistrict,
            address: data.address,
            status: BaseConst.STATUS_ACTIVE,
          },
        ],

      }
    }

    user.country = undefined;
    user.city = undefined;
    user.district = undefined;
    user.subDistrict = undefined;
    user.address = undefined;
    user.userId = undefined;
    const updatedUser = await this.#userRepository.update({
      id: data.userId
    },
      {
        ...user,

      });

    return updatedUser;
  };

  addBankAccount = async (user, params) => {
    const { data, sUser } = await this.#validator.validateUserBankAccount(params);

    const userBankAccount = await this.#userBankAccountRepository.create({
      userId: sUser ? sUser.id : user.id,
      bankCode: data.bankCode,
      accountNo: data.accountNo,
      accountName: data.accountName,
      createdUserId: user.id,
    });

    await this.changeStep(sUser || user, UserStepConst.STEP_3);

    return userBankAccount;
  };

  getBank = async (userId) => {
    const userBankAccount = await this.#userBankAccountRepository.findAll({
      userId: parseInt(userId),
      status: BaseConst.STATUS_ACTIVE
    });

    return userBankAccount;
  };

  getAdditionalInfo = async (userId) => {
    const userInfo = await this.#userAdditionalInfoRepository.findAll({
      userId: parseInt(userId),
      status: BaseConst.STATUS_ACTIVE
    });

    return userInfo;
  };

  getRelation = async (userId) => {
    const res = await this.#userRelationRepository.findAll({
      userId: parseInt(userId),
      status: BaseConst.STATUS_ACTIVE
    });

    return res;
  };

  removeBankAccount = async (user, params) => {
    const { data } = await this.#validator.validateRemoveBankAccount(user, params);

    const userBankAccount = await this.#userBankAccountRepository.update(data.id, {
      status: BaseConst.STATUS_INACTIVE,
      updatedUserId: +user.id,
      updatedAt: new Date(),
    });

    return userBankAccount;
  };

  editNationalCard = async (user, params) => {
    let { data, nationalCard } = await this.#validator.validateEditNationalCard(user, params);

    if (nationalCard != undefined && data.registerNumber && data.lastName && data.firstName && data.birthday && data.familyName) {
      nationalCard = await this.#nationalCardRepository.update(nationalCard.id, {
        registerNumber: data.registerNumber,
        lastName: data.lastName,
        firstName: data.firstName,
        familyName: data.familyName,
        birthday: data.birthday,
        status: UserConst.STATUS_ACTIVE,
        updatedUserId: user.id,
        updatedAt: new Date(),
      });
    }

    await this.#userRepository.update(
      { id: user.id },
      {
        familyName: nationalCard != undefined ? nationalCard.familyName : data.familyName,
        lastName: nationalCard != undefined ? nationalCard.lastName : data.lastName,
        firstName: nationalCard != undefined ? nationalCard.firstName : data.firstName,
        registerNumber: nationalCard != undefined ? nationalCard.registerNumber : data.registerNumber,
        birthday: nationalCard != undefined ? nationalCard.birthday : data.birthday,
        updatedAt: new Date(),
        updatedUserId: user.id,
      }
    );

    return BaseConst.MSG_SUCCESS;
  };

  storeUserFile = async (user, params) => {
    const { data, sUser } = await this.#validator.validateStoreFile(params);

    const { type, imageBase64 } = data;

    const { path, fullPath } = await this.#fileService.saveFile({
      user: sUser || user,
      image: imageBase64,
      type: type,
    });

    await this.#userFilesRepository.update(
      {
        userId: sUser ? sUser.id : user.id,
        type: type,
        status: UserFilesConst.STATUS_ACTIVE,
      },
      {
        status: UserFilesConst.STATUS_INACTIVE,
        updatedAt: new Date(),
        updatedUserId: user.id,
      }
    );

    const sign = await this.#userFilesRepository.create({
      userId: sUser ? sUser.id : user.id,
      imagePath: path,
      imageFullPath: fullPath,
      type: type,
      status: UserFilesConst.STATUS_ACTIVE,
      createUserId: user.id,
    });

    if (sign) {
      return BaseConst.MSG_SUCCESS;
    }

    return 'Failed';
  };

  MCSDTransactions = async (params) => {
    let { user, data } = await this.#validator.validateMCSDTransactions(params);
    let result = await this.#mcsdService.GetTransactions({ BeginDate: params.BeginDate, EndDate: params.EndDate });
    // let result = await this.#msccService.CustStatement({prefix: user.UserMCSDAccount[0].prefix, startdate: data.BeginDate, enddate: data.EndDate});
    let userTransactions = [];
    console.log(user, data)
    loggerMCSD.info({ params: data, result: result });
    if (!Object.prototype.hasOwnProperty.call(result, 'GetTransactionsResult')) {
      throw new ErrorException(500, 'Error at MCSD GetTransactionsResult method');
    }
    if (result.GetTransactionsResult.Response.Code != 1) {
      throw new ErrorException(404, result.GetTransactionsResult.Response.Message);
    }
    result.GetTransactionsResult.Transactions.Transaction.forEach(transaction => {
      if (transaction.MITPrefix == user.UserMCSDAccount[0].prefix) {
        if (transaction.TransactionTypeId == 10 || transaction.TransactionTypeId == 20 || transaction.TransactionTypeId == 11 || transaction.TransactionTypeId == 30) {
          let tran = {
            code: transaction.SecuritiesCode,
            amount: transaction.SecuritiesQuantity,
            date: transaction.TransactionDate,
            description: transaction.Description,
            type: (transaction.TransactionTypeId == 11 || transaction.TransactionTypeId == 30) ? 1 : 2
          }
          userTransactions.push(tran);
        }
      }
    });
    loggerMCSD.info({ userTransactions: userTransactions });
    return userTransactions;
  }
}

module.exports = UserService;
