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
  stock: any;
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
    const { index, stock } = this.props;

    const createdDate = dayjs(new Date()).format('lll');
    const left = stock.quantity - stock.successful;
    const total = stock.quantity * stock.price;

    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{stock.prefix}</td>
        <td>{stock.stock}</td>
        <td>
          <Label lblStyle={stock.type === 'Buy' ? 'primary' : 'danger'}>
            {stock.type}
          </Label>
        </td>
        <td>{stock.orderType}</td>
        <td>
          {stock.price.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{stock.quantity.toLocaleString()}</td>
        <td>{stock.successful.toLocaleString()}</td>
        <td>{left}</td>
        <td>
          <Label
            lblStyle={
              stock.status === 'Successful'
                ? 'success'
                : stock.status === 'Canceled'
                ? 'danger'
                : 'warning'
            }
          >
            {stock.status}
          </Label>
        </td>
        <td>{createdDate}</td>
        <td>{total.toLocaleString()}</td>
        <td>
          {stock.commission.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{stock.timeFrame}</td>
        <td>{this.renderActions(stock)}</td>
      </StyledTr>
    );
  }
}

export default Row;
