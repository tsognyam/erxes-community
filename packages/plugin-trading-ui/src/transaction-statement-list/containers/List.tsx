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
  tradingTransactionStatementQuery: any;
  tradingTransactionStatementSumQuery: any;
} & Props &
  IRouterProps;
const date = new Date();
class ListContainer extends React.Component<FinalProps> {
  constructor(props: FinalProps) {
    super(props);
  }
  render() {
    const {
      history,
      queryParams,
      tradingTransactionStatementQuery,
      tradingTransactionStatementSumQuery,
      walletId
    } = this.props;
    const total =
      tradingTransactionStatementQuery?.tradingTransactionStatement?.total || 0;
    const count =
      tradingTransactionStatementQuery?.tradingTransactionStatement?.count || 0;
    let tradingStatements =
      tradingTransactionStatementQuery?.tradingTransactionStatement?.values ||
      [];
    let tradingStatementSum =
      tradingTransactionStatementSumQuery?.tradingTransactionStatementSummary;
    const updatedProps = {
      ...this.props,
      tradingStatements,
      loading: tradingTransactionStatementQuery.loading,
      total,
      count,
      queryParams,
      tradingStatementSum
    };
    if (tradingTransactionStatementQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      return <List {...updatedProps} {...props} />;
    };

    return (
      <Bulk
        content={content}
        // refetch={this.props.List.refetch}
      />
    );
  }
}
export default withProps<Props>(
  compose(
    graphql<Props>(
      gql(queries.TransactionQueries.tradingTransactionStatement),
      {
        name: 'tradingTransactionStatementQuery',
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
      gql(queries.TransactionQueries.tradingTransactionStatementSummary),
      {
        name: 'tradingTransactionStatementSumQuery',
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
