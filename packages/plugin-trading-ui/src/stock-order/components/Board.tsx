import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import {
  StockDataContainer,
  StockData,
  StockChange,
  Filter,
  SearchBar,
  SearchInput,
  SearchIcon,
  FinanceAmount,
  StockOrderLabel
} from '../../styles';
import Chart from './Chart';
import List from './List';
import Select from 'react-select-plus';
import { IOption } from '@erxes/ui/src/types';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { FlexRow } from '@erxes/ui/src/components/filterableList/styles';
import Icon from '@erxes/ui/src/components/Icon';
import { useEffect, useState } from 'react';
import { IOrder } from '../../types/orderTypes';
import dayjs from 'dayjs';
import _ from 'lodash';
import ListOrder from '../../order-list/containers/List';
import gql from 'graphql-tag';
import { queries, mutations, subscriptions } from '../../graphql';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
import { useQuery, useSubscription } from 'react-apollo';
import client from '@erxes/ui/src/apolloClient';
import stock from '../../graphql/queries/stock';
type Props = {
  queryParams: any;
  history: any;
  onSelect: (values: string[] | string, key: string) => void;
  onSearch: (values: string) => void;
  isAllSelected: boolean;
  closeModal: () => void;
  prefix: any[];
  stocks: any[];
  isCancel: boolean;
  stockcode: string;
  currentUser: IUser;
  tradingOrderBookQuery: any;
  tradingExecutedBookQuery: any;
  sellOrderBook: any[];
  buyOrderBook: any[];
  executedOrderBook: any[];
  getDate: (subday: number) => Date;
};

type State = {
  stockcode?: string;
  closeprice: number;
  closedate?: Date;
  userId: string;
  orders: any[];
  total: number;
  count: number;
  userPrefix: string;
  stockname: string;
};

