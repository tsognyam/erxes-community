import BaseConst from '../../constants/base';
import { getUsers } from '../../models/utils';
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

    let select = {
      wallet: {
        select: {
          user: true
        }
      }
    };
    let withdrawList = await this.findAll(data, select, options);
    let userIds = withdrawList.values.map(function(obj: any) {
      return obj.wallet.user.userId;
    });
    let query = {
      _id: { $in: userIds }
    };
    let users = await getUsers(query);
    let user: any;
    withdrawList.values.forEach((el: any, index) => {
      user = users.find((x: any) => x._id == el.wallet.user.userId);
      if (user != undefined) {
        withdrawList.values[index].firstName = user.firstName;
        withdrawList.values[index].lastName = user.lastName;
      }
    });
    return withdrawList;
  };
  // findAll = async (params: any, options: any = []) => {
  //   let where = params;
  //   if (params.userId != undefined) {
  //     where.wallet = {
  //       userId: params.userId
  //     };
  //     where.userId = undefined;
  //   }
  //   let select = {
  //     wallet: {
  //       select: {
  //         walletNumber: true
  //       }
  //     }
  //     // user: true
  //   };
  //   let data = await this._prisma[this._model].findMany({
  //     skip: options != undefined ? options.skip : undefined,
  //     take: options != undefined ? options.take : undefined,
  //     where,
  //     include: select,
  //     orderBy: options != undefined ? options.orderBy : undefined
  //   });
  //   let total = await this._prisma[this._model].count({
  //     where
  //   });
  //   let res = {
  //     total: total,
  //     count: data.length,
  //     values: data
  //   };
  //   return res;
  // };
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
