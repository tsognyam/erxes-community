import { IContext } from '../../../connectionResolver';

const SystemQueries = {
  tradingSystems(
    _root,
    { searchValue, systemIds }: { searchValue?: string; systemIds: string[] },
    { models, commonQuerySelector }: IContext
  ) {
    const selector: any = { ...commonQuerySelector };
    if (searchValue) {
      selector.name = new RegExp(`.*${searchValue}.*`, 'i');
    }
    if (systemIds) {
      selector._id = { $in: systemIds };
    }
    return models.TradingSystems.find(selector).sort({
      order: 1,
      name: 1
    });
  },
  tradingSystemDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.TradingSystems.findOne({ _id });
  }
};
export default SystemQueries;
