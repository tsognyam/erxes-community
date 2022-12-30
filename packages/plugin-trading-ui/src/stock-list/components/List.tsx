import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_LIST } from '../../constants';
import Row from './Row';

type Props = {
  queryParams: any;
  history: any;
  tradingStocks: any[];
};

class ListComp extends React.Component<Props> {
  renderContent = () => {
    const { tradingStocks } = this.props;
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Symbol')}</th>
            <th>{__('Stock code')}</th>
            <th>{__('Stock name')}</th>
            <th>{__('Inital')}</th>
            <th>{__('Stock type')}</th>
            <th>{__('Currency')}</th>
            <th>{__('Regdate')}</th>
            <th>{__('Exchange')}</th>
            <th>{__('Open price')}</th>
            <th>{__('Close price')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(tradingStocks || []).map((stock, index) => (
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
            emptyText="There is no stock list."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={<Pagination count={90} />}
        hasBorder
      />
    );
  }
}

export default ListComp;
