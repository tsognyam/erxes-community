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
      tradingTransactionStatementQuery,
      tradingTransactionStatementSumQuery
    } = this.props;
    this.setState({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
    tradingTransactionStatementQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
    tradingTransactionStatementSumQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
  };
  render() {
    const {
      history,
      queryParams,
      tradingTransactionStatementQuery,
      tradingTransactionStatementSumQuery,
      walletId,
      tradingUserByPrefixQuery
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
    let prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const updatedProps = {
      ...this.props,
      tradingStatements,
      loading: tradingTransactionStatementQuery.loading,
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
            ...generatePaginationParams(queryParams)
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
