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
import gql from 'graphql-tag';
import queries from '../../graphql/queries';
import client from '@erxes/ui/src/apolloClient';
type Props = {
  object: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any[];
  stocks: any[];
  closeModal: () => void;
};
type State = {
  userId: string;
  stockcode: string;
  isPrice: boolean;
  orderType: number;
  price: string;
  txntype: number;
  tradeBalance: string;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { object } = this.props;

    this.state = {
      userId: object?.userId,
      stockcode: object?.stockcode,
      orderType: object?.orderType || 1,
      isPrice: object?.orderType == 2 ? false : true,
      price: object?.price,
      txntype: object?.txntype || 1,
      tradeBalance: this.numberFormat(
        object?.wallet?.walletBalance.tradeBalance
      )
    };
  }
  generateDoc = (values: {
    txnid?: number;
    txntype: number;
    ordertype: number;
    stockcode: number;
    price: number;
    cnt: number;
    enddate: Date;
    userId: string;
  }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues.txnid = object.txnid;
    }
    return {
      txnid: finalValues.txnid,
      enddate: new Date(finalValues.enddate),
      price: this.state.orderType == 1 ? undefined : Number(finalValues.price),
      cnt: Number(finalValues.cnt),
      txntype: Number(this.state.txntype),
      ordertype: Number(this.state.orderType),
      stockcode: Number(this.state.stockcode),
      userId: this.state.userId
    };
  };
  prefixChange = (option: { value: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ userId: value });
    client
      .query({
        query: gql(queries.tradingUserWallets),
        fetchPolicy: 'network-only',
        variables: { userId: value, currencyCode: 'MNT' }
      })
      .then(({ data }: any) => {
        if (data?.tradingUserWallets.length > 0) {
          this.setState({
            tradeBalance: this.numberFormat(
              data.tradingUserWallets[0].walletBalance.tradeBalance
            )
          });
        } else this.setState({ tradeBalance: this.numberFormat('0') });
      });
  };
  numberFormat = (value: string) => {
    if (value == undefined || value == '') value = '0';
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  };
  stockChange = (option: { value: string }) => {
    const value = !option ? '' : option.value.toString();
    this.setState({ stockcode: value });
  };

  orderTypeChange = e => {
    const value = e.target.value;
    this.setState({ orderType: Number(value) });

    if (value == 1) {
      this.setState({ price: '0.00' });
      this.setState({ isPrice: true });
    } else this.setState({ isPrice: false });
  };
  txntypeChange = e => {
    const value = e.target.value;
    this.setState({ txntype: value });
  };
  renderContent = (formProps: IFormProps) => {
    const order = this.props.object || ({} as any);
    const prefixList = this.props.prefix.map(x => {
      return {
        value: x.userId,
        label: x.prefix
      };
    });
    const stockList = this.props.stocks.map(x => {
      return {
        value: x.stockcode,
        label: x.symbol + ' - ' + x.stockname
      };
    });
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          <Select
            placeholder={__('Prefix')}
            value={this.state.userId}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.prefixChange}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Дансны үлдэгдэл')}</ControlLabel>
          <FormControl
            name="tradeBalance"
            disabled={true}
            value={this.state.tradeBalance}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Хувьцаа')}</ControlLabel>
          <Select
            placeholder={__('Хувьцаагаа сонгоно уу')}
            options={_.sortBy(stockList, ['label'])}
            value={this.state.stockcode}
            onChange={this.stockChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Авах/Зарах')}</ControlLabel>
          <FormControl
            name="txntype"
            componentClass="select"
            options={TYPE}
            defaultValue={order.txntype}
            value={this.state.txntype}
            onChange={this.txntypeChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Захиалгын төрөл')}</ControlLabel>
          <FormControl
            name="ordertype"
            componentClass="select"
            options={ORDER_TYPE}
            defaultValue={order.orderType}
            onChange={this.orderTypeChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Үнэ')}</ControlLabel>
          <FormControl
            {...formProps}
            name="price"
            defaultValue={order?.price || 0}
            disabled={this.state.isPrice}
            value={this.state.price}
            min={0}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Тоо ширхэг')}</ControlLabel>
          <FormControl
            {...formProps}
            name="cnt"
            defaultValue={order?.cnt || 1}
            type="number"
            min={1}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Дуусах өдөр')}</ControlLabel>
          <FormControl
            {...formProps}
            type="date"
            defaultValue={dayjs(order.endDate || new Date()).format(
              'YYYY-MM-DD'
            )}
            required={true}
            name="enddate"
            placeholder={'Дуусах өдөр'}
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
