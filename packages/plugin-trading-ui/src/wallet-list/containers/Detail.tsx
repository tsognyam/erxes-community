import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Spinner from '@erxes/ui/src/components/Spinner';
import { withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import Detail from '../components/Detail';
import { mutations, queries } from '../../graphql';
import {
  PropertyConsumer,
  PropertyProvider
} from '@erxes/ui-contacts/src/customers/propertyContext';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';

type Props = {
  id: string;
  queryParams: any;
};

type FinalProps = {
  tradingUserByPrefixQuery: any;
} & Props &
  IRouterProps;

function CustomerDetailsContainer(props: FinalProps) {
  const { id, tradingUserByPrefixQuery, queryParams } = props;

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
  if (tradingUserByPrefixQuery.loading) {
    return <Spinner objective={true} />;
  }

  if (!tradingUserByPrefixQuery.tradingUserByPrefix) {
    return (
      <EmptyState text="Account not found" image="/images/actions/17.svg" />
    );
  }
  const total = tradingUserByPrefixQuery?.tradingUserByPrefix?.total || 0;
  const count = tradingUserByPrefixQuery?.tradingUserByPrefix?.count || 0;
  // let tradingStocks = tradingStocksQuery.tradingStocks || {};
  let tradingUserByPrefix =
    tradingUserByPrefixQuery?.tradingUserByPrefix?.values[0] || {};

  const taggerRefetchQueries = [
    {
      query: gql(queries.UserQueries.tradingUserByPrefix),
      variables: { userId: id }
    }
  ];

  const updatedProps = {
    ...props,
    renderButton: renderButton,
    customer: tradingUserByPrefix || ({} as any),
    taggerRefetchQueries
  };

  return (
    <PropertyProvider>
      <PropertyConsumer>
        {({
          deviceFields,
          customerVisibility,
          deviceVisibility,
          customerFields
        }) => {
          return (
            <Detail
              {...updatedProps}
              deviceFields={deviceFields}
              fields={customerFields}
              fieldsVisibility={customerVisibility}
              deviceFieldsVisibility={deviceVisibility}
            />
          );
        }}
      </PropertyConsumer>
    </PropertyProvider>
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
      gql(queries.UserQueries.tradingUserByPrefix),
      {
        name: 'tradingUserByPrefixQuery',
        options: ({ id }) => ({
          variables: {
            userId: id
          }
        })
      }
    ),
    graphql<Props>(gql(mutations.WalletMutations.tradingWalletCharge), {
      name: 'tradingWalletChargeMutation',
      options: props => ({
        variables: {
          ...props
        }
      })
    })
  )(CustomerDetailsContainer)
);
