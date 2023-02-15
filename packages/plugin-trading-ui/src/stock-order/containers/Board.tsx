import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Board from '../components/Board';
import { mutations, queries } from '../../graphql';
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
};

type FinalProps = {
  tradingUserByPrefixQuery: any;
  tradingStockListQuery: any;
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
    const { tradingUserByPrefixQuery, tradingStockListQuery } = this.props;
    const prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const stocks = tradingStockListQuery?.tradingStocks?.values || [];
    const extendedProps = {
      ...this.props,
      prefix,
      stocks,
      onSelect: this.onSelect,
      onSearch: this.onSearch,
      isCancel: false,
      stockcode: ''
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
