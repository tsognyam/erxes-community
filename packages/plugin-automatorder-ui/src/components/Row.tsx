import React from 'react';
import { StyledTr } from '../styles';
import Label from '@erxes/ui/src/components/Label';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';

type Props = {
  order: any;
  index: number;
  open?: boolean;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonListProps;

type State = {
  open: boolean;
};

class Row extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      open: props.open || false
    };
  }

  renderActions = object => {
    if (object.status === 'Success' || object.status === 'Canceled') {
      return null;
    }

    return (
      <ActionButtons>
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

  renderIcon = () => {
    return (
      <ActionButtons>
        <Button
          btnStyle="link"
          onClick={() => this.setState({ open: !this.state.open })}
          icon={this.state.open ? 'minus-1' : 'plus-1'}
        />
      </ActionButtons>
    );
  };

  render() {
    const { index, order } = this.props;

    return (
      <>
        <StyledTr key={index}>
          <td>{this.renderIcon()}</td>
          <td>{index + 1}</td>
          <td>{order.prefix}</td>
          <td>{order.stock}</td>
          <td>{order.orderType}</td>
          <td>{order.frequency}</td>
          <td>{order.orderDay}</td>
          <td>{order.orderTime}</td>
          <td>
            {order.amount.toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}{' '}
            {order.amountTo &&
              `- ${order.amountTo.toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}`}
          </td>
          <td>{order.isActive === true ? 'Active' : 'Not Active'}</td>
        </StyledTr>
        {this.state.open && (
          <>
            <tr>
              <th>№</th>
              <th>{__('Stock')}</th>
              <th>{__('Quantity')}</th>
              <th>{__('Successful')}</th>
              <th>{__('Left')}</th>
              <th>{__('Status')}</th>
              <th>{__('Created Date')}</th>
              <th>{__('Total')}</th>
              <th>{__('Commission')}</th>
              <th>{__('Actions')}</th>
            </tr>
            {order.inside.map((arr, i) => (
              <StyledTr key={i + 1}>
                <td>{i + 1}</td>
                <td>{arr.stock}</td>
                <td>
                  {arr.quantity.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {arr.successful.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {arr.left.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  <Label
                    lblStyle={
                      arr.status === 'Success'
                        ? 'success'
                        : arr.status === 'Pending'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {arr.status}
                  </Label>
                </td>
                <td>{arr.createdDate}</td>
                <td>
                  {arr.total.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  {arr.commission.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>{this.renderActions(arr)}</td>
              </StyledTr>
            ))}
          </>
        )}
      </>
    );
  }
}

export default Row;
