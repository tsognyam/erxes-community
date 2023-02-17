import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../../graphql';
import * as compose from 'lodash.flowright';
import React from 'react';
import Index from '../components/Index';
import Spinner from '@erxes/ui/src/components/Spinner';
type Props = {
  queryParams: any;
  history: any;
};
type FinalProps = {
  tradingNominalWalletQuery: any;
  tradingNominalStockBalanceQuery: any;
} & Props &
  IRouterProps;
class IndexContainer extends React.Component<FinalProps> {
  render() {
    const {
      tradingNominalWalletQuery,
      tradingNominalStockBalanceQuery
    } = this.props;
    if (
      tradingNominalStockBalanceQuery.loading ||
      tradingNominalWalletQuery.loading
    ) {
      return <Spinner />;
    }
    return <Index {...this.props} />;
  }
}
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.WalletQueries.tradingNominalWallet), {
      name: 'tradingNominalWalletQuery',
      options: () => ({
        variables: {
          currencyCode: 'MNT'
        }
      })
    }),
    graphql<Props>(
      gql(queries.ReportQueries.tradingNominalStockBalancesWithAmount),
      {
        name: 'tradingNominalStockBalanceQuery',
        options: () => ({
          variables: {
            currencyCode: 'MNT'
          }
        })
      }
    )
  )(IndexContainer)
);
