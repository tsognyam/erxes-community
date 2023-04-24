import React from 'react';
import Sidebar from '../components/Sidebar';
import { IRouterProps } from '@erxes/ui/src/types';
import { withProps } from '@erxes/ui/src/utils';
import { withRouter } from 'react-router-dom';
import * as compose from 'lodash.flowright';
type Props = {
  queryParams: any;
};

type FinalProps = Props & IRouterProps;

const SidebarContainer = (props: FinalProps) => {
  const updatedProps = {
    ...props
  };

  return <Sidebar {...updatedProps} />;
};

export default withProps<Props>(
  compose()(withRouter<FinalProps>(SidebarContainer))
);
