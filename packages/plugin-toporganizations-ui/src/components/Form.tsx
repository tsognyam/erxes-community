import Button from '@erxes/ui/src/components/Button';
import { Alert } from '@erxes/ui/src/utils';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import { REGISTER_TYPES } from '../constants';
import General from './step/GeneralInformation';
import { ButtonWrap, Content } from '../styles';
import { RegisterConfig } from '../types';
import Finance from './step/Finance';
import ActivityReport from './step/ActivityReport';

type Props = {
  configType: string;
  defaultConfigValues?: RegisterConfig;
  handleUpdate: (doc: RegisterConfig) => void;
};

type State = {
  formValues: RegisterConfig;
};

class Form extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      formValues: props.defaultConfigValues || ({} as RegisterConfig)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.defaultConfigValues &&
      nextProps.defaultConfigValues !== this.props.defaultConfigValues
    ) {
      this.setState({ formValues: nextProps.defaultConfigValues });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { formValues } = this.state;

    if (!formValues.companyName) {
      return Alert.error('Please enter a company name');
    }

    this.props.handleUpdate(formValues);
  };

  handleFormChange = (name: string, value: string | object | boolean) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: value
      }
    });
  };

  renderContent = () => {
    const commonProps = {
      ...this.state.formValues,
      handleFormChange: this.handleFormChange
    };

    switch (this.props.configType) {
      case REGISTER_TYPES.GENERAL.VALUE:
        return <General {...commonProps} />;
      case REGISTER_TYPES.FINANCE.VALUE:
        return <Finance {...commonProps} />;
      case REGISTER_TYPES.ACTIVITY.VALUE:
        return <ActivityReport {...commonProps} />;
      default:
        return null;
    }
  };

  renderSubmit = () => {
    return (
      <ButtonWrap>
        <Button btnStyle="success" icon="check-circle" type="submit">
          {__('Save')}
        </Button>
      </ButtonWrap>
    );
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Content>
          {this.renderContent()}
          {this.renderSubmit()}
        </Content>
      </form>
    );
  }
}

export default Form;
