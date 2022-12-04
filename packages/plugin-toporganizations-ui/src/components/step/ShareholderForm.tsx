import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = {
  object?;
  renderButton?: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

class Forms extends React.Component<Props> {
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

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Full Name')}</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="fullName"
            autoFocus={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Holding Shares')}</ControlLabel>
          <FormControl {...formProps} name="holdingShares" type="text" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Has Other Companies Share')}</ControlLabel>
          <FormControl {...formProps} name="name" type="text" />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Same Interest  Person')}</ControlLabel>
          <FormControl {...formProps} name="sameInterestPerson" type="text" />
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
