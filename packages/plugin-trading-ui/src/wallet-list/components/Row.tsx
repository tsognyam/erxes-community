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
  // renderModal = object => {
  //   const content = props => {
  //     console.log('button');
  //     return this.renderForm({ ...props, object });
  //   };

  //   const viewTrigger = (
  //     <Button onClick={onTrClick} btnStyle="default" block>
  //       View Detail
  //     </Button>
  //   );
  //   return (
  //     <ModalTrigger
  //       size="xl"
  //       title="View"
  //       trigger={viewTrigger}
  //       content={content}
  //     />
  //   );
  // };
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
    let walletMNTBalance = wallet.Wallet?.filter(x => x.currencyCode == 'MNT');
    return (
      <StyledTr onDoubleClick={() => this.onTrClick(wallet)} key={index}>
        <td>{index + 1}</td>
        <td>{wallet.prefix}</td>
        <td>{wallet.bdcAccountId}</td>
        <td>{wallet.lastName}</td>
        <td>{wallet.firstName}</td>
        <td>{this.displayValue(walletMNTBalance?.walletBalance?.balance)}</td>
        <td>{wallet.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{wallet.description}</td>
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
