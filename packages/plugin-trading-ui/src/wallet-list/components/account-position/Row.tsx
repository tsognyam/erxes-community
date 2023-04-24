import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';

import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import { IButtonMutateProps } from '@erxes/ui/src/types';
type Props = {
  wallet: any;
  index: number;
  // renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class WalletRow extends React.Component<Props> {
  renderForm = props => {
    // return <Form {...props} renderButton={this.props.renderButton} />;
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

    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{wallet.stockcode}</td>
        <td>{wallet.symbol}</td>
        <td>{wallet.buyvolume - wallet.sellvolume}</td>
        <td>{wallet.buyvolume}</td>
        <td>{wallet.sellvolume}</td>
        <td>{wallet.avg}</td>
        <td>{wallet.result}</td>
      </StyledTr>
    );
  }
}

export default WalletRow;
