import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { TYPE, ORDER_TYPE, WITHDRAW_TYPE } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
type Props = {
  withdraw: any;
  prefix: any;
  userId: any;
  prefixList: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};
type State = {
  prefix: string;
  userId: string;
  walletId: number;
  type: number;
  amount: number;
  description: string;
  avBalance: number;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { withdraw, prefix, userId } = this.props;
    this.state = {
      prefix: prefix,
      userId: userId,
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
  typeChange = (option: { value: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ type: parseInt(value) });
  };
  prefixChange = (option: { value: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ type: parseInt(value) });
  };
  renderContent = (formProps: IFormProps) => {
    const withdraw = this.props.withdraw || ({} as any);
    const prefixList = this.props.prefixList.map(x => {
      return {
        value: x.userId,
        label: x.prefix
      };
    });
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          {/* <FormControl
            {...formProps}
            name="prefix"

          /> */}
          <Select
            placeholder={__('Сонгох')}
            value={this.state.userId}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.typeChange}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Төрөл сонгох')}</ControlLabel>
          <Select
            placeholder={__('Сонгох')}
            value={this.state.type}
            options={WITHDRAW_TYPE}
            onChange={this.typeChange}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Данс сонгох')}</ControlLabel>
          <Select
            placeholder={__('Prefix')}
            options={_.sortBy(prefixList, ['label'])}
            // onChange={this.prefixChange}
            required={true}
          />
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
