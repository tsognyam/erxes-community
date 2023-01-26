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
import { STATE_LIST } from '../../constants';
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  order: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  onCancelOrder: (txnid: number) => void;
  stocks: any[];
  prefix: any[];
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
  cancelOrder = () => {
    const { order, onCancelOrder } = this.props;
    onCancelOrder(order);
  };
  renderEditAction = object => {
    const { save, stocks, prefix } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => {
      return this.renderForm({ ...props, object, save, stocks, prefix });
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
    const { isChecked, index, order, toggleBulk } = this.props;
    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(order, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };
    const left =
      order.cnt - parseFloat(order.donecnt === null ? 0 : order.donecnt);
    const total = order.cnt * order.price;
    const fee = (total * order.fee) / 100;
    const userDetails = order.user?.details;
    let userName = '';
    let registerNumber = '';
    if (userDetails) {
      userName = userDetails.lastName + ' ' + userDetails.firstName;
    }
    if (
      userDetails &&
      userDetails.customFieldsDataByFieldCode?.registerNumber != undefined
    ) {
      registerNumber =
        userDetails.customFieldsDataByFieldCode?.registerNumber.value;
    }
    return (
      <StyledTr key={index}>
        <td id="ordersCheckBox" onClick={onClick}>
          {order.status !== 1 && order.status !== 2 ? (
            ''
          ) : (
            <FormControl
              checked={isChecked}
              componentClass="checkbox"
              onChange={onChange}
            />
          )}
          {/* <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          /> */}
        </td>
        <td>{order.txnid}</td>
        <td>{order.user?.prefix}</td>
        <td>{registerNumber}</td>
        <td>{userName}</td>
        <td>{order.stock.symbol}</td>
        <td>
          <Label lblStyle={order.txntype === 1 ? 'primary' : 'danger'}>
            {order.txntype === 1 ? 'Авах' : 'Зарах'}
          </Label>
        </td>
        <td>
          {order.ordertype == 1
            ? 'Зах зээл'
            : order.ordertype == 2
            ? 'Нөхцөлт'
            : ''}
        </td>
        <td>{this.displayValue(order, 'price')}</td>
        <td>{order.cnt}</td>
        <td>{order.donecnt === null ? 0 : order.donecnt}</td>
        <td>{left}</td>
        <td>
          <Label
            lblStyle={STATE_LIST.find(x => x.status == order.status)?.styleName}
          >
            {STATE_LIST.find(x => x.status == order.status)?.statusName}
          </Label>
        </td>
        <td>{dayjs(order.txndate).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td>{this.displayValue(order, 'total', total)}</td>
        <td>{this.displayValue(order, 'fee', fee)}</td>
        <td>
          {order.condid == 0
            ? 'Day'
            : order.condid == 1
            ? 'GTC'
            : order.conid == 6
            ? 'GTD'
            : ''}
        </td>
        <td>{order.user?.details?.shortName}</td>
        <td>{this.renderActions(order)}</td>
      </StyledTr>
    );
  }
}

export default Row;
