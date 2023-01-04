import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_ORDER, STOCK_DATA, STOCK } from '../../constants';
import {
  StockDataContainer,
  StockData,
  StockChange,
  Filter,
  SearchBar,
  SearchInput,
  SearchIcon
} from '../../styles';
import Row from './Row';
import Chart from './Chart';
import List from './List';
import Select from 'react-select-plus';
import { IOption } from '@erxes/ui/src/types';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Button from '@erxes/ui/src/components/Button';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Form from './Form';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { FlexRow } from '@erxes/ui/src/components/filterableList/styles';
import Icon from '@erxes/ui/src/components/Icon';
import { useEffect, useState } from 'react';

type Props = {
  queryParams: any;
  history: any;
  onSelect: (values: string[] | string, key: string) => void;
  onSearch: (values: string) => void;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

type State = {
  countDown: any;
};

interface ICountdown {
  hours: number;
  minutes: number;
  seconds: number;
}

class BoardComp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      countDown: 0
    };
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  onSearch = (e: React.KeyboardEvent<Element>) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget as HTMLInputElement;
      this.props.onSearch(target.value);
    }
  };

  renderContent = () => {
    const { onSelect, queryParams, onSearch } = this.props;

    const stockValues = STOCK.map(p => ({ label: p.label, value: p.value }));
    const stock = queryParams ? queryParams.stock : [];

    const onFilterSelect = (ops: IOption[], type: string) => {
      console.log('ops', ops);
      onSelect(ops[ops.length - 1].value, type);
    };

    return (
      <>
        <StockDataContainer>
          {STOCK_DATA.map(stock => (
            <StockData>
              <h5>{stock.name}</h5>
              <StockChange isIncreased={stock.changePercent > 0 ? true : false}>
                {stock.changePercent > 0 ? '↑' : '↓'}&nbsp;
                {stock.changePercent}%
              </StockChange>
              <h5>{stock.quantity}</h5>
              <StockChange isIncreased={stock.changePercent > 0 ? true : false}>
                {stock.changePercent > 0 ? '↑' : '↓'}&nbsp;
                {stock.change}
              </StockChange>
            </StockData>
          ))}
        </StockDataContainer>
        <Filter>
          <Select
            placeholder={__('Filter by stock')}
            value={stock || 'CU'}
            options={stockValues}
            name="stock"
            onChange={ops => onFilterSelect(ops, 'stock')}
            multi={true}
            loadingPlaceholder={__('Loading...')}
          />
          <ControlLabel>
            <b>{__('Close Price')}:</b> 200
          </ControlLabel>
          <ControlLabel>
            <b>{__('Close Date')}:</b> 2023-03-01
          </ControlLabel>
        </Filter>
        <List {...this.props} renderButton={this.props.renderButton} />
        <Table>
          <thead>
            <tr>
              <th>№</th>
              <th>{__('Prefix')}</th>
              <th>{__('Stock')}</th>
              <th>{__('Type')}</th>
              <th>{__('Order Type')}</th>
              <th>{__('Price')}</th>
              <th>{__('Quantity')}</th>
              <th>{__('Successful')}</th>
              <th>{__('Left')}</th>
              <th>{__('Status')}</th>
              <th>{__('Date')}</th>
              <th>{__('Total')}</th>
              <th>{__('Commission')}</th>
              <th>{__('Time Frame')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody id="orders">
            {(STOCK_ORDER || []).map((stock, index) => (
              <Row index={index} stock={stock} />
            ))}
          </tbody>
        </Table>
        <Pagination count={90} />
      </>
    );
  };

  renderActionBar() {
    const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    // console.log("fefefefefe", this.CountDownTimer(1,35,6))
    const actionBarRight = (
      <>
        <ControlLabel>{__('Trade closing time:')}&nbsp;01:30:25</ControlLabel>
        <ModalTrigger
          title="Place an order"
          size={'lg'}
          trigger={
            <Button id="add-order" btnStyle="success" icon="plus-circle">
              {__('Add Order')}
            </Button>
          }
          content={this.renderForm}
        />
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
            title={__('Board')}
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
