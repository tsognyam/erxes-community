import Spinner from '@erxes/ui/src/components/Spinner';
import Alert from '@erxes/ui/src/utils/Alert';
import * as routerUtils from '@erxes/ui/src/utils/router';
import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useQuery } from 'react-apollo';

import Register from '../components/Register';
import mutations from '../graphql/mutations';
import queries from '../graphql/queries';
import { RegisterConfig } from '../types';

type Props = {
  queryParams: any;
  history: any;
  closeModal?: () => void;
};

function ClientPortalDetailContainer({
  queryParams,
  history,
  closeModal
}: Props) {
  // const { loading, data = {} } = useQuery<ClientPortalConfigQueryResponse>(
  //   gql(queries.getConfig),
  //   {
  //     variables: { _id: queryParams._id },
  //     skip: !queryParams._id
  //   }
  // );

  // const [mutate] = useMutation(gql(mutations.createOrUpdateConfig), {
  //   refetchQueries: [{ query: gql(queries.getConfigs) }]
  // });

  // if (loading) {
  //   return <Spinner />;
  // }

  const handleUpdate = (doc: RegisterConfig) => {
    // mutate({ variables: { _id: queryParams._id, ...doc } })
    //   .then((response = {}) => {
    //     const { clientPortalConfigUpdate = {} } = response.data || {};
    //     if (clientPortalConfigUpdate) {
    //       routerUtils.setParams(history, { _id: clientPortalConfigUpdate._id });
    //     }
    //     Alert.success('Successfully updated the Client portal config');
    //     if (closeModal) {
    //       closeModal();
    //     }
    //   })
    //   .catch(e => Alert.error(e.message));
  };

  const updatedProps = {
    queryParams,
    history,
    // loading,
    config: {},
    handleUpdate
  };

  return <Register {...updatedProps} />;
}

export default ClientPortalDetailContainer;
