import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import { ITradingSystemsModel, loadTradingClass } from './models/Trading';
import { ITradingSystemsDocument } from './models/definitions/systems';
export interface IModels {
  TradingSystems: ITradingSystemsModel;
}
export interface ICpUser {
  userId: string;
  type?: string | null;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
  cpUser?: ICpUser;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  models.TradingSystems = db.model<
    ITradingSystemsDocument,
    ITradingSystemsModel
  >('trading_systems', loadTradingClass(models));

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
