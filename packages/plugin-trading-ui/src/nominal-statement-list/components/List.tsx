import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert, router } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';
import { nominalStatementMenus } from '../../utils/nominalStatementMenus';
import { FormWrapper, FormColumn } from '@erxes/ui/src/styles/main';
import { ControlLabel, FormControl } from '@erxes/ui/src';
import Datetime from '@nateradebaugh/react-datetime';
import {
  FilterItem,
  FilterWrapper
} from '@erxes/ui-settings/src/permissions/styles';
import dayjs from 'dayjs';
import _ from 'lodash';
interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: any, containerId: string) => void;
  transactions: any[];
  total: number;
  count: number;
  isAllSelected: boolean;
  bulk: any[];
  // emptyBulk: () => void;
  // remove: (tradeId: string) => void;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
  onCancelOrder: () => void;
}
type State = {
  startDate?: string;
  endDate: string;
};
class List extends React.Component<IProps, State> {
  constructor(props) {
    super(props);
    const qp = props.queryParams || {
      startDate: '',
      endDate: ''
    };
    this.state = {
      startDate: qp.startDate,
      endDate: qp.endDate
    };
  }
  onDateChange(type: string, date) {
    const filter = { ...this.state };

    if (date) {
      filter[type] = dayjs(date).format('YYYY-MM-DD HH:mm');
    } else {
      filter.startDate = '';
      filter.endDate = '';
    }
    this.setState(filter);
  }
  onClick = () => {
    const { history } = this.props;
    const { startDate, endDate } = this.state;

    router.setParams(history, {
      startDate,
      endDate
    });
  };
  renderContent = () => {
    const {
      toggleAll,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton,
      transactions,
      total,
      count,
      queryParams
    } = this.props;
    const onChangeAll = () => {
      toggleAll(transactions, 'transactions');
    };
    let indexCounter = 0,
      page = 1,
      perPage = 20;
    if (queryParams && queryParams.page && queryParams.page > 1)
      page = queryParams.page;
    if (queryParams && queryParams.perPage) perPage = queryParams.perPage;
    indexCounter = (page - 1) * perPage;
    return (
      <>
        <Table>
          <thead>
            <tr>
              <th>
                <FormControl
                  checked={isAllSelected}
                  componentClass="checkbox"
                  onChange={onChangeAll}
                />
              </th>
              <th>№</th>
              <th>Префикс</th>
              <th>Гүйлгээний дүн</th>
              <th>Төрөл</th>
              <th>Огноо</th>
              <th>Харьцсан данс</th>
              <th>Гүйлгээний утга</th>
              <th>Жинхэнэ данс</th>
              <th>Данс эзэмшигчийн нэр</th>
              <th>Үүсгэсэн огноо</th>
              <th>Номинал дансны дугаар</th>
              <th>Төлөв</th>
            </tr>
          </thead>
          <tbody id="transactions">
            {(transactions || []).map((transaction, index) => (
              <Row
                index={indexCounter + index}
                transaction={transaction}
                totalCount={total}
                isChecked={bulk.includes(transaction)}
                toggleBulk={toggleBulk}
                renderButton={renderButton}
              />
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  renderDateFilter = (name: string) => {
    const props = {
      value: this.state[name],
      onChange: this.onDateChange.bind(this, name),
      inputProps: {
        placeholder: `${__(`Choose ${name}`)}`
      }
    };

    return (
      <FilterItem>
        <Datetime
          {...props}
          dateFormat="YYYY/MM/DD"
          timeFormat="HH:mm"
          closeOnSelect={true}
        />
      </FilterItem>
    );
  };
  renderFilter() {
    const { renderButton } = this.props;
    return (
      <FilterWrapper style={{ padding: '10px 0px' }}>
        <strong>{__('Filters')}:</strong>
        {this.renderDateFilter('startDate')}
        {this.renderDateFilter('endDate')}
        <Button
          btnStyle="primary"
          icon="filter-1"
          onClick={this.onClick}
          size="small"
        >
          {__('Filter')}
        </Button>
      </FilterWrapper>
    );
  }

  render() {
    const { queryParams, total } = this.props;
    return (
      <>
        <Wrapper
          header={
            <Wrapper.Header
              title={__('Номинал хуулга')}
              //breadcrumb={breadcrumb}
              //queryParams={queryParams}
              submenu={nominalStatementMenus}
            />
          }
          content={
            <>
              {this.renderFilter()}
              <DataWithLoader
                data={this.renderContent()}
                loading={false}
                count={total}
                emptyText="There is no transactions."
                emptyImage="/images/actions/20.svg"
              />
            </>
          }
          footer={<Pagination count={total} />}
          hasBorder
        />
      </>
    );
  }
}

export default List;
