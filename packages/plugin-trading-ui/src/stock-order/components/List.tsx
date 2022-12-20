import React from 'react';
import { ListContainer, List } from '../../styles';
import { ORDER_BUY_SELL } from '../../constants';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';

class ListComp extends React.Component {
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
      </ListContainer>
    );
  }
}

export default ListComp;
