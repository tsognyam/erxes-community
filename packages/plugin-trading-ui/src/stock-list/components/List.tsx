import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_LIST } from '../../constants';
import Row from './Row';

type Props = {
  queryParams: any;
  history: any;
};

class ListComp extends React.Component<Props> {
  renderContent = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Symbol')}</th>
            <th>{__('Yesterdays Last Price')}</th>
            <th>{__('Starting Price')}</th>
            <th>{__('Peak')}</th>
            <th>{__('Bottom')}</th>
            <th>{__('Change')}</th>
            <th>{__('Change')}</th>
            <th>{__('Quantity')}</th>
            <th>{__('Bullish')}</th>
            <th>{__('Bearish')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(STOCK_LIST || []).map((stock, index) => (
            <Row index={index} stock={stock} />
          ))}
        </tbody>
      </Table>
    );
  };

  render() {
    const { queryParams } = this.props;
    const breadcrumb = [
      { title: __('Stock List'), link: '/tradings/stock-list' }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('List')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no order."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={<Pagination count={90} />}
        noPadding
        hasBorder
      />
    );
  }
}

export default ListComp;
