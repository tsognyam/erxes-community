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
import ControlLabel from '@erxes/ui/src/components/form/Label';
type Props = {
  queryParams: any;
  history: any;
  tradingUserByPrefix: any[];
  total: number;
  count: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class ListComp extends React.Component<Props> {
  renderContent = () => {
    const { tradingUserByPrefix, history } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Index')}</th>
            <th>{__('Prefix')}</th>
            <th>{__('Bdc Account')}</th>
            <th>{__('Lastname')}</th>
            <th>{__('Firstname')}</th>
            <th>{__('Status')}</th>
            <th>{__('Description')}</th>
            <th>{__('Updated At')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(tradingUserByPrefix || []).map((wallet, index) => (
            <Row history={history} index={index} wallet={wallet} />
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
      { title: __('Wallet List'), link: '/tradings/wallet-list' }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Wallet list')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={total}
            emptyText="There is no wallet list."
            emptyImage="/images/actions/20.svg"
          />
        }
        // actionBar={this.renderActionBar()}
        footer={
          <Wrapper.ActionBar
            left={<Pagination count={total} />}
            right={
              <ControlLabel>
                {__('Total=')}
                {total}
              </ControlLabel>
            }
          />
        }
        hasBorder
      />
    );
  }
}

export default ListComp;
