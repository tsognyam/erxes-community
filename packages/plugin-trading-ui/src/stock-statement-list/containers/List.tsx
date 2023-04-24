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
  tradingUserByPrefixQuery: any;
} & Props &
  IRouterProps;
const date = new Date();
class ListContainer extends React.Component<
  FinalProps,
  {
    isLoading: boolean;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }
> {
  constructor(props: FinalProps) {
    super(props);

    this.state = {
      isLoading: false
    };
  }
  renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    //const { isLoading } = this.state;
    return (
      <Button btnStyle="primary" onClick={() => this.onSearchList(values)}>
        ХАЙХ
      </Button>
    );
  };
  onSearchList = values => {
    const {
      tradingStockTransactionStatementQuery,
      tradingStockTransactionStatementSumQuery
    } = this.props;
    this.setState({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
    tradingStockTransactionStatementQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
    tradingStockTransactionStatementSumQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
  };
  render() {
    const {
      history,
      queryParams,
      tradingStockTransactionStatementQuery,
      tradingStockTransactionStatementSumQuery,
      tradingUserByPrefixQuery,
      walletId
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
    let prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const updatedProps = {
      ...this.props,
      tradingStatements,
      loading: tradingStockTransactionStatementQuery.loading,
      total,
      count,
      renderButton: this.renderButton,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      userId: this.state.userId,
      queryParams,
      tradingStatementSum,
      prefix
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
            ...generatePaginationParams(queryParams)
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
        options: ({ walletId }) => ({
          variables: {
            walletId: walletId
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true
        })
      }
    ),
    graphql<Props>(gql(queries.UserQueries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ queryParams }) => ({
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
