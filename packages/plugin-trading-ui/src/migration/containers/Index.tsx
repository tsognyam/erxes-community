import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import React from 'react';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps, Alert, confirm, getEnv } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { mutations, queries } from '../../graphql';
import Index from '../components/Index';
import { IAttachment } from '@erxes/ui/src/types';
type Props = {
  queryParams: any;
  history: any;
};
type State = {
  isLoading: boolean;
  file?: any;
};
type FinalProps = {} & Props & IRouterProps;
class IndexContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }
  onSave = (type: string, file?: any) => {
    const { REACT_APP_API_URL } = getEnv();
    const url = `${REACT_APP_API_URL}/pl:trading/migration`;
    confirm(`This action will be change database data.Are you sure?`)
      .then(() => {
        this.setState({
          isLoading: true
        });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 3600000);
        console.log('TRADING UI WORKING');
        fetch(`${url}`, {
          signal: controller.signal,
          method: 'post',
          body: formData
        })
          .then(response => {
            if (response.ok) {
              response.json().then(json => {
                Alert.success(json.data);
              });
              this.setState({
                file: file
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
  render() {
    const { isLoading, file } = this.state;
    const extendedProps = {
      ...this.props,
      onSave: this.onSave,
      isLoading: isLoading,
      file: file
    };
    return <Index {...extendedProps} />;
  }
}
export default withProps<Props>(IndexContainer);
