import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from '../Form';
import { STOCKTYPE } from '../../../constants';
type Props = {
  custFee: any;
  index: number;
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

  render() {
    const { index, custFee } = this.props;
    console.log('custFee', custFee);
    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{custFee.name}</td>
        <td>{STOCKTYPE[custFee.stocktypeId - 1].label}</td>
        <td>{this.displayValue(custFee.value)}</td>
        <td>{custFee.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{dayjs(custFee.updateddate).format('YYYY-MM-DD HH:mm:ss')}</td>
      </StyledTr>
    );
  }
}

export default Row;
