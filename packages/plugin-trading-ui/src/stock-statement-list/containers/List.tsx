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
type Props = {
  queryParams: any;
  history: any;
  tradingTransactionStatementQuery: any;
  walletId: number;
};

type FinalProps = {} & Props & IRouterProps;
const date = new Date();
class ListContainer extends React.Component<
  FinalProps,
  {
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
  }
> {
  constructor(props: FinalProps) {
    super(props);

    this.state = {
      isLoading: false,
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: date
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
    const { tradingTransactionStatementQuery } = this.props;
    this.setState({
      startDate: values.startDate,
      endDate: values.endDate
    });
    tradingTransactionStatementQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate
    });
  };
  render() {
    const {
      history,
      queryParams,
      tradingTransactionStatementQuery,
      walletId
    } = this.props;
    const total =
      tradingTransactionStatementQuery?.tradingTransactionStatement?.total || 0;
    const count =
      tradingTransactionStatementQuery?.tradingTransactionStatement?.count || 0;
    let tradingStatements =
      tradingTransactionStatementQuery?.tradingTransactionStatement?.values ||
      [];
    const updatedProps = {
      ...this.props,
      tradingStatements,
      loading: tradingTransactionStatementQuery.loading,
      total,
      count,
      renderButton: this.renderButton,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      // searchValue,
      queryParams
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
        options: ({ walletId }) => ({
          variables: {
            startDate: new Date(date.getFullYear(), date.getMonth(), 1),
            endDate: date,
            walletId: walletId
          },
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true
        })
      }
    )
  )(ListContainer)
);