class BoardComp extends React.Component<Props, State> {
  private subscription;
  constructor(props: Props) {
    super(props);
    this.state = {
      userId: '',
      closeprice: 0,
      orders: [],
      total: 0,
      count: 0,
      userPrefix: '',
      stockname: '',
      stockcode: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    const { tradingOrderBookQuery } = this.props;
    if (!this.subscription) {
      if (this.subscription) {
        this.subscription();
      }
      this.subscription = tradingOrderBookQuery?.subscribeToMore({
        document: gql(subscriptions.orderBookChanged),
        updateQuery: (prev, { subscriptionData }) => {
          const stockList = this.props.stocks;
          const stock = stockList.find(
            x => x.stockcode == this.state.stockcode
          );
          let changedOrderBook = subscriptionData.data.orderBookChanged;
          console.log(changedOrderBook);
          if (
            // !!this.state.stockcode &&
            // !!stock &&
            changedOrderBook.symbol == stock.externalid ||
            changedOrderBook.symbol == stock.symbol
          ) {
            console.log('this.state.stockcode', this.state.stockcode);
            console.log('changedOrderBook', changedOrderBook);
            this.refetchQuery(this.state.stockcode || '');
          }
        }
      });
    }
  }
  renderButton = ({ values, isSubmitted, callback }: IButtonMutateProps) => {
    const afterMutate = () => {
      if (callback) {
        callback();
      }
    };
    return (
      <ButtonMutate
        mutation={mutations.OrderMutations.orderAdd}
        variables={values}
        callback={afterMutate}
        isSubmitted={isSubmitted}
        type="submit"
        icon="check-circle"
        successMessage={`You successfully added order`}
      />
    );
  };
  displayValue(value: number) {
    return (
      <FinanceAmount>
        {(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
      </FinanceAmount>
    );
  }
  onSearch = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget as HTMLInputElement;
      this.props.onSearch(target.value);
    }
  };
  refetchQuery = (stockcode: string) => {
    const {
      tradingOrderBookQuery,
      tradingExecutedBookQuery,
      getDate,
      onSelect
    } = this.props;
    // tradingOrderBookQuery.refetch({
    //   stockcode: Number(stockcode)
    // });
    // tradingExecutedBookQuery.refetch({
    //   stockcode: Number(stockcode),
    //   beginDate: dayjs(getDate(1)).format('YYYY-MM-DD'),
    //   endDate: dayjs(getDate(-1)).format('YYYY-MM-DD')
    // });
  };
  stockChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value.toString();
    const label = !option ? '' : option.label.toString();
    this.setState({ stockname: label });
    this.setState({ stockcode: value });
    const stockList = this.props.stocks;
    const stock = stockList.find(x => x.stockcode == value);
    this.props.onSelect(value, 'stockcode');
    if (stock) {
      this.refetchQuery(stock.stockcode);
      this.setState({ closeprice: stock.closeprice });
      this.setState({ closedate: new Date(stock.order_enddate) });
    }
  };
  prefixChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value.toString();
    const label = !option ? '' : option.label.toString();
    this.setState({ userPrefix: label });
    this.setState({ userId: value });
  };
  renderContent = () => {
    const {
      onSelect,
      queryParams,
      onSearch,
      isAllSelected,
      stocks,
      prefix,
      sellOrderBook,
      buyOrderBook,
      executedOrderBook
    } = this.props;
    let stockValues: any[] = [];
    let stockList: any[] = [];
    stocks.map((x, index) => {
      stockValues.push({
        value: x.stockcode,
        label: x.symbol + ' - ' + x.stockname
      });
      let changePercent = 0,
        diff = 0,
        closeprice = 0;
      if (!!x.closeprice) closeprice = x.closeprice;
      else closeprice = x.openprice;
      diff = closeprice - x.openprice;
      if (x.openprice != 0)
        changePercent = Math.round((diff / x.openprice) * 100);
      if (x.symbol != 'NULL') {
        if (index < 50)
          stockList.push({
            ...x,
            changePercent,
            changedData: {
              closeprice: closeprice
            }
          });
      }
    });

    const extendedProps = {
      ...this.props,
      renderButton: this.renderButton,
      stockChange: this.stockChange,
      stockcode: this.state.stockcode,
      prefixChange: this.prefixChange,
      object: null,
      sellOrderBook,
      buyOrderBook,
      executedOrderBook
    };
    queryParams.userId =
      this.state.userId == '' ? undefined : this.state.userId;
    queryParams.stockcode = this.state.stockcode;
    const orderListProps = {
      queryParams: queryParams,
      full: false,
      history: this.props.history,
      currentUser: this.props.currentUser
    };
    return (
      <>
        <StockDataContainer>
          <StockData>
            {stockList.map(stock => (
              <div style={{ display: 'inline-table', width: '150px' }}>
                <div
                  style={{ width: '50px', fontSize: '14px', fontWeight: 700 }}
                >
                  {stock.symbol}
                </div>
                <div
                  style={{
                    float: 'left',
                    padding: '0px 15px 7px 0px',
                    fontSize: '14px',
                    fontWeight: 700
                  }}
                >
                  {stock.changedData.closeprice}
                </div>
                <div
                  style={{
                    color: '#23CF4B',
                    float: 'left',
                    width: '40px',
                    padding: '0px 0px 7px 0px'
                  }}
                >
                  <StockChange
                    isIncreased={stock.changePercent > 0 ? true : false}
                  >
                    {stock.changePercent > 0 ? '↑' : '↓'}&nbsp;
                    {stock.changePercent}%
                  </StockChange>
                </div>
                <div
                  style={{
                    borderRight: '1px solid #ECE7E6',
                    height: '50px',
                    margin: '-25px 28px 0px 0px'
                  }}
                ></div>
              </div>
            ))}
          </StockData>
        </StockDataContainer>
        <Filter>
          <Select
            placeholder={__('Filter by stock')}
            value={this.state.stockcode}
            options={stockValues}
            name="stock"
            onChange={this.stockChange}
            loadingPlaceholder={__('Loading...')}
          />
          <ControlLabel>
            <b>{__('Close Price')}:</b>{' '}
            {this.displayValue(this.state.closeprice)}
          </ControlLabel>
          <ControlLabel>
            <b>{__('Close Date')}:</b>{' '}
            {dayjs(this.state.closedate).format('YYYY-MM-DD HH:mm:ss')}
          </ControlLabel>
        </Filter>
        <List {...extendedProps} />
        <ListOrder {...orderListProps} />
      </>
    );
  };
  renderActionBar() {
    const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    const actionBarRight = (
      <>
        <ControlLabel>
          {__('Trade closing time:')}&nbsp;10:00 - 13:00
        </ControlLabel>
      </>
    );

    return (
      <Wrapper.ActionBar left={title} right={actionBarRight} wideSpacing />
    );
  }

  render() {
    const { queryParams } = this.props;
    const breadcrumb = [
      { title: __('Stock Order'), link: '/tradings/stock-order' }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Stock order')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no stock order."
            emptyImage="/images/actions/20.svg"
          />
        }
        hasBorder
        actionBar={this.renderActionBar()}
      />
    );
  }
}

export default BoardComp;
