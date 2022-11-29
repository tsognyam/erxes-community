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
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { __ } from '@erxes/ui/src/utils';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';
import dayjs from 'dayjs';

type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  order: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonListProps;

class Row extends React.Component<Props> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
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
    if (object.status === 'Successful' || object.status === 'Canceled') {
      return null;
    }

    return (
      <ActionButtons>
        {this.renderEditAction(object)}
        <Tip text={__('Delete')} placement="bottom">
          <Button
            btnStyle="link"
            // onClick={() => this.remove(object)}
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

    const createdDate = dayjs(new Date()).format('lll');
    const left = order.quantity - order.successful;
    const total = order.quantity * order.price;

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
        <td>{order.prefix}</td>
        <td>{order.register}</td>
        <td>{order.name}</td>
        <td>{order.stock}</td>
        <td>
          <Label lblStyle={order.type === 'Buy' ? 'primary' : 'danger'}>
            {order.type}
          </Label>
        </td>
        <td>{order.orderType}</td>
        <td>
          {order.price.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{order.quantity.toLocaleString()}</td>
        <td>{order.successful.toLocaleString()}</td>
        <td>{left}</td>
        <td>
          <Label
            lblStyle={
              order.status === 'Successful'
                ? 'success'
                : order.status === 'Canceled'
                ? 'danger'
                : order.status === 'New'
                ? 'default'
                : 'warning'
            }
          >
            {order.status}
          </Label>
        </td>
        <td>{createdDate}</td>
        <td>{total.toLocaleString()}</td>
        <td>
          {order.commission.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{order.timeFrame}</td>
        <td>{order.createdUser}</td>
        <td>{this.renderActions(order)}</td>
      </StyledTr>
    );
  }
}

export default Row;
