import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import { StyledTr } from '../../styles';
import Label from '@erxes/ui/src/components/Label';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Icon from '@erxes/ui/src/components/Icon';
import Form from './Form';
import { ModalTrigger, confirm } from '@erxes/ui/src';
import { __ } from '@erxes/ui/src/utils';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';
import dayjs from 'dayjs';
import _ from 'lodash';
import { FinanceAmount } from '../../styles';
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  withdraw: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onCancelOrder: (txnid: number) => void;
} & ICommonListProps;

class Row extends React.Component<Props> {
  displayValue(order, name, defaultValue = 0) {
    let value = 0;
    if (name == 'total' || name == 'fee') value = defaultValue;
    else value = _.get(order, name);
    return (
      <FinanceAmount>
        {(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
      </FinanceAmount>
    );
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  cancelOrder = e => {
    const { withdraw, onCancelOrder } = this.props;
    e.stopPropagation();
    const message = 'Are you sure?';

    confirm(message).then(() => {
      onCancelOrder(withdraw.txnid);
    });
  };
  renderEditAction = object => {
    const { save } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => {
      return this.renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        size="lg"
        title="Edit"
        trigger={editTrigger}
        content={content}
      />
    );
  };

  renderActions = object => {
    if (object.status !== 1 && object.status !== 2) {
      return null;
    }

    return (
      <ActionButtons>
        {this.renderEditAction(object)}
        <Tip text={__('Цуцлах')} placement="bottom">
          <Button
            size="small"
            btnStyle="link"
            onClick={this.cancelOrder}
            icon="cancel-1"
          />
        </Tip>
      </ActionButtons>
    );
  };

  render() {
    const { isChecked, index, withdraw, toggleBulk } = this.props;
    const stateList = [
      { status: 0, statusName: 'Цуцлагдсан', styleName: 'danger' },
      { status: 1, statusName: 'Шинэ', styleName: 'primary' },
      { status: 2, statusName: 'Хүлээн авсан', styleName: 'primary' },
      { status: 3, statusName: 'Review', styleName: 'warning' },
      { status: 4, statusName: 'Хэсэгчилж биелсэн', styleName: 'success' },
      { status: 5, statusName: 'Биелсэн', styleName: 'success' },
      { status: 6, statusName: 'Түтгэлзсэн', styleName: 'danger' },
      { status: 7, statusName: 'Хугацаа нь дууссан', styleName: 'danger' },
      { status: 9, statusName: 'Шинэчлэгдсэн', styleName: 'default' }
    ];
    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(withdraw, e.target.checked);
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
        <td></td>
        <td></td>
        <td>{withdraw.type}</td>
        <td>{withdraw.amount}</td>
        <td>{withdraw.feeAmount}</td>
        <td>{withdraw.description}</td>
        <td>{withdraw.status}</td>
        <td>{withdraw.createdAt}</td>
        <td>{withdraw.createdUserId}</td>
        <td>{this.renderActions(withdraw)}</td>
      </StyledTr>
    );
  }
}

export default Row;
