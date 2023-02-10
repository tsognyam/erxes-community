import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import Spinner from '@erxes/ui/src/components/Spinner';
import { withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import List from '../../components/account-position/List';
import { mutations, queries } from '../../../graphql';
import {
  PropertyConsumer,
  PropertyProvider
} from '@erxes/ui-contacts/src/customers/propertyContext';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';

type Props = {
  id: string;
  queryParams: any;
  walletIds: number[];
};

type FinalProps = {
  tradingGetPosition: any;
} & Props &
  IRouterProps;

function AccountPosition(props: FinalProps) {
  const { id, tradingGetPosition, queryParams } = props;
  console.log('tradingGetPositionQuery', tradingGetPosition);
  if (tradingGetPosition.loading) {
    return <Spinner objective={true} />;
  }

  if (tradingGetPosition.tradingGetPosition.length == 0) {
    return (
      <EmptyState text="Account not found" image="/images/actions/17.svg" />
    );
  }
  const total = tradingGetPosition?.tradingGetPosition?.total || 0;
  const count = tradingGetPosition?.tradingGetPosition?.count || 0;
  // let tradingStocks = tradingStocksQuery.tradingStocks || {};
  let list = tradingGetPosition?.tradingGetPosition || {};

  const updatedProps = {
    ...props,
    wallets: list || ({} as any)
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
      query: gql(queries.tradingUserByPrefix),
      variables: {
        id: values.id
      }
    }
  ];
};
export default withProps<Props>(
  compose(
    graphql<Props, { userId: string; beginDate: Date; endDate: Date }>(
      gql(queries.tradingGetPosition),
      {
        name: 'tradingGetPosition',
        options: params => ({
          variables: {
            userId: params.queryParams.userId,
            beginDate: '2022-02-10',
            endDate: new Date()
          }
        })
      }
    )
  )(AccountPosition)
);
