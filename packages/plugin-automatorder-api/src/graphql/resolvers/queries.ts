import { IContext } from '../../connectionResolver';

const templateQueries = {
  automatorders(
    _root,
    {
      typeId,
      searchValue,
      automatorderIds
    }: { typeId: string; searchValue?: string; automatorderIds?: string[] },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };
    if (typeId) {
      selector.typeId = typeId;
    }

    if (searchValue) {
      selector.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    if (automatorderIds) {
      selector._id = { $in: automatorderIds };
    }

    // return models.Templates.find({});
    return models.Templates.find(selector).sort({ order: 1, name: 1 });
  },

  automatorderTypes(_root, _args, { models }: IContext) {
    return models.Types.find({});
  },

  automatordersTotalCount(_root, _args, { models }: IContext) {
    return models.Templates.find({}).countDocuments();
  }
};

export default templateQueries;
