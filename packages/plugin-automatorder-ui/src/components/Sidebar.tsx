import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from '@erxes/ui/src/utils';
import {
  FREQUENCY,
  STOCK,
  ORDER_TYPE,
  ORDER_DAY,
  ORDER_TIME,
  STATUS,
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
  renderFrequencyFilter() {
    // const { ipoCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {FREQUENCY.map(item => {
          const onClick = () => {
            router.setParams(history, { frequency: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'frequency') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>9</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by Frequency')}
        collapsible={FREQUENCY.length > 5}
        name="showFilterByFrequency"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={FREQUENCY.length}
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

  renderStockFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {STOCK.map(item => {
          const onClick = () => {
            router.setParams(history, { stock: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'stock') === item.value
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
        title={__('Filter by stock')}
        collapsible={STOCK.length > 5}
        name="showFilterByStock"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={STOCK.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }
  renderOrderTypeFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {ORDER_TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { orderType: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'orderType') === item.value
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
        title={__('Filter by order Type')}
        collapsible={ORDER_TYPE.length > 5}
        name="showFilterByOrderType"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={ORDER_TYPE.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }
  renderOrderDayFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {ORDER_DAY.map(item => {
          const onClick = () => {
            router.setParams(history, { orderDay: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'orderDay') === item.value
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
        title={__('Filter by order Day')}
        collapsible={ORDER_DAY.length > 5}
        name="showFilterByOrderDay"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={ORDER_DAY.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }
  renderOrderTimeFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {ORDER_TIME.map(item => {
          const onClick = () => {
            router.setParams(history, { orderTime: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'orderTime') === item.value
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
        title={__('Filter by order Time')}
        collapsible={ORDER_TIME.length > 5}
        name="showFilterByOrderTime"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={ORDER_TIME.length}
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
        {this.renderFrequencyFilter()}
        {this.renderStatusFilter()}
        {this.renderStockFilter()}
        {this.renderOrderTypeFilter()}
        {this.renderOrderDayFilter()}
        {this.renderOrderTimeFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
