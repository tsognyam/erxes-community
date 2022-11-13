import { IContext } from '../../connectionResolver';

const templateQueries = {
  nominals(
    _root,
    {
      typeId,
      searchValue,
      nominalIds
    }: { typeId: string; searchValue?: string; nominalIds?: string[] },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };
    if (typeId) {
      selector.typeId = typeId;
    }

    if (searchValue) {
      selector.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    if (nominalIds) {
      selector._id = { $in: nominalIds };
    }

    // return models.Templates.find({});
    return models.Templates.find(selector).sort({ order: 1, name: 1 });
  },

  nominalTypes(_root, _args, { models }: IContext) {
    return models.Types.find({});
  },

  nominalsTotalCount(_root, _args, { models }: IContext) {
    return models.Templates.find({}).countDocuments();
  }
};

export default templateQueries;
