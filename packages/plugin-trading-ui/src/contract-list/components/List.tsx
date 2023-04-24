import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
// import RightMenu from './RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IOrder, IOrderList } from '../../types/orderTypes';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';
import { ControlLabel } from '@erxes/ui/src';
import Forms from './Form';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  toggleAll: (targets: any[], containerId: string) => void;
  list: any[]; //list
  total: number;
  count: number;
  isAllSelected: boolean;
  bulk: any[];
  // emptyBulk: () => void;
  // remove: (tradeId: string) => void;
  // clearFilter: () => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
  onSave: (file?: any) => void;
  file?: any;
  isLoading: boolean;
  message?: any;
}
class List extends React.Component<IProps> {
  // remove = (order) => {
  //   const { remove } = this.props;

  //   remove(order._id);
  // };

  renderContent = () => {
    const {
      toggleAll,
      isAllSelected,
      bulk,
      toggleBulk,
      list,
      total,
      count
    } = this.props;
    const onChangeAll = () => {
      toggleAll(list, 'orders');
    };
    return (
      <Table>
        <thead>
          <tr>
            <th>
              <FormControl
                checked={isAllSelected}
                componentClass="checkbox"
                onChange={onChangeAll}
              />
            </th>
            <th>№</th>
            <th>TradeId</th>
            <th>ExternalId</th>
            <th>SecurityId</th>
            <th>
              <SortHandler sortField={'Buy/Sell'} label={__('Buy/Sell')} />
            </th>
            <th>
              <SortHandler sortField={'Price'} label={__('Price')} />
            </th>
            <th>
              <SortHandler sortField={'Size'} label={__('Size')} />
            </th>
            <th>
              <SortHandler sortField={'TradeValue'} label={__('TradeValue')} />
            </th>
            <th>
              <SortHandler
                sortField={'AccruedValue'}
                label={__('AccruedValue')}
              />
            </th>
            <th>
              <SortHandler sortField={'TotalValue'} label={__('TotalValue')} />
            </th>
            <th>
              <SortHandler sortField={'TradeDate'} label={__('TradeDate')} />
            </th>
            <th>
              <SortHandler
                sortField={'DownloadDate'}
                label={__('DownloadDate')}
              />
            </th>
            <th>
              <SortHandler
                sortField={'SettlementDate'}
                label={__('SettlementDate')}
              />
            </th>
            <th>
              <SortHandler
                sortField={'CreatedDate'}
                label={__('CreatedDate')}
              />
            </th>

            <th>{__('')}</th>
          </tr>
        </thead>
        <tbody id="contract-list">
          {(list || []).map((data, index) => (
            <Row
              index={index}
              row={data}
              // totalCount={total}
              isChecked={bulk.includes(data)}
              toggleBulk={toggleBulk}
            />
          ))}
        </tbody>
      </Table>
    );
  };

  // removeOrders = orders => {
  //   const orderIds: string[] = [];

  //   orders.forEach(order => {
  //     orderIds.push(order._id);
  //   });

  //   const { removeOrders, emptyBulk } = this.props;

  //   removeOrders({ orderIds }, emptyBulk);
  // };
  renderActionBar() {
    // const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    // console.log("fe123fefefefe", this.CountDownTimer(1,35,6))
    const actionBarRight = (
      <Flex>
        <ModalTrigger
          title="Upload Contract Note"
          size={'lg'}
          trigger={
            <Button id="add-contract" btnStyle="success" icon="plus-circle">
              {__('Upload Contract Note')}
            </Button>
          }
          content={this.renderForm}
        />
        {/* {this.renderFilter()} */}
      </Flex>
    );

    return <Wrapper.ActionBar right={actionBarRight} wideSpacing />;
  }
  renderForm = props => {
    return (
      <Forms
        {...props}
        onSave={this.props.onSave}
        message={this.props.message}
        isLoading={this.props.isLoading}
      />
    );
  };
  render() {
    const { queryParams, bulk, list, total, count } = this.props;
    const breadcrumb = [
      { title: __('Contract Note list'), link: '/trading/contract-list' }
    ];
    let actionBarLeft: React.ReactNode;

    if (bulk.length > 0) {
      const onClick = () => confirm('Are you sure? This cannot be undone.');
      // .then(() => {
      //     this.removeOrders(bulk);
      //   })
      //   .catch(e => {
      //     Alert.error(e.message);
      //   });

      actionBarLeft = (
        <Button
          btnStyle="danger"
          size="small"
          icon="times-circle"
          onClick={onClick}
        >
          Remove
        </Button>
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
        actionBar={
          <Wrapper.ActionBar
            left={actionBarLeft}
            right={this.renderActionBar()}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={total}
            emptyText="There is no data."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={
          <Wrapper.ActionBar
            left={<Pagination count={total} />}
            right={
              <ControlLabel>
                {__('Total:')}
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

export default List;
