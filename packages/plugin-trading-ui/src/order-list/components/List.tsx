import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import Form from './Form';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Sidebar from '../containers/Sidebar';
import RightMenu from '../components/RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import { SECONDARY_DATA } from '../../constants';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IOrder } from '../../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: IOrder[], containerId: string) => void;
  orders?: IOrder[]; //buh order
  isAllSelected: boolean;
  bulk: any[];
  // emptyBulk: () => void;
  // remove: (tradeId: string) => void;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
}

class ListComp extends React.Component<IProps> {
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
      orders,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton
    } = this.props;

    const onChangeAll = () => {
      toggleAll(SECONDARY_DATA, 'orders');
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
            <th>
              <SortHandler sortField={'order.prefix'} label={__('Prefix')} />
            </th>
            <th>
              <SortHandler
                sortField={'order.register'}
                label={__('Register Number')}
              />
            </th>
            <th>
              <SortHandler sortField={'order.name'} label={__('Name')} />
            </th>
            <th>
              <SortHandler sortField={'order.stock'} label={__('Stock')} />
            </th>
            <th>{__('Type')}</th>
            <th>
              <SortHandler
                sortField={'order.orderType'}
                label={__('Order Type')}
              />
            </th>
            <th>
              <SortHandler sortField={'order.price'} label={__('Price')} />
            </th>
            <th>
              <SortHandler
                sortField={'order.quantity'}
                label={__('Quantity')}
              />
            </th>
            <th>
              <SortHandler
                sortField={'order.successful'}
                label={__('Successful')}
              />
            </th>
            <th>
              <SortHandler sortField={'order.left'} label={__('Left')} />
            </th>
            <th>{__('Status')}</th>
            <th>
              <SortHandler
                sortField={'order.createdDate'}
                label={__('Created Date')}
              />
            </th>
            <th>
              <SortHandler sortField={'order.total'} label={__('Total')} />
            </th>
            <th>
              <SortHandler
                sortField={'order.commission'}
                label={__('Commission')}
              />
            </th>
            <th>{__('Time Frame')}</th>
            <th>
              <SortHandler
                sortField={'order.createdUser'}
                label={__('Created User')}
              />
            </th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(SECONDARY_DATA || []).map((order, index) => (
            <Row
              index={index}
              order={order}
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
    const { queryParams, bulk } = this.props;
    const breadcrumb = [
      { title: __('Order List'), link: '/tradings/order-list' }
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
                  title="Primary merket order"
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
            count={90}
            emptyText="There is no order."
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
