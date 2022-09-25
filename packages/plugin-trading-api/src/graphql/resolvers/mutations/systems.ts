import { IContext } from '../../../connectionResolver';
import { putCreateLog } from '../../../logUtils';
import { ITradingSystems } from '../../../models/definitions/systems';
const SystemMutations = {
  async tradingSystemsAdd(
    _root,
    doc: ITradingSystems,
    { docModifier, models, subdomain, user }: IContext
  ) {
    const tradingSystem = await models.TradingSystems.createTradingSystem(
      docModifier(doc)
    );
    await putCreateLog(
      models,
      subdomain,
      { type: 'systems', newData: tradingSystem, object: tradingSystem },
      user
    );
    return tradingSystem;
  }
};
export default SystemMutations;
