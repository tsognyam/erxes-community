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
import { WITHDRAW_STATUS, WITHDRAW_TYPE } from '../../constants';
import { displayValue } from '../../App';
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  row: any;
  isChecked: boolean;
  index: number;
} & ICommonListProps;

class Row extends React.Component<Props> {
  renderForm = props => {
    return <></>;
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

  render() {
    const { isChecked, index, row, toggleBulk } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(row, e.target.checked);
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
        <td>{row?.tradeId}</td>
        <td>{row.externalId}</td>
        <td>{row.securityId}</td>
        <td>{row.buySell}</td>
        <td>{row?.price}</td>
        <td>{row.size}</td>
        <td>{row.tradeValue}</td>
        <td>{row.accruedValue}</td>
        <td>{row.totalValue}</td>
        <td>{displayValue(row.tradeDate, 'date')}</td>
        <td>{displayValue(row.downloadAt, 'date')}</td>
        <td>{displayValue(row.settlementAt, 'date')}</td>
        <td>{displayValue(row.createdAt, 'date')}</td>
      </StyledTr>
    );
  }
}

export default Row;
