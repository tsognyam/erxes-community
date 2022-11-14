import { __, router } from '@erxes/ui/src/utils/core';
import {
  FieldStyle,
  SidebarCounter,
  SidebarList
} from '@erxes/ui/src/layout/styles';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import React from 'react';
import { STATEMENT_TYPE, TYPE_ARRAY } from '../../constants';
import Box from '@erxes/ui/src/components/Box';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IRouterProps } from '@erxes/ui/src/types';

type Props = {
  history?: any;
  queryParams: any;
  statementType: (obj: any) => void;
};

type FinalProps = Props & IRouterProps;

class SideBar extends React.Component<FinalProps> {
  renderStatementTypeFilter() {
    const { history, statementType, queryParams } = this.props;

    const data = (
      <SidebarList>
        {STATEMENT_TYPE.map(item => {
          const onClick = () => {
            router.setParams(history, { statementType: item.value });
            router.removeParams(history, 'page');
            statementType(item.data);
          };

          return (
            <li key={item.value}>
              <a
                href="#filter"
                tabIndex={0}
                className={
                  queryParams.statementType === item.value ? 'active' : ''
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
        title={__('Filter by Statement Type')}
        collapsible={STATEMENT_TYPE.length > 5}
        name="showFilterByStatementType"
      >
        <DataWithLoader
          data={data}
          loading={false}
          count={STATEMENT_TYPE.length}
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
                <SidebarCounter>9</SidebarCounter>
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

  render() {
    return (
      <Wrapper.Sidebar hasBorder={true}>
        {this.renderStatementTypeFilter()}
        {this.renderTypeFilter()}
      </Wrapper.Sidebar>
    );
  }
}

export default SideBar;
