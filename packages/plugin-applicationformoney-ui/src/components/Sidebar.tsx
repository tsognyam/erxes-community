import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from '@erxes/ui/src/utils';
import {
  TYPE,
  STATUS,
  BANK,
  TYPE_COUNTS,
  STATUS_COUNTS,
  BANK_COUNTS
} from '../constants';
import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {
  typeCounts?: any;
  statusCounts?: any;
  bankCounts?: any;
  history?: any;
  queryParams: any;
  type: (obj: any) => void;
};

type FinalProps = Props & IRouterProps;

class Sidebar extends React.Component<FinalProps> {
  renderTypeFilter() {
    // const { typeCounts, history } = this.props;
    const { history, type } = this.props;

    const data = (
      <SidebarList>
        {TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { moneyType: item.value });
            router.removeParams(history, 'page');
            type(item.data);
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'moneyType') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>{TYPE_COUNTS[item.value]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by Type')}
        collapsible={TYPE.length > 5}
        name="showFilterByType"
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

  renderBankFilter() {
    // const { bankCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {BANK.map(item => {
          const onClick = () => {
            router.setParams(history, { bank: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'bank') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>{BANK_COUNTS[item.value]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by bank')}
        collapsible={BANK.length > 5}
        name="showFilterByBank"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={BANK.length}
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
        {this.renderTypeFilter()}
        {this.renderBankFilter()}
        {this.renderStatusFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
