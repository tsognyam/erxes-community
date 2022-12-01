import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { IContext } from '../../connectionResolver';
import { ITemplateDocument } from '../../models/definitions/template';

const Registerbond = {
  currentType(registerbond: ITemplateDocument, _args, { models }: IContext) {
    return models.Types.findOne({ _id: registerbond.typeId });
  }
};

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Registerbond,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
