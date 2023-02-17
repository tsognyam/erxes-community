import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import {
  Box,
  CollapseContent,
  Table,
  Pagination,
  Info
} from '@erxes/ui/src/components';
import _ from 'lodash';
import {
  BoxContent,
  BoxContentContainer,
  ChartContentContainer
} from '../../styles';
import Chart from './Chart';
import { displayValue } from '../../App';
type Props = {
  history?: any;
  queryParams: any;
};
const COLORS = ['#004c6d', '#346888', '#5886a5'];
const userCountByYearData = [
  {
    name: '1-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '2-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '3-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '4-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '5-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '6-р сар',
    2023: 100,
    2022: 200,
    2021: 500
  },
  {
    name: '7-р сар',
    2023: 200,
    2022: 300,
    2021: 100
  },
  {
    name: '8-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '9-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '10-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '11-р сар',
    2023: 1000,
    2022: 2000,
    2021: 3000
  },
  {
    name: '12-р сар',
    2023: 1,
    2022: 4,
    2021: 5
  }
];
const PIE_COLORS = [
  '#ea5545',
  '#f46a9b',
  '#ef9b20',
  '#edbf33',
  '#ede15b',
  '#bdcf32',
  '#87bc45',
  '#27aeef',
  '#b33dc6'
];
// const stockByAmountData = [
//   {
//     symbol: 'LendMN',
//     amount: 10000,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: 'Other',
//     amount: 9000,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: '1',
//     amount: 8000,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: '2',
//     amount: 7000,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: '3',
//     amount: 6000,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: '4',
//     amount: 5500,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: 'UID',
//     amount: 5000,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: 'TUM',
//     amount: 4500,
//     cnt: 10,
//     price: 1000
//   },
//   {
//     symbol: 'APU',
//     amount: 220,
//     cnt: 10,
//     price: 1000
//   }
// ];
type FinalProps = {
  tradingNominalWalletQuery: any;
  tradingNominalStockBalanceQuery: any;
} & Props &
  IRouterProps;
class Index extends React.Component<FinalProps> {
  renderContent = () => {
    const {
      tradingNominalWalletQuery,
      tradingNominalStockBalanceQuery
    } = this.props;
    const nominalWallet = tradingNominalWalletQuery?.tradingNominalWallet || [];
    const stockByAmountData =
      tradingNominalStockBalanceQuery?.tradingNominalStockBalancesWithAmount ||
      [];
    return (
      <>
        <BoxContentContainer>
          <BoxContent>
            <Box
              title="Дансан дахь үнэт цаас /мөнгөн дүнгээр/"
              name="stockByAmount"
              isOpen={true}
            >
              <Chart
                chartType="stockByAmount"
                data={stockByAmountData}
                colors={COLORS}
              />
            </Box>
          </BoxContent>
          <BoxContent>
            <Box
              title="Дансан дахь үнэт цаас /мөнгөн дүнд эзлэх хувь/"
              name="stockByPercentage"
              isOpen={true}
            >
              <Chart
                chartType="stockByPercentage"
                data={stockByAmountData}
                colors={PIE_COLORS}
              />
            </Box>
          </BoxContent>
        </BoxContentContainer>
        <BoxContentContainer>
          <BoxContent>
            <Box
              title="Дансан дахь үнэт цаас, ширхэгээр"
              name="stockByAmount"
              isOpen={true}
            >
              <Table>
                <thead>
                  <tr>
                    <th>№</th>
                    <th>ҮЦ нэр</th>
                    <th>Тоо ширхэг</th>
                  </tr>
                </thead>
                <tbody>
                  {stockByAmountData.map((item, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{item.symbol}</td>
                        <td>{item.cnt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Pagination count={stockByAmountData.length} />
            </Box>
          </BoxContent>
          <BoxContent>
            <Box
              title="Ногдол ашгийн мөнгө (ҮЦТХТ)"
              name="mcsdAmount"
              isOpen={true}
            >
              <BoxContent>
                <Info type="info" title={displayValue(0, 'noDiv') + '₮'}>
                  {' '}
                </Info>
              </BoxContent>
            </Box>
            <Box
              title="Арилжааны төлбөр тооцоо ХХК дахь мөнгө (бонд, IPO)"
              name="tradingBondIpoAmount"
              isOpen={true}
            >
              <BoxContent>
                <Info type="info" title={displayValue(0, 'noDiv') + '₮'}>
                  {' '}
                </Info>
              </BoxContent>
            </Box>
            <Box
              title="Номинал дансан дахь мөнгө"
              name="nominalAmount"
              isOpen={true}
            >
              <BoxContent>
                <Info
                  type="info"
                  title={
                    displayValue(
                      nominalWallet?.walletBalance.availableBalance,
                      'noDiv'
                    ) + '₮'
                  }
                >
                  {' '}
                </Info>
              </BoxContent>
            </Box>
            <Box
              title="Клиринг банкин дахь мөнгө"
              name="msccAmount"
              isOpen={true}
            >
              <BoxContent>
                <Info type="info" title={displayValue(0, 'noDiv') + '₮'}>
                  {' '}
                </Info>
              </BoxContent>
            </Box>
          </BoxContent>
        </BoxContentContainer>
        <ChartContentContainer>
          <h3>Данс нээлгэсэн харилцагч </h3>
          <Chart
            chartType="userCountByYear"
            data={userCountByYearData}
            colors={COLORS}
          />
        </ChartContentContainer>
      </>
    );
  };
  render() {
    const { queryParams, history } = this.props;
    const breadcrumb = [
      { title: __('Trading dashboard'), link: '/trading/home' }
    ];
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Trading dashboard')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={1}
            emptyText="There is no data."
            emptyImage="/images/actions/20.svg"
          />
        }
        transparent={true}
        hasBorder
      />
    );
  }
}
export default Index;
