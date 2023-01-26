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
import { WITHDRAW_STATUS, WITHDRAW_TYPE } from '../../constants';
import { displayValue } from '../../App';
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  withdraw: any;
  prefixList: any[];
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onConfirm: (id: number) => void;
  onCancel: (id: number, userId) => void;
} & ICommonListProps;

class Row extends React.Component<Props> {
  renderForm = props => {
    return (
      <Form
        {...props}
        withdraw={this.props.withdraw}
        onCancel={this.props.onCancel}
        onConfirm={this.props.onConfirm}
        prefixList={this.props.prefixList}
        prefix={this.props.withdraw.wallet.user.prefix}
        renderButton={this.props.renderButton}
      />
    );
  };
  confirmOrder = e => {
    const { withdraw, onConfirm } = this.props;
    e.stopPropagation();
    const message = 'Are you sure?';

    confirm(message).then(() => {
      onConfirm(withdraw.id);
    });
  };
  cancelOrder = e => {
    const { withdraw, onCancel } = this.props;
    e.stopPropagation();
    const message = 'Are you sure?';

    confirm(message).then(() => {
      onCancel(withdraw.id, withdraw.wallet.user.userId);
    });
  };
  renderEditAction = object => {
    const { save } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('View')} placement="bottom">
          <Icon icon="eye" />
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
    if (object.status == 1 || object.status == 3) {
      return null;
    }

    return (
      <ActionButtons>
        <Tip text={__('Зөвшөөрөх')} placement="bottom">
          <Button
            size="large"
            btnStyle="link"
            onClick={this.confirmOrder}
            icon="check-1"
          />
        </Tip>
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
        <td>{withdraw?.wallet?.user?.prefix}</td>
        <td>{withdraw.lastName}</td>
        <td>{withdraw.firstName}</td>
        <td>
          {
            <Label
              lblStyle={
                WITHDRAW_TYPE.find(x => x.value == withdraw.type)?.styleName
              }
            >
              {WITHDRAW_TYPE.find(x => x.value == withdraw.type)?.label}
            </Label>
          }
        </td>
        <td>{withdraw?.wallet?.currencyCode}</td>
        <td>{withdraw.amount}</td>
        <td>{withdraw.feeAmount}</td>
        <td>{withdraw.description}</td>
        <td>
          {
            <Label
              lblStyle={
                WITHDRAW_STATUS.find(x => x.status == withdraw.status)
                  ?.styleName
              }
            >
              {
                WITHDRAW_STATUS.find(x => x.status == withdraw.status)
                  ?.description
              }
            </Label>
          }
        </td>
        <td>{displayValue(withdraw.createdAt, 'date')}</td>
        <td>{withdraw.createdUserId}</td>
        <td>{this.renderActions(withdraw)}</td>
      </StyledTr>
    );
  }
}

export default Row;
