// const FileService = require('../file.service');
import WalletService from '../wallet/wallet.service';
import MCSDService from '../mcsd.service';
import MSCCService from '../mscc.service';
import CustFeeService from '../custfee.service';
import UserRepository from '../../repository/user/user.repository';
// import UserFilesRepository from '../../repository/user/user.files.repository';
import UserBankAccountRepository from '../../repository/user/user.bank.account.repository';
// import NationalCardRepository from '../../repository/user/national.card.repository';
import WalletRepository from '../../repository/wallet/wallet.repository';
import UserRelationRepository from '../../repository/user/user.relation.repository';
import UserAdditionalInfoRepository from '../../repository/user/user.additional.info.repository';

import UserValidator from '../validator/user/user.validator';

import Helper from '../../middleware/helper.service';

import { UserConst, UserFilesConst, UserStepConst } from '../../constants/user';
import { McsdConst, McsdAccountConst } from '../../constants/mcsd';
import { CurrencyConst, WalletConst } from '../../constants/wallet';
// const { UserNotFoundException, UserBankNotFoundException, NotRequireToUpdate } = require('../../exception/error');
// const UserAddressRepository = require('../../repository/user/user.address.repository');
// const ErrorException = require('../../exception/error-exception');
// import { getValueR } from '../middleware/helper.middleware';
import NotificationService from '../notification.service';
import { StockConst, StockTypeConst } from '../../constants/stock';
import { logger, loggerMCSD, loggerID } from '../../middleware/logger';
import BaseConst from '../../constants/base';
import * as moment from 'moment';
import { CustomException, ErrorCode } from '../../exception/error-code';
import ErrorException from '../../exception/error-exception';
import {
  fetchSegment,
  sendContactsMessage,
  sendCoreMessage,
  sendCPMessage,
  sendFormsMessage,
  sendLogsMessage
} from '../../messageBroker';
import UserMCSDAccountRepository from '../../repository/user/user.mcsd.repository';
import { any } from 'joi';
import { getUsers } from '../../models/utils';

export default class UserService {
  _validator: UserValidator;
  _mcsdService: MCSDService;
  _walletService: WalletService;
  _custFeeService: CustFeeService;
  _userRepository: UserRepository;
  _userMcsdRepository: UserMCSDAccountRepository;
  _userBankAccountRepository: UserBankAccountRepository;
  _notificationService = new NotificationService();
  constructor() {
    this._validator = new UserValidator();
    this._mcsdService = new MCSDService();
    // _fileService = new FileService();
    this._walletService = new WalletService();
    this._custFeeService = new CustFeeService();
    this._userRepository = new UserRepository();
    // _userFilesRepository = new UserFilesRepository();
    this._userBankAccountRepository = UserBankAccountRepository.get();
    this._notificationService = new NotificationService();
    this._userMcsdRepository = new UserMCSDAccountRepository();
  }
  // getFullInfo = (user) => this._userRepository.findById(+user.id, true);
  getFullInfo = async params => {
    let where: any = {};
    let options: any = {
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy
    };
    if (!!params.prefix) {
      where.prefix = {
        contains: params.prefix
      };
    }
    if (params.userId != undefined) {
      where.userId = params.userId;
    }
    if (!!params.prefixs && params.prefixs.length > 0) {
      where.prefix = { in: params.prefixs };
    }
    if (!!params.userIds && params.userIds.length > 0) {
      where.userId = { in: params.userIds };
    }
    where.OR = [];
    if (!!params.searchValue) {
      where.OR.push({
        prefix: {
          contains: params.searchValue
        }
      });
      where.OR.push({
        registerNumber: {
          contains: params.searchValue
        }
      });
    }
    if (
      params.prefixs != undefined &&
      params.prefixs.length > 0 &&
      !!params.searchValue
    ) {
      where.prefix = undefined;
      where.OR.push({
        prefix: {
          contains: params.searchValue
        }
      });
      where.OR.push({
        registerNumber: {
          contains: params.searchValue
        }
      });
      where.OR.push({ prefix: { in: params.prefixs } });
    }
    if (where.OR.length == 0) where.OR = undefined;
    let account = await this._userMcsdRepository.findAll(
      where,
      {
        Wallet: {
          include: {
            walletBalance: true,
            stockBalances: true
          }
        }
      },
      options
    );
    let userIds = account.values.map(function(obj: any) {
      return obj.userId;
    });
    let query = {
      _id: { $in: userIds }
    };
    let users = await getUsers(query);
    let user: any;
    account.values.forEach((el: any, index) => {
      user = users.find((x: any) => x._id == el.userId);
      if (user != undefined) {
        account.values[index].firstName = user.firstName;
        account.values[index].lastName = user.lastName;
      }
    });
    return account;
  };

