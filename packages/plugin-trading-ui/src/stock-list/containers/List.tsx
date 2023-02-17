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
type Props = {
  queryParams: any;
  history: any;
  tradingStocksQuery: any;
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

  render() {
    const { history, queryParams, tradingStocksQuery } = this.props;
    const total = tradingStocksQuery?.tradingStocks?.total || 0;
    const count = tradingStocksQuery?.tradingStocks?.count || 0;
    // let tradingStocks = tradingStocksQuery.tradingStocks || {};
    let tradingStocks = tradingStocksQuery?.tradingStocks?.values || [];
    console.log('tradingStocks', tradingStocks);
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
      tradingStocks,
      loading: tradingStocksQuery.loading,
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
const getRefetchQueries = () => {
  return ['tradingStocks'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.StockQueries.TradingStocks), {
      name: 'tradingStocksQuery',
      options: props => ({
        variables: { ...props }
      })
    }),
    graphql<Props>(gql(mutations.StockMutations.stockAdd), {
      name: 'tradingStockAddMutation',
      options: props => ({
        variables: {
          ...props
        }
      })
    })
  )(ListContainer)
);
