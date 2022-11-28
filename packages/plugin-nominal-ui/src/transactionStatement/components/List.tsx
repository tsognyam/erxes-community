import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/Table';
import {
  TRANSACTION_STATEMENT,
  TRANSACTION_STATEMENT_LIST,
  COLLATERAL_STATEMENT,
  CURRENCY
} from '../../constants';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';
import { FilterHeader, Filter, AdditionalInfo } from '../../styles';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormLabel from '@erxes/ui/src/components/form/Label';
import Button from '@erxes/ui/src/components/Button';
import { Flex } from '@erxes/ui/src/styles/main';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import dayjs from 'dayjs';
import Select from 'react-select-plus';
import { IOption } from '@erxes/ui/src/types';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  onSelect: (values: string[] | string, key: string) => void;
}

type State = {
  date: any;
};

class ListComp extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      date: dayjs(new Date()).format('YYYY-MM-DD')
    };
  }
  onChangeRangeFilter = (kind: string, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';

    const { queryParams, onSelect } = this.props;

    if (queryParams[kind] !== formattedDate) {
      onSelect(formattedDate, kind);
    }

    this.setState({ date: formattedDate });
  };

  renderContent = () => {
    const { queryParams, onSelect } = this.props;

    const currencyValues = CURRENCY.map(p => ({
      label: p.label,
      value: p.value
    }));
    const currency = queryParams ? queryParams.currency : [];

    const onFilterSelect = (ops: IOption[], type: string) =>
      onSelect(ops[ops.length - 1].value, type);

    return (
      <>
        <FilterHeader>
          <b>
            {__('A Statement of Sending a Request for Transfer of Collateral')}
          </b>
          <Flex>
            <FormControl
              componentClass="select"
              defaultValue={COLLATERAL_STATEMENT[0]}
              options={COLLATERAL_STATEMENT}
            />
            <Button>{__('Request for Transfer of Collateral')}</Button>
          </Flex>
        </FilterHeader>
        <Filter>
          <FormLabel required={true}>
            {__('Date to check the balance of the collateral')}
          </FormLabel>
          <DateControl
            value={this.props.queryParams.filterDate || new Date()}
            required={true}
            name="filterDate"
            onChange={date => this.onChangeRangeFilter('filterDate', date)}
            placeholder={'Filter by date'}
            dateFormat={'YYYY-MM-DD'}
          />
          <Select
            placeholder={__('Filter by currency')}
            value={currency || 'MNT'}
            options={currencyValues}
            name="currency"
            onChange={ops => onFilterSelect(ops, 'currency')}
            multi={true}
            loadingPlaceholder={__('Loading...')}
          />
        </Filter>
        <Table>
          <thead>
            <tr>
              <th>№</th>
              <th>{__('Account Number')}</th>
              {(TRANSACTION_STATEMENT_LIST || []).map(({ name, label }) => (
                <th key={name}>
                  <SortHandler sortField={name} label={__(label)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody id="statement">
            {(TRANSACTION_STATEMENT || []).map((statement, index) => (
              <Row index={index} statement={statement} />
            ))}
          </tbody>
        </Table>
        <AdditionalInfo>
          <p>
            {__('Required deposit')}:{' '}
            {(18717739.44).toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}
          </p>
          <p>
            {__('The Difference from the First Balance')}:{' '}
            {(108371796.6).toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}
          </p>
          <p>
            {__('The Difference from the Last Balance')}:{' '}
            {(108371796.6).toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}
          </p>
        </AdditionalInfo>
      </>
    );
  };

  render() {
    const { queryParams } = this.props;
    const { date } = this.state;

    const breadcrumb = [
      { title: __('Statement'), link: '/nominal/statement' },
      { title: __(`Commercial settlement of ${date}`) }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('List')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no statement."
            emptyImage="/images/actions/20.svg"
          />
        }
        hasBorder
      />
    );
  }
}

export default ListComp;
