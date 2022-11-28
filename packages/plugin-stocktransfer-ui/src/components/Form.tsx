import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { STOCK_COMPANY, STOCK } from '../constants';
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
          <ControlLabel>{__('Last Name')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.lastName}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('First Name')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.firstName}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Register number')}</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="regiter"
            defaultValue={object.register}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Phone')}</ControlLabel>
          <FormControl
            {...formProps}
            type="number"
            defaultValue={object.phone}
            name="phone"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Address')}</ControlLabel>
          <FormControl
            {...formProps}
            name="address"
            defaultValue={object.address}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Request By')}</ControlLabel>
          <FormControl
            {...formProps}
            name="requestBy"
            defaultValue={object.requestBy}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock Company')}</ControlLabel>
          <FormControl
            defaultValue={object.stockCompany}
            componentClass="select"
            options={STOCK_COMPANY}
            disabled={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock Account Number')}</ControlLabel>
          <FormControl
            {...formProps}
            name="account"
            defaultValue={object.stockAccount}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock')}</ControlLabel>
          <FormControl
            defaultValue={object.stock}
            componentClass="select"
            options={STOCK}
            disabled={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Quantity')}</ControlLabel>
          <FormControl
            {...formProps}
            name="quantity"
            defaultValue={object.quantity}
            type="number"
          />
        </FormGroup>
        {Object.keys(object).length === 0 && (
          <FormGroup>
            <ControlLabel>{__('Price')}</ControlLabel>
            <FormControl {...formProps} name="price" type="number" />
          </FormGroup>
        )}
        <FormGroup>
          <ControlLabel>{__('Stock Company to Receive')}</ControlLabel>
          <FormControl
            value={object.stockCompanyToReceive}
            componentClass="select"
            options={STOCK_COMPANY}
            disabled={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock Account to Receive')}</ControlLabel>
          <FormControl
            {...formProps}
            name="quantity"
            defaultValue={object.stockAccountToReceive}
            type="number"
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
