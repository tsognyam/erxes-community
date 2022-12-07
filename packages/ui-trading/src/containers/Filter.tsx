import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import { IRouterProps, Counts } from '@erxes/ui/src/types';
import { router, withProps } from '@erxes/ui/src/utils';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import BankFilter from '../components/BankFilter';
import StockFilter from '../components/StockFilter';
import { queries } from '../graphql';
import { SegmentsQueryResponse } from '../types';

type Props = {};

type FinalProps = {} & Props & IRouterProps;

const FilterContainer = (props: FinalProps) => {
  return (
    <>
      <BankFilter />
      <StockFilter />
    </>
  );
};

export default withProps<Props>(
  compose()(withRouter<FinalProps>(FilterContainer))
);
