import React from 'react';
import { FinanceAmount, StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import { StockChange } from '../../styles';
import dayjs from 'dayjs';
import { ActionButtons, Tip, Icon } from '@erxes/ui/src/components';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from './Form';
type Props = {
  wallet: any;
  index: number;
  history: any;
};

class Row extends React.Component<Props> {
  displayValue(value, type = 'number') {
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
  renderForm = props => {
    return <Form {...props} />;
  };
  onTrClick = (wallet: any) => {
    this.props.history.push(`/trading/account/details/${wallet.userId}`);
  };
  renderActionButtons(wallet: any) {
    return (
      <Button btnStyle="link" onClick={() => this.onTrClick(wallet)}>
        View Details
      </Button>
    );
  }
  render() {
    const { index, wallet } = this.props;
    return (
      <StyledTr onDoubleClick={() => this.onTrClick(wallet)} key={index}>
        <td>{index + 1}</td>
        <td>{wallet.user?.prefix}</td>
        <td>{wallet.user?.bdcAccountId}</td>
        <td>{wallet.user?.lastName}</td>
        <td>{wallet.user?.firstName}</td>
        <td>{wallet.currencyCode}</td>
        <td>
          {this.displayValue(parseFloat(wallet.walletBalance?.balance || 0))}
        </td>
        <td>{wallet.user?.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{wallet.user?.description}</td>
        <td>
          {wallet.updatedAt != null
            ? dayjs(wallet.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            : dayjs(wallet.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </td>
        <td>
          <ActionButtons>{this.renderActionButtons(wallet)}</ActionButtons>
        </td>
      </StyledTr>
    );
  }
}

export default Row;
