import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import HeaderDescription from '@erxes/ui/src/components/HeaderDescription';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert, router } from '@erxes/ui/src/utils';
import { colors } from '@erxes/ui/src/styles';
import {
  Box,
  CollapseContent,
  Table,
  Pagination,
  Info,
  Icon
} from '@erxes/ui/src/components';
import _ from 'lodash';
import {
  BoxContent,
  BoxContentContainer,
  ChartContentContainer,
  Widget,
  WidgetItem,
  Widgets,
  WidgetContainer
} from '../../styles';
import Chart from './Chart';
import { displayValue } from '../../App';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import {
  FilterItem,
  FilterWrapper
} from '@erxes/ui-settings/src/permissions/styles';
import dayjs from 'dayjs';
import Button from '@erxes/ui/src/components/Button';
type Props = {
  history?: any;
  queryParams: any;
};
type State = {
  startYear?: string;
  endYear: string;
  years: [];
};
const COLORS = [
  '#004c6d',
  '#346888',
  '#004c6d',
  '#004c6d',
  '#004c6d',
  '#004c6d'
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
type FinalProps = {
  tradingNominalWalletQuery: any;
  tradingNominalStockBalanceQuery: any;
  tradingUsersTotalCountQuery: any;
  tradingUsersCountByYearQuery: any;
} & Props &
  IRouterProps;
class Index extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);
    const qp = props.queryParams || {
      startYear: '',
      endYear: ''
    };
    this.state = {
      startYear: qp.startYear,
      endYear: qp.endYear,
      years: this.generateYears(qp.startYear, qp.endYear)
    };
  }
  generateYears(start, end) {
    let years: any = [];
    if (start != '' || end != '') {
      const diff = parseInt(end) - parseInt(start);
      if (diff >= 0) {
        for (let i = 0; i <= diff; i++) {
          years.push(parseInt(start) + i);
        }
      }
    }
    this.setState({
      years: years
    });
    return years;
  }
  onDateChange(type: string, date) {
    const filter = { ...this.state };
    if (date) {
      filter[type] = dayjs(date).format('YYYY');
    } else {
      filter.startYear = '';
      filter.endYear = '';
    }
    this.setState(filter);
  }
  onClick = () => {
    const { history, tradingUsersCountByYearQuery } = this.props;
    const { startYear, endYear } = this.state;
    this.generateYears(startYear, endYear);
    router.setParams(history, {
      startYear,
      endYear
    });
  };
  renderDateFilter = (name: string) => {
    return (
      <FilterItem>
        <DateControl
          value={this.state[name]}
          required={false}
          name={name}
          onChange={date => this.onDateChange(name, date)}
          placeholder={'Choose ' + name}
          dateFormat={'YYYY'}
        />
      </FilterItem>
    );
  };
  renderFilter() {
    return (
      <FilterWrapper style={{ padding: '10px 0px' }}>
        <strong>{__('Filters')}:</strong>
        {this.renderDateFilter('startYear')}
        {this.renderDateFilter('endYear')}
        <Button
          btnStyle="primary"
          icon="filter-1"
          onClick={this.onClick}
          size="small"
        >
          {__('Filter')}
        </Button>
      </FilterWrapper>
    );
  }
  onClickWidget = (e: any, type: number) => {
    const { history } = this.props;
    if (type == 1) history.push('/trading/wallet-list');
  };
  renderContent = () => {
    const {
      tradingNominalWalletQuery,
      tradingNominalStockBalanceQuery,
      tradingUsersTotalCountQuery,
      tradingUsersCountByYearQuery
    } = this.props;
    const nominalWallet = tradingNominalWalletQuery?.tradingNominalWallet || [];
    const stockByAmountData =
      tradingNominalStockBalanceQuery?.tradingNominalStockBalancesWithAmount ||
      [];
    const totalUsersCount =
      tradingUsersTotalCountQuery?.tradingUsersTotalCount || 0;
    const userCountByYearData =
      tradingUsersCountByYearQuery?.tradingUsersCountByYear || [];
    return (
      <>
        <WidgetContainer>
          <Widgets>
            <Widget onClick={e => this.onClickWidget(e, 1)}>
              <WidgetItem>
                <Icon
                  icon="users-alt"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Нийт харилцагч</span>
                <span className="counter">{totalUsersCount}</span>
              </WidgetItem>
            </Widget>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Нийт хөрөнгө</span>
                <span className="counter">
                  {' '}
                  {displayValue(0, 'noDiv') + '₮'}
                </span>
              </WidgetItem>
            </Widget>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Ногдол ашиг</span>
                <span className="counter">
                  {displayValue(0, 'noDiv') + '₮'}
                </span>
              </WidgetItem>
            </Widget>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Нийт татвар</span>
                <span className="counter">
                  {displayValue(0, 'noDiv') + '₮'}
                </span>
              </WidgetItem>
            </Widget>
          </Widgets>
        </WidgetContainer>
        <WidgetContainer>
          <Widgets>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Дотоод номинал данс</span>
                <span className="counter">
                  {displayValue(
                    nominalWallet?.walletBalance.availableBalance,
                    'noDiv'
                  ) + '₮'}
                </span>
              </WidgetItem>
            </Widget>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Гадаад номинал данс</span>
                <span className="counter">
                  {displayValue(0, 'noDiv') + '$'}
                </span>
              </WidgetItem>
            </Widget>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">ҮЦТХТ данс</span>
                <span className="counter">
                  {displayValue(0, 'noDiv') + '₮'}
                </span>
              </WidgetItem>
            </Widget>
            <Widget>
              <WidgetItem>
                <Icon
                  icon="money-bill"
                  style={{ fontSize: '60px' }}
                  color={colors.colorCoreBlue}
                />
              </WidgetItem>
              <WidgetItem>
                <span className="title">Клиринг данс</span>
                <span className="counter">
                  {displayValue(0, 'noDiv') + '₮'}
                </span>
              </WidgetItem>
            </Widget>
          </Widgets>
        </WidgetContainer>
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
              title="Дотоод арилжааны үнэт цаас"
              name="stockByPercentage"
              isOpen={true}
            >
              <Chart
                chartType="stockByPercentage"
                data={stockByAmountData}
                colors={PIE_COLORS}
                years={this.state.years}
              />
            </Box>
          </BoxContent>
        </BoxContentContainer>
        <ChartContentContainer>
          <h3>Данс нээлгэсэн харилцагч </h3>
          {this.renderFilter()}
          <Chart
            chartType="userCountByYear"
            data={userCountByYearData}
            colors={COLORS}
            years={this.state.years}
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