  changeStep = async (user, step = UserStepConst.STEP_1) =>
    // await this._userRepository.update({ id: +user.id }, { externalId: step });
    console.log('user step completed:', step);

  getUserInfoById = async userId => {
    const user = await this._userRepository.findById(+userId, true);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  };
  getUserByRegisterNumber = async (
    registerNumber: string[],
    subdomain: string
  ) => {
    let fieldId = await sendFormsMessage({
      action: 'fields.findOne',
      subdomain: subdomain,
      data: {
        query: {
          code: 'registerNumber'
        }
      },
      isRPC: true,
      defaultValue: []
    });
    let query = {
      'customFieldsData.field': fieldId._id,
      'customFieldsData.value': {
        $in: registerNumber
      }
    };
    const user = await getUsers(query, subdomain);
    // console.log('user',user)
    return user;
  };
  getUser = async (subdomain, userUuid) => {
    // let user = this._userRepository.findByUuid(userUuid);
    console.log('userUuid', userUuid);
    let cpUser = await sendCPMessage({
      subdomain,
      action: 'clientPortalUsers.findOne',
      data: {
        _id: userUuid
      },
      isRPC: true
    });
    console.log('cpUser', cpUser);
    if (cpUser.type == 'customer') {
      let user = await sendContactsMessage({
        subdomain,
        action: 'customers.findOne',
        data: {
          _id: userUuid
        },
        isRPC: true
      });
      console.log('user', user);
      return user;
    } else if (cpUser.type == 'company') {
      let user = await sendContactsMessage({
        subdomain,
        action: 'company.findOne',
        data: {
          _id: userUuid
        },
        isRPC: true
      });
      console.log('user', user);
      return user;
    }
  };

  getUserByCustom = async (subdomain, params) => {
    let user = await sendContactsMessage({
      subdomain,
      action: 'customers.findOne',
      data: params,
      isRPC: true
    });
    return user;
  };

  cooperateGW = async params => {
    const { data, user } = await this._validator.validateMCSDAccount(params);

    let userMcsdAccount = await this._userMcsdRepository.findUnique({
      userId: user._id
    });

    // if (userMcsdAccount.status == UserConst.STATUS_ACTIVE || userMcsdAccount.status == UserConst.STATUS_MCSD_PENDING) {
    //   throw new Error('User created');
    // }

    //Компанийн бондын шимтгэл
    const feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    const feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    const feeEquity = await Helper.getValue('FeeEquity');

    console.log('feeCorpDebt', feeCorpDebt);
    if (!userMcsdAccount) {
      try {
        //change status on customer erxes
        await this._userMcsdRepository.create({
          userId: data.userId,
          registerNumber: data.registerNumber,
          createdAt: new Date()
        });
        await this._custFeeService.create({
          name: 'Хувьцааны шимтгэл',
          name2: 'Securities fee',
          userId: user._id,
          stocktypeId: StockTypeConst.SEC,
          value: parseFloat(feeEquity)
        });
        await this._custFeeService.create({
          name: 'Компанийн бондын шимтгэл',
          name2: 'Company bond fee',
          userId: user._id,
          stocktypeId: StockTypeConst.COMPANY_BOND,
          value: parseFloat(feeCorpDebt)
        });
        await this._custFeeService.create({
          name: 'ЗГ-ын бондын шимтгэл',
          name2: 'Government bond fee',
          userId: user._id,
          stocktypeId: StockTypeConst.GOV_BOND,
          value: parseFloat(feeDebt)
        });
      } catch (ex) {
        logger.info('Already created fee on ' + user.id);
      }

      await this._walletService.createWallet(
        {
          name: user.firstName,
          userId: user._id,
          type: WalletConst.TYPE_USER,
          status: WalletConst.STATUS_ACTIVE,
          currencyCode: 'MNT'
        },
        'MNT'
      );

      await this._walletService.createWallet(
        {
          name: user.firstName,
          userId: user.id,
          type: WalletConst.TYPE_USER,
          status: WalletConst.STATUS_ACTIVE,
          currencyCode: CurrencyConst.USD
        },
        'USD'
      );

      await this.changeStep(user, UserStepConst.STEP_5);
    } else {
      if (userMcsdAccount.status == UserConst.STATUS_MCSD_ERROR) {
        return await this.updateMCSDAccount({ userId: data.userId });
      }
    }

    await this.mcsdAccountOne({ userId: data.userId });
    return BaseConst.MSG_SUCCESS;
  };

