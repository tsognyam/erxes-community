import EmptyState from '@erxes/ui/src/components/EmptyState';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Sidebar from '../../containers/Sidebar';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { __, Alert } from '@erxes/ui/src/utils';
import { BOND } from '../../constants';
import RightMenu from '../../components/RightMenu';
import Table from '@erxes/ui/src/components/Table';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import Row from './BondDetailRow';
import { BOND_DETAIL_ROW, BOND_DETAIL_LIST } from '../../constants';

type Props = {
  // bond: IUser;
  queryParams: any;
  history: any;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
};

function BondDetail({
  // bond,
  queryParams,
  onSearch,
  onSelect,
  clearFilter
}: // excludeUserSkill,
// renderSkillForm,
// renderEditForm
Props) {
  // const { details = {} } = BOND;
  const renderContent = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>№</th>
            {(BOND_DETAIL_LIST || []).map(({ name, label }) => (
              <th key={name}>
                <SortHandler sortField={name} label={__(label)} />
              </th>
            ))}
            <th>{__('Status')}</th>
          </tr>
        </thead>
        <tbody id="bonds">
          {(BOND_DETAIL_ROW || []).map((bond, index) => (
            <Row index={index} bond={bond} history={history} />
          ))}
        </tbody>
      </Table>
    );
  };

  const renderFilter = () => {
    // const { queryParams, history, onSearch, onSelect, clearFilter } = this.props;

    const rightMenuProps = {
      queryParams,
      history,
      onSearch,
      onSelect,
      clearFilter
    };

    return <RightMenu {...rightMenuProps} />;
  };

  const title = BOND.bondName || 'Unknown';
  const breadcrumb = [{ title: 'Bond List', link: '/bond-list' }, { title }];

  if (!BOND.bondId) {
    return (
      <EmptyState
        image="/images/actions/11.svg"
        text="User not found"
        size="small"
      />
    );
  }

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('List')}
          breadcrumb={breadcrumb}
          queryParams={queryParams}
        />
      }
      actionBar={<Wrapper.ActionBar right={renderFilter()} />}
      leftSidebar={<Sidebar queryParams={queryParams} />}
      content={
        <DataWithLoader
          data={renderContent()}
          loading={false}
          count={90}
          emptyText="There is no registered bond."
          emptyImage="/images/actions/20.svg"
        />
      }
      footer={<Pagination count={90} />}
      hasBorder
    />
  );
}

export default BondDetail;
