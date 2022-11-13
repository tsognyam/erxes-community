import BaseConst from '../../constants/base';
import BaseRepository from '../base.repository';
export default class WithdrawRepository extends BaseRepository {
  constructor() {
    super('withdraw');
  }
  getWithdrawList = async (data: any) => {
    let options: any = [];
    options.take = data.take;
    options.skip = data.skip;
    options.orderBy = data.orderBy;
    data.skip = undefined;
    data.take = undefined;
    data.orderBy = undefined;
    return await this.findAll(data, options);
  };
  findAll = async (params: any, options: any = []) => {
    let where = params;
    if (params.userId != undefined) {
      where.wallet = {
        userId: params.userId
      };
      where.userId = undefined;
    }
    let select = {
      wallet: {
        select: {
          walletNumber: true,
          user: {
            select: {
              familyName: true,
              firstName: true,
              lastName: true,
              registerNumber: true,
              passportNumber: true,
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
                              status: true
                            }
                          }
                        }
                      }
                    }
                  }
                },
                where: {
                  status: BaseConst.STATUS_ACTIVE
                }
              },
              UserMCSDAccount: true
            }
          }
        }
      }
    };
    let data = await this._prisma[this._model].findMany({
      skip: options != undefined ? options.skip : undefined,
      take: options != undefined ? options.take : undefined,
      where,
      include: select,
      orderBy: options != undefined ? options.orderBy : undefined
    });
    let total = await this._prisma[this._model].count({
      where
    });
    let res = {
      total: total,
      count: data.length,
      values: data
    };
    return res;
  };
  findByWalletId = async (walletId: number | undefined) => {
    let where = {};

    if (undefined !== walletId) {
      where = {
        walletId: walletId
      };
    }

    return await this._prisma[this._model].findMany({
      where
    });
  };
}
