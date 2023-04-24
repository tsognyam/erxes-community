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
type Props = {
  queryParams: any;
  history: any;
  currentUser: IUser;
};

type FinalProps = {
  tradingTransactionNominalQuery: any;
  tradingUserByPrefixQuery: any;
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
          mutations.BankTransactionuMutations.tradingEditBankTransactionWalletId
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully updated`}
      />
    );
  };
  onSearch = (search: string, type: string) => {
    if (!search) {
      return routerUtils.removeParams(this.props.history, type);
    }

    routerUtils.setParams(this.props.history, search);
  };
  onCancelOrder = txnid => {
    const {} = this.props;
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
      tradingTransactionNominalQuery,
      queryParams,
      tradingUserByPrefixQuery
    } = this.props;
    const transactions =
      tradingTransactionNominalQuery?.tradingBankTransactions?.values || [];
    const total =
      tradingTransactionNominalQuery?.tradingBankTransactions?.total || 0;
    const count =
      tradingTransactionNominalQuery?.tradingBankTransactions?.count || 0;
    const prefix = tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const extendedProps = {
      ...this.props,
      transactions,
      loading: tradingTransactionNominalQuery.loading,
      total,
      count,
      onSelect: this.onSelect,
      clearFilter: this.clearFilter,
      onSearch: this.onSearch,
      renderButton: this.renderButton,
      prefix
      // remove: this.remove,
      // removeOrders,
    };
    if (tradingTransactionNominalQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      return <List {...extendedProps} {...props} />;
    };

    return <Bulk content={content} />;
  }
}
const getRefetchQueries = () => {
  return ['tradingTransactionNominalList'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(
      gql(queries.BankTransactionQueries.tradingBankTransactions),
      {
        name: 'tradingTransactionNominalQuery',
        options: ({ queryParams }) => ({
          variables: {
            startDate: queryParams.startDate,
            endDate: queryParams.endDate,
            status: queryParams.status ? Number(queryParams.status) : undefined,
            ...generatePaginationParams(queryParams)
          },
          fetchPolicy: 'network-only'
        })
      }
    ),
    graphql<Props>(gql(queries.UserQueries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ queryParams }) => ({
        fetchPolicy: 'network-only'
      })
    })
  )(ListContainer)
);
