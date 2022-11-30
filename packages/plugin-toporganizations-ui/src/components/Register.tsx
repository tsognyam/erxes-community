import {
  GeneralInformation
  // ChooseType,
  // FormStep,
  // FullPreview,
  // OptionStep,
  // SuccessStep
} from './step';
import { IAttachment, IConditionsRule } from '@erxes/ui/src/types';
import { ILeadData, ILeadIntegration } from '@erxes/ui-leads/src/types';
import { Step, Steps } from '@erxes/ui/src/components/step';

import { Alert } from '@erxes/ui/src/utils';
import Button from '@erxes/ui/src/components/Button';
import ConditionsRule from '@erxes/ui/src/components/rule/ConditionsRule';
import { Content } from '@erxes/ui-inbox/src/settings/integrations/styles';
import { ControlWrapper } from '@erxes/ui/src/components/step/styles';
import { IConfig } from '@erxes/ui-settings/src/general/types';
import { IField } from '@erxes/ui/src/types';
import { IFormData } from '@erxes/ui-forms/src/forms/types';
import { Indicator } from '@erxes/ui/src/components/step/styles';
import { LeftContent } from '@erxes/ui-inbox/src/settings/integrations/styles';
import { Link } from 'react-router-dom';
import { PreviewWrapper } from '@erxes/ui/src/components/step/style';
import React from 'react';
import { SmallLoader } from '@erxes/ui/src/components/ButtonMutate';
import { StepWrapper } from '@erxes/ui/src/components/step/styles';
// import StyleSheetStep from './step/StyleSheetStep';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from '@erxes/ui/src/utils/core';

type Props = {
  integration?: ILeadIntegration;
  loading?: boolean;
  isActionLoading: boolean;
  isReadyToSaveForm: boolean;
  configs: IConfig[];
  emailTemplates?: any[] /*change type*/;
  afterFormDbSave: (formId: string) => void;
  save: (params: {
    name: string;
    brandId: string;
    languageCode?: string;
    general: ILeadData;
    channelIds?: string[];
    visibility?: string;
    departmentIds?: string[];
  }) => void;
};

type State = {
  title?: string;
  carousel: string;
  registryNumber?: string;
  companyName?: string;
  phoneNumber?: string;
  email?: string;
  establishedDate?: any;
  registeredDate?: any;
  address?: string;
  stockType?: string;
  businessDirection?: string;
  activityDirection?: string;
  actionField?: string;
  operationalStatus?: string;
  isin?: string;
  totalShares?: number;
  issuedShares?: number;
  marketValue?: number;
  weeks?: number;
};

