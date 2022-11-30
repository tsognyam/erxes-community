import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import { StyledTr } from '../styles';
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
    if (object.status === 'Success' || object.status === 'Canceled') {
      return null;
    }

    return (
      <ActionButtons>
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
        <td>{order.registry}</td>
        <td>{order.ipo}</td>
        <td>{order.createdDate}</td>
        <td>
          {order.price.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {order.amount.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{order.provision}</td>
        <td>
          {order.total.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{order.commission}</td>
        <td>
          <Label
            lblStyle={
              order.status === 'Success'
                ? 'success'
                : order.status === 'Canceled'
                ? 'danger'
                : 'warning'
            }
          >
            {order.status}
          </Label>
        </td>
        <td>{this.renderActions(order)}</td>
      </StyledTr>
    );
  }
}

export default Row;
