import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { TRANSACTION_ACCOUNTS } from '../../constants';

type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

class Forms extends React.Component<Props & ICommonFormProps> {
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
          <ControlLabel>{__('Choose Transaction Account')}</ControlLabel>
          <FormControl
            componentClass="select"
            defaultValue={object.transactionAccount}
            options={TRANSACTION_ACCOUNTS}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Transaction Amount')}</ControlLabel>
          <FormControl
            {...formProps}
            type="number"
            name="transactionAmount"
            defaultValue={object.transactionAmount}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Transaction Mean')}</ControlLabel>
          <FormControl
            {...formProps}
            name="transactionMean"
            componentClass="textarea"
            defaultValue={object.transactionMean}
            type="text"
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