class Lead extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    //ILeadIntegration
    const integration = props.integration || ({} as any);

    const { general = {} as ILeadData } = integration;
    const callout = general.callout || {};
    const form = integration.form || ({} as any);
    const channels = integration.channels || [];

    this.state = {
      title: integration.name || 'Create Form',
      carousel: 'form',
      establishedDate: new Date(),
      registeredDate: new Date()
    };
  }

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { title } = this.state;

    if (!title) {
      return Alert.error('Enter a Form name');
    }

    const doc = {
      name: title,
      general: {
        registryNumber: this.state.registryNumber,
        companyName: this.state.companyName,
        phoneNumber: this.state.phoneNumber,
        email: this.state.email,
        establishedDate: this.state.establishedDate,
        registeredDate: this.state.registeredDate,
        address: this.state.address,
        stockType: this.state.stockType,
        businessDirection: this.state.businessDirection,
        activityDirection: this.state.activityDirection,
        actionField: this.state.actionField,
        operationalStatus: this.state.operationalStatus,
        isin: this.state.isin,
        totalShares: this.state.totalShares,
        issuedShares: this.state.issuedShares,
        marketValue: this.state.marketValue,
        weeks: this.state.weeks
      }
    };

    this.props.save(doc);
  };

  onChange = (key: string, value: any) => {
    this.setState({ [key]: value } as any);
  };

  // onFormDocChange = formData => {
  //   this.setState({ formData });
  // };

  // onFormInit = (fields: IField[]) => {
  //   const formData = this.state.formData;
  //   formData.fields = fields;

  //   this.setState({ formData });
  // };

  // onFieldClick = (field: IField) => {
  //   this.setState({ currentMode: 'update', currentField: field });
  // };

  onStepClick = currentStepNumber => {
    let carousel = 'form';
    switch (currentStepNumber) {
      case 7:
        carousel = 'success';
        break;
    }
    return this.setState({ carousel });
  };

  renderButtons = () => {
    const { isActionLoading } = this.props;

    const cancelButton = (
      <Link to="/forms">
        <Button btnStyle="simple" icon="times-circle">
          Cancel
        </Button>
      </Link>
    );

    return (
      <Button.Group>
        {cancelButton}

        <Button
          disabled={isActionLoading}
          btnStyle="success"
          icon={isActionLoading ? undefined : 'check-circle'}
          onClick={this.handleSubmit}
        >
          {isActionLoading && <SmallLoader />}
          Save
        </Button>
      </Button.Group>
    );
  };

  render() {
    const {
      title,
      registryNumber,
      companyName,
      phoneNumber,
      email,
      establishedDate,
      registeredDate,
      address,
      stockType,
      businessDirection,
      activityDirection,
      actionField,
      operationalStatus,
      isin,
      totalShares,
      issuedShares,
      marketValue,
      weeks
    } = this.state;

    const { integration = {} as any, emailTemplates, configs } = this.props;
    const general = integration && integration.general;
    const brand = integration && integration.brand;
    const breadcrumb = [{ title: __('Forms'), link: '/forms' }];

    return (
      <StepWrapper>
        <Wrapper.Header title={__('Forms')} breadcrumb={breadcrumb} />
        <Content>
          <LeftContent>
            <Steps>
              <Step
                img="/images/icons/erxes-04.svg"
                title={__('General Information')}
                onClick={this.onStepClick}
              >
                <GeneralInformation
                  onChange={this.onChange}
                  registryNumber={registryNumber}
                  companyName={companyName}
                  phoneNumber={phoneNumber}
                  email={email}
                  establishedDate={establishedDate}
                  registeredDate={registeredDate}
                  address={address}
                  stockType={stockType}
                  businessDirection={businessDirection}
                  activityDirection={activityDirection}
                  actionField={actionField}
                  operationalStatus={operationalStatus}
                  isin={isin}
                  totalShares={totalShares}
                  issuedShares={issuedShares}
                  marketValue={marketValue}
                  weeks={weeks}
                />
              </Step>
              <Step
                img="/images/icons/erxes-03.svg"
                title="CallOut"
                onClick={this.onStepClick}
              >
                {/* <CallOut
                  onChange={this.onChange}
                  type={type}
                  calloutTitle={calloutTitle}
                  calloutBtnText={calloutBtnText}
                  calloutImgSize={calloutImgSize}
                  bodyValue={bodyValue}
                  color={color}
                  theme={theme}
                  image={logo}
                  skip={isSkip}
                /> */}
              </Step>
              <Step
                img="/images/icons/erxes-12.svg"
                title={'Content'}
                onClick={this.onStepClick}
              >
                {/* <FormStep
                  type={type}
                  color={color}
                  theme={theme}
                  formId={integration && integration.formId}
                  formData={formData}
                  afterDbSave={this.props.afterFormDbSave}
                  onDocChange={this.onFormDocChange}
                  onInit={this.onFormInit}
                  isReadyToSaveForm={this.props.isReadyToSaveForm}
                  currentMode={this.state.currentMode}
                  currentField={this.state.currentField}
                /> */}
              </Step>
            </Steps>
            <ControlWrapper>
              <Indicator>
                {__('You are')} {integration ? 'editing' : 'creating'}{' '}
                <strong>{title}</strong> {__('form')}
              </Indicator>
              {this.renderButtons()}
            </ControlWrapper>
          </LeftContent>
        </Content>
      </StepWrapper>
    );
  }
}

export default Lead;
