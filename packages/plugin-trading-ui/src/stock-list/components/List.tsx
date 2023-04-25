import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_LIST } from '../../constants';
import Row from './Row';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Button from '@erxes/ui/src/components/Button';
import Form from './Form';
import RightMenu from './RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
type Props = {
  queryParams: any;
  history: any;
  tradingStocks: any[];
  total: number;
  count: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
};

class ListComp extends React.Component<Props> {
  renderContent = () => {
    const { tradingStocks, renderButton, queryParams } = this.props;
    let paginationParams = generatePaginationParams(queryParams);
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Index')}</th>
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
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(tradingStocks || []).map((stock, index) => (
            <Row
              renderButton={renderButton}
              index={
                index + (paginationParams.page - 1) * paginationParams.perPage
              }
              stock={stock}
            />
          ))}
        </tbody>
      </Table>
    );
  };
  renderFilter() {
    const {
      queryParams,
      onSearch,
      onSelect,
      clearFilter,
      tradingStocks
    } = this.props;

    const rightMenuProps = {
      queryParams,
      onSearch,
      onSelect,
      clearFilter,
      tradingStocks
    };

    return <RightMenu {...rightMenuProps} />;
  }
  renderActionBar() {
    // const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    // console.log("fe123fefefefe", this.CountDownTimer(1,35,6))
    const actionBarRight = (
      <Flex>
        <ModalTrigger
          title="Add stock"
          size={'lg'}
          trigger={
            <Button id="add-stock" btnStyle="success" icon="plus-circle">
              {__('Add Stock')}
            </Button>
          }
          content={this.renderForm}
        />
        {this.renderFilter()}
      </Flex>
    );

    return <Wrapper.ActionBar right={actionBarRight} wideSpacing />;
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  render() {
    const { queryParams, total, count } = this.props;
    const breadcrumb = [
      { title: __('Dashboard'), link: '/trading/home' },
      { title: __('Stock List'), link: '/trading/stock-list' }
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
            count={total}
            emptyText="There is no stock list."
            emptyImage="/images/actions/20.svg"
          />
        }
        actionBar={this.renderActionBar()}
        footer={<Pagination count={total} />}
        hasBorder
      />
    );
  }
}

export default ListComp;
