import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from 'coreui/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { PREFIX, STOCK, TYPE, ORDER_TYPE } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';

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
          <ControlLabel>{__('Prefix')}</ControlLabel>
          <FormControl
            componentClass="select"
            defaultValue={object.prefix}
            options={PREFIX}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Register number')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.register}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Name')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.name}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={STOCK}
            defaultValue={object.stock}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Type')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={TYPE}
            defaultValue={object.type}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Order Type')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={ORDER_TYPE}
            defaultValue={object.orderType}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Price')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.price}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Quantity')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.quantity}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Successful')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.successful}
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
