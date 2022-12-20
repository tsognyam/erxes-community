import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from 'coreui/utils';
import {
  SEC_STATUS,
  STATUS_COUNTS,
  TYPE,
  STOCK,
  ORDER_TYPE
} from '../../constants';
import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {
  stockCounts?: any;
  statusCounts?: any;
  typeCounts?: any;
  history?: any;
  queryParams: any;
};

type FinalProps = Props & IRouterProps;

class Sidebar extends React.Component<FinalProps> {
  renderStockFilter() {
    // const { stockCounts, history } = this.props;
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
                {/* <SidebarCounter>{IPO_COUNTS[item.value]}</SidebarCounter> */}
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by Stock')}
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

  renderStatusFilter() {
    // const { statusCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {SEC_STATUS.map(item => {
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
        collapsible={SEC_STATUS.length > 5}
        name="showFilterByStatus"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={SEC_STATUS.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderTypeFilter() {
    // const { typeCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { type: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'type') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                {/* <SidebarCounter>{typeCounts[item.value]}</SidebarCounter> */}
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by type')}
        collapsible={TYPE.length > 5}
        name="showFilterByProvision"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={TYPE.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderOrderTypeFilter() {
    // const { typeCounts, history } = this.props;
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
                {/* <SidebarCounter>{typeCounts[item.value]}</SidebarCounter> */}
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by order type')}
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

  render() {
    return (
      <Wrapper.Sidebar noMargin={true} hasBorder={true}>
        {this.renderStockFilter()}
        {this.renderStatusFilter()}
        {this.renderTypeFilter()}
        {this.renderOrderTypeFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
