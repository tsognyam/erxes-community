import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import Uploader from '@erxes/ui/src/components/Uploader';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps
} from '@erxes/ui/src/types';

type Props = {
  object?;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

type State = {
  attachment: any;
};

class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      attachment: {}
    };
  }

  generateDoc = (values: { _id?: string; name: string; content: string }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues._id = object._id;
    }

    return {
      _id: finalValues._id,
      name: finalValues.name
    };
  };

  onChangeAttachment = (files: IAttachment[]) => {
    this.setState({ attachment: files ? files[0] : undefined });
  };

  renderContent = (formProps: IFormProps) => {
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Company Name')}</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="fullName"
            autoFocus={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Symbol')}</ControlLabel>
          <FormControl {...formProps} name="holdingShares" type="text" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Brief Description')}</ControlLabel>
          <FormControl {...formProps} name="name" type="text" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Date')}</ControlLabel>
          <FormControl {...formProps} name="sameInterestPerson" type="text" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('File')}</ControlLabel>
          <Uploader
            text={`Choose a file to attach.`}
            single={true}
            defaultFileList={[]}
            onChange={this.onChangeAttachment}
          />
        </FormGroup>
      </>
    );
  };

  render() {
    return (
      <CommonForm
        {...this.props}
        name="name"
        renderContent={this.renderContent}
        generateDoc={this.generateDoc}
        renderButton={this.props.renderButton}
        object={this.props.object}
      />
    );
  }
}

export default Forms;
