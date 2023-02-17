import gql from 'graphql-tag';
import { graphql, useMutation } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import queryString from 'query-string';
import { Alert, router as routerUtils } from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IUser } from '@erxes/ui/src/auth/types';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import Spinner from '@erxes/ui/src/components/Spinner';
type Props = {
  queryParams: any;
  history: any;
  currentUser: IUser;
};

type FinalProps = {
  tradingWithdrawGetQuery: any;
  tradingUserByPrefixQuery: any;
  tradingWithdrawConfirmMutation: (params: {
    variables: { requestId: number; confirm: number };
  }) => Promise<any>;
  tradingWithdrawCancelMutation: (params: {
    variables: { requestId: number; userId: string };
  }) => Promise<any>;
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
          object ? '' : mutations.WithdrawMutations.tradingWithdrawCreate
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries}
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
  onCancel = (id, userId) => {
    const {
      tradingWithdrawCancelMutation,
      tradingWithdrawGetQuery
    } = this.props;
    let variables: any = {
      requestId: id,
      userId: userId
    };
    tradingWithdrawCancelMutation({
      variables
    })
      .then(() => {
        Alert.success('You successfully cancelled');
        // tradingWithdrawGetQuery.refetch();
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };
  onConfirm = id => {
    const {
      tradingWithdrawConfirmMutation,
      tradingWithdrawGetQuery
    } = this.props;

    tradingWithdrawConfirmMutation({
      variables: {
        requestId: id,
        confirm: 1
      }
    })
      .then(() => {
        Alert.success('You successfully confirmed');
        // tradingWithdrawGetQuery.refetch();
        // getRefetchQueries(this.props.queryParams)
      })
      .catch(e => {
        Alert.error(e.message);
      });
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
      tradingWithdrawGetQuery,
      tradingUserByPrefixQuery,
      queryParams
    } = this.props;
    const list = tradingWithdrawGetQuery?.tradingWithdrawGet?.values || [];
    const total = tradingWithdrawGetQuery?.tradingWithdrawGet?.total || 0;
    const count = tradingWithdrawGetQuery?.tradingWithdrawGet?.count || 0;
    console.log('rendering', list ?? undefined);
    const prefixList =
      tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    const extendedProps = {
      ...this.props,
      list,
      prefixList,
      loading: tradingWithdrawGetQuery.loading,
      total,
      count,
      onSelect: this.onSelect,
      clearFilter: this.clearFilter,
      onSearch: this.onSearch,
      renderButton: this.renderButton,
      onCancel: this.onCancel,
      onConfirm: this.onConfirm
      // remove: this.remove,
      // removeOrders,
    };
    if (tradingWithdrawGetQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      return <List {...extendedProps} {...props} />;
    };

    return <Bulk content={content} />;
  }
}

const getRefetchQueries = (queryParams?: any) => {
  return [
    {
      query: gql(queries.WithdrawQueries.tradingWithdrawGet),
      variables: {
        type: queryParams.type,
        walletId: queryParams.walletId,
        status: queryParams.status,
        ...generatePaginationParams(queryParams)
      }
    }
  ];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.UserQueries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ queryParams }) => ({
        refetchQueries: getRefetchQueries(queryParams)
      })
    }),
    graphql<Props>(gql(queries.WithdrawQueries.tradingWithdrawGet), {
      name: 'tradingWithdrawGetQuery',
      options: ({ queryParams }) => ({
        refetchQueries: getRefetchQueries(queryParams)
      })
    }),
    graphql<Props>(gql(mutations.WithdrawMutations.tradingWithdrawCancel), {
      name: 'tradingWithdrawCancelMutation',
      options: ({ queryParams }) => ({
        refetchQueries: getRefetchQueries(queryParams)
      })
    }),
    graphql<Props>(gql(mutations.WithdrawMutations.tradingWithdrawConfirm), {
      name: 'tradingWithdrawConfirmMutation',
      options: ({ queryParams }) => ({
        refetchQueries: getRefetchQueries(queryParams)
      })
    }),
    graphql<Props>(gql(mutations.WithdrawMutations.tradingWithdrawCreate), {
      name: 'tradingWithdrawCreateMutation',
      options: ({ queryParams }) => ({
        refetchQueries: getRefetchQueries(queryParams)
      })
    })
  )(ListContainer)
);
