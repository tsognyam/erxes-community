import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import {
  PREFIX,
  STOCK,
  TYPE,
  ORDER_TYPE,
  STOCKTYPE,
  EXCHANGE,
  IPO,
  WITHDRAW_TYPE
} from '../../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Table, Tabs, TabTitle } from '@erxes/ui/src';
import { TabContainer } from '@erxes/ui/src/components/tabs/styles';
import { TabCaption } from '@erxes/ui/src/components/tabs/styles';
import { TabContent } from '@erxes/ui/src/styles/main';
import Select from 'react-select-plus';
// import Row from './custFee/Row';
// import List from '../containers/custFee/List';
type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;
type State = {
  walletId: number;
  type: number;
  amount: number;
  // description: string;
  avBalance: number;
};
class Forms extends React.Component<Props & ICommonFormProps, State> {
  constructor(props) {
    super(props);
    const { object } = this.props;
    const avBalance =
      object?.walletBalance.balance - object?.walletBalance.holdBalance;
    this.state = {
      walletId: object?.walletId,
      amount: object?.amount,
      type: object?.type,
      // description: object?.description,
      avBalance: avBalance
    };
  }

  generateDoc = (values: { amount: string; type: string }) => {
    const { object } = this.props;
    const finalValues = values;
    return {
      walletId: object.id,
      type: this.state.type,
      amount: parseInt(finalValues.amount)
    };
  };
  typeChange = (option: { value: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ type: parseInt(value) });
  };
  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Төрөл сонгох')}</ControlLabel>
          <Select
            {...formProps}
            placeholder={__('Сонгох')}
            value={this.state.type}
            options={WITHDRAW_TYPE}
            onChange={this.typeChange}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Боломжит дүн')}</ControlLabel>
          <FormControl
            {...formProps}
            name="avBalance"
            type="number"
            value={this.state.avBalance}
            defaultValue={0}
            disabled
          ></FormControl>
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Мөнгөн дүн')}</ControlLabel>
          <FormControl
            {...formProps}
            name="amount"
            type="number"
            placeholder={__('Оруулах дүн')}
            defaultValue={0}
            required
          ></FormControl>
        </FormGroup>
      </>
    );
  };

  render() {
    return (
      <CommonForm
        {...this.props}
        name="withdrawal"
        renderContent={this.renderContent}
        generateDoc={this.generateDoc}
        renderButton={this.props.renderButton}
        object={this.props.object}
      />
    );
  }
}

export default Forms;
