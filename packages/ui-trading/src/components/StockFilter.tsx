import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';

import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { router } from '@erxes/ui/src/utils';
import { STOCK, STOCK_TYPE } from '../constants';
import { IRouterProps } from '@erxes/ui/src/types';
import { withRouter } from 'react-router-dom';

type Props = {
  banks?;
  counts?;
  loading?;
  history?: any;
};

type FinalProps = Props & IRouterProps;

class Stock extends React.Component<FinalProps> {
  setSegment = segment => {
    router.setParams(history, { segment });
    router.removeParams(history, 'page');
  };

  onSegmentClick(segmentId) {
    this.setSegment(segmentId);
  }

  renderData() {
    const { history } = this.props;

    return (
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
  }

  renderTypeData() {
    const { history } = this.props;

    return (
      <SidebarList>
        {STOCK_TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { stockType: item.value });
            router.removeParams(history, 'page');
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  router.getParam(history, 'stockType') === item.value
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
  }

  render() {
    return (
      <>
        <Box
          title={__('Filter by stock')}
          collapsible={STOCK.length > 7}
          isOpen={true}
          name="showFilterByStock"
        >
          <DataWithLoader
            data={this.renderData()}
            loading={false}
            count={STOCK.length}
            emptyText="Empty"
            emptyIcon="leaf"
            size="small"
            objective={true}
          />
        </Box>
        <Box
          title={__('Filter by stock type')}
          collapsible={STOCK_TYPE.length > 7}
          isOpen={true}
          name="showFilterByStockType"
        >
          <DataWithLoader
            data={this.renderTypeData()}
            loading={false}
            count={STOCK_TYPE.length}
            emptyText="Empty"
            emptyIcon="leaf"
            size="small"
            objective={true}
          />
        </Box>
      </>
    );
  }
}

export default withRouter<FinalProps>(Stock);
