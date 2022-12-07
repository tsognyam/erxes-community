import React from 'react';
import * as compose from 'lodash.flowright';
import { withProps } from '@erxes/ui/src/utils';
import ChangeCommission from '../components/ChangeCommission';

type Props = {
  bulk: any;
  type?: string;
};

const ChangeCommissionContainer = (props: Props) => {
  return <ChangeCommission bulk={props.bulk} type={props.type} />;
};

export default withProps(compose()(ChangeCommissionContainer));
