import { Document, Schema } from 'mongoose';
import { field, schemaHooksWrapper } from './utils';

export interface ITradingSystems {
  name: string;
  value: string;
  createdAt: Date;
}

export interface ITradingSystemsDocument extends ITradingSystems, Document {
  _id: string;
}

export const tradingSystemsSchema = schemaHooksWrapper(
  new Schema({
    _id: field({ pkey: true }),
    name: field({ type: String, label: 'Name' }),
    value: field({ type: String, label: 'Value' }),
    createdAt: field({
      type: Date,
      default: new Date(),
      label: 'Created Date for new system'
    })
  }),
  'erxes_trading_systems'
);
