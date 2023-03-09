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
type DataMigrateMutationResponse = {
  tradingDataMigrateMutation: (params: {
    variables: { type: string; attachment?: IAttachment };
  }) => Promise<any>;
};
type FinalProps = {} & Props & IRouterProps & DataMigrateMutationResponse;
class IndexContainer extends React.Component<FinalProps> {
  onSave = (type: string, file?: any) => {
    console.log('attach=', file);
    console.log('type=', type);
    const { REACT_APP_API_URL } = getEnv();
    const url = `${REACT_APP_API_URL}/pl:trading/migration`;
    confirm(`This action will be change database data.Are you sure?`)
      .then(() => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        fetch(`${url}`, {
          method: 'post',
          body: formData
        })
          .then(response => {
            if (response.ok) {
              response.json().then(json => {
                console.log(json);
              });
              Alert.success('Амжилтай импорт хийлээ');
            } else Alert.error('Error');
          })
          .catch(error => {
            Alert.error(error.message);
          });
      })
      .catch(e => {
        Alert.error(e.message);
      });
  };
  render() {
    const extendedProps = {
      ...this.props,
      onSave: this.onSave
    };
    return <Index {...extendedProps} />;
  }
}
export default withProps<Props>(
  compose(
    graphql<
      Props,
      DataMigrateMutationResponse,
      { type: string; attachment?: IAttachment }
    >(gql(mutations.MigrationMutations.dataMigrate), {
      name: 'tradingDataMigrateMutation'
    })
  )(IndexContainer)
);
