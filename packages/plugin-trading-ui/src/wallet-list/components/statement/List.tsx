import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_LIST } from '../../../constants';
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
import Form from '../Form';
import { Contents } from '../../../styles';
import { FormGroup } from '@erxes/ui/src';
import { FormWrapper, FormColumn } from '@erxes/ui/src/styles/main';
import { ControlLabel, FormControl } from '@erxes/ui/src';
import { displayValue } from '../../../App';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import dayjs from 'dayjs';
import { PageContent } from '@erxes/ui/src';
import DateControl from '@erxes/ui/src/components/form/DateControl';
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
};
type State = {
  startDate: string;
  endDate: string;
};
class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: dayjs(this.props.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(this.props.endDate).format('YYYY-MM-DD')
    };
  }
  generateDoc = (values: {
    walletId?: number;
    startDate: Date;
    endDate: Date;
  }) => {
    const finalValues = values;

    return {
      walletId: finalValues.walletId,
      startDate: finalValues.startDate,
      endDate: finalValues.endDate
    };
  };

  renderContent = () => {
    const { tradingStatements, beginBalance, endBalance } = this.props;

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
          </thead>
          <tbody id="transactions">
            {(tradingStatements || []).map((transaction, index) => (
              <Row index={index} transaction={transaction} />
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
          {/* <Button onClick={this.props.renderButton} id="find-transactions" btnStyle="default" block>
                            {__('Find')}
                        </Button> */}
          {renderButton({
            values: {
              startDate: this.state.startDate,
              endDate: this.state.endDate
            }
          })}
        </FormColumn>
      </FormWrapper>
    );

    return <Wrapper.ActionBar left={actionBarLeft} wideSpacing />;
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  render() {
    const { queryParams, total, count } = this.props;

    return (
      <>
        {this.renderActionBar()}
        <Contents hasBorder={true}>
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
              emptyText="There is no statements."
              emptyImage="/images/actions/20.svg"
            />
          </PageContent>
        </Contents>
      </>
    );
  }
}

export default List;
