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
  tradingWallets: any[];
  total: number;
  count: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class ListComp extends React.Component<Props> {
  renderContent = () => {
    const { tradingWallets } = this.props;
    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Index')}</th>
            <th>{__('Prefix')}</th>
            <th>{__('Bdc Account')}</th>
            <th>{__('Lastname')}</th>
            <th>{__('Firstname')}</th>
            <th>{__('Currency')}</th>
            <th>{__('Balance')}</th>
            <th>{__('Hold balance')}</th>
            <th>{__('Trade Balance')}</th>
            <th>{__('Status')}</th>
            <th>{__('Description')}</th>
            <th>{__('Updated At')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(tradingWallets || []).map((wallet, index) => (
            <Row index={index} wallet={wallet} />
          ))}
        </tbody>
      </Table>
    );
  };
  renderActionBar() {
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

    return <Wrapper.ActionBar right={actionBarRight} wideSpacing />;
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  render() {
    const { queryParams, total, count } = this.props;
    const breadcrumb = [
      { title: __('Wallet List'), link: '/tradings/stock-list' }
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
        // actionBar={this.renderActionBar()}
        footer={<Pagination count={total} />}
        hasBorder
      />
    );
  }
}

export default ListComp;
