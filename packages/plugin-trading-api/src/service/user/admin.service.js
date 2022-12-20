const UserRepository = require('../../repository/user/user.repository');
const UserGroupRepository = require('../../repository/user/user.group.repository');
const UserFilesRepository = require('../../repository/user/user.files.repository');
const fs = require('fs');
const moment = require('moment');
const AdminValidator = require('../validator/user/admin.validator');

const UserRegister = require('../request/identification/user.register');
const Helper = require('../../middleware/helper.middleware');
const { ErrorANDException, UserNotFoundException, WalletNotFoundException } = require('../../exception/error');
const { UserConst, UserGroupConst, UserStepConst } = require('../../typing/user.const');
const { McsdConst } = require('../../typing/mcsd.const');
const BaseConst = require('../../typing/base.const');
const UserAddressRepository = require('../../repository/user/user.address.repository');
const CountryRepository = require('../../repository/user/country.repository');
const { StockConst, StockTypeConst, OrderTxnType, OrderType, OrderCondition, TxnSourceConst, OrderStatus } = require('../../typing/stock.const');
const WalletService = require('../wallet/wallet.service');
const CustFeeService = require('../custfee.service');
const WalletNumberRepository = require('../../repository/wallet/wallet.number.repository');
const { XmlParser } = require('../../middleware/helper.middleware');
const StockBalanceRepository = require('../../repository/wallet/stock.balance.repository');
const { prisma, PrismaClient } = require('@prisma/client');
const { CurrencyConst, TransactionConst, WalletConst } = require('../../typing/wallet.const');
const UserService = require('./user.service');
const { loggerMCSD, loggerMigration } = require('../../middleware/logger');
const ErrorException = require('../../exception/error-exception');
const { MSG_SUCCESS } = require('../../typing/base.const');
const StockRepository = require('../../repository/stock.repository');
const OrderService = require('../order.service');
const ContractNoteRepository = require('../../repository/contractNote.repository');
const TransactionService = require('../wallet/transaction.service');
const OrderRepository = require('../../repository/order.repository');
const StockTransactionService = require('../wallet/stock.transaction.service');
class AdminService {
  #validator = new AdminValidator();
  #userService = new UserService();
  #userAddressRepository = new UserAddressRepository();
  #userRepository = new UserRepository();
  #userGroupRepository = new UserGroupRepository();
  #userFilesRepository = new UserFilesRepository();
  #countryRepository = new CountryRepository();
  #walletService = new WalletService();
  #custFeeService = new CustFeeService();
  #walletNumberRepository = new WalletNumberRepository();
  #stockBalanceRepository = new StockBalanceRepository();
  #stockRepository = new StockRepository();
  #orderService = new OrderService();
  #contractNoteRepository = new ContractNoteRepository();
  #transactionService = new TransactionService();
  #orderRepository = new OrderRepository();
  #stockTransactionService = new StockTransactionService();
  getFullInfo = (user) => this.#userRepository.findById(+user.id, true);

