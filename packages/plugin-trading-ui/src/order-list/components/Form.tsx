import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React, { useRef, useCallback } from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import { TYPE, ORDER_TYPE, TIME_FRAME } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select, { OptionsType } from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
import gql from 'graphql-tag';
import queries from '../../graphql/queries';
import client from '@erxes/ui/src/apolloClient';
import { Button, Icon, Label, TextInfo, Tip } from '@erxes/ui/src/components';
//import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import CommonForm from '@erxes/ui/src/components/form/Form';
import { ModalFooter } from '@erxes/ui/src/styles/main';
import SelectWithPagination from '../../utils/SelectWithPagination';
type Props = {
  object: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any[];
  stocks: any[];
  closeModal: () => void;
  stockChange: (option: { value: string; label: string }) => void;
  prefixChange: (option: { value: string; label: string }) => void;
  stockcode?: string;
  confirmationUpdate?: boolean;
  isCancel: boolean;
};
type State = {
  userId: string;
  stockcode: string;
  isHide: boolean;
  ordertype: number;
  price?: number;
  cnt: number;
  txntype: number;
  tradeBalance: number;
  isCanceled: boolean;
  condid: number;
  fee?: number;
  total: number;
  isEditable: boolean;
  stockSymbol: string;
  stockBalance: number;
  options: OptionsType<OptionType>;
  selectedOptions: OptionsType | null;
  isLoading: boolean;
  hasMore: boolean;
};
interface OptionType {
  value: string;
  label: string;
}
const PAGE_SIZE = 50;
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
    const prefixList = this.props.prefix.map(x => {
      return {
        value: x.userId,
        label: x.prefix
      };
    });
    this.state = {
      isCanceled: false,
      userId: object?.userId,
      stockcode: object?.stockcode,
      ordertype: object?.ordertype || 1,
      isHide: object?.ordertype == 2 ? false : true,
      price: object?.price || 0,
      txntype: object?.txntype || 1,
      tradeBalance:
        parseFloat(object?.wallet?.walletBalance.balance) -
          parseFloat(object?.wallet?.walletBalance.holdBalance) +
          parseFloat(object?.wallet?.walletBalance.incomingBalance) || 0,
      fee: object?.fee || 0,
      total: total,
      cnt: object?.cnt || 1,
      condid: object?.condid || 0,
      isEditable: object ? false : true,
      stockSymbol: object?.stock?.symbol,
      stockBalance: 0,
      options: prefixList,
      selectedOptions: null,
      isLoading: false,
      hasMore: true
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
    condid: number;
  }) => {
    const { object } = this.props;
    const finalValues = values;
    if (object) {
      finalValues.txnid = object.txnid;
    }
    return {
      txnid: finalValues.txnid,
      enddate: finalValues.enddate,
      price: this.state.ordertype == 1 ? undefined : Number(finalValues.price),
      cnt: Number(finalValues.cnt),
      txntype: Number(this.state.txntype),
      ordertype: Number(this.state.ordertype),
      stockcode: Number.isNaN(this.state.stockcode)
        ? undefined
        : Number(this.state.stockcode),
      userId: this.state.userId,
      condid: this.state.ordertype == 1 ? undefined : Number(this.state.condid)
    };
  };
  prefixChange = (option: OptionType) => {
    const value = !option ? '' : option.value;
    this.setState({ userId: value, selectedOptions: option }, () => {
      this.changeTradeBalance();
      this.getCustFee();
    });
    if (this.props.prefixChange != undefined)
      this.props.prefixChange(option[0]);
  };
  changeTradeBalance = () => {
    if (this.state.userId != '' && this.state.userId != undefined)
      client
        .query({
          query: gql(queries.WalletQueries.tradingUserWallets),
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
            let stockBalances = data.tradingUserWallets[0].stockBalances;
            if (stockBalances && stockBalances.length > 0) {
              let stockBalance = stockBalances.find(
                x => x.stockCode == this.state.stockcode
              );
              if (stockBalance) {
                this.setState({
                  stockBalance:
                    parseFloat(stockBalance.balance) -
                    parseFloat(stockBalance.holdBalance)
                });
              } else
                this.setState({
                  stockBalance: 0
                });
            } else
              this.setState({
                stockBalance: 0
              });
          } else {
            this.setState({ tradeBalance: 0 });
            this.setState({ stockBalance: 0 });
          }
        });
    else Alert.warning('Choose prefix');
  };
  getCustFee = () => {
    client
      .query({
        query: gql(queries.CustFeeQueries.tradingCustFeeList),
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
      this.setState({ stockcode: this.props.stockcode as string });
  };
  numberFormat = (value: number) => {
    if (value == undefined) value = 0;
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  };
  stockChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value.toString();
    const { stocks } = this.props;
    this.setState({ stockcode: value }, () => {
      this.setTotalPrice();
      this.changeTradeBalance();
      let stock = stocks.find(x => x.stockcode == value);
      if (stock) {
        this.setState({ stockSymbol: stock.symbol });
      }
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
    if (this.state.ordertype == 1) {
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
  ordertypeChange = e => {
    const value = e.target.value;
    this.setState({ ordertype: Number(value) });

    if (value == 1) {
      this.setState({ price: 0 }, () => {
        this.setTotalPrice();
      });
      this.setState({ isHide: true });
    } else
      this.setState({ isHide: false }, () => {
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
    const generateOptions = (array: any = []): any => {
      return array.map(item => {
        return {
          value: item.userId,
          label: item.prefix,
          value2: item.registerNumber
        };
      });
    };
    const generateFilterParams = (value: any, searchValue: string) => {
      return {
        searchValue: searchValue,
        userIds: value
      };
    };
    const onSelect = (values: string[] | string, key: string) => {
      this.prefixChange({
        label: values as string,
        value: values as string
      });
    };
    return (
      <>
        <FormGroup>
          Дансны үлдэгдэл:
          <TextInfo
            textStyle={this.state.tradeBalance > 0 ? 'success' : 'danger'}
            hugeness="big"
          >
            {this.numberFormat(this.state.tradeBalance)}
          </TextInfo>
          <Tip text="Үлдэгдэл шинэчлэх">
            <Button
              onClick={this.tradeBalanceRefresh}
              size="small"
              btnStyle="success"
              iconColor=""
              icon="refresh"
            ></Button>
          </Tip>
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Prefix')}</ControlLabel>
          <SelectWithPagination
            queryName="tradingUserByPrefix"
            label={__('Filter by prefix')}
            name="prefix"
            onSelect={onSelect}
            multi={false}
            disabled={this.state.isEditable ? false : true}
            customQuery={queries.UserQueries.tradingUsers}
            generateOptions={generateOptions}
            initialValue={this.state.userId}
            generateFilterParams={generateFilterParams}
            uniqueValue="userId"
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
            disabled={this.state.isEditable ? false : true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Авах/Зарах')}</ControlLabel>
          <FormControl
            {...formProps}
            name="txntype"
            componentClass="select"
            options={TYPE}
            value={this.state.txntype}
            onChange={this.txntypeChange}
            required={true}
            disabled={this.state.isEditable ? false : true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel required={true}>{__('Захиалгын төрөл')}</ControlLabel>
          <FormControl
            {...formProps}
            name="ordertype"
            componentClass="select"
            options={ORDER_TYPE}
            value={this.state.ordertype}
            onChange={this.ordertypeChange}
            required={true}
            disabled={this.state.isEditable ? false : true}
          />
        </FormGroup>
        {this.state.isHide == false ? (
          <FormGroup>
            <ControlLabel required={this.state.isHide ? false : true}>
              {__('Үнэ')}
            </ControlLabel>
            <FormControl
              {...formProps}
              name="price"
              disabled={this.state.isHide}
              value={this.state.price}
              min={0}
              //required={true}
              onChange={this.priceChange}
            />
          </FormGroup>
        ) : (
          ''
        )}
        {this.state.txntype == 2 ? (
          <FormGroup>
            <ControlLabel>{__('Боломжит үлдэгдэл')}</ControlLabel>
            <label style={{ color: '#5629B6' }}>
              {this.state.stockBalance}
            </label>
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
        {this.state.isHide == false ? (
          <FormGroup>
            <ControlLabel required={this.state.isHide ? false : true}>
              {__('Хугацаа')}
            </ControlLabel>
            <FormControl
              {...formProps}
              name="condid"
              componentClass="select"
              options={TIME_FRAME}
              value={this.state.condid}
              onChange={this.orderConditionChange}
              //required={this.state.isHide ? false : true}
              disabled={
                this.state.isHide ? true : this.state.isEditable ? false : true
              }
            />
          </FormGroup>
        ) : (
          ''
        )}
        {this.state.isHide == false ? (
          this.state.condid == 6 ? (
            <FormGroup>
              <ControlLabel>{__('Дуусах өдөр')}</ControlLabel>
              <FormControl
                {...formProps}
                type="date"
                value={dayjs(order.endDate || new Date()).format('YYYY-MM-DD')}
                // required={
                //   this.state.isHide == false && this.state.condid == 6
                //     ? true
                //     : false
                // }
                name="enddate"
                placeholder={'Дуусах өдөр'}
                disabled={
                  this.state.isHide
                    ? true
                    : this.state.isEditable
                    ? false
                    : true
                }
              />
            </FormGroup>
          ) : (
            ''
          )
        ) : (
          ''
        )}
        <FormGroup>
          <ControlLabel>{__('Шимтгэлийн хувь')}</ControlLabel>
          <label style={{ color: '#5629B6' }}>{this.state.fee + '%'}</label>
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Нийт(Дүн+Шимтгэл)')}</ControlLabel>
          <label style={{ color: '#5629B6' }}>
            {this.numberFormat(this.state.total) + '₮'}
          </label>
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
          {renderButton({
            name: 'save',
            values: this.generateDoc(values),
            isSubmitted,
            callback: closeModal,
            object
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
