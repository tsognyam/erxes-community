import { IContext } from '../../connectionResolver';

const templateQueries = {
  registerorders(
    _root,
    {
      typeId,
      searchValue,
      registerorderIds
    }: { typeId: string; searchValue?: string; registerorderIds?: string[] },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };
    if (typeId) {
      selector.typeId = typeId;
    }

    if (searchValue) {
      selector.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    if (registerorderIds) {
      selector._id = { $in: registerorderIds };
    }

    // return models.Templates.find({});
    return models.Templates.find(selector).sort({ order: 1, name: 1 });
  },

  registerorderTypes(_root, _args, { models }: IContext) {
    return models.Types.find({});
  },

  registerordersTotalCount(_root, _args, { models }: IContext) {
    return models.Templates.find({}).countDocuments();
  }
};

export default templateQueries;
