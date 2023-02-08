import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../../components/statement/List';
import { mutations, queries } from '../../../graphql';
import React from 'react';
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
  startDate: Date;
  endDate: Date;
  walletId: number;
};

type FinalProps = {} & Props & IRouterProps;

class ListContainer extends React.Component<FinalProps> {
  renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <Button btnStyle="default" onClick={() => this.onSearchList(values)}>
        Find
      </Button>
    );
  };
  onSearchList = values => {
    const { tradingTransactionStatementQuery } = this.props;
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
      startDate,
      endDate,
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
      // searchValue,
      queryParams
    };
    // return <List history={history} queryParams={queryParams} />;
    // return <List {...updatedProps} />;
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
    graphql<Props>(gql(queries.tradingTransactionStatement), {
      name: 'tradingTransactionStatementQuery',
      options: ({ startDate, endDate, walletId }) => ({
        variables: {
          startDate: startDate,
          endDate: endDate,
          walletId: walletId
        },
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
