import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import {
  TYPE,
  IPO,
  PREFIX,
  ORDER_PRICE,
  EXPIRE,
  INTEREST_PAYMENT
} from '../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';

type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

type State = {
  selectedBond: any;
};

class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      selectedBond: IPO[0]
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

  onBondChange = e => {
    this.setState({ selectedBond: e });
  };

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);
    const bondValues = IPO.map(p => ({
      label: p.label,
      value: p.value,
      price: p.price,
      closedDate: p.closedDate
    }));

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Bond')}</ControlLabel>
          <Select
            placeholder={__('Filter by Bond')}
            value={object.bond || this.state.selectedBond}
            options={bondValues}
            name="bond"
            onChange={ops => this.onBondChange(ops)}
            loadingPlaceholder={__('Loading...')}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Price')}</ControlLabel>
          <FormControl
            {...formProps}
            name="price"
            defaultValue={this.state.selectedBond.price}
            type="number"
            disabled
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Closed Date')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            value={this.state.selectedBond.closedDate}
            type="text"
            disabled
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          <FormControl
            type="number"
            componentClass="select"
            defaultValue={object.prefix}
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
          <ControlLabel>{__('Order Price')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={ORDER_PRICE}
            defaultValue={object.type}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Potential Balance')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.potentialBalance}
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
          <ControlLabel>{__('Interest Payment')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={INTEREST_PAYMENT}
            defaultValue={object.interestPayment}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Expire')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={EXPIRE}
            defaultValue={object.expire}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Commission by Percent')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.commission}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Total')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.total}
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
