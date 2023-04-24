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
type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  stockWallet: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  render() {
    const { isChecked, index, stockWallet, toggleBulk } = this.props;
    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(stockWallet, e.target.checked);
      }
    };
    const onClick = e => {
      e.stopPropagation();
    };
    const availableBalance =
      parseFloat(stockWallet.balance) - parseFloat(stockWallet.holdBalance);
    let updatedDate = stockWallet.updatedAt;
    if (!updatedDate) {
      updatedDate = stockWallet.createdAt;
    }
    return (
      <StyledTr key={index}>
        <td id="ordersCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{stockWallet.id}</td>
        <td>{stockWallet.wallet?.user?.prefix}</td>
        <td>{stockWallet.stock?.symbol}</td>
        <td>{stockWallet.stock?.stockname}</td>
        <td>{stockWallet.balance}</td>
        <td>{stockWallet.holdBalance}</td>
        <td>{availableBalance}</td>
        <td>{dayjs(updatedDate).format('YYYY-MM-DD HH:mm:ss')}</td>
      </StyledTr>
    );
  }
}

export default Row;
