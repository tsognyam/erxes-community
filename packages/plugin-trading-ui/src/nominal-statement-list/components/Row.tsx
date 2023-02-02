import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import { StyledTr } from '../../styles';
import Label from '@erxes/ui/src/components/Label';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Icon from '@erxes/ui/src/components/Icon';
import { ModalTrigger, confirm } from '@erxes/ui/src';
import { __ } from '@erxes/ui/src/utils';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';
import dayjs from 'dayjs';
import _ from 'lodash';
import { FinanceAmount } from '../../styles';
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  transaction: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onCancelOrder: (txnid: number) => void;
} & ICommonListProps;

class Row extends React.Component<Props> {
  render() {
    const { isChecked, index, transaction, toggleBulk } = this.props;
    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(transaction, e.target.checked);
      }
    };
    const onClick = e => {
      e.stopPropagation();
    };
    return (
      <StyledTr key={index}>
        <td id="ordersCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{index + 1}</td>
        <td></td>
        <td>{transaction.id}</td>
        <td>{transaction.amount}</td>
        <td>{transaction.type}</td>
        <td>{transaction.date}</td>
        <td>{}</td>
        <td>{dayjs(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td></td>
      </StyledTr>
    );
  }
}

export default Row;
