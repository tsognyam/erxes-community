import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';

type Props = {
  object?;
} & ICommonFormProps;

class Form extends React.Component<Props & ICommonFormProps, {}> {
  generateDoc = (values: {
    id?: number;
    name: string;
    currencyCode: string;
    content: string;
  }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues.id = object.id;
    }

    return {
      id: finalValues.id,
      name: finalValues.name,
      currencyCode: finalValues.currencyCode
    };
  };

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);
    console.log('this.props', this.props);
    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Name</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            type="text"
            required={true}
            autoFocus={true}
          />
          <ControlLabel required={true}>CurrencyCode</ControlLabel>
          <FormControl
            {...formProps}
            name="currencyCode"
            defaultValue={object.currencyCode}
            type="text"
            required={true}
            autoFocus={true}
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
        object={this.props.object}
      />
    );
  }
}

export default Form;
