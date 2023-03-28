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
import { TRANSACTION_STATUS } from '../../constants';
import Form from './Form';
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  transaction: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any;
};

class Row extends React.Component<Props> {
  displayValue(object, name) {
    let value = _.get(object, name);
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
    return <Form {...props} />;
  };
  renderEditAction = object => {
    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );
    const { prefix, renderButton } = this.props;
    const content = props => {
      return this.renderForm({ ...props, object, prefix, renderButton });
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

    let isEdit = transaction.status == 2 ? true : false;
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
        <td>{transaction.wallet?.user?.prefix}</td>
        <td>{this.displayValue(transaction, 'amount')}</td>
        <td>
          {transaction.type == 1
            ? 'Орлого'
            : transaction.type == 2
            ? 'Зарлага'
            : transaction.type == 3
            ? 'Орлого'
            : transaction.type == 4
            ? 'Зарлага'
            : ''}
        </td>
        <td>{dayjs(transaction.dater).format('YYYY-MM-DD')}</td>
        <td>{transaction.contAccountNo}</td>
        <td>{transaction.description}</td>
        <td>{transaction.recAccountNo}</td>
        <td>{transaction.accountName}</td>
        <td>{dayjs(transaction.createdAt).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td>{transaction.wallet?.walletNumber}</td>
        <td>{transaction.message}</td>
        <td>
          {
            <Label
              lblStyle={
                TRANSACTION_STATUS.find(x => x.status == transaction.status)
                  ?.styleName
              }
            >
              {
                TRANSACTION_STATUS.find(x => x.status == transaction.status)
                  ?.statusName
              }
            </Label>
          }
        </td>
        <td>
          <ActionButtons>
            {isEdit && this.renderEditAction(transaction)}
          </ActionButtons>
        </td>
      </StyledTr>
    );
  }
}

export default Row;