  getUsers = async ({ params }) => {
    const { data } = await this.#validator.validateGet(params);

    let options = {};
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;

    delete data.skip;
    delete data.take;
    delete data.orderBy;

    let where = {};
    if (data.userId) {
      where.id = data.userId;
      delete data.userId;
    }

    Object.assign(where, data);

    let select = {
      UserGroup: {}, UserAddress: {
        where: {
          status: BaseConst.STATUS_ACTIVE
        }
      },
      UserMCSDAccount: {},
      wallets: {
        select: {
          currencyCode: true,
          userId: true,
          status: true,
          name: true,
          type: true,
          walletNumber: true,
          walletBalance: true
        }
      },
      UserBankAccounts: {},
      Custfee: {}
    };
    if (data.prefix != undefined) {


      where.UserMCSDAccount = {
        some: {
          prefix: data.prefix
        }
      }

      delete where.prefix;
    }

    if (data.walletNumber != undefined) {


      where.wallets = {
        some: {
          walletNumber: {
            equals: data.walletNumber
          }
        }
      }

      delete where.walletNumber;
    }

    if (data.groupId != undefined) {


      where.UserGroup = {
        some: {
          groupId: data.groupId
        }
      }

    }

    delete where.groupId;
    delete where.countryId;
    delete where.cityId;
    delete where.districtId;

    let users = await this.#userRepository.findAll(where, select, options);

    // if (data.groupId) {
    //   users.values = users.values.filter((user) => {
    //     let group = user.UserGroup.filter((group) => group.groupId === data.groupId);
    //     if (group.length) {
    //       return true;
    //     }
    //     return false;
    //   });
    // }

    if (data.countryId || data.cityId || data.districtId) {
      users.values = users.values.filter((user) => {
        let address = user.UserAddress.filter(
          (address) =>
            address.countryId === data.countryId ||
            address.cityId === data.cityId ||
            address.districtId === data.districtId
        );
        if (address.length) {
          return true;
        }
        return false;
      });
    }

    users.count = users.values.length;

    return users;
  };
  contractNote = async (params) => {

    let file = fs.readFileSync('./data/uploads/' + params.file.filename, "utf8");
    let arr = file.split("\n");
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split(",");
    }

