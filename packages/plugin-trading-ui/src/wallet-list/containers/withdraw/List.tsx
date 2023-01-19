import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../../components/withdraw/List';
import { mutations, queries } from '../../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
type Props = {
  queryParams: any;
  history: any;
  tradingWithdrawGetQuery: any;
  walletId: number;
};

type FinalProps = {} & Props & IRouterProps;

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
        mutation={object ? mutations.stockAdd : mutations.stockAdd}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries(object)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${passedName}`}
      />
    );
  };

  render() {
    const { history, queryParams, tradingWithdrawGetQuery } = this.props;
    const total = tradingWithdrawGetQuery?.tradingWithdrawGet?.total || 0;
    const count = tradingWithdrawGetQuery?.tradingWithdrawGet?.count || 0;
    // let tradingStocks = tradingStocksQuery.tradingStocks || {};
    let tradingWithdrawGet =
      tradingWithdrawGetQuery?.tradingWithdrawGet?.values || [];
    console.log('tradingWithdrawGet', tradingWithdrawGet);
    // if ('values' in tradingStocks) {
    //   tradingStocks = tradingStocks.values;
    // } else {
    //   tradingStocks = [];
    // }
    // console.log('stockList',tradingStocks)
    // tradingStocks = []
    // tradingStocks = []
    const updatedProps = {
      ...this.props,
      tradingWithdrawGet,
      loading: tradingWithdrawGetQuery.loading,
      total,
      count,
      renderButton: this.renderButton,
      // searchValue,
      queryParams
    };

    // return <List history={history} queryParams={queryParams} />;
    // return <List {...updatedProps} />;
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
const getRefetchQueries = values => {
  return [
    {
      query: gql(queries.tradingWithdrawGet),
      variables: {
        walletId: values.walletId
      }
    }
  ];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.tradingWithdrawGet), {
      name: 'tradingWithdrawGetQuery',
      options: ({ walletId }) => ({
        variables: { walletId: walletId }
      })
    })
  )(ListContainer)
);
