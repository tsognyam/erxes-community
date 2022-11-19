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
  request: any;
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
        title="Edit Price Information of Stock Transfer Request"
        size="lg"
        trigger={editTrigger}
        content={content}
      />
    );
  };

  renderActions = object => {
    if (object.status === 'Transfered') {
      return null;
    }

    return (
      <ActionButtons>
        <ActionButtons>{this.renderEditAction(object)}</ActionButtons>
      </ActionButtons>
    );
  };

  render() {
    const { isChecked, index, request, toggleBulk } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(request, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    return (
      <StyledTr key={index}>
        <td id="requestsCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{index + 1}</td>
        <td>{request.firstName}</td>
        <td>{request.register}</td>
        <td>{request.phone}</td>
        <td>{request.stockCompany}</td>
        <td>{request.stockAccount}</td>
        <td>{request.stock}</td>
        <td>
          {request.quantity.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{request.requestedDate}</td>
        <td>
          <Label
            lblStyle={
              request.status === 'Transfered'
                ? 'success'
                : request.status === 'New'
                ? 'warning'
                : 'simple'
            }
          >
            {request.status}
          </Label>
        </td>
        <td>{request.approvedDate}</td>
        <td>{this.renderActions(request)}</td>
      </StyledTr>
    );
  }
}

export default Row;
