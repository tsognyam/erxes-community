import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import Form from './Form';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Sidebar from '../containers/Sidebar';
import RightMenu from '../components/RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IOrder, IOrderList } from '../../types/orderTypes';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: IOrder[], containerId: string) => void;
  orders: IOrder[]; //buh order
  prefix: any[];
  stocks: any[];
  total: number;
  count: number;
  isAllSelected: boolean;
  bulk: any[];
  // emptyBulk: () => void;
  // remove: (tradeId: string) => void;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
  onCancelOrder: () => void;
}

class List extends React.Component<IProps> {
  renderForm = props => {
    return (
      <Form
        {...props}
        renderButton={this.props.renderButton}
        prefix={this.props.prefix}
        stocks={this.props.stocks}
      />
    );
  };

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
      renderButton,
      orders,
      total,
      count
    } = this.props;
    const onChangeAll = () => {
      toggleAll(orders, 'orders');
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
            <th>Регистр</th>
            <th>Журналын дугаар</th>
            <th>Гүйлгээний дүн</th>
            <th>
              <SortHandler sortField={'stockcode'} label={__('Төрөл')} />
            </th>
            <th>
              <SortHandler sortField={'order.txntype'} label={__('Огноо')} />
            </th>
            <th>
              <SortHandler
                sortField={'ordertype'}
                label={__('Харьцсан данс')}
              />
            </th>
            <th>
              <SortHandler sortField={'price'} label={__('Гүйлгээний утга')} />
            </th>
            <th>
              <SortHandler sortField={'cnt'} label={__('Жинхэнэ данс')} />
            </th>
            <th>
              <SortHandler
                sortField={'donecnt'}
                label={__('Данс эзэмшигчийн нэр')}
              />
            </th>
            <th>
              {/* <SortHandler sortField={'donecnt'} label={__('Үлдсэн')} /> */}
              {__('Үүсгэсэн огноо')}
            </th>
            <th>
              <SortHandler
                sortField={'status'}
                label={__('Номинал дансны дугаар')}
              />
            </th>
          </tr>
        </thead>
        <tbody id="statements">
          {(orders || []).map((order, index) => (
            <Row
              index={index}
              order={order}
              totalCount={total}
              isChecked={bulk.includes(order)}
              toggleBulk={toggleBulk}
              renderButton={renderButton}
            />
          ))}
        </tbody>
      </Table>
    );
  };

  renderFilter() {
    const { queryParams, onSearch, onSelect, clearFilter } = this.props;

    const rightMenuProps = {
      queryParams,
      onSearch,
      onSelect,
      clearFilter
    };

    return <RightMenu {...rightMenuProps} />;
  }

  // removeOrders = orders => {
  //   const orderIds: string[] = [];

  //   orders.forEach(order => {
  //     orderIds.push(order._id);
  //   });

  //   const { removeOrders, emptyBulk } = this.props;

  //   removeOrders({ orderIds }, emptyBulk);
  // };

  render() {
    const { queryParams, bulk, orders, total, count } = this.props;
    const breadcrumb = [
      { title: __('Дотоод арилжаа'), link: '/trading/order-list' }
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
            right={
              <Flex>
                <ModalTrigger
                  title="Place an order"
                  size={'lg'}
                  trigger={
                    <Button
                      id={'NewOrderButton'}
                      btnStyle="success"
                      block={true}
                      icon="plus-circle"
                    >
                      Add Order
                    </Button>
                  }
                  content={this.renderForm}
                />
                {this.renderFilter()}
              </Flex>
            }
          />
        }
        leftSidebar={<Sidebar queryParams={queryParams} />}
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={total}
            emptyText="There is no order."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={<Pagination count={total} />}
        hasBorder
      />
    );
  }
}

export default List;
