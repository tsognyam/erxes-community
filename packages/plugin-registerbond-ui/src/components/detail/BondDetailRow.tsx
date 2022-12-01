import React from 'react';
import { StyledTr } from '../../styles';
import Label from '@erxes/ui/src/components/Label';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { Link, Redirect } from 'react-router-dom';

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
        <td>{index + 1}</td>
        <td>{bond.prefix}</td>
        <td>{bond.registry}</td>
        <td>{bond.lastName}</td>
        <td>{bond.firstName}</td>
        <td>{bond.registeredDate}</td>
        <td>{bond.bondName}</td>
        <td>
          {bond.unitPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {bond.quantity.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {bond.totalPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{bond.periodMonth}</td>
        <td>{bond.interestRate}%</td>
        <td>
          <Link
            to={`/bond-list/interestPayment/details/${bond.interestPaymentId}`}
          >
            {bond.interestPayment}
          </Link>
        </td>
        <td>{bond.interestDay}</td>
        <td>{bond.mainPayment}</td>
        <td>
          <Label
            lblStyle={bond.status === 'Successful' ? 'success' : 'warning'}
          >
            {bond.status}
          </Label>
        </td>
      </StyledTr>
    );
  }
}

export default withProps<Props>(compose()(withRouter<FinalProps>(Row)));
