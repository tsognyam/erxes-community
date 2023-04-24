import BaseRepository from '../base.repository';

export default class UserMCSDAccountRepository extends BaseRepository {
  constructor() {
    super('userMCSDAccount');
  }
  getTotalCount = async () => {
    return await this._prisma[this._model].count();
  };
  getUsersCountByYear = async params => {
    let i;
    let data: any = [];
    let years: any = {};
    for (let i = 0; i <= params.endYear - params.startYear; i++) {
      years = {
        ...years,
        [params.startYear + i]: 0
      };
    }
    for (i = 1; i <= 12; i++) {
      data.push({
        name: i + '-р сар',
        key: i,
        ...years
      });
    }
    let usersCount = await this._prisma
      .$queryRaw`select count(createdAt) as \`count\`,
    YEAR(userMCSD.createdAt) as year,
    MONTH(userMCSD.createdAt) as month from \`UserMCSDAccount\` userMCSD 
    where YEAR(userMCSD.createdAt)>=${params.startYear} and YEAR(userMCSD.createdAt)<=${params.endYear}
    group by YEAR(userMCSD.createdAt),MONTH(userMCSD.createdAt)`;
    usersCount.map(item => {
      let itemData = data.find(x => x.key == item.month);
      itemData[item.year] = Number(item.count);
    });
    return data;
  };
}
