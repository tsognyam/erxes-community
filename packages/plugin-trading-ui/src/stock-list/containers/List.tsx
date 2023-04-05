import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries, subscriptions } from '../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import { router as routerUtils } from '@erxes/ui/src/utils';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import queryString from 'query-string';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
type Props = {
  queryParams: any;
  history: any;
  tradingStocksQuery: any;
};

type FinalProps = {} & Props & IRouterProps;
const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};
const defaultParams = ['id'];
class ListContainer extends React.Component<FinalProps> {
  private subscription;

  componentWillReceiveProps(nextProps) {
    const { conversation, tradingStocksQuery } = nextProps;
    console.log('nextProps');
    // It is first time or subsequent conversation change
    if (!this.subscription) {
      // Unsubscribe previous subscription ==========
      if (this.subscription) {
        this.subscription();
      }

      this.subscription = tradingStocksQuery.subscribeToMore({
        document: gql(subscriptions.stockMarketChanged),
        updateQuery: () => {
          console.log('updateQuery');
        }
      });
    }
  }

  renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={
          object
            ? mutations.StockMutations.stockEdit
            : mutations.StockMutations.stockAdd
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${object ? 'updated' : 'added'} `}
      />
    );
  };
  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);
    if (params[key] === values) {
      return routerUtils.removeParams(this.props.history, key);
    }

    return routerUtils.setParams(this.props.history, { [key]: values });
  };
  clearFilter = () => {
    const params = generateQueryParams(this.props.history);
    const remainedParams = Object.keys(params).filter(
      key => !defaultParams.includes(key)
    );

    routerUtils.removeParams(this.props.history, ...remainedParams);
  };
  onSearch = (search: string, type: string) => {
    if (!search) {
      return routerUtils.removeParams(this.props.history, type);
    }

    routerUtils.setParams(this.props.history, search);
    //getRefetchQueries();
  };
  render() {
    const { history, queryParams, tradingStocksQuery } = this.props;
    const total = tradingStocksQuery?.tradingStocks?.total || 0;
    const count = tradingStocksQuery?.tradingStocks?.count || 0;
    // let tradingStocks = tradingStocksQuery.tradingStocks || {};
    let tradingStocks = tradingStocksQuery?.tradingStocks?.values || [];
    console.log('tradingStocks', tradingStocks);
    // if ('values' in tradingStocks) {
    //   tradingStocks = tradingStocks.values;
    // } else {
    //   tradingStocks = [];
    // }
    // console.log('stockList',tradingStocks)
    // tradingStocks = []
    // tradingStocks = []
    const updatedProps = {
      ...this.props,
      tradingStocks,
      loading: tradingStocksQuery.loading,
      total,
      count,
      renderButton: this.renderButton,
      clearFilter: this.clearFilter,
      onSearch: this.onSearch,
      onSelect: this.onSelect,
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
const generateNumberArray = (value: any) => {
  let values: number[] | undefined = undefined;
  if (value) {
    if (typeof value == 'string') {
      values = [];
      values.push(parseInt(value));
    } else values = value.map(Number);
  }
  return values;
};
const generateParams = ({ queryParams }, isPagination = true) => {
  let symbol = queryParams.symbol;
  let params = {
    symbol: symbol,
    ...(isPagination && returnPagination(queryParams))
  };
  return params;
};
const returnPagination = queryParams => {
  let defaultPage = generatePaginationParams(queryParams);
  return {
    skip: (defaultPage.page - 1) * defaultPage.perPage,
    take: defaultPage.perPage
  };
};
const getRefetchQueries = () => {
  return ['tradingStocks'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.StockQueries.TradingStocks), {
      name: 'tradingStocksQuery',
      options: ({ queryParams }) => ({
        variables: generateParams({ queryParams })
      })
    }),
    graphql<Props>(gql(mutations.StockMutations.stockAdd), {
      name: 'tradingStockAddMutation',
      options: props => ({
        variables: {
          ...props
        }
      })
    }),
    graphql<Props>(gql(mutations.StockMutations.stockEdit), {
      name: 'tradingStockEditMutation',
      options: props => ({
        variables: {
          ...props
        }
      })
    })
  )(ListContainer)
);
