import BaseRepository from '../base.repository';
export default class BankTransactionRepository extends BaseRepository {
  constructor() {
    super('bankTransaction');
  }
  bankTransactionReport = async (params: any) => {
    let where: any = {
      dater: {
        gte: params.startDate,
        lte: params.endDate
      }
    };

    if (params.type != undefined) {
      where.type = params.type;
    }
    if (params.accountNo != undefined) {
      where.accountNo = params.accountNo;
    }
    if (params.description != undefined) {
      where.description = params.description;
    }

    const list = await this.findMany(where, {
      order: {
        select: {
          walletFrom: {
            select: {
              user: {
                select: {
                  id: true,
                  lastName: true,
                  firstName: true
                }
              }
            }
          },
          walletTo: {
            select: {
              user: {
                select: {
                  id: false,
                  lastName: true,
                  firstName: true
                }
              }
            }
          }
        }
      },
      withdraw: true
    });
    return list;
  };
}
