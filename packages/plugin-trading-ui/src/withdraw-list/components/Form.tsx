import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { TYPE, ORDER_TYPE } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
type Props = {
  withdraw: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};
type State = {
  walletId: number;
  type: number;
  amount: number;
  description: string;
  avBalance: number;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { withdraw } = this.props;
    this.state = {
      walletId: withdraw?.walletId,
      amount: withdraw?.amount,
      type: withdraw?.type,
      description: withdraw?.description,
      avBalance: 0
    };
  }
  generateDoc = (values: {
    id?: number;
    type: number;
    amount: number;
    walletId: number;
    description: string;
  }) => {
    const { withdraw } = this.props;
    const finalValues = values;

    if (withdraw) {
      finalValues.id = withdraw.id;
    }
    return {
      id: finalValues.id,
      type: Number(this.state.type),
      amount: Number(this.state.amount),
      walletId: Number(this.state.walletId),
      description: this.state.description
    };
  };
  // prefixChange = (option: { value: string }) => {
  //   const value = !option ? '' : option.value;
  //   this.setState({ userId: value });
  // };
  renderContent = (formProps: IFormProps) => {
    const withdraw = this.props.withdraw || ({} as any);

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          {/* <Select
            placeholder={__('Prefix')}
            value={this.state.userId}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.prefixChange}
            required={true}
          /> */}
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Дансны үлдэгдэл')}</ControlLabel>
          <FormControl
            name="tradeBalance"
            disabled={true}
            value={this.state.avBalance}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Данс сонгох')}</ControlLabel>
          {/* <FormControl
            name="txntype"
            componentClass="select"
            options={TYPE}
            defaultValue={order.txntype}
            value={this.state.txntype}
            onChange={this.txntypeChange}
          /> */}
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Мөнгөн дүн')}</ControlLabel>
          <FormControl
            {...formProps}
            name="amount"
            defaultValue={withdraw?.amount || 0}
            // disabled={this.state.amount}
            value={this.state.amount}
            min={0}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Тайлбар')}</ControlLabel>
          <FormControl
            {...formProps}
            name="description"
            defaultValue={withdraw?.description || ''}
            type="string"
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
        object={this.props.withdraw}
      />
    );
  }
}

export default Forms;
