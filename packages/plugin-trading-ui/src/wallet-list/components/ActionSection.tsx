import { Alert, __, confirm } from '@erxes/ui/src/utils';

import { Actions } from '@erxes/ui/src/styles/main';
import Button from '@erxes/ui/src/components/Button';
import CompanyForm from '@erxes/ui-contacts/src/companies/containers/CompanyForm';
import { ControlLabel } from '@erxes/ui/src/components/form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownToggle from '@erxes/ui/src/components/DropdownToggle';
import { ICompany } from '@erxes/ui-contacts/src/companies/types';

import Icon from '@erxes/ui/src/components/Icon';
import MailForm from '@erxes/ui-inbox/src/settings/integrations/containers/mail/MailForm';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import React from 'react';
import SmsForm from '@erxes/ui-inbox/src/settings/integrations/containers/telnyx/SmsForm';

import Tip from '@erxes/ui/src/components/Tip';

type Props = {
  cocType: string;
  // remove: () => void;
  // merge: (doc: { ids: string[]; data: any | ICompany }) => void;
  // search: (value: string, callback: (objects: any[]) => void) => void;
  // changeState?: (value: string) => void;
  isSmall?: boolean;
};
class ActionSection extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderButton() {
    const { isSmall } = this.props;

    return (
      <Button size="small" btnStyle="default">
        {isSmall ? (
          <Icon icon="ellipsis-h" />
        ) : (
          <>
            {__('Action')} <Icon icon="angle-down" />
          </>
        )}
      </Button>
    );
  }

  renderEditButton() {
    const { cocType } = this.props;

    const customerForm = props => {
      // return <CustomerForm {...props} size="lg" customer={coc} />;
    };

    const companyForm = props => {
      // return <CompanyForm {...props} size="lg" company={coc} />;
    };

    return (
      <li>
        <ModalTrigger
          title="Edit basic info"
          trigger={<a href="#edit">{__('Edit')}</a>}
          size="lg"
          content={cocType === 'company' ? companyForm : customerForm}
        />
      </li>
    );
  }

  renderDropdown() {
    const { cocType } = this.props;

    // const onClick = () =>
    //   confirm()
    //     .then(() => remove())
    //     .catch(error => {
    //       Alert.error(error.message);
    //     });

    const generateOptions = customers => {
      return customers.map((cus, key) => ({
        key,
        value: JSON.stringify(cus),
        label:
          cus.firstName ||
          cus.lastName ||
          cus.middleName ||
          cus.primaryEmail ||
          cus.primaryPhone ||
          'Unknown'
      }));
    };

    const targetMergeOptions = companies => {
      return companies.map((c, key) => ({
        key,
        value: JSON.stringify(c),
        label: c.primaryName || c.website || 'Unknown'
      }));
    };

    return (
      <Dropdown>
        <Dropdown.Toggle as={DropdownToggle} id="dropdown-action">
          {this.renderButton()}
        </Dropdown.Toggle>
        <Dropdown.Menu>{this.renderEditButton()}</Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    return <Actions>{this.renderDropdown()}</Actions>;
  }
}

export default ActionSection;
