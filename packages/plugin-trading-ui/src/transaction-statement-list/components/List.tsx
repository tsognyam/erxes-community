import { __ } from '@erxes/ui/src/utils';
import Select from 'react-select-plus';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_LIST } from '../../constants';
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
type Props = {
  queryParams: any;
  history: any;
  tradingStatements: any[];
  beginBalance: number;
  endBalance: number;
  total: number;
  count: number;
  loading: boolean;
  renderButton: (props: any) => JSX.Element;
  closeModal: () => void;
  startDate: string;
  endDate: string;
  full: boolean;
  tradingStatementSum: any;
  prefix: any;
  userId?: string;
};
type State = {
  startDate: string;
  endDate: string;
  userId?: string;
};
class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      userId: this.props.userId
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
              <th>{__('Эхний үлдэгдэл')}</th>
              <th>{__('Орлого')}</th>
              <th>{__('Зарлага')}</th>
              <th>{__('ХБО')}</th>
              <th>{__('ХБЗ')}</th>
              <th>{__('Эцсийн үлдэгдэл')}</th>
              <th>{__('Гүйлгээний утга')}</th>
              <th>Үүсгэсэн огноо</th>
            </tr>
            <tr>
              <th colSpan={4}></th>
              <th>{displayValue(tradingStatementSum?.beginBalance)}</th>
              <th>{displayValue(tradingStatementSum?.income)}</th>
              <th>{displayValue(tradingStatementSum?.outcome)}</th>
              <th>{displayValue(tradingStatementSum?.expectedIncome)}</th>
              <th>{displayValue(tradingStatementSum?.expectedOutcome)}</th>
              <th>{displayValue(tradingStatementSum?.endBalance)}</th>
              <th colSpan={3}></th>
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
  onChangeDate = (kind: string, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    if (kind == 'startDate') {
      this.setState({ startDate: formattedDate });
    } else this.setState({ endDate: formattedDate });
  };
  renderActionBar() {
    const { renderButton } = this.props;
    const prefixList = this.props.prefix.map(x => {
      return {
        value: x.userId,
        label: x.prefix
      };
    });
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
          <Select
            placeholder={__('Prefix')}
            value={this.state.userId}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.prefixChange}
            name="userId"
          />
        </FormColumn>
        <FormColumn>
          {renderButton({
            values: {
              startDate: this.state.startDate,
              endDate: this.state.endDate,
              userId: this.state.userId
            }
          })}
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
          actionBar={<Wrapper.ActionBar left={this.renderActionBar()} />}
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
