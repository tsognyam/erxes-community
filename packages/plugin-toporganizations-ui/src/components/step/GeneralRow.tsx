import React from 'react';
import { StyledTr } from '../../styles';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  shareHolder: any;
  index: number;
};

class Row extends React.Component<Props> {
  render() {
    const { index, shareHolder } = this.props;

    return (
      <StyledTr key={index}>
        <td>&nbsp;&nbsp;{index + 1}</td>
        <td>{shareHolder.fullName}</td>
        <td>
          {shareHolder.holdingShares.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {shareHolder.hasOtherCompaniesShare
            ? shareHolder.hasOtherCompaniesShare
            : '-'}
        </td>
        <td>
          {shareHolder.sameInterestPerson
            ? shareHolder.sameInterestPerson
            : '-'}
        </td>
      </StyledTr>
    );
  }
}

export default Row;
