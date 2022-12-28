// const { getValueR } = require('../../middleware/helper.middleware');
import Helper from '../../middleware/helper.service';
import BaseConst from '../../constants/base';
import ContractConst from '../../constants/contract';
import { UserFilesConst, UserConst } from '../../constants/user';
import { CurrencyConst } from '../../constants/wallet';
import BaseRepository from '../base.repository';

export default class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  #getUserInfo = async (where, profile) => {
    let user = await this._prisma[this._model].findUnique({
      where,
      select: {
        id: true,
        uuid: true,
        registerNumber: true,
        passportNumber: true,
        email: true,
        familyName: true,
        lastName: true,
        firstName: true,
        birthday: true,
        workPhone: true,
        handPhone: true,
        phone: true,
        status: true,
        gender: true,
        custType: true,
        profession: true,
        position: true,
        externalId: true,
        isAdditional: true,
        // UserGroup: {
        //   select: {
        //     id: true,
        //     groupId: true,
        //     startDate: true,
        //     endDate: true,
        //     status: true,
        //     Group: {
        //       select: {
        //         id: true,
        //         name: true,
        //         name2: true,
        //         group: true,
        //         status: true,
        //         roles: {
        //           select: {
        //             status: true,
        //             Role: {
        //               select: {
        //                 role: true,
        //                 status: true,
        //               },

        //             },
        //           },
        //         },
        //       },

        //     },
        //   },
        //   where: {
        //     status: BaseConst.STATUS_ACTIVE
        //   }
        // },
        UserAddress: {
          select: {
            id: true,
            city: {
              select: {
                id: true,
                name: true,
                name2: true,
                status: true,
              },
            },
            country: {
              select: {
                id: true,
                name: true,
                name2: true,
                status: true,
              },
            },
            district: {
              select: {
                id: true,
                name: true,
                name2: true,
                status: true,
              },
            },
            subDistrict: true,
            address: true,
            status: true,
          },
          where: {
            status: BaseConst.STATUS_ACTIVE
          }
        },
        UserBankAccounts: {
          select: {
            id: true,
            bankCode: true,
            accountNo: true,
            accountName: true,
            status: true,
          },
          where: {
            status: BaseConst.STATUS_ACTIVE
          }
        },
        UserMCSDAccount: {
          select: {
            id: true,
            prefix: true,
            clientSuffix: true,
            fullPrefix: true,
            bdcAccountId: true
          }
        },
        // UserFiles: {
        //   select: {
        //     imagePath: true,
        //     imageFullPath: true,
        //     type: true,
        //     status: true,
        //   },
        // },
        UserContract: {
          select: {
            Contract: {
              select: {
                name: true,
                name2: true,
                type: true
              }
            }
          }
        }
      },
    });

    if (!user) {
      return user;
    }

    // user.UserGroup = user.UserGroup.filter(
    //   (group) => BaseConst.STATUS_ACTIVE === group.status && BaseConst.STATUS_ACTIVE === group.Group.status
    // );
    if (user.UserContract.length != 0) {
      user.term = user.UserContract.filter(
        (contract) => ContractConst.TYPE_SERVICE === contract.Contract.type
      );
      user.term = user.term.length != 0 ? true : false;
    } else {
      user.term = false;
    }

    user.UserAddress = user.UserAddress.filter((address) => BaseConst.STATUS_ACTIVE === address.status)[0];

    user.UserBankAccounts = user.UserBankAccounts.filter((account) => {
      if (BaseConst.STATUS_ACTIVE === account.status) {
        delete account.status;
        return account;
      }
    });

    // const roles = user.UserGroup.map((grpObj) => {
    //   let grpRoles = grpObj.Group.roles
    //     .filter((role) => BaseConst.STATUS_ACTIVE === role.status && BaseConst.STATUS_ACTIVE === role.Role.status)
    //     .map((role) => role.Role.role);
    //   delete grpObj.Group.roles;
    //   return grpRoles;
    // });

    if (profile) {
      const profilePicture = user.UserFiles.filter(
        (file) => BaseConst.STATUS_ACTIVE === file.status && UserFilesConst.TYPE_PROFILE === file.type
      );
      console.log('profilePicture',profilePicture)
      if (profilePicture.length != 0)
        user.image = profilePicture[0].imageFullPath;
      else
        user.image = null;
      // if (profilePicture.length && fs.existsSync(profilePicture[0].imagePath)) {
      //   user.image = fs.readFileSync(profilePicture[0].imagePath, {
      //     encoding: 'base64',
      //   });
      // }
    }
    delete user.UserFiles;

    user.step = user.externalId;
    delete user.externalId;

    // user.roles = roles.flat();
    if (user.UserBankAccounts.length != 0) {
      user.UserBankAccounts[0].transactionFee = user.UserBankAccounts[0].bankCode == '04' ? await Helper.getValueR('TDBTransactionFee') : await Helper.getValueR('BankTransactionFee')
      user.UserBankAccounts[0].transactionFeeLarge = user.UserBankAccounts[0].bankCode == '04' ? await Helper.getValueR('TDBTransactionFeeLarge') : await Helper.getValueR('BankTransactionFeeLarge')
    }

    return user;
  };

  findByUuid = async (uuid, profile = false) => await this.#getUserInfo({ uuid }, profile);

  findById = async (id, profile = false) => await this.#getUserInfo({ id }, profile);

  findMCSDAccountById = async (id) => {
    let where = { id };
    let user = await this._prisma[this._model].findUnique({
      where,
      select: {
        id: true,
        uuid: true,
        registerNumber: true,
        passportNumber: true,
        email: true,
        familyName: true,
        lastName: true,
        firstName: true,
        birthday: true,
        workPhone: true,
        handPhone: true,
        phone: true,
        status: true,
        gender: true,
        custType: true,
        profession: true,
        position: true,
        externalId: true,
        isAdditional: true,
        UserMCSDAccount: {
          select: {
            id: true,
            prefix: true,
            clientSuffix: true,
            fullPrefix: true,
            bdcAccountId: true
          }
        },
      },
    });
    return user;

  }

  findWithWallet = async (id) =>
    await this._prisma[this._model].findFirst({
      where: {
        id: +id,
        // status: UserConst.STATUS_PAID,
      },
      include: {
        wallets: true,
      },
    });

  findbyIdWithWallet = async (id) =>
    await this._prisma[this._model].findFirst({
      where: {
        id: +id
      },
      include: {
        wallets: {
          where: {
            currencyCode: CurrencyConst.DEFAULT
          }
        },
      },
    });
  findByPassport = async (passportNumber, profile = false) => {
    let where = {
      passportNumber
    }
    let user = await this._prisma[this._model].findMany({
      where,
      select: {
        id: true,
        uuid: true,
        registerNumber: true,
        passportNumber: true,
        email: true,
        familyName: true,
        lastName: true,
        firstName: true,
        birthday: true,
        workPhone: true,
        handPhone: true,
        phone: true,
        status: true,
        gender: true,
        custType: true,
        profession: true,
        position: true,
        externalId: true,
        isAdditional: true,
        UserGroup: {
          select: {
            id: true,
            groupId: true,
            startDate: true,
            endDate: true,
            status: true,
            Group: {
              select: {
                id: true,
                name: true,
                name2: true,
                group: true,
                status: true,
                roles: {
                  select: {
                    status: true,
                    Role: {
                      select: {
                        role: true,
                        status: true,
                      },

                    },
                  },
                },
              },

            },
          },
          where: {
            status: BaseConst.STATUS_ACTIVE
          }
        }
      },
    });

    return user;
  }
  findByRegisterNumber = async (registerNumber, profile = false) => {
    let where = {
      registerNumber
    }
    let user = await this._prisma[this._model].findUnique({
      where,
      select: {
        id: true,
        uuid: true,
        registerNumber: true,
        email: true,
        familyName: true,
        lastName: true,
        firstName: true,
        birthday: true,
        workPhone: true,
        handPhone: true,
        phone: true,
        status: true,
        gender: true,
        custType: true,
        profession: true,
        position: true,
        externalId: true,
        isAdditional: true,
        // UserGroup: {
        //   select: {
        //     id: true,
        //     groupId: true,
        //     startDate: true,
        //     endDate: true,
        //     status: true,
        //     Group: {
        //       select: {
        //         id: true,
        //         name: true,
        //         name2: true,
        //         group: true,
        //         status: true,
        //         roles: {
        //           select: {
        //             status: true,
        //             Role: {
        //               select: {
        //                 role: true,
        //                 status: true,
        //               },

        //             },
        //           },
        //         },
        //       },

        //     },
        //   },
        //   where: {
        //     status: BaseConst.STATUS_ACTIVE
        //   }
        // }
      },
    });

    return user;
  }

  update = async (where, entity, select = null) =>
    await this._prisma[this._model].update({
      where,
      data: entity,
      include: select,
    });

  findByEmail = async (email) =>
    await this._prisma[this._model].findUnique({
      where: {
        email,
      },
    });

  findByPrefix = async (prefix) =>
    await this._prisma[this._model].findMany({
      where: {
        UserMCSDAccount: {
          some: {
            prefix: prefix
          }
        }
      },
      include: {
        UserMCSDAccount: true
      }
    });

    findByMCSDId = async (id) =>
    await this._prisma[this._model].findMany({
      where: {
        UserMCSDAccount: {
          some: {
            id: id
          }
        }
      },
    });

  findWithWalletByPrefix = async (prefix) =>
    await this._prisma[this._model].findMany({
      where: {
        UserMCSDAccount: {
          some: {
            prefix: prefix
          }
        }
      },
      include: {
        wallets: {
          where: {
            currencyCode: CurrencyConst.DEFAULT
          }
        },
      }
    });
}

