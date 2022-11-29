import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import Uploader from '@erxes/ui/src/components/Uploader';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps
} from '@erxes/ui/src/types';

type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

type State = {
  attachment: any;
  signedDate: any;
};

class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      attachment: {},
      signedDate: new Date()
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

  handleSignedDate = signedDate => {
    this.setState({ signedDate });
  };

  renderContent = (formProps: IFormProps) => {
    const { object } = this.props;

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Registry number')}</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="regisry"
            defaultValue={object.registry}
            autoFocus={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('First Name')}</ControlLabel>
          <FormControl
            {...formProps}
            name="firstName"
            defaultValue={object.firstName}
            type="text"
          />
        </FormGroup>
        {Object.keys(object).length === 0 && (
          <FormGroup>
            <ControlLabel>{__('Contract signed date')}</ControlLabel>
            <DateControl
              value={this.state.signedDate}
              required={true}
              name="signedDate"
              onChange={date => this.handleSignedDate(date)}
              placeholder={'Signed Date'}
              dateFormat={'YYYY / MM / DD'}
            />
          </FormGroup>
        )}
        <FormGroup>
          <ControlLabel>{__('Contract Number')}</ControlLabel>
          <FormControl
            {...formProps}
            name="contractNumber"
            defaultValue={object.contractNumber}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Contract')}</ControlLabel>
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
