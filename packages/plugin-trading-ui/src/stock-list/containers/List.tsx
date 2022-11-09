import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {} & Props & IRouterProps;

class ListContainer extends React.Component<FinalProps> {
  render() {
    const { history, queryParams } = this.props;

    return <List history={history} queryParams={queryParams} />;
  }
}

export default withProps<Props>(
  compose()(withRouter<FinalProps>(ListContainer))
);
