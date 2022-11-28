import { IContext } from '../../connectionResolver';
import { ITemplate } from '../../models/definitions/template';

interface ITemplateEdit extends ITemplate {
  _id: string;
}

const templateMutations = {
  /**
   * Creates a new applicationformoney
   */
  async applicationformoneysAdd(_root, doc: ITemplate, { models }: IContext) {
    const template = await models.Templates.createTemplate(doc);

    return template;
  }
};

// commented out for testing purposes
// requireLogin(templateMutations, 'applicationformoneysAdd');

export default templateMutations;
