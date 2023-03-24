import React from 'react';
import {
  ListContainer,
  FormBox,
  OrderBookList,
  OrderBookListDiv
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
import { colors } from '@erxes/ui/src/styles';
import _ from 'lodash';
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
  object: any;
  stockChange: (option: { value: string; label: string }) => void;
  prefixChange: (option: { value: string; label: string }) => void;
  isCancel: boolean;
  stockcode?: string;
  sellOrderBook: any[];
  buyOrderBook: any[];
  executedOrderBook: any[];
} & ICommonFormProps;
class ListComp extends React.Component<Props & ICommonFormProps> {
  constructor(props) {
    super(props);
  }
  render() {
    const extendedProps = {
      ...this.props
    };
    const {
      queryParams,
      history,
      sellOrderBook,
      buyOrderBook,
      executedOrderBook
    } = this.props;
    return (
      <>
        <ListContainer>
          <OrderBookListDiv>
            <OrderBookList background={colors.colorCoreGreen}>
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
                {buyOrderBook.map(item => (
                  <tr>
                    <td>
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{item.volume}</td>
                  </tr>
                ))}
              </tbody>
            </OrderBookList>
          </OrderBookListDiv>
          <OrderBookListDiv>
            <OrderBookList background={colors.colorCoreRed}>
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
                {sellOrderBook.map(item => (
                  <tr>
                    <td>
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{item.volume}</td>
                  </tr>
                ))}
              </tbody>
            </OrderBookList>
          </OrderBookListDiv>
          <OrderBookListDiv>
            <OrderBookList background={colors.colorCoreBlue}>
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
                {executedOrderBook.map((item, index) => (
                  <tr>
                    <td>{dayjs(item.regdate).format('YYYY-MM-DD HH:mm:ss')}</td>
                    <td>
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td>{item.volume}</td>
                  </tr>
                ))}
              </tbody>
            </OrderBookList>
          </OrderBookListDiv>
          <FormBox>
            <Form {...extendedProps} />
          </FormBox>
        </ListContainer>
      </>
    );
  }
}

export default ListComp;
