import React from 'react';
import { StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  statement: any;
  index: number;
};

class Row extends React.Component<Props> {
  render() {
    const { index, statement } = this.props;

    return (
      <StyledTr key={index}>
        <td>{index + 1}</td>
        <td>{statement.account}</td>
        <td>
          {statement.first.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {statement.income.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {statement.expense.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {statement.last.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
      </StyledTr>
    );
  }
}

export default Row;
