import React from 'react';
import { StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';
import { StockChange } from '../../styles';

type Props = {
  stock: any;
  index: number;
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
}

export default Row;
