import React from 'react';
import { FinanceAmount, StyledTr } from '../../../styles';
import { __ } from '@erxes/ui/src/utils';
import dayjs from 'dayjs';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { ModalTrigger, confirm } from '@erxes/ui/src';
import Form from './Form';
import { STOCKTYPE } from '../../../constants';
import Icon from '@erxes/ui/src/components/Icon';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';
type Props = {
  custFee: any;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonListProps;

class Row extends React.Component<Props> {
  displayValue(value, type = 'number') {
    if (type == 'number') {
      return (
        <FinanceAmount>
          {(value || 0).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })}
        </FinanceAmount>
      );
    } else if (type == 'date') {
      return (
        <>
          {(value || 0).toLocaleString('default', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
          })}
        </>
      );
    }
  }
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
  render() {
    const { index, custFee } = this.props;
    console.log('custFee', custFee);
    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{custFee.name}</td>
        <td>{STOCKTYPE[custFee.stocktypeId - 1].label}</td>
        <td>{this.displayValue(custFee.value)}</td>
        <td>{custFee.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{dayjs(custFee.updateddate).format('YYYY-MM-DD HH:mm:ss')}</td>
        <td>{this.renderEditAction(custFee)}</td>
      </StyledTr>
    );
  }
}

export default Row;
