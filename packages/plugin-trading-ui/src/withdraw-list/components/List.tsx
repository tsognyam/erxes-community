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
import RightMenu from './RightMenu';
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
  list: IOrder[]; //list
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
  onCancel: () => void;
  onConfirm: () => void;
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
      onCancel,
      onConfirm,
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
            <th>Prefix</th>
            <th>LastName</th>
            <th>FirstName</th>
            <th>
              <SortHandler sortField={'Type'} label={__('Type')} />
            </th>
            <th>
              <SortHandler sortField={'Amount'} label={__('Amount')} />
            </th>
            <th>
              <SortHandler sortField={'FeeAmount'} label={__('Fee amount')} />
            </th>
            <th>
              <SortHandler
                sortField={'Description'}
                label={__('Description')}
              />
            </th>
            <th>
              <SortHandler sortField={'Status'} label={__('Status')} />
            </th>
            <th>
              <SortHandler sortField={'CreatedAt'} label={__('Created date')} />
            </th>
            <th>
              <SortHandler
                sortField={'CreatedUser'}
                label={__('Created user')}
              />
            </th>

            <th>{__('')}</th>
          </tr>
        </thead>
        <tbody id="withdraws">
          {(list || []).map((withdraw, index) => (
            <Row
              index={index}
              withdraw={withdraw}
              // totalCount={total}
              isChecked={bulk.includes(withdraw)}
              toggleBulk={toggleBulk}
              renderButton={renderButton}
              onCancel={onCancel}
              onConfirm={onConfirm}
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
    const { queryParams, bulk, list, total, count } = this.props;
    const breadcrumb = [
      { title: __('Мөнгө хүсэх өргөдөл'), link: '/trading/withdraw-list' }
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
                  title="New withdraw"
                  size={'lg'}
                  trigger={
                    <Button
                      id={'NewWithdraw'}
                      btnStyle="success"
                      block={true}
                      icon="plus-circle"
                    >
                      New withdraw
                    </Button>
                  }
                  content={this.renderForm}
                />
                {this.renderFilter()}
              </Flex>
            }
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
        footer={<Pagination count={total} />}
        hasBorder
      />
    );
  }
}

export default List;
