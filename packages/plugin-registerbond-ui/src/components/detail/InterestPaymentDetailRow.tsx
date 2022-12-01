import React from 'react';
import { StyledTr } from '../../styles';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { Link } from 'react-router-dom';

type Props = {
  bond: any;
  index: number;
  history: any;
};

type FinalProps = {} & Props & IRouterProps;

class Row extends React.Component<FinalProps> {
  render() {
    const { index, bond } = this.props;

    return (
      <StyledTr key={index}>
        <td>{bond.type}</td>
        <td>
          <Link to={`/bond-list/bond/details/${bond.bondId}`}>
            {bond.bondName}
          </Link>
        </td>
        <td>{bond.bondCode}</td>
        <td>{bond.interestPayment}</td>
        <td>{bond.interestPaymentDay}</td>
        <td>
          {bond.paymentAmount.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {bond.accumulativeInterest.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
      </StyledTr>
    );
  }
}

export default withProps<Props>(compose()(withRouter<FinalProps>(Row)));