  mcsdAccountOne = async params => {
    let userId = params.userId;
    // const rawUsers = await this._userRepository.findAll(
    //   {
    //     id: userId,
    //     status: UserConst.STATUS_PAID
    //   },
    //   {
    //     UserBankAccounts: true,
    //     UserMCSDAccount: true,
    //     UserAddress: {
    //       select: { district: true, country: true, city: true, address: true, subDistrict: true, status: true },
    //     },
    //   }
    // );
    // let user = rawUsers.values[0];
    let user = await this.getUser('localhost', userId);
    if (user == undefined) {
      throw new Error('User not found');
    }
    let userMcsdAccount = await this._userMcsdRepository.findUnique({
      userId: user._id
    });
    const feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    //ЗГ бондын шимтгэл
    const feeDebt = await Helper.getValue('FeeDebt');
    //Хувьцааны шимтгэл
    const feeEquity = await Helper.getValue('FeeEquity');

    let accounts: any = [];

    // const wallet = user.wallets.find(
    //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
    // );
    // const bankAccount = user.UserBankAccounts.find((account) => BaseConst.STATUS_ACTIVE === account.status);
    // if (bankAccount == undefined) {
    //   CustomException(ErrorCode.UserBankNotFoundException);
    // }
    if (
      user.customFieldsDataByFieldCode.userBank == undefined ||
      user.customFieldsDataByFieldCode.userBankAccountNo == undefined
    ) {
      await this._userMcsdRepository.update(userMcsdAccount.id, {
        description: ErrorCode.UserBankNotFoundException.message
      });
      CustomException(ErrorCode.UserBankNotFoundException);
    }
    let bankAccount = {
      bank: user.customFieldsDataByFieldCode.userBank.value,
      accountNo: user.customFieldsDataByFieldCode.userBankAccountNo.value
    };
    // const birthdate = new Date(user.birthday).toISOString().slice(0, 10);
    const birthdate = moment(new Date(user.birthDate), 'YYYY-MM-DD')
      .format()
      .slice(0, 10);
    if (user.customFieldsDataByFieldCode.address == undefined) {
      await this._userMcsdRepository.update(userMcsdAccount.id, {
        description: ErrorCode.CityNotFoundException.message
      });
      CustomException(ErrorCode.CityNotFoundException);
    }
    let address = user.customFieldsDataByFieldCode.address.value;
    if (user.customFieldsDataByFieldCode.registerNumber == undefined) {
      await this._userMcsdRepository.update(userMcsdAccount.id, {
        description: ErrorCode.RegisterNumberMismatchException.message
      });
      CustomException(ErrorCode.RegisterNumberMismatchException);
    }
    let registerNumber = user.customFieldsDataByFieldCode.registerNumber.value;
    if (user.customFieldsDataByFieldCode.profession == undefined) {
      await this._userMcsdRepository.update(userMcsdAccount.id, {
        description: ErrorCode.UserInfoProNotFoundException.message
      });
      CustomException(ErrorCode.UserInfoProNotFoundException);
    }
    let profession = user.customFieldsDataByFieldCode.profession.value;
    if (user.primaryPhone == null) {
      CustomException(ErrorCode.UserInfoPhoneNotFoundException);
    }
    let phone = user.primaryPhone;

    if (user.sex == null) {
      CustomException(ErrorCode.UserInfoGenderNotFoundException);
    }
    let sex = user.sex;
    // const address = user.UserAddress.find((address) => BaseConst.STATUS_ACTIVE === address.status);
    // * BDCAccountNumber: 8 тэмдэгтээс бага эсвэл тэнцүү байх ёстой!
    let MCSDaccount = {
      // BDCAccountId: wallet.walletNumberId.toString(),
      // BDCAccountNumber: wallet.walletNumberId.toString(),
      BDCAccountId: userMcsdAccount.id.toString(),
      BDCAccountNumber: userMcsdAccount.id.toString(),
      BankAccountNumber: bankAccount.accountNo.toString(),
      BankCode: McsdConst.getTypesByName(bankAccount.bank),
      BankName: bankAccount.bank,
      BirthDate: birthdate,
      Country: '976', //?
      CustomerType:
        user.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER ? 1 : 0,
      FeeCorpDebt: feeCorpDebt,
      FeeDebt: feeDebt,
      FeeEquity: feeEquity,
      FirstName: user.firstName,
      Gender: user.sex, //?
      HomeAddress: address,
      HomePhone: phone,
      LastName: user.lastName,
      MobilePhone: phone,
      Occupation: profession,
      RegistryNumber: registerNumber
    };
    loggerMCSD.info('info', MCSDaccount);
    accounts.push(MCSDaccount);

    const res = await this._mcsdService.SetAccounts(accounts);

    if (!Object.prototype.hasOwnProperty.call(res, 'SetAccountsResult')) {
      throw new ErrorException({
        code: 500,
        message: 'Error at MCSD SetAccounts method'
      });
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        res.SetAccountsResult,
        'ResponseCode'
      ) ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.SetAccountsResult.ResponseCode
    ) {
      await this._userMcsdRepository.update(userMcsdAccount.id, {
        description: res.SetAccountsResult.ResponseMessage
      });
      throw new ErrorException({
        code: 500,
        message:
          res.SetAccountsResult.ResponseMessage || 'Error while SetAccounts'
      });
    }
    await this._userMcsdRepository.update(userMcsdAccount.id, {
      status: UserConst.STATUS_MCSD_PENDING,
      description: 'ҮЦТХТ данс нээх хүсэлт илгээгдсэн'
    });

