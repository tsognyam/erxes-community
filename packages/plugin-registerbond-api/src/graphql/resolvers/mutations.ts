import { IContext } from '../../connectionResolver';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';
import { ITemplate, IType } from '../../models/definitions/template';
import { putUpdateLog } from '@erxes/api-utils/src/logUtils';
import messageBroker from '../../messageBroker';

interface ITemplateEdit extends ITemplate {
  _id: string;
}

const templateMutations = {
  /**
   * Creates a new registerbond
   */
  async registerbondsAdd(_root, doc: ITemplate, { models }: IContext) {
    const template = await models.Templates.createTemplate(doc);

    return template;
  },
  /**
   * Edits a new registerbond
   */
  async registerbondsEdit(
    _root,
    { _id, ...doc }: ITemplateEdit,
    { models, subdomain, user }: IContext
  ) {
    const registerbond = await models.Templates.getTemplate(_id);
    const updated = await models.Templates.updateTemplate(_id, doc);
    await putUpdateLog(
      subdomain,
      messageBroker(),
      { type: 'registerbond', object: registerbond, newData: doc },
      user
    );

    return updated;
  },
  /**
   * Removes a single registerbond
   */
  async registerbondsRemove(_root, { _id }, { models }: IContext) {
    const template = await models.Templates.removeTemplate(_id);
    return template;
  },

  /**
   * Creates a new type for registerbond
   */
  async registerbondTypesAdd(_root, doc: ITemplate, { models }: IContext) {
    const type = await models.Types.createType(doc);
    return type;
  },

  async registerbondTypesRemove(_root, { _id }, { models }: IContext) {
    const type = await models.Types.removeType(_id);
    return type;
  },

  async registerbondTypesEdit(
    _root,
    { _id, ...doc }: ITemplateEdit,
    { models, subdomain, user }: IContext
  ) {
    const type = await models.Types.getType(_id);
    const updated = await models.Types.updateType(_id, doc);
    await putUpdateLog(
      subdomain,
      messageBroker(),
      { type: 'type', object: type, newData: doc },
      user
    );

    return updated;
  }
};

// commented out for testing purposes
// requireLogin(templateMutations, 'registerbondsAdd');

export default templateMutations;
