import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import Filter from '@erxes/ui-trading/src/containers/Filter';
import React from 'react';
import { withProps } from '@erxes/ui/src/utils';

type Props = {};

class TradingFilterContainer extends React.Component<Props> {
  render() {
    return <Filter />;
  }
}

export default withProps<Props>(compose()(TradingFilterContainer));
