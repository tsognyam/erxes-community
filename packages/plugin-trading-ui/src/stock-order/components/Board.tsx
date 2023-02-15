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
import { queries, mutations } from '../../graphql';
import client from '@erxes/ui/src/apolloClient';
import ButtonMutate from '@erxes/ui/src/components/ButtonMutate';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
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
  constructor(props: Props) {
    super(props);
    this.state = {
      userId: '',
      closeprice: 0,
      orders: [],
      total: 0,
      count: 0,
      userPrefix: '',
      stockname: ''
    };
  }
  renderButton = ({ values, isSubmitted, callback }: IButtonMutateProps) => {
    const afterMutate = () => {
      this.fetchOrders();
      if (callback) {
        callback();
      }
    };
    return (
      <ButtonMutate
        mutation={mutations.orderAdd}
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
  stockChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value.toString();
    const label = !option ? '' : option.label.toString();
    this.setState({ stockname: label });
    this.setState({ stockcode: value }, () => {
      this.fetchOrders();
    });
    const stockList = this.props.stocks;
    const stock = stockList.find(x => x.stockcode == value);
    if (stock) {
      this.setState({ closeprice: stock.closeprice });
      this.setState({ closedate: new Date(stock.order_enddate) });
    }
  };
  prefixChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value.toString();
    const label = !option ? '' : option.label.toString();
    this.setState({ userPrefix: label });
    this.setState({ userId: value }, () => {
      this.fetchOrders();
    });
  };
  fetchOrders = () => {
    if (this.state.userId != '' && this.state.userId != undefined) {
      let variables: any = {
        userId: this.state.userId,
        page: 1,
        perPage: 10
      };
      if (this.state.stockcode != null && this.state.stockcode != '') {
        variables.stockcode = Number(this.state.stockcode);
      }
      client
        .query({
          query: gql(queries.orderList),
          fetchPolicy: 'network-only',
          variables: variables
        })
        .then(({ data }: any) => {
          const orders = data?.tradingOrders?.values || [];
          const total = data?.tradingOrders?.total || 0;
          const count = data?.tradingOrders?.count || 0;
          this.setState({ orders: orders, total: total, count: count });
        });
    } else this.setState({ orders: [], total: 0, count: 0 });
  };
  renderContent = () => {
    const {
      onSelect,
      queryParams,
      onSearch,
      isAllSelected,
      stocks,
      prefix
    } = this.props;
    let stockValues: any[] = [];
    let stockList: any[] = [];
    stocks.map(x => {
      stockValues.push({
        value: x.stockcode,
        label: x.symbol + ' - ' + x.stockname
      });
      let changePercent = 0;
      let diff = x.closeprice - x.openprice;
      if (x.openprice != 0)
        changePercent = Math.round((diff / x.openprice) * 100);
      if (x.symbol != 'NULL')
        stockList.push({
          ...x,
          changePercent
        });
    });
    const extendedProps = {
      ...this.props,
      renderButton: this.renderButton,
      stockChange: this.stockChange,
      stockcode: this.state.stockcode,
      prefixChange: this.prefixChange,
      object: null
    };
    queryParams.userId = this.state.userId;
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
          {stockList.map(stock => (
            <StockData>
              <h5>{stock.symbol}</h5>
              <StockChange isIncreased={stock.changePercent > 0 ? true : false}>
                {stock.changePercent > 0 ? '↑' : '↓'}&nbsp;
                {stock.changePercent}%
              </StockChange>
              <h5>{stock.cnt}</h5>
              <StockChange isIncreased={stock.changePercent > 0 ? true : false}>
                {stock.changePercent > 0 ? '↑' : '↓'}&nbsp;
                {stock.closeprice}
              </StockChange>
            </StockData>
          ))}
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
        <StockOrderLabel>
          <ControlLabel>
            <h5 style={{ color: '#5629B6' }}>
              {this.state.userPrefix != ''
                ? '“' + this.state.userPrefix + '” хэрэглэгчийн '
                : ''}
              {this.state.stockname != ''
                ? '“' + this.state.stockname + '” хувьцааны '
                : ''}
              захиалгийн жагсаалт
            </h5>
          </ControlLabel>
        </StockOrderLabel>
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
