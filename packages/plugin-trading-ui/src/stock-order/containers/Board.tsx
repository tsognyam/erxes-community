import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Board from '../components/Board';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { router as routerUtils } from '@erxes/ui/src/utils';
import queryString from 'query-string';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {} & Props & IRouterProps;

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

const defaultParams = ['stock'];

class ListContainer extends React.Component<FinalProps> {
  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);

    if (params[key] === values) {
      return routerUtils.removeParams(this.props.history, key);
    }

    return routerUtils.setParams(this.props.history, { [key]: values });
  };

  onSearch = (search: string) => {
    if (!search) {
      return routerUtils.removeParams(this.props.history, 'search');
    }

    routerUtils.setParams(this.props.history, { search });
  };

  renderButton = ({
    passedName,
    values,
    isSubmitted,
    callback,
    object
  }: IButtonMutateProps) => {
    return (
      <ButtonMutate
        mutation={object}
        variables={values}
        callback={callback}
        // refetchQueries={getRefetchQueries(queryParams, currentOrderId)}
        isSubmitted={isSubmitted}
        type="submit"
        successMessage={`You successfully ${
          object ? 'updated' : 'added'
        } a ${passedName}`}
      />
    );
  };

  render() {
    const extendedProps = {
      ...this.props,
      onSelect: this.onSelect,
      onSearch: this.onSearch,
      renderButton: this.renderButton
    };

    return <Board {...extendedProps} />;
  }
}

export default withProps<Props>(
  compose()(withRouter<FinalProps>(ListContainer))
);
