import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import _ from 'lodash';
import {
  BoxContent,
  BoxContentContainer,
  ChartContentContainer
} from '../../styles';
import Chart from './Chart';
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
const stockByAmountData = [
  {
    symbol: 'LendMN',
    amount: 10000
  },
  {
    symbol: 'Other',
    amount: 9000
  },
  {
    symbol: '1',
    amount: 8000
  },
  {
    symbol: '2',
    amount: 7000
  },
  {
    symbol: '3',
    amount: 6000
  },
  {
    symbol: '4',
    amount: 5500
  },
  {
    symbol: 'UID',
    amount: 5000
  },
  {
    symbol: 'TUM',
    amount: 4500
  },
  {
    symbol: 'APU',
    amount: 220
  }
];
type FinalProps = Props & IRouterProps;
class Index extends React.Component<FinalProps> {
  renderContent = () => {
    return (
      <>
        <BoxContentContainer>
          <BoxContent>
            <h5>Дансан дахь үнэт цаас /мөнгөн дүнгээр/ </h5>
            <Chart
              chartType="stockByAmount"
              data={stockByAmountData}
              colors={COLORS}
            />
          </BoxContent>
          <BoxContent>
            <h5>Дансан дахь үнэт цаас /мөнгөн дүнд эзлэх хувь/ </h5>
            <Chart
              chartType="stockByPercentage"
              data={stockByAmountData}
              colors={PIE_COLORS}
            />
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
