import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from '../Form';
import { STOCKTYPE } from '../../../constants';
import { displayValue } from '../../../App';
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
        <td>
          {transaction.type == 1
            ? 'Орлого'
            : transaction.type == 2
            ? 'Зарлага'
            : transaction.type == 3
            ? 'Шимтгэлийн орлого'
            : transaction.type == 4
            ? 'Шимтгэлийн зарлага'
            : ''}
        </td>
        <td>{displayValue(transaction.amount)}</td>
        <td>{displayValue(transaction.beforeBalance)}</td>
        <td>{displayValue(transaction.afterBalance)}</td>
        <td>{transaction.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{transaction.description}</td>
        <td>{dayjs(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
      </StyledTr>
    );
  }
}

export default Row;
