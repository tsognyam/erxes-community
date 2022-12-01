import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from '@erxes/ui/src/utils';
import { INTEREST_PAYMENT_TYPE, IPO_COUNTS } from '../../constants';
import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { DateFilter } from '../../styles';
import dayjs from 'dayjs';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import DateControl from '@erxes/ui/src/components/form/DateControl';

type Props = {
  ipoCounts?: any;
  statusCounts?: any;
  provisionCounts?: any;
  history?: any;
  queryParams: any;
  onSelect: (values: string[] | string, key: string) => void;
};

type FinalProps = Props & IRouterProps;

class Sidebar extends React.Component<FinalProps> {
  onChangeRangeFilter = (kind: string, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';

    const { queryParams, onSelect } = this.props;

    if (queryParams[kind] !== formattedDate) {
      onSelect(formattedDate, kind);
    }
  };

  renderDateFilter() {
    const { queryParams } = this.props;

    return (
      <Box title={__('Filter by date')} name="showFilterByDate">
        <DateFilter>
          <div>
            <ControlLabel>{__('Start date')}:</ControlLabel>
            <DateControl
              value={queryParams.startDate}
              required={false}
              name="startDate"
              onChange={date => this.onChangeRangeFilter('startDate', date)}
              placeholder={'Start date'}
              dateFormat={'YYYY-MM-DD'}
            />
          </div>
          <div>
            <ControlLabel>{__('End date')}:</ControlLabel>
            <DateControl
              value={queryParams.endDate}
              required={false}
              name="endDate"
              placeholder={'End date'}
              onChange={date => this.onChangeRangeFilter('endDate', date)}
              dateFormat={'YYYY-MM-DD'}
            />
          </div>
        </DateFilter>
      </Box>
    );
  }

  rendeInterestPaymentFilter() {
    // const { statusCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {INTEREST_PAYMENT_TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { interestPayment: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'interestPayment') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>{IPO_COUNTS[item.value]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by interest payment')}
        collapsible={INTEREST_PAYMENT_TYPE.length > 5}
        name="showFilterByBond"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={INTEREST_PAYMENT_TYPE.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderMainPaymentFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {INTEREST_PAYMENT_TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { mainPayment: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'mainPayment') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>{IPO_COUNTS[item.value]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by main payment')}
        collapsible={INTEREST_PAYMENT_TYPE.length > 5}
        name="showFilterByCupon"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={INTEREST_PAYMENT_TYPE.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  render() {
    return (
      <Wrapper.Sidebar hasBorder={true}>
        {this.renderDateFilter()}
        {this.rendeInterestPaymentFilter()}
        {this.renderMainPaymentFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
