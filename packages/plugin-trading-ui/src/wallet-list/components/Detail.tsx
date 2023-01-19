import { MailBox, UserHeader } from '@erxes/ui-contacts/src/customers/styles';
import { __, renderFullName } from 'coreui/utils';

import ActionSection from './ActionSection';
import ActivityInputs from '@erxes/ui-log/src/activityLogs/components/ActivityInputs';
import ActivityLogs from '@erxes/ui-log/src/activityLogs/containers/ActivityLogs';

import { IButtonMutateProps, IField } from '@erxes/ui/src/types';
import { IFieldsVisibility } from '@erxes/ui-contacts/src/customers/types';
import Icon from '@erxes/ui/src/components/Icon';
import InfoSection from '@erxes/ui-contacts/src/customers/components/common/InfoSection';
import LeadState from '@erxes/ui-contacts/src/customers/containers/LeadState';
// import LeftSidebar from './LeftSidebar';
import MailForm from '@erxes/ui-inbox/src/settings/integrations/containers/mail/MailForm';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import React from 'react';
// import RightSidebar from './RightSidebar';
import { TabTitle } from '@erxes/ui/src/components/tabs';
import Widget from '@erxes/ui-engage/src/containers/Widget';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { isEnabled } from '@erxes/ui/src/utils/core';
import Tab from './Tab';
import { Table } from '@erxes/ui/src';
import { Contents } from '../../styles';
import WalletRow from './wallet/walletRow';
import { USER_STATUS } from '../../constants';
import { displayValue } from '../../App';

type Props = {
  customer: any;
  fieldsVisibility: (key: string) => IFieldsVisibility;
  deviceFields: IField[];
  fields: IField[];
  taggerRefetchQueries?: any[];
  deviceFieldsVisibility: (key: string) => IFieldsVisibility;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Detail extends React.Component<Props> {
  renderEmailTab = () => {
    const { customer } = this.props;

    if (!customer.primaryEmail) {
      return null;
    }

    const triggerEmail = (
      <TabTitle>
        <Icon icon="envelope-add" /> {__('New email')}
      </TabTitle>
    );

    const content = props => (
      <MailBox>
        <MailForm
          fromEmail={customer.primaryEmail}
          refetchQueries={['activityLogsCustomer']}
          closeModal={props.closeModal}
        />
      </MailBox>
    );

    return (
      <ModalTrigger
        dialogClassName="middle"
        title="Email"
        trigger={triggerEmail}
        size="xl"
        content={content}
        paddingContent="less-padding"
        enforceFocus={false}
      />
    );
  };

  renderExtraTabs = () => {
    const triggerMessenger = (
      <TabTitle>
        <Icon icon="comment-plus" /> {__('New message')}
      </TabTitle>
    );

    if (isEnabled('engages')) {
      return (
        <>
          {/* <Widget
            customers={[this.props.customer]}
            modalTrigger={triggerMessenger}
            channelType="messenger"
            forceCreateConversation={true}
          /> */}
        </>
      );
    }

    return null;
  };
  renderContent = () => {
    const { customer, renderButton } = this.props;

    return (
      <>
        <></>

        <Table>
          <thead>
            <tr>
              <th>{__('Index')}</th>
              <th>{__('Name')}</th>
              <th>{__('Currency')}</th>
              <th>{__('Balance')}</th>
              <th>{__('Av.balance')}</th>
              <th>{__('Hold balance')}</th>
              <th>{__('Wait balance')}</th>
              <th>{__('Status')}</th>
              <th>{__('CreatedAt')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="wallet">
            {(customer.Wallet || []).map((wallet, index) => (
              <WalletRow
                index={index}
                wallet={wallet}
                renderButton={renderButton}
              />
            ))}
          </tbody>
        </Table>
      </>
    );
  };
  render() {
    const {
      customer,
      deviceFields,
      fields,
      taggerRefetchQueries,
      fieldsVisibility,
      deviceFieldsVisibility
    } = this.props;
    console.log('customer', customer);
    const breadcrumb = [
      { title: __('Account'), link: '/account' },
      { title: renderFullName(customer) }
    ];

    const content = (
      <>
        <Contents>
          <div>ҮЦ дансны дугаар: {customer.bdcAccountId}</div>
          <div>Префикс: {customer.fullPrefix}</div>
          <div>Төлөв: {USER_STATUS.find(item => { return item.status == customer.status })?.description}</div>
          <div>Шинэчлэгдсэн огноо: {customer.updatedAt != null ? displayValue(customer.updatedAt, 'date') : displayValue(customer.createdAt, 'date')}</div>
        </Contents>
        <Contents headers="Wallet list" hasBorder={true}>
          {this.renderContent()}
        </Contents>
        <Tab contentType="account" object={customer} />
      </>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={renderFullName(customer)}
            breadcrumb={breadcrumb}
          />
        }
        mainHead={
          <UserHeader>
            <InfoSection avatarSize={40} customer={customer}>
              <ActionSection customer={customer} />
            </InfoSection>
          </UserHeader>
        }
        content={content}
        transparent={true}
      />
    );
  }
}

export default Detail;
