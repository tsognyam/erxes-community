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
        <td>
          {order.price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>
        <td>{order.cnt}</td>
        <td>{order.donecnt === null ? 0 : order.donecnt}</td>
        <td>{left}</td>
        <td>
          <Label
            lblStyle={stateList.find(x => x.status == order.status)?.styleName}
          >
            {stateList.find(x => x.status == order.status)?.statusName}
          </Label>
        </td>
        <td>{dayjs(order.regdate).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td>
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {fee.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </td>
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
