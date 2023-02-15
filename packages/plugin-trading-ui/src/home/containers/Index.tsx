import { IButtonMutateProps, IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { mutations, queries } from '../../graphql';
import * as compose from 'lodash.flowright';
import React from 'react';
import Index from '../components/Index';
type Props = {
  queryParams: any;
  history: any;
};
type FinalProps = {} & Props & IRouterProps;
class IndexContainer extends React.Component<FinalProps> {
  render(): React.ReactNode {
    return <Index {...this.props} />;
  }
}
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.tradingUserByPrefix), {
      name: 'tradingUserByPrefixQuery',
      options: props => ({
        variables: { ...props }
      })
    })
  )(IndexContainer)
);
