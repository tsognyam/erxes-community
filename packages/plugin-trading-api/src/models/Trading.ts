import { Model } from 'mongoose';
import * as _ from 'underscore';
import { IModels } from '../connectionResolver';
import {
  ITradingSystems,
  ITradingSystemsDocument,
  tradingSystemsSchema
} from './definitions/systems';

export interface ITradingSystemsModel extends Model<ITradingSystemsDocument> {
  getTradingSystem(_id: string): Promise<ITradingSystemsDocument>;
  createTradingSystem(doc: ITradingSystems): Promise<ITradingSystemsDocument>;
  updateTradingSystem(
    _id: string,
    doc: ITradingSystems
  ): Promise<ITradingSystemsDocument>;
  removeTradingSystem(_id: string): void;
}

export const loadTradingClass = (models: IModels) => {
  class Trading {
    public static async createTradingSystem(doc: ITradingSystems) {
      return models.TradingSystems.create({
        ...doc,
        createdAt: new Date()
      });
    }
  }

  tradingSystemsSchema.loadClass(Trading);

  return tradingSystemsSchema;
};
