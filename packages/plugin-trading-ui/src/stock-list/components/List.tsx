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

type Props = {
  queryParams: any;
  history: any;
  tradingStocks: any[];
  total: number;
  count: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
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
  renderActionBar(){
    // const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    // console.log("fefefefefe", this.CountDownTimer(1,35,6))
    const actionBarRight = (
      <>
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
      </>
    );

    return (
      <Wrapper.ActionBar right={actionBarRight} wideSpacing />
    );
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  render() {
    const { queryParams, total, count } = this.props;
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
