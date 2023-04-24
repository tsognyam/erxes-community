import { __ } from '@erxes/ui/src/utils';
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
import Select from 'react-select-plus';
import _ from 'lodash';
type Props = {
  queryParams: any;
  history: any;
  items: any[];
  total: number;
  count: number;
  loading: boolean;
  renderButton: (props: any) => JSX.Element;
  closeModal: () => void;
  startDate: string;
  endDate: string;
  full: boolean;
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
      startDate: dayjs(this.props.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.props.endDate).format('YYYY-MM-DD'),
      userId: this.props.userId
    };
  }
  prefixChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ userId: value });
  };
  renderContent = () => {
    const { items } = this.props;

    return (
      <>
        <Table>
          <thead>
            <tr>
              <th></th>
              <th>{__('Client prefix')}</th>
              <th>{__('Client suffix')}</th>
              <th>{__('Trade date')}</th>
              <th>{__('Settlement date')}</th>
              <th>{__('Buy quantity')}</th>
              <th>{__('Buy obligation')}</th>
              <th>{__('Sell quantity')}</th>
              <th>{__('Sell obligation')}</th>
              <th>{__('Quantity')}</th>
              <th>{__('Obligation')}</th>
              <th>{__('MSE fee')}</th>
              <th>{__('MSCC fee')}</th>
              <th>{__('FRC fee')}</th>
              <th>{__('Status')}</th>
              <th>{__('Status description')}</th>
              <th>{__('CreatedAt')}</th>
            </tr>
          </thead>
          <tbody id="transactions">
            {(items || []).map((settlement, index) => (
              <Row index={index} settlement={settlement} />
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
            placeholder={'Start date'}
            dateFormat={'YYYY-MM-DD'}
          />
        </FormColumn>
        <FormColumn>
          <DateControl
            value={this.state.endDate}
            required={false}
            name="endDate"
            onChange={date => this.onChangeDate('endDate', date)}
            placeholder={'End date'}
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
    const breadcrumb = [
      { title: __('Settlement list'), link: '/trading/order-list' }
    ];
    if (full) {
      return (
        <Wrapper
          header={
            <Wrapper.Header
              title={__('Settlement list')}
              queryParams={queryParams}
              breadcrumb={breadcrumb}
            />
          }
          actionBar={<Wrapper.ActionBar left={this.renderActionBar()} />}
          content={
            <DataWithLoader
              data={this.renderContent()}
              loading={false}
              count={total}
              emptyText="There is no settlement."
              emptyImage="/images/actions/20.svg"
            />
          }
          footer={
            <Wrapper.ActionBar
              left={<Pagination count={total} />}
              right={
                <ControlLabel>
                  {__('Total settlements=')}
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
      <>
        <Contents hasBorder={true}>
          {this.renderActionBar()}
          <PageContent
            footer={
              <Wrapper.ActionBar
                left={<Pagination count={total} />}
                right={
                  <ControlLabel>
                    {__('Total settlements=')}
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
              emptyText="There is no settlement."
              emptyImage="/images/actions/20.svg"
            />
          </PageContent>
        </Contents>
      </>;
    }
  }
}

export default List;
