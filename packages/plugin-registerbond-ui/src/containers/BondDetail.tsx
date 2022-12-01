import * as compose from 'lodash.flowright';

import { withProps } from '@erxes/ui/src/utils';

import React from 'react';
import BondDetail from '../components/detail/BondDetail';
import { router as routerUtils } from '@erxes/ui/src/utils';
import queryString from 'query-string';

type Props = {
  _id: string;
  queryParams: any;
  history: any;
};

type FinalProps = {
  channelsQuery: any; //check - ChannelsQueryResponse
  skillsQuery: any; //check - SkillsQueryResponse
  skillTypesQuery: any; //check - SkillTypesQueryResponse
  userExcludeSkill: (params: {
    variables: { _id: string; memberIds: string[] };
  }) => Promise<void>;
};

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

const defaultParams = ['id'];

const BondDetailContainer = (props: Props & FinalProps) => {
  const {
    channelsQuery = {} as any, //check - ChannelsQueryResponse
    skillsQuery = {} as any, // check - SkillsQueryResponse
    skillTypesQuery = {} as any, //check - SkillTypesQueryResponse
    userExcludeSkill,
    history
  } = props;

  const onSearch = (search: string, type: string) => {
    if (!search) {
      return routerUtils.removeParams(history, type);
    }

    routerUtils.setParams(history, search);
  };

  const onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(history);

    if (params[key] === values) {
      return routerUtils.removeParams(history, key);
    }

    return routerUtils.setParams(history, { [key]: values });
  };

  const clearFilter = () => {
    const params = generateQueryParams(history);

    const remainedParams = Object.keys(params).filter(
      key => !defaultParams.includes(key)
    );

    routerUtils.removeParams(history, ...remainedParams);
  };

  const updatedProps = {
    ...props,
    channels: channelsQuery.channels || [],
    skills: skillsQuery.skills || [],
    clearFilter,
    onSearch,
    onSelect
  };

  return <BondDetail {...updatedProps} />;
};

export default withProps<Props>(compose()(BondDetailContainer));
