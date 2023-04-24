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
  full: boolean;
};

type FinalProps = {
  tradingSettlementQuery: any;
  tradingUserByPrefixQuery: any;
} & Props &
  IRouterProps;
const date = new Date();
class ListContainer extends React.Component<
  FinalProps,
  {
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    userId?: string;
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
    const { tradingSettlementQuery } = this.props;
    this.setState({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
    tradingSettlementQuery.refetch({
      startDate: values.startDate,
      endDate: values.endDate,
      userId: values.userId
    });
  };
  render() {
    const {
      history,
      queryParams,
      tradingSettlementQuery,
      tradingUserByPrefixQuery
    } = this.props;
    const total = tradingSettlementQuery?.tradingSettlements?.total || 0;
    const count = tradingSettlementQuery?.tradingSettlements?.count || 0;
    let items = tradingSettlementQuery?.tradingSettlements?.values || [];
    let prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const updatedProps = {
      ...this.props,
      items,
      loading: tradingSettlementQuery.loading,
      total,
      count,
      renderButton: this.renderButton,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      userId: this.state.userId,
      queryParams,
      prefix
    };
    if (tradingSettlementQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      console.log(props);
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
    graphql<Props>(gql(queries.SettlementQueries.tradingSettlements), {
      name: 'tradingSettlementQuery',
      options: ({ queryParams }) => ({
        variables: {
          startDate: new Date(date.getFullYear(), date.getMonth(), 1),
          endDate: date,
          ...generatePaginationParams(queryParams)
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true
      })
    }),
    graphql<Props>(gql(queries.UserQueries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ queryParams }) => ({
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
