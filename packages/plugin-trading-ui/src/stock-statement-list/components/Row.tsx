import React from 'react';
import { FinanceAmount, StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import { STOCKTYPE } from '../../constants';
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
          {transaction.type == 1
            ? 'Авах'
            : transaction.type == 2
            ? 'Зарах'
            : transaction.type == 3
            ? 'Авах'
            : transaction.type == 4
            ? 'Зарах'
            : ''}
        </td>
        <td>{transaction.stockname}</td>
        <td>{transaction.symbol}</td>
        <td>{transaction.stockcode}</td>
        <td>{displayValue(transaction.income)}</td>
        <td>{displayValue(transaction.outcome)}</td>
        <td>{displayValue(transaction.expectedIncome)}</td>
        <td>{displayValue(transaction.expectedOutcome)}</td>
        <td>{displayValue(transaction.price || 0)}</td>
        <td>{displayValue(transaction.fee)}</td>
        <td>{displayValue(transaction.description)}</td>
        <td></td>
      </StyledTr>
    );
  }
}

export default Row;
