import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import { TYPE, ORDER_TYPE, TIME_FRAME } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
import gql from 'graphql-tag';
import queries from '../../graphql/queries';
import client from '@erxes/ui/src/apolloClient';
import { Button, Icon } from '@erxes/ui/src/components';
//import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import CommonForm from '@erxes/ui/src/components/form/Form';
import { ModalFooter } from '@erxes/ui/src/styles/main';
type Props = {
  object: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any[];
  stocks: any[];
  closeModal: () => void;
  stockChange: (option: { value: string }) => void;
  prefixChange: (option: { value: string }) => void;
  stockcode: string;
  confirmationUpdate?: boolean;
  isCancel: boolean;
};
type State = {
  userId: string;
  stockcode: string;
  isPrice: boolean;
  orderType: number;
  price?: number;
  cnt: number;
  txntype: number;
  tradeBalance: number;
  isCanceled: boolean;
  condid?: number;
  fee?: number;
  total: number;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { object } = this.props;
    let total = 0;
    if (object) {
      total =
        parseFloat(object.price) +
        (parseFloat(object.price) * parseFloat(object.fee)) / 100;
    }
    this.state = {
      isCanceled: false,
      userId: object?.userId,
      stockcode: object?.stockcode,
      orderType: object?.orderType || 1,
      isPrice: object?.orderType == 2 ? false : true,
      price: object?.price || 0,
      txntype: object?.txntype || 1,
      tradeBalance:
        parseFloat(object?.wallet?.walletBalance.balance) -
          parseFloat(object?.wallet?.walletBalance.holdBalance) +
          parseFloat(object?.wallet?.walletBalance.incomingBalance) || 0,
      fee: object?.fee || 0,
      total: total,
      cnt: object?.cnt || 1
    };
  }
  generateDoc = (values: {
    txnid?: number;
    txntype: number;
    ordertype: number;
    stockcode: number;
    price?: number;
    cnt: number;
    enddate?: Date;
    userId: string;
    condid?: number;
  }) => {
    const { object } = this.props;
    const finalValues = values;
    if (object) {
      finalValues.txnid = object.txnid;
    }
    return {
      txnid: finalValues.txnid,
      enddate: finalValues.enddate,
      price: this.state.orderType == 1 ? undefined : Number(finalValues.price),
      cnt: Number(finalValues.cnt),
      txntype: Number(this.state.txntype),
      ordertype: Number(this.state.orderType),
      stockcode: Number.isNaN(this.state.stockcode)
        ? undefined
        : Number(this.state.stockcode),
      userId: this.state.userId,
      condid: this.state.condid
    };
  };
  prefixChange = (option: { value: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ userId: value }, () => {
      this.changeTradeBalance();
      this.getCustFee();
    });
    if (this.props.prefixChange != undefined) this.props.prefixChange(option);
  };
  changeTradeBalance = () => {
    if (this.state.userId != '' && this.state.userId != undefined)
      client
        .query({
          query: gql(queries.tradingUserWallets),
          fetchPolicy: 'network-only',
          variables: { userId: this.state.userId, currencyCode: 'MNT' }
        })
        .then(({ data }: any) => {
          if (data?.tradingUserWallets.length > 0) {
            this.setState({
              tradeBalance: parseFloat(
                data.tradingUserWallets[0].walletBalance.tradeBalance
              )
            });
          } else this.setState({ tradeBalance: 0 });
          Alert.success('Trade balance updated');
        });
    else Alert.warning('Choose prefix');
  };
  getCustFee = () => {
    client
      .query({
        query: gql(queries.tradingCustFeeList),
        fetchPolicy: 'network-only',
        variables: { userId: this.state.userId }
      })
      .then(({ data }: any) => {
        if (data?.tradingCustFeeGetList?.values.length > 0) {
          let custFeeStock = data.tradingCustFeeGetList.values.find(
            x => x.stocktypeId == 1
          );
          if (custFeeStock) {
            this.setState(
              {
                fee: parseFloat(custFeeStock.value)
              },
              () => {
                this.setTotalPrice();
              }
            );
          } else this.setState({ fee: 0 });
        } else this.setState({ fee: 0 });
      });
  };
  componentDidUpdate = (prevProps: Props) => {
    if (prevProps != this.props)
      this.setState({ stockcode: this.props.stockcode });
  };
  numberFormat = (value: number) => {
    if (value == undefined) value = 0;
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  };
  stockChange = (option: { value: string }) => {
    const value = !option ? '' : option.value.toString();
    this.setState({ stockcode: value }, () => {
      this.setTotalPrice();
    });
    if (this.props.stockChange != undefined) this.props.stockChange(option);
  };
  priceChange = event => {
    this.setState({ price: event.target.value }, () => {
      this.setTotalPrice();
    });
  };
  cntChange = event => {
    this.setState({ cnt: event.target.value }, () => {
      this.setTotalPrice();
    });
  };
  setTotalPrice = () => {
    if (this.state.orderType == 1) {
      let stock = this.props.stocks.find(
        x => x.stockcode == this.state.stockcode
      );
      if (stock) {
        let price =
          (parseFloat(stock.openprice) +
            (parseFloat(stock.openprice) * 15) / 100) *
          this.state.cnt;
        let fee = 0;
        if (this.state.fee != undefined) {
          fee = (price * this.state.fee) / 100;
        }
        this.setState({ total: price + fee });
      } else this.setState({ total: 0 });
    } else {
      let price = 0,
        fee = 0;
      if (this.state.price != undefined)
        price = this.state.price * this.state.cnt;
      if (this.state.fee != undefined) fee = (price * this.state.fee) / 100;
      this.setState({ total: price + fee });
    }
  };
  orderTypeChange = e => {
    const value = e.target.value;
    this.setState({ orderType: Number(value) });

    if (value == 1) {
      this.setState({ price: 0 }, () => {
        this.setTotalPrice();
      });
      this.setState({ isPrice: true });
    } else
      this.setState({ isPrice: false }, () => {
        this.setTotalPrice();
      });
  };
  txntypeChange = e => {
    const value = e.target.value;
    this.setState({ txntype: value }, () => {
      this.setTotalPrice();
    });
  };
  orderConditionChange = e => {
    const value = e.target.value;
    this.setState({ condid: value });
  };
  tradeBalanceRefresh = e => {
    e.preventDefault();
    this.changeTradeBalance();
  };

  renderContent = (formProps: IFormProps) => {
    const order = this.props.object || ({} as any);
    const cancel = () => {
      this.setState({ isCanceled: true }, () => {
        closeModal();
      });
    };
    const {
      renderButton,
      closeModal,
      object,
      confirmationUpdate,
      isCancel
    } = this.props;
    const { values, isSubmitted } = formProps;
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
          <div style={{ textAlign: 'right' }}>
            Дансны үлдэгдэл{' '}
            <label
              style={
                this.state.tradeBalance > 0
                  ? { color: 'green' }
                  : { color: 'red' }
              }
            >
              {this.numberFormat(this.state.tradeBalance)}
            </label>
            <Button
              onClick={this.tradeBalanceRefresh}
              size="small"
              btnStyle="success"
              iconColor=""
              icon="refresh"
            ></Button>
          </div>
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Prefix')}</ControlLabel>
          <Select
            {...formProps}
            placeholder={__('Prefix')}
            value={this.state.userId}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.prefixChange}
            required={true}
            name="userId"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Хувьцаа')}</ControlLabel>
          <Select
            {...formProps}
            name="stockcode"
            placeholder={__('Хувьцаагаа сонгоно уу')}
            options={_.sortBy(stockList, ['label'])}
            value={this.state.stockcode}
            onChange={this.stockChange}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Авах/Зарах')}</ControlLabel>
          <FormControl
            {...formProps}
            name="txntype"
            componentClass="select"
            options={TYPE}
            defaultValue={order.txntype}
            value={this.state.txntype}
            onChange={this.txntypeChange}
            required={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Захиалгын төрөл')}</ControlLabel>
          <FormControl
            {...formProps}
            name="ordertype"
            componentClass="select"
            options={ORDER_TYPE}
            defaultValue={order.orderType}
            onChange={this.orderTypeChange}
            required={true}
          />
        </FormGroup>
        {this.state.isPrice == false ? (
          <FormGroup>
            <ControlLabel required={true}>{__('Үнэ')}</ControlLabel>
            <FormControl
              {...formProps}
              name="price"
              defaultValue={order?.price || 0}
              disabled={this.state.isPrice}
              value={this.state.price}
              min={0}
              required={true}
              onChange={this.priceChange}
            />
          </FormGroup>
        ) : (
          ''
        )}
        <FormGroup>
          <ControlLabel required={true}>{__('Тоо ширхэг')}</ControlLabel>
          <FormControl
            {...formProps}
            name="cnt"
            value={this.state.cnt}
            type="number"
            min={1}
            required={true}
            onChange={this.cntChange}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Хугацаа')}</ControlLabel>
          <FormControl
            {...formProps}
            name="condid"
            componentClass="select"
            options={TIME_FRAME}
            defaultValue={order.condid}
            onChange={this.orderConditionChange}
            required={true}
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
        <FormGroup>
          <ControlLabel>
            {__('Шимтгэлийн хувь') + ' ' + this.state.fee + '%'}
          </ControlLabel>
        </FormGroup>
        <FormGroup>
          <ControlLabel>
            {__('Нийт(Дүн+Шимтгэл)') +
              ' ' +
              this.numberFormat(this.state.total)}
          </ControlLabel>
        </FormGroup>
        <ModalFooter>
          {isCancel == false ? (
            ''
          ) : (
            <Button
              btnStyle="simple"
              type="button"
              onClick={cancel}
              icon="times-circle"
            >
              Cancel
            </Button>
          )}
          {renderButton &&
            renderButton({
              name: 'save',
              values: this.generateDoc(values),
              isSubmitted,
              callback: closeModal,
              object,
              confirmationUpdate: false
            })}
        </ModalFooter>
      </>
    );
  };

  render() {
    return <CommonForm {...this.props} renderContent={this.renderContent} />;
  }
}

export default Forms;
