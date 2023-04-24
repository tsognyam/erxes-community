import gql from 'graphql-tag';
import { graphql, useMutation } from 'react-apollo';
import List from '../components/List';
import { mutations, queries } from '../../graphql';
import React from 'react';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import queryString from 'query-string';
import {
  Alert,
  confirm,
  getEnv,
  router as routerUtils
} from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import Bulk from '@erxes/ui/src/components/Bulk';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IUser } from '@erxes/ui/src/auth/types';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import Spinner from '@erxes/ui/src/components/Spinner';
type Props = {
  queryParams: any;
  history: any;
  currentUser: IUser;
};

type FinalProps = {
  tradingGetContractNoteQuery: any;
} & Props &
  IRouterProps;
type State = {
  isLoading: boolean;
  file?: any;
  message?: any;
};
const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

const defaultParams = ['id'];

class ListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  render() {
    const { isLoading, file, message } = this.state;
    const { tradingGetContractNoteQuery, queryParams } = this.props;
    console.log('render*');
    const list =
      tradingGetContractNoteQuery?.tradingGetContractNote?.values || [];
    const total =
      tradingGetContractNoteQuery?.tradingGetContractNote?.total || 0;
    const count =
      tradingGetContractNoteQuery?.tradingGetContractNote?.count || 0;
    console.log('rendering', list ?? undefined);

    const extendedProps = {
      ...this.props,
      list,
      loading: tradingGetContractNoteQuery.loading,
      total,
      count,
      onSave: this.onSave,
      isLoading: isLoading,
      message: message,
      file: file
      // remove: this.remove,
      // removeOrders,
    };
    if (tradingGetContractNoteQuery.loading) {
      return <Spinner />;
    }
    const content = props => {
      return <List {...extendedProps} {...props} />;
    };

    return <Bulk content={content} />;
  }
  onSave = (file?: any) => {
    const { REACT_APP_API_URL } = getEnv();
    const url = `${REACT_APP_API_URL}/pl:trading/admin/upload/contract-note`;
    confirm(`This action will be change database data.Are you sure?`)
      .then(() => {
        this.setState({
          isLoading: true
        });
        const formData = new FormData();
        formData.append('contract-note', file);
        fetch(`${url}`, {
          method: 'post',
          body: formData
        })
          .then(async response => {
            if (response.ok) {
              let json = await response.json();
              Alert.success(json.data.error);
              this.setState({
                file: file,
                message: json.data.error
              });
            } else {
              const contentType = response.headers.get('content-type');
              if (
                contentType &&
                contentType.indexOf('application/json') !== -1
              ) {
                response.json().then(json => {
                  Alert.error(json);
                });
              } else Alert.error(response.statusText);
            }
            this.setState({
              isLoading: false
            });
          })
          .catch(error => {
            Alert.error(error.message);
            this.setState({
              isLoading: false
            });
          });
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };
}

const getRefetchQueries = (queryParams?: any) => {
  return [
    {
      query: gql(queries.ContractNoteQueries)
    }
  ];
};
export default withProps<Props>(
  compose(
    graphql<Props>(gql(queries.ContractNoteQueries.tradingGetContractNote), {
      name: 'tradingGetContractNoteQuery',
      options: ({ queryParams }) => ({
        // refetchQueries: getRefetchQueries(queryParams)
      })
    })
  )(ListContainer)
);
