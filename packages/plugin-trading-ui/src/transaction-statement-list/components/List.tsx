import { Alert, __, router } from '@erxes/ui/src/utils';
import Select from 'react-select-plus';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Row from './Row';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { IButtonMutateProps, IFormProps } from '@erxes/ui/src/types';
import {
  VerticalContent,
  MainContent,
  MainHead,
  HeightedWrapper
} from '@erxes/ui/src/layout/styles';
import Button from '@erxes/ui/src/components/Button';
import { Contents } from '../../styles';
import { FormGroup } from '@erxes/ui/src';
import { FormWrapper, FormColumn } from '@erxes/ui/src/styles/main';
import { ControlLabel, FormControl } from '@erxes/ui/src';
import { displayValue } from '../../App';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import dayjs from 'dayjs';
import { PageContent } from '@erxes/ui/src';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { nominalStatementMenus } from '../../utils/nominalStatementMenus';
import _ from 'lodash';
import { generatePaginationParams } from '@erxes/ui/src/utils/router';
import { queries } from '../../graphql';
import SelectWithPagination from '../../utils/SelectWithPagination';
import { getEnv } from '@erxes/ui/src/utils';
type Props = {
  queryParams: any;
  history: any;
  tradingStatements: any[];
  beginBalance: number;
  endBalance: number;
  total: number;
  count: number;
  loading: boolean;
  closeModal: () => void;
  full: boolean;
  tradingStatementSum: any;
};
type State = {
  startDate: string;
  endDate: string;
  userId?: string;
};
interface Option {
  value: string;
  label: string;
}
const { REACT_APP_API_URL } = getEnv();
class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const qp = props.queryParams || {
      startDate: '',
      endDate: '',
      userId: ''
    };
    this.state = {
      startDate: qp.startDate,
      endDate: qp.endDate,
      userId: qp.userId
    };
  }
  prefixChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ userId: value });
  };
  renderContent = () => {
    const { tradingStatements, tradingStatementSum, queryParams } = this.props;
    let paginationParams = generatePaginationParams(queryParams);
    return (
      <>
        {/* <div style={{ float: 'right', paddingRight: '20px' }}>
          <div>Begin Balance: {displayValue(beginBalance)}</div>
          <div>End Balance: {displayValue(endBalance)}</div>
        </div> */}
        <Table>
          <thead>
            <tr>
              <th>{__('Index')}</th>
              <th>{__('Prefix')}</th>
              <th>{__('Огноо')}</th>
              <th>{__('Төрөл')}</th>
              <th style={{ textAlign: 'right' }}>{__('Орлого')}</th>
              <th style={{ textAlign: 'right' }}>{__('Зарлага')}</th>
              <th style={{ textAlign: 'right' }}>{__('ХБО')}</th>
              <th style={{ textAlign: 'right' }}>{__('ХБЗ')}</th>
              <th>{__('Гүйлгээний утга')}</th>
              <th>Үүсгэсэн огноо</th>
            </tr>
            <tr>
              <th colSpan={3}></th>
              <th>
                Эх.Үлд=
                {displayValue(tradingStatementSum?.beginBalance, 'beginBlance')}
              </th>
              <th>{displayValue(tradingStatementSum?.income)}</th>
              <th>{displayValue(tradingStatementSum?.outcome)}</th>
              <th>{displayValue(tradingStatementSum?.expectedIncome)}</th>
              <th>{displayValue(tradingStatementSum?.expectedOutcome)}</th>
              <th>
                Эц.Үлд=
                {displayValue(tradingStatementSum?.endBalance, 'endBalance')}
              </th>
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody id="transactions">
            {(tradingStatements || []).map((transaction, index) => (
              <Row
                index={
                  index + (paginationParams.page - 1) * paginationParams.perPage
                }
                transaction={transaction}
              />
            ))}
          </tbody>
        </Table>
      </>
    );
  };
  onClick = () => {
    const { history } = this.props;
    const { startDate, endDate, userId } = this.state;
    router.setParams(history, {
      startDate,
      endDate,
      userId
    });
  };
  onChangeDate = (kind: string, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    if (kind == 'startDate') {
      this.setState({ startDate: formattedDate });
    } else this.setState({ endDate: formattedDate });
  };
  handleExport = async () => {
    try {
      const { startDate, endDate, userId } = this.state;
      const params: any = {
        type: 'transactions'
      };
      if (userId != undefined) params.userId = userId;
      if (startDate != undefined) params.startDate = startDate;
      if (endDate != undefined) params.endDate = endDate;
      const response = await fetch(
        `${REACT_APP_API_URL}/pl:trading/admin/export?` +
          new URLSearchParams(params).toString()
      );
      if (!response.ok) {
        Alert.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.log(err);
    }
  };
  renderActionBar() {
    const generateOptions = (array: any = []): Option[] => {
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
    const actionBarLeft = (
      <FormWrapper>
        <FormColumn>
          <DateControl
            value={this.state.startDate}
            required={false}
            name="startDate"
            onChange={date => this.onChangeDate('startDate', date)}
            placeholder={'Choose startDate'}
            dateFormat={'YYYY-MM-DD'}
          />
        </FormColumn>
        <FormColumn>
          <DateControl
            value={this.state.endDate}
            required={false}
            name="endDate"
            onChange={date => this.onChangeDate('endDate', date)}
            placeholder={'Choose endDate'}
            dateFormat={'YYYY-MM-DD'}
          />
        </FormColumn>
        <FormColumn>
          <SelectWithPagination
            queryName="tradingUserByPrefix"
            label={__('Filter by prefix and registerNumber')}
            name="userId"
            onSelect={onSelect}
            multi={false}
            disabled={false}
            customQuery={queries.UserQueries.tradingUsers}
            generateOptions={generateOptions}
            initialValue={this.state.userId}
            generateFilterParams={generateFilterParams}
            uniqueValue="userId"
          />
        </FormColumn>
        <FormColumn>
          <Button
            btnStyle="primary"
            icon="filter-1"
            onClick={this.onClick}
            size="small"
          >
            {__('Filter')}
          </Button>
        </FormColumn>
      </FormWrapper>
    );

    return <Wrapper.ActionBar left={actionBarLeft} wideSpacing />;
  }
  render() {
    const { queryParams, total, count, full } = this.props;
    console.log('full', full);
    let actionBarLeft: React.ReactNode;
    if (full) {
      return (
        <Wrapper
          header={
            <Wrapper.Header
              title={__('Transaction Statement')}
              queryParams={queryParams}
              submenu={nominalStatementMenus}
            />
          }
          actionBar={
            <Wrapper.ActionBar
              left={this.renderActionBar()}
              right={
                <Button icon="csv-export" onClick={this.handleExport}>
                  Export
                </Button>
              }
            />
          }
          content={
            <DataWithLoader
              data={this.renderContent()}
              loading={false}
              count={total}
              emptyText="There is no transaction."
              emptyImage="/images/actions/20.svg"
            />
          }
          footer={
            <Wrapper.ActionBar
              left={<Pagination count={total} />}
              right={
                <ControlLabel>
                  {__('Total transaction=')}
                  {total}
                </ControlLabel>
              }
            />
          }
          transparent={true}
          hasBorder
        />
      );
    } else {
      return (
        <>
          <Contents hasBorder={true}>
            {this.renderActionBar()}
            <PageContent
              footer={
                <Wrapper.ActionBar
                  left={<Pagination count={total} />}
                  right={
                    <ControlLabel>
                      {__('Total transaction=')}
                      {total}
                    </ControlLabel>
                  }
                />
              }
              transparent={true}
            >
              <DataWithLoader
                data={this.renderContent()}
                loading={false}
                count={total}
                emptyText="There is no transaction."
                emptyImage="/images/actions/20.svg"
              />
            </PageContent>
          </Contents>
        </>
      );
    }
  }
}

export default List;
