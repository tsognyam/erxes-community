import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';

import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from './Form';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = {
  wallet: any;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class WalletRow extends React.Component<Props> {
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
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  renderModal = object => {
    const content = props => {
      return this.renderForm({ ...props, object });
    };

    const viewTrigger = (
      <Button btnStyle="default" block>
        {__('Орлого')}
      </Button>
    );
    return (
      <ModalTrigger
        size="sm"
        title={__('Орлого хийх')}
        trigger={viewTrigger}
        content={content}
      />
    );
  };

  render() {
    const { index, wallet } = this.props;
    console.log('userMcsd', wallet);

    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{wallet.name}</td>
        <td>{wallet.currencyCode}</td>
        <td>{wallet.walletBalance.balance}</td>
        <td>
          {wallet.walletBalance.balance - wallet.walletBalance.holdBalance}
        </td>
        <td>{wallet.walletBalance.holdBalance}</td>
        <td>{wallet.walletBalance.tradeBalance}</td>
        <td>{wallet.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>
          {wallet.updatedAt != null
            ? dayjs(wallet.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            : dayjs(wallet.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </td>
        <td>{this.renderModal(wallet)}</td>
      </StyledTr>
    );
  }
}

export default WalletRow;
