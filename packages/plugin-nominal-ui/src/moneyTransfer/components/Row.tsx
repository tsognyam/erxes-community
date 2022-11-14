import React from 'react';
import { StyledTr } from '../../styles';
import Label from '@erxes/ui/src/components/Label';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Form from './Form';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  transaction: any;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  render() {
    const { index, transaction } = this.props;

    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{transaction.createdDate}</td>
        <td>{transaction.receiveAccount}</td>
        <td>{transaction.transactionAccount}</td>
        <td>
          {transaction.transactionAmount.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{transaction.transactionMeaning}</td>
        <td>
          <Label
            lblStyle={
              transaction.status === 'Done'
                ? 'success'
                : transaction.status === 'Pending'
                ? 'warning'
                : 'danger'
            }
          >
            {transaction.status}
          </Label>
        </td>
      </StyledTr>
    );
  }
}

export default Row;
