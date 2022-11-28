import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { PREFIX, TYPE, ORDER_TYPE, TIME_FRAME } from '../../constants';
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
        <FormGroup horizontal>
          <ControlLabel>{__('Your Account Balance')}:</ControlLabel>{' '}
          {(2500000).toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
          ₮
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          <FormControl
            componentClass="select"
            defaultValue={object.prefix}
            type="number"
            options={PREFIX}
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
          <ControlLabel>{__('Lowest Price')}</ControlLabel>
          <FormControl
            {...formProps}
            name="lowestPrice"
            defaultValue={object.price}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Highest Price')}</ControlLabel>
          <FormControl
            {...formProps}
            name="highestPrice"
            defaultValue={object.price}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Potential Balance')}</ControlLabel>
          <FormControl
            {...formProps}
            name="potentialBalance"
            disabled
            defaultValue={object.price}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Quantity')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.quantity}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Time Frame')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={TIME_FRAME}
            defaultValue={object.timeframe}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Commission')}</ControlLabel>
          <FormControl
            {...formProps}
            name="commission"
            defaultValue={object.commission}
            type="number"
            disabled
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Total (sum + commission)')}</ControlLabel>
          <FormControl
            {...formProps}
            name="total"
            defaultValue={object.total}
            type="number"
            disabled
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
