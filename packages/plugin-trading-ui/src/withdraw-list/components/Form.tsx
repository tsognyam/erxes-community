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
import client from '@erxes/ui/src/apolloClient';
import gql from 'graphql-tag';
import { queries } from '../../graphql';
import { displayValue } from '../../App';
import { Button, confirm } from '@erxes/ui/src';
type Props = {
  withdraw: any;
  onConfirm: (id) => void;
  onCancel: (id, userId) => void;
  prefix: any;
  userId: any;
  prefixList: any[];
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
  walletList: any[];
};
class Forms extends React.Component<Props, State> {
  preList;
  constructor(props) {
    super(props);
    const { withdraw, prefix, userId } = this.props;

    let prefixList = this.props.prefixList || ([] as any);
    this.preList = prefixList.map(x => {
      return {
        value: x.prefix,
        label: x.prefix
      };
    });
    console.log(this.preList);
    this.state = {
      prefix: prefix,
      userId: userId,
      walletId: withdraw?.walletId,
      amount: withdraw?.amount,
      type: withdraw?.type,
      description: withdraw?.description,
      avBalance: 0,
      walletList: []
    };
  }
  componentDidMount(): void {
    let { withdraw } = this.props;

    if (withdraw) {
      this.prefixChange({
        label: this.state.prefix,
        value: this.state.prefix
      });
      this.walletChange({
        value: this.state.walletId
      });
    }
  }
  generateDoc = (values: {
    id?: number;
    type: number;
    amount: string;
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
      amount: Number(finalValues.amount),
      walletId: Number(this.state.walletId),
      description: finalValues.description
    };
  };
  typeChange = (option: { value: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ type: parseInt(value) });
  };
  walletChange = (option: { value: number }) => {
    const value = !option ? '' : option.value;
    this.setState({ walletId: Number(value) });
    client
      .query({
        query: gql(queries.tradingWallets),
        fetchPolicy: 'network-only',
        variables: { walletIds: [value] }
      })
      .then(({ data }: any) => {
        if (data?.tradingWallets.length > 0) {
          this.setState({
            avBalance: displayValue(
              data.tradingWallets[0].walletBalance.balance -
                data.tradingWallets[0].walletBalance.holdBalance,
              'raw-number'
            )
          });
        } else this.setState({ avBalance: displayValue('0', 'raw-number') });
      });
  };
  prefixChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value;
    const label = !option ? '' : option.label;
    console.log('label', label);
    this.setState({ prefix: value });
    client
      .query({
        query: gql(queries.tradingUserByPrefix),
        fetchPolicy: 'network-only',
        variables: { prefix: value }
      })
      .then(({ data }: any) => {
        if (data?.tradingUserByPrefix.values[0].Wallet.length > 0) {
          let walletList = data.tradingUserByPrefix.values[0].Wallet.map(x => {
            return {
              value: x.id,
              label: x.name + ' - ' + x.currencyCode
            };
          });
          this.setState({
            walletList: walletList
          });
        } else this.setState({ walletList: [] });
      });
  };
  cancelOrder = e => {
    const { withdraw, onCancel } = this.props;
    e.stopPropagation();
    const message = 'Are you sure?';

    confirm(message).then(() => {
      onCancel(withdraw.id, withdraw.wallet.user.userId);
    });
  };
  confirmOrder = e => {
    const { withdraw, onConfirm } = this.props;
    e.stopPropagation();
    const message = 'Are you sure?';

    confirm(message).then(() => {
      onConfirm(withdraw.id);
    });
  };
  renderButtons = props => {
    const { withdraw } = this.props;
    return (
      <>
        {withdraw != undefined ? (
          <>
            <Button btnStyle="danger" onClick={this.cancelOrder}>
              Reject
            </Button>
            <Button onClick={this.confirmOrder}>Confirm</Button>
          </>
        ) : (
          this.props.renderButton(props)
        )}
      </>
    );
  };
  renderContent = (formProps: IFormProps) => {
    const withdraw = this.props.withdraw || undefined;

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>

          <Select
            placeholder={__('Сонгох')}
            value={this.state.prefix}
            options={_.sortBy(this.preList, ['label'])}
            onChange={this.prefixChange}
            required={true}
            disabled={withdraw != undefined ? true : false}
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
            disabled={withdraw != undefined ? true : false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Данс сонгох')}</ControlLabel>
          <Select
            placeholder={__('Wallet')}
            value={this.state.walletId}
            options={_.sortBy(this.state.walletList, ['label'])}
            onChange={this.walletChange}
            required={true}
            disabled={withdraw != undefined ? true : false}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Дансны үлдэгдэл')}</ControlLabel>
          <FormControl
            name="avBalance"
            disabled={true}
            value={this.state.avBalance}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Мөнгөн дүн')}</ControlLabel>
          <FormControl
            {...formProps}
            name="amount"
            type="number"
            value={this.state.amount}
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
        renderButton={this.renderButtons}
        object={this.props.withdraw}
      />
    );
  }
}

export default Forms;
