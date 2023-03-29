import React from 'react';
import { StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import { StockChange } from '../../styles';
import { ActionButtons, Button, Icon, ModalTrigger, Tip } from '@erxes/ui/src';
import Forms from './Form';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = {
  stock: any;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  render() {
    const { index, stock } = this.props;
    // console.log('stock.change', stock.change);
    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{stock.symbol}</td>
        <td>{stock.stockcode}</td>
        <td>{stock.stockname}</td>
        <td>{stock.ipo == 1 ? 'Хоёрдогч' : 'Анхдагч'}</td>
        <td>{stock.stocktypeId == 1 ? 'Хувьцаа' : 'Бонд'}</td>
        <td>{stock.currencyCode}</td>
        <td>{stock.regdate}</td>
        <td>{stock.exchangeid == 1 ? 'MSE' : 'Бусад'}</td>
        <td>{stock.openprice}</td>
        <td>{stock.closeprice}</td>
        <td>{this.renderActions(stock)}</td>
        {/* <td>
          {stock.yesterdaysLastPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {stock.startingPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {stock.peak.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {stock.bottom.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <StockChange isIncreased={stock.change >= 0}>
          {stock.change.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </StockChange>
        <td>
          {stock.changePercent.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
          %
        </td>
        <td>
          {stock.quantity.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {stock.bullish.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {stock.bearish.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td> */}
      </StyledTr>
    );
  }
  renderActions = object => {
    return (
      <ActionButtons>
        {this.renderEditAction(object)}
        {/* <Tip text={__('Цуцлах')} placement="bottom">
          <Button
            size="small"
            btnStyle="link"
            onClick={this.cancelOrder}
            icon="cancel-1"
          />
        </Tip> */}
      </ActionButtons>
    );
  };
  renderForm = props => {
    return <Forms {...props} renderButton={this.props.renderButton} />;
  };
  renderEditAction = object => {
    const { stock } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => {
      return this.renderForm({ ...props, object, stock });
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
}

export default Row;