    return BaseConst.MSG_SUCCESS;
  };
  updateMCSDAccount = async params => {
    let userId = params.userId;
    const rawUsers = await this._userRepository.findAll(
      {
        id: userId
        // status: UserConst.STATUS_MCSD_ERROR
      },
      {
        UserMCSDAccount: true,
        UserBankAccounts: true,
        UserAddress: {
          select: {
            district: true,
            country: true,
            city: true,
            address: true,
            subDistrict: true,
            status: true
          }
        }
      }
    );
    let user = rawUsers.values[0];
    if (user == undefined) {
      throw new Error('User not found');
    }
    if (user.status != UserConst.STATUS_MCSD_ERROR) {
      CustomException(ErrorCode.NotRequireToUpdateException);
    }

    let feeCorpDebt = await Helper.getValue('FeeCorpDebt');
    let feeEquity = await Helper.getValue('FeeEquity');
    let feeDebt = await Helper.getValue('FeeDebt');
    const feeCorp = await this._custFeeService.getbyUserIdWithType(
      user.id,
      StockTypeConst.COMPANY_BOND
    );
    if (feeCorp.length != 0) {
      feeCorpDebt = parseFloat(feeCorp[0].value);
    }
    //ЗГ бондын шимтгэл

    const feeGov = await this._custFeeService.getbyUserIdWithType(
      user.id,
      StockTypeConst.GOV_BOND
    );
    if (feeGov.length != 0) {
      feeDebt = parseFloat(feeGov[0].value);
    }
    //Хувьцааны шимтгэл

    const feeSec = await this._custFeeService.getbyUserIdWithType(
      user.id,
      StockTypeConst.SEC
    );
    if (feeSec.legnth != 0) {
      feeEquity = parseFloat(feeSec[0].value);
    }

    let accounts: any = [];

    // const wallet = user.wallets.find(
    //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
    // );
    const bankAccount = user.UserBankAccounts.find(
      account => BaseConst.STATUS_ACTIVE === account.status
    );
    // const birthdate = new Date(user.birthday).toISOString().slice(0, 10);
    const birthdate = moment(new Date(user.birthday), 'YYYY-MM-DD')
      .format()
      .slice(0, 10);
    const address = user.UserAddress.find(
      address => BaseConst.STATUS_ACTIVE === address.status
    );

    // * BDCAccountNumber: 8 тэмдэгтээс бага эсвэл тэнцүү байх ёстой!
    let MCSDaccount = {
      BDCAccountId: user.UserMCSDAccount[0].id.toString(),
      BDCAccountNumber: user.UserMCSDAccount[0].id.toString(),
      BankAccountNumber: bankAccount.accountNo.toString(),
      BankCode: bankAccount.bankCode,
      BankName: McsdConst.getTypes(bankAccount.bankCode),
      BirthDate: birthdate,
      Country: address.country.code,
      CustomerType:
        user.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER ? 1 : 0,
      FeeCorpDebt: feeCorpDebt,
      FeeDebt: feeDebt,
      FeeEquity: feeEquity,
      FirstName: user.firstName,
      Gender: user.gender,
      HomeAddress: `${address.address}, ${address.subDistrict}, ${address.district.name2} district, ${address.city.name2}, ${address.country.name2}`,
      HomePhone: user.handPhone,
      LastName: user.lastName,
      MobilePhone: user.handPhone,
      Occupation: user.profession,
      RegistryNumber: user.registerNumber
    };
    loggerMCSD.info('info', MCSDaccount);
    accounts.push(MCSDaccount);

    const res = await this._mcsdService.UpdateAccounts(accounts);

    if (!Object.prototype.hasOwnProperty.call(res, 'UpdateAccountsResult')) {
      throw new ErrorException({
        code: 500,
        message: 'Error at MCSD UpdateAccountsResult method'
      });
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        res.UpdateAccountsResult,
        'ResponseCode'
      ) ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.UpdateAccountsResult.ResponseCode
    ) {
      await this._userRepository.update(
        { id: +user.id },
        {
          description: res.UpdateAccountsResult.ResponseMessage
        }
      );
      throw new ErrorException({
        code: 500,
        message:
          res.UpdateAccountsResult.ResponseMessage ||
          'Error while UpdateAccountsResult'
      });
    }
    await this._userRepository.update(
      { id: +user.id },
      {
        status: UserConst.STATUS_MCSD_PENDING,
        description: 'ҮЦТХТ данс засварлах хүсэлт илгээгдсэн'
      }
    );

    return BaseConst.MSG_SUCCESS;
  };
  mcsdAccount = async () => {
    const rawUsers = await this._userRepository.findAll(
      {
        status: UserConst.STATUS_PAID
      },
      {
        UserMCSDAccount: true,
        UserBankAccounts: true,
        UserAddress: {
          select: {
            district: true,
            country: true,
            city: true,
            address: true,
            subDistrict: true,
            status: true
          }
        }
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

    let accounts: any = [];

    users.forEach(user => {
      // const wallet = user.wallets.find(
      //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
      // );
      const bankAccount = user.UserBankAccounts.find(
        account => BaseConst.STATUS_ACTIVE === account.status
      );
      // const birthdate = new Date(user.birthday).toISOString().slice(0, 10);
      const birthdate = moment(new Date(user.birthday), 'YYYY-MM-DD')
        .format()
        .slice(0, 10);
      const address = user.UserAddress.find(
        address => BaseConst.STATUS_ACTIVE === address.status
      );

      // * BDCAccountNumber: 8 тэмдэгтээс бага эсвэл тэнцүү байх ёстой!
      let MCSDaccount = {
        BDCAccountId: user.UserMCSDAccount[0].id.toString(),
        BDCAccountNumber: user.UserMCSDAccount[0].id.toString(),
        BankAccountNumber: bankAccount.accountNo.toString(),
        BankCode: bankAccount.bankCode,
        BankName: McsdConst.getTypes(bankAccount.bankCode),
        BirthDate: birthdate,
        Country: address.country.code,
        CustomerType:
          user.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER ? 1 : 0,
        FeeCorpDebt: feeCorpDebt,
        FeeDebt: feeDebt,
        FeeEquity: feeEquity,
        FirstName: user.firstName,
        Gender: user.gender,
        HomeAddress: `${address.address}, ${address.subDistrict}, ${address.district.name2} district, ${address.city.name2}, ${address.country.name2}`,
        HomePhone: user.handPhone,
        LastName: user.lastName,
        MobilePhone: user.handPhone,
        Occupation: user.profession,
        RegistryNumber: user.registerNumber
      };
      loggerMCSD.info('info', MCSDaccount);
      accounts.push(MCSDaccount);
    });

    const res = await this._mcsdService.SetAccounts(accounts);

    if (!Object.prototype.hasOwnProperty.call(res, 'SetAccountsResult')) {
      throw new ErrorException({
        code: 500,
        message: 'Error at MCSD SetAccounts method'
      });
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        res.SetAccountsResult,
        'ResponseCode'
      ) ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.SetAccountsResult.ResponseCode
    ) {
      throw new ErrorException({
        code: 500,
        message:
          res.SetAccountsResult.ResponseMessage || 'Error while SetAccounts'
      });
    }

    await Promise.all(
      users.map(async user => {
        await this._userRepository.update(
          { id: +user.id },
          {
            status: UserConst.STATUS_MCSD_PENDING,
            description: 'ҮЦТХТ данс нээх хүсэлт илгээгдсэн'
          }
        );
      })
    );

    return BaseConst.MSG_SUCCESS;
  };

  mcsdAccountStatus = async params => {
    // const rawUsers = await this._userRepository.findAll({ status: UserConst.STATUS_MCSD_PENDING }, { wallets: true });
    let data = await this._validator.validateGetAccountStatus(params);
    const rawUsers = await this._userRepository.findAll(
      {
        status: UserConst.STATUS_MCSD_PENDING
      },
      { UserMCSDAccount: true }
    );

    const users = rawUsers.values;

    let accountIds: any = [];

    users.forEach(user => {
      // const wallet = user.wallets.find(
      //   (wallet) => CurrencyConst.DEFAULT === wallet.currencyCode && BaseConst.STATUS_ACTIVE === wallet.status
      // );

      accountIds.push(user.UserMCSDAccount[0].id.toString());
    });

    const res = await this._mcsdService.GetAccountStatus({
      BDCAccountIds: accountIds
    });

    if (!Object.prototype.hasOwnProperty.call(res, 'GetAccountStatusResult')) {
      throw new ErrorException({
        code: 500,
        message: 'Error at MCSD GetAccountsStatus method'
      });
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        res.GetAccountStatusResult,
        'ResponseCode'
      ) ||
      McsdConst.RESPONSE_CODE_SUCCESS !==
        res.GetAccountStatusResult.ResponseCode
    ) {
      throw new ErrorException({
        code: 500,
        message:
          res.GetAccountStatusResult.ResponseMessage ||
          'Error while GetAccountsStatus'
      });
    }

    let accounts = res.GetAccountStatusResult.AccountsStatus.AccountStatus;

    if (!Array.isArray(accounts)) {
      accounts = [accounts];
    }

    await Promise.all(
      accounts.map(async account => {
        let data: any = {
          description: account.ErrorMessage,
          updatedAt: new Date()
        };

        if (McsdAccountConst.STATUS_ERROR == account.Status) {
          data.status = UserConst.STATUS_MCSD_ERROR;
        }
        loggerMCSD.log('info', account);

        const user = await this._userRepository.findByMCSDId(
          parseInt(account.BDCAccountId)
        );
        await this._userRepository.update({ id: user[0].id }, data);
      })
    );

    await this.mcsdOpenedAccounts(params);

    return BaseConst.MSG_SUCCESS;
  };

  mcsdOpenedAccounts = async params => {
    let data = await this._validator.validateGetAccountStatus(params);
    let companySymbol = await Helper.getValueR('CompanySymbol');
    let companyParticipantType = await Helper.getValueR(
      'CompanyParticipantType'
    );
    const res = await this._mcsdService.GetAccounts({
      BeginDate: Helper.dateToString(data.BeginDate, true),
      EndDate: Helper.dateToString(data.EndDate, true)
    });

    if (!Object.prototype.hasOwnProperty.call(res, 'GetAccountsResult')) {
      throw new ErrorException({
        code: 500,
        message: 'Error at MCSD GetAccounts method'
      });
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        res.GetAccountsResult,
        'ResponseCode'
      ) ||
      McsdConst.RESPONSE_CODE_SUCCESS !== res.GetAccountsResult.ResponseCode
    ) {
      throw new ErrorException({
        code: 500,
        message:
          res.GetAccountsResult.ResponseMessage || 'Error while GetAccounts'
      });
    }

    let openedAccounts = res.GetAccountsResult.OpenedAccounts.OpenedAccount;
    console.log('res GetAccounts:', openedAccounts);
    if (!Array.isArray(openedAccounts)) {
      openedAccounts = [openedAccounts];
    }
    for (let i = 0; i < openedAccounts.length; i++) {
      let account = openedAccounts[i];
      const user = await this._userRepository.findByMCSDId(
        parseInt(account.AccountNumber)
      );
      if (user.length == 0 || user[0].status == BaseConst.STATUS_ACTIVE) {
        continue;
      }
      let fullPrefix =
        companySymbol +
        '-' +
        companyParticipantType +
        '/' +
        account.MITPrefix +
        '-' +
        account.ClientSuffix +
        '/0';
      await this._userRepository.update(
        { id: user[0].id },
        {
          status: UserConst.STATUS_ACTIVE,
          description: 'ҮЦТХТ-д данс нээгдсэн.',
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
                bdcAccountId:
                  account.BDCId.toString() +
                  account.AccountNumber.toString().padStart(8, 0)
              }
            }
          }
          // UserGroup: {
          //   updateMany: {
          //     where: {
          //       userId: user[0].id,
          //       groupId: UserGroupConst.GROUP_USER,
          //     },
          //     data: {
          //       groupId: UserGroupConst.GROUP_CONFIRMED_USER,
          //       updatedAt: new Date(),
          //       updatedUserId: 1,
          //     },
          //   },
          // },
        }
      );

      let params = {
        key: 'account-open',
        uuid: user[0].uuid,
        subject: 'Данс',
        type: 'success',
        content: 'Таны үнэт цаасны данс нээгдсэн байна.',
        data: user[0]
      };
      // this._notificationService.send(params);
    }
    return BaseConst.MSG_SUCCESS;
  };

  addBankAccount = async (user, params) => {
    const { data, sUser } = await this._validator.validateUserBankAccount(
      params
    );

    const userBankAccount = await this._userBankAccountRepository.create({
      userId: sUser ? sUser.id : user._id,
      bankCode: data.bankCode,
      accountNo: data.accountNo,
      accountName: data.accountName,
      createdUserId: user._id
    });

    await this.changeStep(sUser || user, UserStepConst.STEP_3);

    return userBankAccount;
  };

  getBank = async params => {
    const userBankAccount = await this._userBankAccountRepository.findAll(
      params
    );

    return userBankAccount.values;
  };

  removeBankAccount = async (user, params) => {
    const { data } = await this._validator.validateRemoveBankAccount(
      user,
      params
    );

    const userBankAccount = await this._userBankAccountRepository.update(
      data.id,
      {
        status: BaseConst.STATUS_INACTIVE,
        updatedUserId: +user.id,
        updatedAt: new Date()
      }
    );

    return userBankAccount;
  };

  MCSDTransactions = async params => {
    let { user, data } = await this._validator.validateMCSDTransactions(params);
    let result = await this._mcsdService.GetTransactions({
      BeginDate: params.BeginDate,
      EndDate: params.EndDate
    });
    // let result = await this._msccService.CustStatement({prefix: user.UserMCSDAccount[0].prefix, startdate: data.BeginDate, enddate: data.EndDate});
    let userTransactions: any = [];
    console.log(user, data);
    loggerMCSD.info({ params: data, result: result });
    if (
      !Object.prototype.hasOwnProperty.call(result, 'GetTransactionsResult')
    ) {
      throw new ErrorException({
        code: 500,
        message: 'Error at MCSD GetTransactionsResult method'
      });
    }
    if (result.GetTransactionsResult.Response.Code != 1) {
      throw new ErrorException({
        code: 404,
        message: result.GetTransactionsResult.Response.Message
      });
    }
    result.GetTransactionsResult.Transactions.Transaction.forEach(
      transaction => {
        if (transaction.MITPrefix == user.UserMCSDAccount[0].prefix) {
          if (
            transaction.TransactionTypeId == 10 ||
            transaction.TransactionTypeId == 20 ||
            transaction.TransactionTypeId == 11 ||
            transaction.TransactionTypeId == 30
          ) {
            let tran = {
              code: transaction.SecuritiesCode,
              amount: transaction.SecuritiesQuantity,
              date: transaction.TransactionDate,
              description: transaction.Description,
              type:
                transaction.TransactionTypeId == 11 ||
                transaction.TransactionTypeId == 30
                  ? 1
                  : 2
            };
            userTransactions.push(tran);
          }
        }
      }
    );
    loggerMCSD.info({ userTransactions: userTransactions });
    return userTransactions;
  };
}
