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
import { FormWidth } from '../../styles';
type Props = {
  order: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any[];
  stocks: any[];
};
type State = {
  userId: string;
  stockcode: string;
  isPrice: boolean;
  orderType: number;
  price: string;
  txntype: number;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { order } = this.props;
    this.state = {
      userId: order?.userId,
      stockcode: order?.stockcode,
      orderType: order?.orderType || 1,
      isPrice: order?.orderType == 2 ? false : true,
      price: order?.price,
      txntype: order?.txntype || 1
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
    const { order } = this.props;
    const finalValues = values;

    if (order) {
      finalValues.txnid = order.txnid;
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
    const order = this.props.order || ({} as any);
    const prefixList = this.props.prefix.map(x => {
      return {
        value: x.userId,
        label: x.prefix
      };
    });
    const stockList = this.props.stocks.map(x => {
      return {
        value: x.stockcode,
        label: x.symbol + ') ' + x.stockname
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
        object={this.props.order}
      />
    );
  }
}

export default Forms;
