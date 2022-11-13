import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from 'coreui/utils';
import { TRADING_TYPE, TYPE_COUNTS, TYPE_ARRAY, STOCK } from '../constants';
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
  tradingType: (obj: any) => void;
};

type FinalProps = Props & IRouterProps;

class Sidebar extends React.Component<FinalProps> {
  renderTradingTypeFilter() {
    const { history, tradingType } = this.props;

    const data = (
      <SidebarList>
        {TRADING_TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { tradingType: item.value });
            router.removeParams(history, 'page');
            tradingType(item.data);
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'tradingType') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by Trading Type')}
        collapsible={TRADING_TYPE.length > 5}
        name="showFilterByTradingType"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={TRADING_TYPE.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderTypeFilter() {
    const { history } = this.props;

    const data = (
      <SidebarList>
        {TYPE_ARRAY.map(item => {
          const onClick = () => {
            router.setParams(history, { type: item });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'type') === item ? 'active' : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item}</FieldStyle>
                <SidebarCounter>{TYPE_COUNTS[item]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by type')}
        collapsible={TYPE_ARRAY.length > 5}
        name="showFilterByType"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={TYPE_ARRAY.length}
          emptyText={'Empty'}
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }

  renderStockFilter() {
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

  render() {
    return (
      <Wrapper.Sidebar noMargin={true} hasBorder={true}>
        {this.renderTradingTypeFilter()}
        {this.renderTypeFilter()}
        {this.renderStockFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
