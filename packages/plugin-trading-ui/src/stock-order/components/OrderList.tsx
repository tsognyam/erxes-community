import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import Table from '@erxes/ui/src/components/table';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IOrder, IOrderList } from '../../types/orderTypes';
import { IRouterProps } from '@erxes/ui/src/types';
import client from '@erxes/ui/src/apolloClient';
import Row from '../../order-list/components/Row';
interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  renderButtonExecute: (props: IButtonMutateProps) => JSX.Element;
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
  onCancelOrder: (txnid: number) => void;
}

class List extends React.Component<IProps> {
  renderContent = () => {
    const {
      toggleAll,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton,
      orders,
      total,
      count,
      stocks,
      prefix,
      onCancelOrder
    } = this.props;
    return (
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>№</th>
            <th>Prefix</th>
            <th>Register</th>
            <th>Username</th>
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
              isChecked={false}
              toggleBulk={toggleBulk}
              renderButton={renderButton}
              stocks={stocks}
              prefix={prefix}
              onCancelOrder={onCancelOrder}
            />
          ))}
        </tbody>
      </Table>
    );
  };
  render() {
    let actionBarLeft: React.ReactNode;
    return this.renderContent();
  }
}

export default List;
