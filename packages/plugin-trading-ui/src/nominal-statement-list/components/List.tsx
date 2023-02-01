import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
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
import { nominalStatementMenus } from '../../utils/nominalStatementMenus';
interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: any, containerId: string) => void;
  stockWallets: any[];
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
  renderContent = () => {
    const {
      toggleAll,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton,
      stockWallets,
      total,
      count
    } = this.props;
    const onChangeAll = () => {
      toggleAll(stockWallets, 'stockWallets');
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
            <th>Хувьцааны симбол</th>
            <th>Хувьцааны нэр</th>
            <th>Үлдэгдэл</th>
            <th>Барилт хийсэн дүн</th>
            <th>Боломжит үлдэгдэл</th>
            <th>Сүүлд засагдсан огноо</th>
          </tr>
        </thead>
        <tbody id="stockWallets">
          {(stockWallets || []).map((stockWallet, index) => (
            <Row
              index={index}
              stockWallet={stockWallet}
              totalCount={total}
              isChecked={bulk.includes(stockWallet)}
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
    const { queryParams, total } = this.props;
    const breadcrumb = [
      { title: __('Stock wallet list'), link: '/trading/stock-wallet-list' }
    ];
    let actionBarLeft: React.ReactNode;
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Номинал хуулга')}
            //breadcrumb={breadcrumb}
            queryParams={queryParams}
            submenu={nominalStatementMenus}
          />
        }
        actionBar={
          <Wrapper.ActionBar
            left={actionBarLeft}
            right={<Flex>{this.renderFilter()}</Flex>}
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
