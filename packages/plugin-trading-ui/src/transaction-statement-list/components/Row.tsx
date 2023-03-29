import React from 'react';
import { FinanceAmount, StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import { displayValue } from '../../App';
type Props = {
  transaction: any;
  index: number;
};
class Row extends React.Component<Props> {
  render() {
    const { index, transaction } = this.props;
    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{transaction.prefix}</td>
        <td>{dayjs(transaction.dater).format('YYYY-MM-DD')}</td>
        <td>
          {transaction.type == 1 || transaction.type == 3
            ? 'Орлого'
            : transaction.type == 2 || transaction.type == 4
            ? 'Зарлага'
            : ''}
        </td>
        <td>{displayValue(transaction.beforeBalance)}</td>
        <td>{displayValue(transaction.income)}</td>
        <td>{displayValue(transaction.outcome)}</td>
        <td>{displayValue(transaction.expectedIncome)}</td>
        <td>{displayValue(transaction.expectedOutcome)}</td>
        <td>{displayValue(transaction.afterBalance)}</td>
        <td>{transaction.description}</td>
        <td>{dayjs(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
      </StyledTr>
    );
  }
}

export default Row;
