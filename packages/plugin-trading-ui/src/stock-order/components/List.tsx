import React from 'react';
import { ListContainer, List, FormBox } from '../../styles';
import { ORDER_BUY_SELL } from '../../constants';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import Form from '../../order-list/components/Form';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;
class ListComp extends React.Component<Props & ICommonFormProps> {
  constructor(props) {
    super(props);
  }
  render() {
    const createdDate = dayjs(new Date()).format('lll');

    return (
      <ListContainer>
        <List>
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
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {item.quantity.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </List>
        <List>
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
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {item.quantity.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </List>
        <List>
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
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {item.quantity.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </List>
        <FormBox>
          <Form
            {...this.props}
            renderButton={this.props.renderButton}
            prefix={[]}
            stocks={[]}
          />
        </FormBox>
      </ListContainer>
    );
  }
}

export default ListComp;
