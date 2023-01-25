import React from 'react';
import {
  ListContainer,
  OrderBuyList,
  OrderSellList,
  OrderDoneList,
  FormBox
} from '../../styles';
import { ORDER_BUY_SELL } from '../../constants';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import Form from '../../order-list/components/Form';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import {
  ICommonFormProps,
  ICommonListProps
} from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
type Props = {
  queryParams: any;
  history: any;
  onSelect: (values: string[] | string, key: string) => void;
  onSearch: (values: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  isAllSelected: boolean;
  closeModal: () => void;
  prefix: any[];
  stocks: any[];
  object?;
  stockChange: (option: { value: string }) => void;
  prefixChange: (option: { value: string }) => void;
  isCancel: boolean;
  stockcode?: string;
} & ICommonFormProps;
class ListComp extends React.Component<Props & ICommonFormProps> {
  constructor(props) {
    super(props);
  }
  render() {
    const createdDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const extendedProps = {
      ...this.props
    };
    const { queryParams, history } = this.props;
    return (
      <ListContainer>
        <OrderBuyList>
          <thead>
            <tr>
              <th colSpan={2}>{__('Order to buy')}</th>
            </tr>
            <tr>
              <th>{__('Price to buy')}</th>
              <th>{__('Quantity to buy')}</th>
            </tr>
          </thead>
          <tbody>
            {ORDER_BUY_SELL.map(item => (
              <tr>
                <td>
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </OrderBuyList>
        <OrderSellList>
          <thead>
            <tr>
              <th colSpan={2}>{__('Order to sell')}</th>
            </tr>
            <tr>
              <th>{__('Price to sell')}</th>
              <th>{__('Quantity to sell')}</th>
            </tr>
          </thead>
          <tbody>
            {ORDER_BUY_SELL.map(item => (
              <tr>
                <td>
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </OrderSellList>
        <OrderDoneList>
          <thead>
            <tr>
              <th colSpan={3}>{__('Successful deals')}</th>
            </tr>
            <tr>
              <th>{__('Date')}</th>
              <th>{__('Price')}</th>
              <th>{__('Quantity')}</th>
            </tr>
          </thead>
          <tbody>
            {ORDER_BUY_SELL.map(item => (
              <tr>
                <td>{createdDate}</td>
                <td>
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </OrderDoneList>
        <FormBox>
          <Form {...extendedProps} />
        </FormBox>
      </ListContainer>
    );
  }
}

export default ListComp;
