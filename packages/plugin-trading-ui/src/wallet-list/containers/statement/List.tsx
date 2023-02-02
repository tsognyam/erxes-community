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
type Props = {
  queryParams: any;
  history: any;
  tradingTransactionGetQuery: any;
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
    const { tradingTransactionGetQuery } = this.props;
    console.log(tradingTransactionGetQuery);
    tradingTransactionGetQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate
    });
  };
  render() {
    const {
      history,
      queryParams,
      tradingTransactionGetQuery,
      startDate,
      endDate,
      walletId
    } = this.props;
    console.log('startDate=', startDate);
    console.log('endDate=', endDate);
    console.log(walletId);
    const total = tradingTransactionGetQuery?.tradingTransactionGet?.total || 0;
    const count = tradingTransactionGetQuery?.tradingTransactionGet?.count || 0;
    const beginBalance =
      tradingTransactionGetQuery?.tradingTransactionGet?.beginBalance || 0;
    const endBalance =
      tradingTransactionGetQuery?.tradingTransactionGet?.endBalance || 0;
    let tradingTransactionGet =
      tradingTransactionGetQuery?.tradingTransactionGet?.values || [];
    const updatedProps = {
      ...this.props,
      tradingTransactionGet,
      loading: tradingTransactionGetQuery.loading,
      total,
      count,
      beginBalance,
      endBalance,
      renderButton: this.renderButton,
      // searchValue,
      queryParams
    };
    // return <List history={history} queryParams={queryParams} />;
    // return <List {...updatedProps} />;
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
    graphql<Props>(gql(queries.tradingTransactionGet), {
      name: 'tradingTransactionGetQuery',
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
