import React from 'react';
import { FinanceAmount, StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import { StockChange } from '../../styles';
import dayjs from 'dayjs';
import { ActionButtons, Tip } from '@erxes/ui';
import { ModalTrigger, Button, confirm } from '@erxes/ui/src';
import Form from './Form';
type Props = {
  wallet: any;
  index: number;
  history: any;
};

class Row extends React.Component<Props> {
  displayValue(value, type = 'number') {
    console.log('value', value);
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
    return <Form {...props} />;
  };
  // renderModal = object => {
  //   const content = props => {
  //     console.log('button');
  //     return this.renderForm({ ...props, object });
  //   };

  //   const viewTrigger = (
  //     <Button onClick={onTrClick} btnStyle="default" block>
  //       View Detail
  //     </Button>
  //   );
  //   return (
  //     <ModalTrigger
  //       size="xl"
  //       title="View"
  //       trigger={viewTrigger}
  //       content={content}
  //     />
  //   );
  // };

  render() {
    const { index, wallet, history } = this.props;
    console.log('userMcsd', wallet);
    const onTrClick = () => {
      history.push(`/trading/account/details/${wallet.userId}`);
    };
    return (
      <StyledTr onDoubleClick={onTrClick} key={index}>
        <td>{index + 1}</td>
        <td>{wallet.prefix}</td>
        <td>{wallet.bdcAccountId}</td>
        <td>{wallet.lastName}</td>
        <td>{wallet.firstName}</td>
        <td>{wallet.status == 1 ? 'Идэвхитэй' : 'Идэвхигүй'}</td>
        <td>{wallet.description}</td>
        <td>
          {wallet.updatedAt != null
            ? dayjs(wallet.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            : dayjs(wallet.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </td>
        <td>
          {
            <Button onClick={onTrClick} btnStyle="default" block>
              View Detail
            </Button>
          }
        </td>
      </StyledTr>
    );
  }
}

export default Row;
