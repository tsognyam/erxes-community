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
import { SECONDARY_DATA } from '../../constants';
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
}

class List extends React.Component<IProps> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
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
            <th>Prefix</th>
            <th>Регистр</th>
            <th>Нэр</th>
            <th>
              <SortHandler sortField={'stockcode'} label={__('Хувьцаа')} />
            </th>
            <th>
              <SortHandler sortField={'order.txntype'} label={__('Төрөл')} />
            </th>
            <th>
              <SortHandler
                sortField={'ordertype'}
                label={__('Захиалгын төрөл')}
              />
            </th>
            <th>
              <SortHandler sortField={'price'} label={__('Үнэ')} />
            </th>
            <th>
              <SortHandler sortField={'cnt'} label={__('Тоо ширхэг')} />
            </th>
            <th>
              <SortHandler sortField={'donecnt'} label={__('Биелсэн')} />
            </th>
            <th>
              {/* <SortHandler sortField={'donecnt'} label={__('Үлдсэн')} /> */}
              {__('Үлдсэн')}
            </th>
            <th>
              <SortHandler sortField={'status'} label={__('Төлөв')} />
            </th>
            <th>
              <SortHandler sortField={'regdate'} label={__('Огноо')} />
            </th>
            <th>
              {/* <SortHandler sortField={''} label={__('Нийт')} /> */}
              {__('Нийт')}
            </th>
            <th>
              <SortHandler sortField={'fee'} label={__('Шимтгэл')} />
            </th>
            <th>
              <SortHandler sortField={'condid'} label={__('Хугацаа')} />
            </th>
            <th>
              <SortHandler
                sortField={'userId'}
                label={__('Оруулсан хэрэглэгч')}
              />
            </th>
            <th>{__('')}</th>
          </tr>
        </thead>
        <tbody id="orders">
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
