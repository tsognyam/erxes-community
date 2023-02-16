import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Spinner from '@erxes/ui/src/components/Spinner';
import { withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import List from '../../components/stock-list/List';
import { mutations, queries } from '../../../graphql';
import {
  PropertyConsumer,
  PropertyProvider
} from '@erxes/ui-contacts/src/customers/propertyContext';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';

type Props = {
  id: string;
  queryParams: any;
  walletIds: number[];
};

type FinalProps = {
  tradingWalletsQuery: any;
} & Props &
  IRouterProps &
  ICommonFormProps;

function CustomerDetailsContainer(props: FinalProps) {
  const { id, tradingWalletsQuery, queryParams } = props;

  const renderButton = ({
    name,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={
          name == 'deposit'
            ? mutations.WalletMutations.tradingWalletCharge
            : mutations.WithdrawMutations.tradingWithdrawCreate
        }
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(object)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${name}`}
      />
    );
  };
  if (tradingWalletsQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!tradingWalletsQuery.tradingWallets) {
    return (
      <EmptyState text="Account not found" image="/images/actions/17.svg" />
    );
  }
  const total = tradingWalletsQuery?.tradingWallets?.total || 0;
  const count = tradingWalletsQuery?.tradingWallets?.count || 0;
  // let tradingStocks = tradingStocksQuery.tradingStocks || {};
  let tradingWallets = tradingWalletsQuery?.tradingWallets || {};

  const updatedProps = {
    ...props,
    renderButton: renderButton,
    wallets: tradingWallets || ({} as any),
    beginBalance: 0,
    endBalance: 0
  };

  return (
    <List
      {...updatedProps}
      // deviceFields={deviceFields}
      // fields={customerFields}
      // fieldsVisibility={customerVisibility}
      // deviceFieldsVisibility={deviceVisibility}
    />
  );
}
const getRefetchQueries = values => {
  console.log('values', values);
  return [
    {
      query: gql(queries.UserQueries.tradingUserByPrefix),
      variables: {
        id: values.id
      }
    }
  ];
};
export default withProps<Props>(
  compose(
    graphql<Props, { userId: string }>(
      gql(queries.WalletQueries.tradingWallets),
      {
        name: 'tradingWalletsQuery',
        options: ({ walletIds }) => ({
          variables: {
            walletIds: walletIds
          }
        })
      }
    )
  )(CustomerDetailsContainer)
);
