import React from 'react';
import { FinanceAmount, StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import { displayValue } from '../../App';
import Label from '@erxes/ui/src/components/Label';
type Props = {
  settlement: any;
  index: number;
};
class Row extends React.Component<Props> {
  render() {
    const { index, settlement } = this.props;
    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{settlement.clientPrefix}</td>
        <td>{settlement.clientSuffix}</td>
        <td>{dayjs(settlement.tradeDate).format('YYYY-MM-DD')}</td>
        <td>{dayjs(settlement.settlementDate).format('YYYY-MM-DD')}</td>
        <td>{settlement.buyQuantity}</td>
        <td>{settlement.buyObligation}</td>
        <td>{settlement.sellQuantity}</td>
        <td>{settlement.sellObligation}</td>
        <td>{settlement.quantity}</td>
        <td>{settlement.obligation}</td>
        <td>{settlement.mseFee}</td>
        <td>{settlement.msccFee}</td>
        <td>{settlement.frcFee}</td>
        <td>
          {
            <Label
              lblStyle={
                settlement.status === 1
                  ? 'warning'
                  : settlement.status === 3
                  ? 'success'
                  : settlement.status === 4
                  ? 'danger'
                  : 'default'
              }
            >
              {settlement.status === 1
                ? 'Active'
                : settlement.status === 3
                ? 'Done'
                : settlement.status === 4
                ? 'Failed'
                : 'Inactive'}
            </Label>
          }
        </td>
        <td>{settlement.statusDescription}</td>
        <td>{dayjs(settlement.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
      </StyledTr>
    );
  }
}

export default Row;