    let row0 = arr[0];
    let runDate = row0[1];
    let settlementDate = row0[2];
    let downloadAt = moment(runDate, "DDMMYYYY").format();
    let settlementAt = moment(settlementDate, "DDMMYYYY").format();
    console.log(downloadAt, settlementAt)
    if (downloadAt == "Invalid date" && settlementAt == "Invalid date") {
      return "Please, fix date types.";
    }
    let custTotal = row0[3];
    let obligationTotal = row0[4];
    let orders = [];
    let nextRow = 1;
    let error = "";
    for (let i = 0; i < custTotal; i++) {
      let rowi = arr[nextRow];
      let registerNumber = rowi[4];
      let rowCount = arr[nextRow + 1][1];

      let user = await this.#userRepository.findByRegisterNumber(registerNumber);
      if (!user) {
        error += "\n--! Харилцагчийн мэдээлэл олдсонгүй. РД:" + registerNumber
        continue;
      }
      for (let j = 0; j < rowCount; j++) {
        let jTradeDate = arr[nextRow + 2 + j][0];
        let mTradeDate = moment(jTradeDate, "DDMMYYYY").format();
        if (mTradeDate == "Invalid date") {
          error += "-! Please, fix date types." + mTradeDate;
          continue;
        }
        let jSymbol = arr[nextRow + 2 + j][1];
        let jSecurityId = arr[nextRow + 2 + j][2];
        let jTradeId = arr[nextRow + 2 + j][3];
        let jBuySell = arr[nextRow + 2 + j][4];
        let orderType;
        if (jBuySell == "B") {
          orderType = OrderTxnType.Buy;
        } else if (jBuySell == "S") {
          orderType = OrderTxnType.Sell;
        }
        let jSize = arr[nextRow + 2 + j][5];
        let jPrice = arr[nextRow + 2 + j][6];
        let jTradeValue = arr[nextRow + 2 + j][7];
        let jAccruedValue = arr[nextRow + 2 + j][8];
        let jTotalValue = arr[nextRow + 2 + j][9];

        let contract = await this.#contractNoteRepository.findbyTradeId(jTradeId);
        if (contract) {
          error += "-! Already inserted:" + jTradeId;
          continue;
        }
        let stock = await this.#stockRepository.getByExternalId(jSymbol);
        if (stock.length == 0) {
          error += "-! Stock not found:" + jSymbol;
          continue;
        }
        stock = stock[0];
        if (stock.stocktypeId == StockTypeConst.COMPANY_BOND || stock.stocktypeId == StockTypeConst.GOV_BOND) {
          let multiplier = 1;
          if (stock.stocktypeId == StockTypeConst.COMPANY_BOND) {
            if (stock.currencyCode == CurrencyConst.DEFAULT) {
              multiplier = 1000;
            }
            if (stock.currencyCode == CurrencyConst.USD) {
              multiplier = 100;
            }
          }
          jPrice = parseFloat(jPrice) * multiplier;
        }
        let order;
        let data = {
          ordertype: OrderType.LIMIT,
          txntype: orderType,
          condid: OrderCondition.Day,
          enddate: new Date(),
          txndate: mTradeDate,
          regdate: mTradeDate,
          txnsource: TxnSourceConst.Broker,
          stockcode: stock.stockcode,
          price: parseFloat(jPrice),
          cnt: parseInt(jSize),
          userId: user.id
        }
        data.fee = await this.#custFeeService.getFee(data.userId, data.stockcode);
        try {
          //live = false so cannot send order message to mse
          // order = await this.#orderService.create(params, false);
          let params = {
            userId: data.userId,
            currencyCode: stock.currencyCode
          };
          const wallets = await this.#walletService.getWalletWithUser(params);
          if (wallets.length == 0) {
            throw new WalletNotFoundException();
          }
          let nominalWallet = await this.#walletService.getNominalWallet({ currencyCode: stock.currencyCode });
          data.walletId = wallets[0].id;

          let camount = data.price * data.cnt;
          let feeamount = camount * (data.fee / 100);

          if (data.txntype == OrderTxnType.Buy) {
            params = {
              senderWalletId: wallets[0].id,
              receiverWalletId: nominalWallet.id,
              type: TransactionConst.TYPE_W2W,
              amount: parseFloat(camount.toFixed(2)),
              feeAmount: parseFloat(feeamount)
            };
            const transaction = await this.#transactionService.w2w(params);
            data.tranOrderId = transaction.id;

            params = {
              senderWalletId: nominalWallet.id,
              receiverWalletId: wallets[0].id,
              stockCount: data.cnt,
              stockCode: data.stockcode
            };
            const stockTransaction = await this.#stockTransactionService.w2w(params);

            data.stockOrderId = stockTransaction.id;
          } else {
            params = {
              senderWalletId: nominalWallet.id,
              receiverWalletId: wallets[0].id,
              type: TransactionConst.TYPE_W2W,
              amount: parseFloat(camount.toFixed(2)),
              feeAmount: parseFloat(feeamount)
            };
            const transaction = await this.#transactionService.w2w(params);
            data.tranOrderId = transaction.id;

            params = {
              senderWalletId: wallets[0].id,
              receiverWalletId: nominalWallet.id,
              stockCount: data.cnt,
              stockCode: data.stockcode
            };
            const stockTransaction = await this.#stockTransactionService.w2w(params);

            data.stockOrderId = stockTransaction.id;
          }

          data.originalCnt = data.cnt;
          data.originalPrice = data.price;
          data.status = OrderStatus.STATUS_FILLED;
          data.doneprice = data.price;
          data.donecnt = data.cnt;
          data.donedate = mTradeDate;
          data.descr = "Биелсэн";
          data.descr2 = "Filled";
          data.ipo = stock.ipo;
          order = await this.#orderRepository.create(data);

          params = {
            orderId: parseInt(order.tranOrderId),
            confirm: TransactionConst.STATUS_SUCCESS
          }
          await this.#transactionService.confirmTransaction(params);
          orders.push(order);

          params = {
            orderId: parseInt(order.stockOrderId),
            confirm: TransactionConst.STATUS_SUCCESS
          }
          await this.#stockTransactionService.confirmTransaction(params);
        }
        catch (ex) {
          console.log('ex', ex)
          error += "-! " + ex._message + " РД:" + registerNumber + " Symbol:" + jSymbol;
          continue;
        }
        params = {
          tradeId: jTradeId,
          externalId: jSymbol,
          securityId: jSecurityId,
          tradeDate: mTradeDate,
          buySell: jBuySell,
          size: parseInt(jSize),
          price: parseFloat(jPrice),
          tradeValue: parseFloat(jTradeValue),
          accruedValue: parseFloat(jAccruedValue),
          totalValue: parseFloat(jTotalValue),
          orderId: order.txnid,
          downloadAt: downloadAt,
          settlementAt: settlementAt
        }
        await this.#contractNoteRepository.create(params);



      }
      nextRow += parseInt(rowCount) + 7;
    }

