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
type Props = {
  queryParams: any;
  history: any;
  tradingUserByPrefixQuery: any;
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
    const { history, queryParams, tradingUserByPrefixQuery } = this.props;
    const total = tradingUserByPrefixQuery?.tradingUserByPrefix?.total || 0;
    const count = tradingUserByPrefixQuery?.tradingUserByPrefix?.count || 0;
    // let tradingStocks = tradingStocksQuery.tradingStocks || {};
    let tradingUserByPrefix =
      tradingUserByPrefixQuery?.tradingUserByPrefix?.values || [];
    console.log('tradingWallets', tradingUserByPrefix);
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
      tradingUserByPrefix,
      loading: tradingUserByPrefixQuery.loading,
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
  return ['tradingUserByPrefix'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.UserQueries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: ({ queryParams }) => ({
        variables: {
          ...generatePaginationParams(queryParams)
        }
      })
    })
  )(ListContainer)
);
