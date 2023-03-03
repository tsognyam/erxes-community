import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React from 'react';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils/core';
import * as compose from 'lodash.flowright';
import { mutations, queries } from '../../graphql';
import Index from '../components/Index';
type Props = {
  queryParams: any;
  history: any;
};
type FinalProps = {} & Props & IRouterProps;
class IndexContainer extends React.Component<FinalProps> {
  render() {
    return <Index {...this.props} />;
  }
}
export default withProps<Props>(
  compose(
    graphql<Props>(gql(mutations.MigrationMutations.dataMigrate), {
      name: 'tradingDataMigrateMutations',
      options: queryParams => ({
        variables: {
          attachment: '',
          type: ''
        }
      })
    })
  )(IndexContainer)
);
