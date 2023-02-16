import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../../components/custFee/List';
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
  tradingCustFeeGetListQuery: any;
  userId: string;
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
        mutation={mutations.CustFeeMutations.tradingCustFeeUpdate}
        variables={values}
        callback={callback}
        refetchQueries={getRefetchQueries()}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully updated`}
      />
    );
  };

  render() {
    const { history, queryParams, tradingCustFeeGetListQuery } = this.props;
    const total = tradingCustFeeGetListQuery?.tradingCustFeeGetList?.total || 0;
    const count = tradingCustFeeGetListQuery?.tradingCustFeeGetList?.count || 0;
    // let tradingStocks = tradingStocksQuery.tradingStocks || {};
    let tradingCustFeeGetList =
      tradingCustFeeGetListQuery?.tradingCustFeeGetList?.values || [];
    console.log('tradingCustFeeGetList', tradingCustFeeGetList);
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
      tradingCustFeeGetList,
      loading: tradingCustFeeGetListQuery.loading,
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
  return ['tradingCustFeeList'];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.CustFeeQueries.tradingCustFeeList), {
      name: 'tradingCustFeeGetListQuery',
      options: ({ userId }) => ({
        variables: { userId: userId }
      })
    })
  )(ListContainer)
);
