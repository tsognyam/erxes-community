import React from 'react';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __, router } from '@erxes/ui/src/utils';
import { TYPE, IPO_COUNTS } from '../constants';
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
  renderTypeFilter() {
    // const { ipoCounts, history } = this.props;
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
                <SidebarCounter>{IPO_COUNTS[item.value]}</SidebarCounter>
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

  rendeBondFilter() {
    // const { statusCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {TYPE.map(item => {
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
        title={__('Filter by bond')}
        collapsible={TYPE.length > 5}
        name="showFilterByBond"
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

  renderCuponFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { cupon: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'cupon') === item.value
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
        title={__('Filter by cupon')}
        collapsible={TYPE.length > 5}
        name="showFilterByCupon"
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

  renderPaymentFilter() {
    // const { provisionCounts, history } = this.props;
    const { history } = this.props;

    const data = (
      <SidebarList>
        {TYPE.map(item => {
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
        collapsible={TYPE.length > 5}
        name="showFilterByMainPayment"
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

  render() {
    return (
      <Wrapper.Sidebar hasBorder={true}>
        {this.renderTypeFilter()}
        {this.rendeBondFilter()}
        {this.renderCuponFilter()}
        {this.renderPaymentFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default withRouter<FinalProps>(Sidebar);
