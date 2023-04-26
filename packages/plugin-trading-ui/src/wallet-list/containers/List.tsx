import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { isValidUsername, router as routerUtils } from '@erxes/ui/src/utils';
import queryString from 'query-string';
import Spinner from '@erxes/ui/src/components/Spinner';
import { queries as configQueries } from '@erxes/ui-settings/src/general/graphql';
import { ConfigsQueryResponse } from '@erxes/ui-settings/src/general/types';
type Props = {
  queryParams: any;
  history: any;
  tradingWalletQuery: any;
};

type FinalProps = {
  configsQuery: ConfigsQueryResponse;
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
    return (
      <ButtonMutate
        mutation={
          object
            ? mutations.StockMutations.stockAdd
            : mutations.StockMutations.stockAdd
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${passedName}`}
      />
    );
  };
  onSearch = (search: string, type: string) => {
    if (!search) {
      return routerUtils.removeParams(this.props.history, type);
    }

    routerUtils.setParams(this.props.history, search);
  };
  clearFilter = () => {
    const params = generateQueryParams(this.props.history);
    const remainedParams = Object.keys(params).filter(
      key => !defaultParams.includes(key)
    );

    routerUtils.removeParams(this.props.history, ...remainedParams);
  };
  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);
    if (params[key] === values) {
      return routerUtils.removeParams(this.props.history, key);
    }

    return routerUtils.setParams(this.props.history, { [key]: values });
  };
  render() {
    const { tradingWalletQuery, configsQuery } = this.props;
    if (tradingWalletQuery.loading || configsQuery.loading) {
      return <Spinner />;
    }
    const total = tradingWalletQuery?.tradingWallets?.total || 0;
    const count = tradingWalletQuery?.tradingWallets?.count || 0;
    let tradingWallets = tradingWalletQuery?.tradingWallets?.values || [];
    const updatedProps = {
      ...this.props,
      tradingWallets,
      loading: tradingWalletQuery.loading,
      total,
      count,
      renderButton: this.renderButton,
      onSelect: this.onSelect,
      clearFilter: this.clearFilter,
      onSearch: this.onSearch,
      configs: configsQuery.configs || []
    };
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
const getRefetchQueries = () => {
  return ['tradingWalletQuery'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.WalletQueries.tradingWallets), {
      name: 'tradingWalletQuery',
      options: ({ queryParams }) => ({
        variables: {
          ...generatePaginationParams(queryParams),
          sortField: queryParams.sortField,
          sortDirection: queryParams.sortDirection,
          currencyCode: queryParams.currencyCode,
          prefix: queryParams.prefix
        }
      })
    }),
    graphql<{}, ConfigsQueryResponse>(gql(configQueries.configs), {
      name: 'configsQuery'
    })
  )(ListContainer)
);
