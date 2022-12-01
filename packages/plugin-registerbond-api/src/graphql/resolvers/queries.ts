import { IContext } from '../../connectionResolver';

const templateQueries = {
  registerbonds(
    _root,
    {
      typeId,
      searchValue,
      registerbondIds
    }: { typeId: string; searchValue?: string; registerbondIds?: string[] },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };
    if (typeId) {
      selector.typeId = typeId;
    }

    if (searchValue) {
      selector.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    if (registerbondIds) {
      selector._id = { $in: registerbondIds };
    }

    // return models.Templates.find({});
    return models.Templates.find(selector).sort({ order: 1, name: 1 });
  },

  registerbondTypes(_root, _args, { models }: IContext) {
    return models.Types.find({});
  },

  registerbondsTotalCount(_root, _args, { models }: IContext) {
    return models.Templates.find({}).countDocuments();
  }
};

export default templateQueries;
