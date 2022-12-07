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
import { BANKS } from '../constants';
import { IRouterProps } from '@erxes/ui/src/types';
import { withRouter } from 'react-router-dom';

type Props = {
  banks?;
  counts?;
  loading?;
  history?: any;
};

type FinalProps = Props & IRouterProps;

class Banks extends React.Component<FinalProps> {
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
        {BANKS.map(item => {
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
                <SidebarCounter>3</SidebarCounter>
              </a>
            </li>
          );
        })}
      </SidebarList>
    );
  }

  render() {
    // const { BANKS, loading } = this.props;

    return (
      <Box
        title={__('Filter by bank')}
        collapsible={BANKS.length > 7}
        isOpen={true}
        name="showFilterByBank"
      >
        <DataWithLoader
          data={this.renderData()}
          loading={false}
          count={BANKS.length}
          emptyText="Empty"
          emptyIcon="leaf"
          size="small"
          objective={true}
        />
      </Box>
    );
  }
}

export default withRouter<FinalProps>(Banks);
