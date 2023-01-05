import React from 'react';
import { FinanceAmount, StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import { StockChange } from '../../styles';
import dayjs from 'dayjs';
type Props = {
  wallet: any;
  index: number;
};

class Row extends React.Component<Props> {
  displayValue(value, type = 'number') {
    console.log('value', value);
    if (type == 'number') {
      return (
        <FinanceAmount>
          {(value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })}
        </FinanceAmount>
      );
    } else if (type == 'date') {
      return (
        <>
          {(value || 0).toLocaleString('default', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
          })}
        </>
      );
    }
  }
  render() {
    const { index, wallet } = this.props;

    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{wallet.user.prefix}</td>
        <td>{wallet.user.bdcAccountId}</td>
        <td>{wallet.lastName}</td>
        <td>{wallet.firstName}</td>
        <td>{wallet.currencyCode}</td>
        <td>{this.displayValue(wallet.walletBalance.balance)}</td>
        <td>{this.displayValue(wallet.walletBalance.holdBalance)}</td>
        <td>{this.displayValue(wallet.walletBalance.tradeBalance)}</td>
        <td>{wallet.user.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{wallet.user.description}</td>
        <td>
          {wallet.walletBalance.updatedAt != null
            ? dayjs(wallet.walletBalance.updatedAt).format(
                'YYYY-MM-DD HH:mm:ss'
              )
            : dayjs(wallet.walletBalance.createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
        </td>
      </StyledTr>
    );
  }
}

export default Row;
