import List from '../components/List';
import React from 'react';
import queryString from 'query-string';
import { router as routerUtils } from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {} & Props & IRouterProps;

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

const defaultParams = ['statementType'];

class ListContainer extends React.Component<FinalProps> {
  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);

    if (params[key] === values) {
      return routerUtils.removeParams(this.props.history, key);
    }

    return routerUtils.setParams(this.props.history, { [key]: values });
  };

  render() {
    const extendedProps = {
      ...this.props,
      onSelect: this.onSelect
    };

    return <List {...extendedProps} />;
  }
}

export default withProps<Props>(
  compose()(withRouter<FinalProps>(ListContainer))
);
