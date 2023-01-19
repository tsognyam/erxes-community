import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import { ActionButtons, FormControl, Label, Tip } from '@erxes/ui/src/components';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from '../Form';
import { STOCKTYPE, WITHDRAW_STATUS, WITHDRAW_TYPE } from '../../../constants';
import { displayValue } from '../../../App';
type Props = {
  data: any;
  index: number;
};

class Row extends React.Component<Props> {
  

  render() {
    const { index, data } = this.props;
    
    const onClick = e => {
      e.stopPropagation();
    };
    return (
      <StyledTr key={index}>
        <td id="ordersCheckBox" onClick={onClick}>
          <FormControl
            // checked={isChecked}
            componentClass="checkbox"
            // onChange={onChange}
          />
        </td>
        <td>{index + 1}</td>
        <td>{data.wallet.user.prefix}</td>
        <td>{data.lastName}</td>
        <td>{data.firstName}</td>
        <td>{<Label
            lblStyle={WITHDRAW_TYPE.find(x => x.value == data.type)?.styleName}
          >
            {WITHDRAW_TYPE.find(x => x.value == data.type)?.label}
          </Label>}</td>
        <td>{data.amount}</td>
        <td>{data.feeAmount}</td>
        <td>{data.description}</td>
        <td>{<Label
            lblStyle={WITHDRAW_STATUS.find(x => x.status == data.status)?.styleName}
          >
            {WITHDRAW_STATUS.find(x => x.status == data.status)?.description}
          </Label>}</td>
        <td>{displayValue(data.createdAt, 'date')}</td>
        <td>{data.createdUserId}</td>
      </StyledTr>
    );
  }
}

export default Row;
