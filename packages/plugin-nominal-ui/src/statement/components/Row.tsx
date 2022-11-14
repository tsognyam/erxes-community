import React from 'react';
import { StyledTr } from '../../styles';
import Label from '@erxes/ui/src/components/Label';
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
        <td>{statement.register}</td>
        <td>{statement.journalNumber}</td>
        <td>
          {statement.transaction.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          <Label lblStyle={statement.type === 'Income' ? 'success' : 'warning'}>
            {statement.type}
          </Label>
        </td>
        <td>{statement.createdDate}</td>
        <td>{statement.usedAccount}</td>
        <td>{statement.transactionMeaning}</td>
        <td>{statement.realAccount}</td>
        <td>{statement.name}</td>
        <td>{statement.nominalAccount}</td>
      </StyledTr>
    );
  }
}

export default Row;
