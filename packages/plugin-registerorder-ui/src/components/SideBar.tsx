import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from '@erxes/ui/src/utils';
import {
  IPO,
  STATUS,
  INTEREST_PAYMENT,
  MAIN_PAYMENT,
  IPO_COUNTS,
  STATUS_COUNTS
} from '../constants';
import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {
  ipoCounts?: any;
  statusCounts?: any;
  provisionCounts?: any;
  history?: any;
  queryParams: any;
};

type FinalProps = Props & IRouterProps;

class Sidebar extends React.Component<FinalProps> {
  renderBondFilter() {
    // const { ipoCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {IPO.map(item => {
          const onClick = () => {
            router.setParams(history, { bond: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'bond') === item.value
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
        title={__('Filter by Bond')}
        collapsible={IPO.length > 5}
        name="showFilterByBond"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={IPO.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderStatusFilter() {
    // const { statusCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {STATUS.map(item => {
          const onClick = () => {
            router.setParams(history, { status: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'status') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>{STATUS_COUNTS[item.value]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by status')}
        collapsible={STATUS.length > 5}
        name="showFilterByStatus"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={STATUS.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderInterestPaymentFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {INTEREST_PAYMENT.map(item => {
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
                <SidebarCounter>3</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by interest Payment')}
        collapsible={INTEREST_PAYMENT.length > 5}
        name="showFilterByInterestPayment"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={INTEREST_PAYMENT.length}
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
        {MAIN_PAYMENT.map(item => {
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
                <SidebarCounter>3</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by main Payment')}
        collapsible={MAIN_PAYMENT.length > 5}
        name="showFilterByMainPayment"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={MAIN_PAYMENT.length}
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
        {this.renderBondFilter()}
        {this.renderStatusFilter()}
        {this.renderInterestPaymentFilter()}
        {this.renderMainPaymentFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
