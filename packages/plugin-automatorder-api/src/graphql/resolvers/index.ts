import customScalars from '@erxes/api-utils/src/customScalars';

import mutations from './mutations';
import queries from './queries';
import { IContext } from '../../connectionResolver';
import { ITemplateDocument } from '../../models/definitions/template';

const Automatorder = {
  currentType(automatorder: ITemplateDocument, _args, { models }: IContext) {
    return models.Types.findOne({ _id: automatorder.typeId });
  }
};

const resolvers: any = async serviceDiscovery => ({
  ...customScalars,
  Automatorder,
  Mutation: {
    ...mutations
  },
  Query: {
    ...queries
  }
});

export default resolvers;
