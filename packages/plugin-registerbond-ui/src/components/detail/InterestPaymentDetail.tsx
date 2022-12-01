import EmptyState from '@erxes/ui/src/components/EmptyState';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Sidebar from './Sidebar';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { __, Alert } from '@erxes/ui/src/utils';
import { INTEREST_PAYMENT } from '../../constants';
import Table from '@erxes/ui/src/components/Table';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import Row from './InterestPaymentDetailRow';
import { INTEREST_PAYMENT_ROW, INTEREST_PAYMENT_LIST } from '../../constants';

type Props = {
  // bond: IUser;
  queryParams: any;
  history: any;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
};

function InterestPaymentDetail({
  // bond,
  queryParams,
  onSearch,
  onSelect,
  clearFilter
}: // excludeUserSkill,
// renderSkillForm,
// renderEditForm
Props) {
  // const { details = {} } = INTEREST_PAYMENT;
  const renderContent = () => {
    return (
      <Table>
        <thead>
          <tr>
            {(INTEREST_PAYMENT_LIST || []).map(({ name, label }) => (
              <th key={name}>
                <SortHandler sortField={name} label={__(label)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody id="bonds">
          {(INTEREST_PAYMENT_ROW || []).map((bond, index) => (
            <Row index={index} bond={bond} history={history} />
          ))}
        </tbody>
      </Table>
    );
  };

  const title = INTEREST_PAYMENT.interestPayment || 'Unknown';
  const breadcrumb = [{ title: 'Bond List', link: '/bond-list' }, { title }];

  if (!INTEREST_PAYMENT.interestPayment) {
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
      leftSidebar={<Sidebar queryParams={queryParams} onSelect={onSelect} />}
      content={
        <DataWithLoader
          data={renderContent()}
          loading={false}
          count={90}
          emptyText="There is no interest payment."
          emptyImage="/images/actions/20.svg"
        />
      }
      footer={<Pagination count={90} />}
      hasBorder
    />
  );
}

export default InterestPaymentDetail;
