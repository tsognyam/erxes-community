import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from 'coreui/utils';
import {
  IPO,
  STATUS,
  PROVISION,
  IPO_COUNTS,
  STATUS_COUNTS,
  PROVISION_COUNTS
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
  renderIPOFilter() {
    // const { ipoCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {IPO.map(item => {
          const onClick = () => {
            router.setParams(history, { ipo: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'ipo') === item.value ? 'active' : ''
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
        title={__('Filter by IPO')}
        collapsible={IPO.length > 5}
        name="showFilterByIPO"
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

  renderProvisionFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {PROVISION.map(item => {
          const onClick = () => {
            router.setParams(history, { provision: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'provision') === item.value
                    ? 'active'
                    : ''
                }
                onClick={onClick}
              >
                <FieldStyle>{item.label}</FieldStyle>
                <SidebarCounter>{PROVISION_COUNTS[item.value]}</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );

    return (
      <Box
        title={__('Filter by provision')}
        collapsible={PROVISION.length > 5}
        name="showFilterByProvision"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={PROVISION.length}
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
        {this.renderIPOFilter()}
        {this.renderStatusFilter()}
        {this.renderProvisionFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
