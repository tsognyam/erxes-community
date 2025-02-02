import { Document, Schema } from 'mongoose';
import { field, schemaWrapper } from './utils';

export interface IBrandEmailConfig {
  email?: string;
  type?: string;
  template?: string;
}

export interface IBrand {
  code?: string;
  name?: string;
  description?: string;
  memberIds?: string[];
  userId?: string;
  emailConfig?: IBrandEmailConfig;
}

export interface IBrandDocument extends IBrand, Document {
  _id: string;
  createdAt: Date;
}

// Mongoose schemas ===========
export const brandEmailConfigSchema = new Schema(
  {
    type: field({
      type: String,
      enum: ['simple', 'custom'],
      label: 'Type'
    }),
    template: field({ type: String, label: 'Template', optional: true }),
    email: field({
      type: String,
      label: 'Email',
      optional: true
    })
  },
  { _id: false }
);

export const brandSchema = schemaWrapper(
  new Schema({
    _id: field({ pkey: true }),
    code: field({ type: String, label: 'Code' }),
    name: field({ type: String, label: 'Name' }),
    description: field({
      type: String,
      optional: true,
      label: 'Description'
    }),
    memberIds: field({ type: [String], label: 'Members' }),
    userId: field({ type: String, label: 'Created by' }),
    createdAt: field({ type: Date, label: 'Created at' }),
    emailConfig: field({
      type: brandEmailConfigSchema,
      label: 'Email config'
    })
  })
);