    return {
      error: error,
      orders: orders
    };
  }
  userAddress = async (user, params) => {
    const data = await this.#validator.validateAddress(params);

    const userAddressOld = await this.#userAddressRepository.updateMany(

      {
        userId: data.userId,
        status: BaseConst.STATUS_ACTIVE
      },
      {
        status: BaseConst.STATUS_INACTIVE
      },

    )
    const userAddress = await this.#userAddressRepository.create({
      userId: data.userId,
      countryId: data.country,
      cityId: data.city,
      districtId: data.district,
      subDistrict: data.subDistrict,
      address: data.address
    })

    return userAddress;
  }
  changeIdentity = async (params) => {
    let { user, data } = await this.#validator.validateChangeIdentity(params);
    let userRegisterService = new UserRegister();

    await userRegisterService.changeIdentity({
      phone: data.email,
      uuid: user.uuid
    })
    await this.#userRepository.update({
      uuid: user.uuid
    }, {
      email: data.email
    })
    return BaseConst.MSG_SUCCESS;
  }
  userRegister = async (user, params) => {
    const { data, userData } = await this.#validator.validateUserReg(params);

    const userRegisterService = new UserRegister();

    const ANDUser = await userRegisterService._process({
      identity: data.identity,
      password: Helper.generatePassword(),
    });

    if (!ANDUser) throw new ErrorANDException();
    // const ANDUser = {
    //   id: data.identity
    // }

    // data.custType = data.type;
    // data.custType = McsdConst.CUSTOMER_TYPE_CITIZEN;
    // if (UserConst.TYPE_ORGINIZATION_CUSTOMER === data.custType) {
    //   userData.custType = McsdConst.CUSTOMER_TYPE_AAN;
    // }
    let newUser;
    if (data.type == UserConst.TYPE_ADMIN) {

      newUser = await this.#userRepository.create({
        email: data.identity,
        identityType: 'email',
        uuid: ANDUser.id,
        status: UserConst.STATUS_ACTIVE,
        handphone: data.phoneNumber,
        familyName: userData.familyName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        createdUserId: user.id,
        UserGroup: {
          create: [
            { groupId: data.type === UserConst.TYPE_ADMIN ? UserGroupConst.GROUP_ADMIN_BASIC : UserGroupConst.GROUP_USER },
          ],
        }
      });
    } else {
      if (data.custType == UserConst.TYPE_FOREIGN_CUSTOMER) {
        data.registerNumber = userData.passportNumber;
      }
      if (data.custType == UserConst.TYPE_ORGINIZATION_CUSTOMER) {
        data.registerNumber = userData.companyRegisterNumber;
      }
      newUser = await this.#userRepository.create({
        email: data.identity,
        identityType: 'email',
        uuid: ANDUser.id,
        registerNumber: data.registerNumber,
        passportNumber: data.passportNumber,
        status: UserConst.STATUS_PENDING_PAYMENT,
        handphone: data.phoneNumber,
        profession: userData.profession,
        gender: userData.gender,
        familyName: userData.familyName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        nationId: userData.nationId,
        birthday: userData.birthday,
        companyName: userData.companyName,
        custType: data.custType,
        createdAt: new Date(),
        createdUserId: user.id,
        UserGroup: {
          create: [
            { groupId: data.type === UserConst.TYPE_ADMIN ? UserGroupConst.GROUP_ADMIN : UserGroupConst.GROUP_CONFIRMED_USER },
          ],
        },
        UserAddress: {
          create: [
            {
              countryId: userData.country,
              cityId: userData.city,
              districtId: userData.district,
              subDistrict: userData.subDistrict,
              address: userData.address
            },
          ],
        },
      });


    }

    return newUser;
  };

  userFiles = async (params) => {
    const { data } = await this.#validator.validateUserFiles(params);
    let options = {};
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;

    delete data.skip;
    delete data.take;
    delete data.orderBy;

    const userFiles = await this.#userFilesRepository.findAll(data, undefined, options);
    userFiles.values.forEach(element => {
      if (!(/http/.exec(element.imagePath))) {
        element.imageUrl = element.imageFullPath;
      }
    });
    return userFiles;
  };

  addUserToGroup = async (admin, params) => {
    const { data, user, group } = await this.#validator.validateAddUserToGroup(params);

    let status = BaseConst.STATUS_ACTIVE;
    // if (new Date(data.startDate) < new Date()) {
    //   status = BaseConst.STATUS_ACTIVE;
    // }

    await this.#userGroupRepository.create({
      userId: +user.id,
      groupId: +group.id,
      status,
      startDate: data.startDate,
      endDate: data.endDate,
      createdUserId: admin.id,
    });

    return BaseConst.MSG_SUCCESS;
  };

  removeUserFromGroup = async (admin, params) => {
    const { userGroup } = await this.#validator.validateRemoveUserFromGroup(params);

    await this.#userGroupRepository.update(userGroup.id, {
      status: BaseConst.STATUS_INACTIVE,
      updatedAt: new Date(),
      updatedUserId: admin.id,
    });

    return BaseConst.MSG_SUCCESS;
  };
  importUsersFromJson = async (admin, params) => {
    const { holders_brok } = require('../../../sample_data/' + params.fileName);
    const { Banks } = require('../../../sample_data/' + params.fileName);
    const { mit_registration } = require('../../../sample_data/mit_registration.json');
    let countries = await this.#countryRepository.findByStatus(BaseConst.STATUS_ACTIVE);
    let i = 0, length = holders_brok.length, duplicateReg = 0;
    let totalAddedUsers = 0;
    let stockBalanceXML = fs.readFileSync('./sample_data/stockBalance.xml');
    let stockBalance = XmlParser(stockBalanceXML);
    let stockDepo = stockBalance.cdepo;
    let userBridge = stockBalance.bridge;
    let mergedBalance = [];
    let error = "";
    const prisma = new PrismaClient();
    for (let i = 0; i < stockDepo.length; i++) {
      mergedBalance.push({
        ...stockDepo[i],
        ...(userBridge.find((itmInner) => itmInner.FFF1 === stockDepo[i].GGG1))
      }
      );

      // let stock = await prisma.stock.findUnique({
      //   where: {
      //     stockcode: stockDepo[i].GGG2
      //   }
      // })
      // if(!stock){
      //   console.log('stockcode not found:', stockDepo[i].GGG2)
      // }
    }
    console.log('mergedBalance', mergedBalance)



    console.log('length', length)
    for (i = 0; i < length; i++) {



      if (holders_brok[i].b_Email == "") {
        holders_brok[i].b_Email = "user" + holders_brok[i].b_ID + "@rhinosinvest.mn";
      }
      if (Helper.hasKey(holders_brok[i], "b_Email") && holders_brok[i].b_Email != undefined && holders_brok[i].b_Email != "") {
        let resRegex = RegExp(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,})+$/).exec(holders_brok[i].b_Email);
        if (resRegex == null) {

          loggerMigration.info({ not_match: holders_brok[i].b_Email })
          holders_brok[i].b_Email = "user" + holders_brok[i].b_ID + "@rhinosinvest.mn";
          // continue;
        }
        let checkId = await this.#userRepository.findByRegisterNumber(holders_brok[i].b_Register);
        let mcsdAcc = mit_registration.find(y => y.m_User == holders_brok[i].b_User);
        if (mcsdAcc == undefined) {

          loggerMigration.info({ not_found_reg: holders_brok[i].b_Register })
          continue;
        }
        if (checkId) {
          duplicateReg += 1;


          // let user = await this.#userRepository.findbyIdWithWallet(checkId.id);
          // if (user == undefined || user.wallets.length == 0) {
          //   error += "wallet not found:" + mcsdAcc.Client_Prefix;
          //   loggerMigration.info({not_found_wallet: holders_brok[i].b_Register})
          //   continue;
          // }


          // for (let index = 0; index < mergedBalance.length; index++) {


          //   if (mergedBalance[index].MIT_Prefix == mcsdAcc.Client_Prefix && mergedBalance[index].GGG2 != undefined && mergedBalance[index].GGG2 != '9991' && mergedBalance[index].GGG2 != '9992' && mergedBalance[index].GGG2 != '9998' && mergedBalance[index].GGG2 != '9999') {

          //     var stockBalances = await this.#stockBalanceRepository.findByWalletId(user.wallets[0].id, WalletConst.STATUS_ACTIVE, mergedBalance[index].GGG2);
          //     let stock = await this.#stockRepository.getByStockcode(mergedBalance[index].GGG2);
          //     if(!stock){
          //       loggerMigration.info({not_found_stock: mergedBalance[index].GGG2})
          //       continue;
          //     }
          //     loggerMigration.info({stockBalances: stockBalances})
          //     try {
          //       if (stockBalances.length == 0) {
          //         await this.#stockBalanceRepository.create({
          //           walletId: user.wallets[0].id,
          //           stockCode: mergedBalance[index].GGG2,
          //           balance: mergedBalance[index].GGG3,
          //           holdBalance: 0,
          //           updatedAt: new Date(),
          //           updatedUserId: 1
          //         });
          //       }

          //       else {
          //         let params = {
          //           stockCode: mergedBalance[index].GGG2,
          //           balance: mergedBalance[index].GGG3,
          //           updatedAt: new Date(),
          //           updatedUserId: 1
          //         }

          //         loggerMigration.info({params: params})

          //         await this.#stockBalanceRepository.update(stockBalances[0].id, params);
          //       }
          //       loggerMigration.info("Success walletId"+ user.wallets[0].id+"stockcode:"+mergedBalance[index].GGG2+"balance:"+mergedBalance[index].GGG3)


          //     }
          //     catch (ex) {
          //       console.log(ex)
          //       loggerMigration.info("-! " + ex._message + " wallet id:" + user.wallets[0].id + " Symbol:" + mergedBalance[index].GGG2)
          //       error += "-! " + ex._message + " wallet id:" + user.wallets[0].id + " Symbol:" + mergedBalance[index].GGG2;
          //       continue;
          //     }
          //   }
          // }

          continue;
        }
        let checkUser = await this.#userRepository.findByEmail(holders_brok[i].b_Email);
        if (!checkUser) {
          let lastName = "", firstName = "", companyName = "";
          if (Helper.hasKey(holders_brok[i], "b_Ovog"))
            lastName = holders_brok[i].b_Ovog;
          if (Helper.hasKey(holders_brok[i], "b_Ner"))
            firstName = holders_brok[i].b_Ner;
          let birthdate = new Date(holders_brok[i].b_Birthdate);
          birthdate.setUTCHours(0, 0, 0, 0);
          let countryId = "";
          let country = countries.find(y => y.code == holders_brok[i].b_Country);
          if (country != undefined)
            countryId = country.id;
          else
            countryId = countries.find(y => y.code == "496").id;
          let uuid = "";
          if (params.status == 0) {

            const userRegisterService = new UserRegister();
            const ANDUser = await userRegisterService._process({
              identity: holders_brok[i].b_Email,
              password: 'Qwer1234!',
            });
            if (ANDUser)
              uuid = ANDUser.id;

          }
          if (uuid == "") {
            uuid = holders_brok[i].b_Email;
          }
          let custType = UserConst.TYPE_ADULT_CUSTOMER;
          if (holders_brok[i].b_CustomerType == 1) {
            custType = UserConst.TYPE_ORGINIZATION_CUSTOMER;
            if (Helper.hasKey(holders_brok[i], "b_Ner"))
              companyName = holders_brok[i].b_Ner;
          }
          let bank = Banks.find(y => y.Bank_code == holders_brok[i].b_BankId1);
          let mcsdAcc = mit_registration.find(y => y.m_User == holders_brok[i].b_User);
          let userBankAccount = undefined;
          if (bank != undefined) {
            let accountNo = "";
            if (Helper.hasKey(holders_brok[i], "b_BankDans1"))
              accountNo = holders_brok[i].b_BankDans1;
            userBankAccount = {
              create: {
                bankCode: bank.Bank_code.padStart(2, 0),
                accountNo: accountNo.toString(),
                accountName: mcsdAcc != undefined ? mcsdAcc.Other_Names : ""
              }
            }
          }
          let userMcsdAccount = undefined;

          let walletNumber = holders_brok[i].b_Brok + holders_brok[i].b_User.toString().padStart(8, 0);
          if (mcsdAcc != undefined) {
            userMcsdAccount = {
              create: {
                prefix: mcsdAcc.Client_Prefix.toString(),
                clientSuffix: mcsdAcc.Client_Suffix,
                fullPrefix: mcsdAcc.m_Full_Prefix,
                bdcAccountId: walletNumber
              }
            }
          }
          let newUser = await this.#userRepository.create({
            uuid: uuid,
            identityType: "email",
            familyName: "",
            lastName: lastName,
            firstName: firstName,
            birthday: birthdate,
            registerNumber: holders_brok[i].b_Register,
            gender: holders_brok[i].b_Gender,
            profession: holders_brok[i].b_Work || "",
            position: holders_brok[i].b_Work || "",
            companyName: companyName,
            email: holders_brok[i].b_Email,
            phone: holders_brok[i].b_Phone,
            workphone: "",
            handphone: holders_brok[i].b_Phone,
            externalId: UserStepConst.STEP_5,
            status: UserConst.STATUS_PAID,
            custType: custType,
            description: "",
            createdAt: new Date(),
            createdUserId: admin.id,
            isAdditional: true,
            UserBankAccounts: userBankAccount,
            UserMCSDAccount: userMcsdAccount,
            UserGroup: {
              create: {
                groupId: UserGroupConst.GROUP_CONFIRMED_USER,
                status: 1,
                createdAt: new Date()
              }
            },
            UserAddress: {
              create: {
                countryId: countryId,
                cityId: 1,
                districtId: 1,
                status: 1,
                address: holders_brok[i].b_Address.toString()
              }
            }
          });
          await this.#custFeeService.create({
            userId: newUser.id,
            name: "Хувьцааны шимтгэл",
            name2: "Securities fee",
            stocktypeId: StockTypeConst.SEC,
            value: parseFloat(holders_brok[i].b_Tax_E)
          });
          await this.#custFeeService.create({
            userId: newUser.id,
            name: "Компанийн бондын шимтгэл",
            name2: "Company bond fee",
            stocktypeId: StockTypeConst.COMPANY_BOND,
            value: parseFloat(holders_brok[i].b_Tax_C)
          });
          await this.#custFeeService.create({
            userId: newUser.id,
            name: "ЗГ-ын бондын шимтгэл",
            name2: "Government bond fee",
            stocktypeId: StockTypeConst.GOV_BOND,
            value: parseFloat(holders_brok[i].b_Tax_G)
          });

          var wallet = await this.#walletService.createWallet({
            name: newUser.firstName.substring(0, 30),
            userId: newUser.id
          });

          // await this.#walletNumberRepository.updateByNumber(wallet.walletNumber, {
          //   number: walletNumber
          // });
          await this.#userRepository.update({ id: newUser.id }, {
            status: UserConst.STATUS_ACTIVE
          });
          if (mcsdAcc != undefined) {
            for (let index = 0; index < mergedBalance.length; index++) {
              if (mergedBalance[index].MIT_Prefix == mcsdAcc.Client_Prefix && mergedBalance[index].GGG2 != '9991' && mergedBalance[index].GGG2 != '9992' && mergedBalance[index].GGG2 != '9998' && mergedBalance[index].GGG2 != '9999') {
                await this.#stockBalanceRepository.create({
                  walletId: wallet.id,
                  stockCode: mergedBalance[index].GGG2,
                  balance: mergedBalance[index].GGG3,
                  holdBalance: 0
                });
              }
            }
          }

          totalAddedUsers++;
        } else {
          // let user = await this.#userRepository.findbyIdWithWallet(checkUser.id);

          // if (user == undefined || user.wallets.length == 0) {
          //   error += "wallet not found:" + mcsdAcc.Client_Prefix;
          //   continue;
          // }


          // for (let index = 0; index < mergedBalance.length; index++) {


          //   if (mergedBalance[index].MIT_Prefix == mcsdAcc.Client_Prefix && mergedBalance[index].GGG2 != '9991' && mergedBalance[index].GGG2 != '9992' && mergedBalance[index].GGG2 != '9998' && mergedBalance[index].GGG2 != '9999') {

          //     var stockBalances = await this.#stockBalanceRepository.findByWalletId(user.wallets[0].id, WalletConst.STATUS_ACTIVE, mergedBalance[index].GGG2);
          //     try {
          //       if (stockBalances.length == 0) {
          //         await this.#stockBalanceRepository.create({
          //           walletId: user.wallets[0].id,
          //           stockCode: mergedBalance[index].GGG2,
          //           balance: mergedBalance[index].GGG3,
          //           holdBalance: 0,
          //           updatedAt: new Date(),
          //           updatedUserId: 1
          //         });
          //       }

          //       else {
          //         await this.#stockBalanceRepository.update(stockBalances[0].id, {
          //           stockCode: mergedBalance[index].GGG2,
          //           balance: mergedBalance[index].GGG3,
          //           updatedAt: new Date(),
          //           updatedUserId: 1
          //         });
          //       }
          //       loggerMigration.info("Success walletId"+ user.wallets[0].id+"stockcode:"+mergedBalance[index].GGG2+"balance:"+mergedBalance[index].GGG3)

          //     }
          //     catch (ex) {
          //       console.log(ex)
          //       loggerMigration.info("-! " + ex._message + " wallet id:" + user.wallets[0].id + " Symbol:" + mergedBalance[index].GGG2)
          //       error += "-! " + ex._message + " wallet id:" + user.wallets[0].id + " Symbol:" + mergedBalance[index].GGG2;
          //       continue;
          //     }
          //   }
          // }


          duplicateReg++;
        }
      }


    }

    loggerMigration.info("Duplicate reg user:" + duplicateReg)
    loggerMigration.info(totalAddedUsers + " user added")

    for (let i = 0; i < length; i++) {
      let mcsdAccount = mit_registration.find(y => y.m_User == holders_brok[i].b_User);
      if (mcsdAccount != undefined) {

        let user = await this.#userRepository.findByRegisterNumber(holders_brok[i].b_Register);
        if (!user) {
          continue;
        }
        let newDate = mcsdAccount.Date_Registration.substring(4, 8) + "-" + mcsdAccount.Date_Registration.substring(2, 4) + "-" + mcsdAccount.Date_Registration.substring(0, 2);
        // user.createdAt = new Date(newDate);
        await this.#userRepository.update({ id: user.id }, {
          createdAt: new Date(newDate)
        });
      }
    }
    return BaseConst.MSG_SUCCESS + " " + totalAddedUsers + " user added, Duplicated user:" + duplicateReg;
  }
}

module.exports = AdminService;
