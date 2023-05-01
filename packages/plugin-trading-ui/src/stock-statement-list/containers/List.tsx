import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import Button from '@erxes/ui/src/components/Button';
import Spinner from '@erxes/ui/src/components/Spinner';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
type Props = {
  queryParams: any;
  history: any;
  walletId: number;
  full: boolean;
};
type FinalProps = {
  tradingStockTransactionStatementQuery: any;
  tradingStockTransactionStatementSumQuery: any;
} & Props &
  IRouterProps;
const date = new Date();
class ListContainer extends React.Component<FinalProps> {
  constructor(props: FinalProps) {
    super(props);
  }
  render() {
    const {
      queryParams,
      tradingStockTransactionStatementQuery,
      tradingStockTransactionStatementSumQuery
    } = this.props;
    const total =
      tradingStockTransactionStatementQuery?.tradingStockTransactionStatement
        ?.total || 0;
    const count =
      tradingStockTransactionStatementQuery?.tradingStockTransactionStatement
        ?.count || 0;
    let tradingStatements =
      tradingStockTransactionStatementQuery?.tradingStockTransactionStatement
        ?.values || [];
    let tradingStatementSum =
      tradingStockTransactionStatementSumQuery?.tradingStockTransactionStatementSummary;
    const updatedProps = {
      ...this.props,
      tradingStatements,
      loading: tradingStockTransactionStatementQuery.loading,
      total,
      count,
      queryParams,
      tradingStatementSum
    };
    if (tradingStockTransactionStatementQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      return <List {...updatedProps} {...props} />;
    };

    return <Bulk content={content} />;
  }
}
export default withProps<Props>(
  compose(
    graphql<Props>(
      gql(queries.StockTransactionQueries.tradingStockTransactionStatement),
      {
        name: 'tradingStockTransactionStatementQuery',
        options: ({ walletId, queryParams }) => ({
          variables: {
            walletId: walletId,
            ...generatePaginationParams(queryParams),
            userId: queryParams.userId,
            startDate: queryParams.startDate,
            endDate: queryParams.endDate
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true
        })
      }
    ),
    graphql<Props>(
      gql(
        queries.StockTransactionQueries.tradingStockTransactionStatementSummary
      ),
      {
        name: 'tradingStockTransactionStatementSumQuery',
        options: ({ walletId, queryParams }) => ({
          variables: {
            walletId: walletId,
            userId: queryParams.userId,
            startDate: queryParams.startDate,
            endDate: queryParams.endDate
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true
        })
      }
    )
  )(ListContainer)
);
