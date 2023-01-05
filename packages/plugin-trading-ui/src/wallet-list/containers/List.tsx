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
  tradingWalletsQuery: any;
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
    const { history, queryParams, tradingWalletsQuery } = this.props;
    const total = tradingWalletsQuery?.tradingWallets?.length || 0;
    const count = tradingWalletsQuery?.tradingWallets?.length || 0;
    // let tradingStocks = tradingStocksQuery.tradingStocks || {};
    let tradingWallets = tradingWalletsQuery?.tradingWallets || [];
    console.log('tradingWallets', tradingWallets);
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
      tradingWallets,
      loading: tradingWalletsQuery.loading,
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
  return ['tradingWallets'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.tradingWallets), {
      name: 'tradingWalletsQuery',
      options: props => ({
        variables: { ...props }
      })
    })
  )(ListContainer)
);
