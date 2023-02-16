import { WalletConst } from '../../constants/wallet';
import BaseRepository from '../base.repository';

export default class ReportRepository extends BaseRepository {
  constructor() {
    super('');
  }
  getNominalStockBalancesWithAmount = async (nominalWalletId: number) => {
    return await this._prisma.$queryRaw`select st.symbol,sum(sb.balance) as cnt,
        case when st.closeprice!=0 and st.closeprice is not null 
        then st.closeprice*sum(sb.balance) 
        else 
         IFNULL(st.openprice,0)*sum(sb.balance) 
         end as amount,
         case when st.closeprice!=0 and st.closeprice is not null 
         then st.closeprice
         else 
          IFNULL(st.openprice,0)
          end as price
         from 
        \`StockBalance\` sb
        inner join Stock st on st.stockcode=sb.stockCode
        where sb.walletId!=${nominalWalletId}
        group by sb.stockcode
        having cnt>0
        order by amount desc
        `;
  };
}
