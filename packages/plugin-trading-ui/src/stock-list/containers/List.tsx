import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
type Props = {
  queryParams: any;
  history: any;
  tradingStocksQuery: any;
};

type FinalProps = {} & Props & IRouterProps;

class ListContainer extends React.Component<FinalProps> {
  render() {
    const { history, queryParams, tradingStocksQuery } = this.props;

    let tradingStocks = tradingStocksQuery.tradingStocks || {};

    if ('values' in tradingStocks) {
      tradingStocks = tradingStocks.values;
    } else {
      tradingStocks = [];
    }
    // console.log('stockList',tradingStocks)
    // tradingStocks = []
    // tradingStocks = []
    const updatedProps = {
      ...this.props,
      tradingStocks,
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
    graphql<Props>(gql(queries.TradingStocks), {
      name: 'tradingStocksQuery',
      options: props => ({
        variables: { ...props }
      })
    })
  )(ListContainer)
);
