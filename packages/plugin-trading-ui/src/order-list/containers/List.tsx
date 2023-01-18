import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import queryString from 'query-string';
import { router as routerUtils } from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IUser } from '@erxes/ui/src/auth/types';
import { OrderQueryResponse } from '../../types/orderTypes';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import Spinner from '@erxes/ui/src/components/Spinner';
import { OrderCancelMutationResponse } from '../../types';
type Props = {
  queryParams: any;
  history: any;
  currentUser: IUser;
};

type FinalProps = {
  tradingOrdersQuery: any;
  tradingUserByPrefixQuery: any;
  tradingStockListQuery: any;
} & Props &
  IRouterProps;

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

const defaultParams = ['id'];

class ListContainer extends React.Component<FinalProps> {
  renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    const { tradingOrdersQuery } = this.props;
    const afterMutate = () => {
      tradingOrdersQuery.refetch();
      if (callback) {
        callback();
      }
    };
    return (
      <ButtonMutate
        mutation={object ? mutations.orderEdit : mutations.orderAdd}
        variables={values}
        callback={afterMutate}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${object ? 'updated' : 'added'}`}
      />
    );
  };
  renderButtonExecute = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    const { tradingOrdersQuery } = this.props;
    const afterMutate = () => {
      tradingOrdersQuery.refetch();
      if (callback) {
        callback();
      }
    };
    return (
      <ButtonMutate
        mutation={mutations.orderConfirm}
        variables={values}
        callback={afterMutate}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully executed`}
      />
    );
  };
  onSearch = (search: string, type: string) => {
    if (!search) {
      return routerUtils.removeParams(this.props.history, type);
    }

    routerUtils.setParams(this.props.history, search);
    //getRefetchQueries();
  };
  onCancelOrder = txnid => {
    const {} = this.props;
    alert(txnid);
  };
  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);
    if (params[key] === values) {
      console.log('params[key] === value', params[key], values);
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

  render() {
    const {
      tradingOrdersQuery,
      tradingUserByPrefixQuery,
      queryParams,
      tradingStockListQuery
    } = this.props;
    const orders = tradingOrdersQuery?.tradingOrders?.values || [];
    const total = tradingOrdersQuery?.tradingOrders?.total || 0;
    const count = tradingOrdersQuery?.tradingOrders?.count || 0;
    const prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const stocks = tradingStockListQuery?.tradingStocks?.values || [];
    const extendedProps = {
      ...this.props,
      orders,
      prefix,
      stocks,
      loading: tradingOrdersQuery.loading,
      total,
      count,
      onSelect: this.onSelect,
      clearFilter: this.clearFilter,
      onSearch: this.onSearch,
      renderButton: this.renderButton,
      renderButtonExecute: this.renderButtonExecute,
      onCancelOrder: this.onCancelOrder
      // remove: this.remove,
      // removeOrders,
    };
    if (tradingOrdersQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      return <List {...extendedProps} {...props} />;
    };

    return <Bulk content={content} />;
  }
}
const generateParams = ({ queryParams }) => {
  return {
    stockcode: queryParams.stockcode
      ? parseInt(queryParams.stockcode)
      : undefined,
    txntype: queryParams.txntype,
    status: queryParams.status,
    sortField: queryParams.sortField,
    sortDirection: queryParams.sortDirection,
    startDate: queryParams.startDate,
    endDate: queryParams.endDate,
    ...generatePaginationParams(queryParams)
  };
};
const getRefetchQueries = (queryParams?: any) => {
  return [
    {
      query: gql(queries.orderList),
      variables: { ...generateParams({ queryParams }) }
    }
  ];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.orderList), {
      name: 'tradingOrdersQuery',
      options: ({ queryParams }) => ({
        variables: generateParams({ queryParams }),
        fetchPolicy: 'network-only'
      })
    }),
    graphql<
      Props,
      OrderCancelMutationResponse,
      { txnid: number; stockcode: number; userId: string }
    >(gql(mutations.orderCancel), {
      name: 'cancelMutation',
      options: ({ queryParams }) => ({
        refetchQueries: getRefetchQueries(queryParams)
      })
    }),
    graphql<Props>(gql(queries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ queryParams }) => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql<Props>(gql(queries.stockList), {
      name: 'tradingStockListQuery',
      options: ({ queryParams }) => ({
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
