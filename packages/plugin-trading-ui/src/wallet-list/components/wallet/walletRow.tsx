import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';

import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from './Form';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import WithdrawForm from './withdrawForm';
type Props = {
  wallet: any;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class WalletRow extends React.Component<Props> {
  
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
  renderWithdrawForm = props => {
    return <WithdrawForm {...props} renderButton={this.props.renderButton} />;
  };
  renderWithdrawModal = object => {
    const content = props => {
      return this.renderWithdrawForm({ ...props, object });
    };

    const viewTrigger = (
      <Button btnStyle="default" block>
        {__('Зарлага')}
      </Button>
    );
    return (
      <ModalTrigger
        size="sm"
        title={__('Зарлага хийх')}
        trigger={viewTrigger}
        content={content}
      />
    );
  };

  render() {
    const { index, wallet } = this.props;

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
        <td>{this.renderWithdrawModal(wallet)}</td>
      </StyledTr>
    );
  }
}

export default WalletRow;
