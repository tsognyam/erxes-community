import gql from 'graphql-tag';
import { graphql, useSubscription } from 'react-apollo';
import Board from '../components/Board';
import { mutations, queries, subscriptions } from '../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { router as routerUtils } from '@erxes/ui/src/utils';
import queryString from 'query-string';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
type Props = {
  queryParams: any;
  history: any;
  closeModal: () => void;
  isAllSelected: boolean;
  currentUser: IUser;
  stockcode: string;
};

type FinalProps = {
  tradingUserByPrefixQuery: any;
  tradingStockListQuery: any;
  tradingOrderBookQuery: any;
  tradingExecutedBookQuery: any;
} & Props &
  IRouterProps;

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

const defaultParams = ['stock'];
class ListContainer extends React.Component<FinalProps> {
  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);

    if (params[key] === values) {
      return routerUtils.removeParams(this.props.history, key);
    }

    return routerUtils.setParams(this.props.history, { [key]: values });
  };

  onSearch = (search: string) => {
    if (!search) {
      return routerUtils.removeParams(this.props.history, 'search');
    }

    routerUtils.setParams(this.props.history, { search });
  };
  render() {
    const {
      tradingUserByPrefixQuery,
      tradingStockListQuery,
      tradingOrderBookQuery,
      tradingExecutedBookQuery
    } = this.props;
    const prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const stocks = tradingStockListQuery?.tradingStocks?.values || [];
    const extendedProps = {
      ...this.props,
      prefix,
      stocks,
      onSelect: this.onSelect,
      onSearch: this.onSearch,
      isCancel: false
    };

    return (
      <>
        <Board {...extendedProps} />
      </>
    );
  }
}

export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.UserQueries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props>(gql(queries.StockQueries.stockList), {
      name: 'tradingStockListQuery',
      options: () => ({
        variables: {
          detail: true
        },
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props>(gql(queries.MarketQueries.tradingOrderBook), {
      name: 'tradingOrderBookQuery',
      options: () => ({
        variables: {
          stockcode: 0
        }
      })
    }),
    graphql<Props>(gql(queries.MarketQueries.tradingExecutedBook), {
      name: 'tradingExecutedBookQuery',
      options: () => ({
        variables: {
          stockcode: 0,
          beginDate: new Date(),
          endDate: new Date()
        }
      })
    })
  )(ListContainer)
);
