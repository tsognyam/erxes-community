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
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { ButtonMutate } from '@erxes/ui/src/components';

type Props = {
  id: string;
};

type FinalProps = {
  tradingUserByPrefixQuery: any;
} & Props;

function CustomerDetailsContainer(props: FinalProps) {
  const { id, tradingUserByPrefixQuery } = props;
  const renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={mutations.tradingWalletCharge}
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
  console.log('account list12', tradingUserByPrefix);
  const taggerRefetchQueries = [
    {
      query: gql(queries.tradingUserByPrefix),
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
const getRefetchQueries = () => {
  return ['tradingUserByPrefix'];
};
export default withProps<Props>(
  compose(
    graphql<Props, { userId: string }>(gql(queries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ id }) => ({
        variables: {
          userId: id
        }
      })
    }),
    graphql<Props>(gql(mutations.tradingWalletCharge), {
      name: 'tradingWalletChargeMutation',
      options: props => ({
        variables: {
          ...props
        }
      })
    })
  )(CustomerDetailsContainer)
);
