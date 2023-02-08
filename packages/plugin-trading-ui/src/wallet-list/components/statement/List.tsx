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
type Props = {
  queryParams: any;
  history: any;
  tradingStatements: any[];
  beginBalance: number;
  endBalance: number;
  total: number;
  count: number;
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
        {this.renderActionBar()}
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
              <th>{__('Үнэт цаасны нэр')}</th>
              <th>{__('Симбол')}</th>
              <th>{__('Код')}</th>
              <th>{__('Орлого')}</th>
              <th>{__('Зарлага')}</th>
              <th>{__('ХБО')}</th>
              <th>{__('ХБЗ')}</th>
              <th>{__('Үнэ')}</th>
              <th>{__('Нийт дүн')}</th>
              <th>{__('Шимтгэл')}</th>
              <th>{__('Тайлбар')}</th>
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
  onChangeDate = (e, type = '') => {
    if (type == 'startDate') {
      console.log(e.target);
      this.setState({ startDate: e.target.value });
    } else this.setState({ endDate: e.target.value });
  };
  renderActionBar() {
    const { renderButton } = this.props;
    const actionBarLeft = (
      <>
        <FormWrapper>
          <FormColumn>
            <ControlLabel>{__('Start Date')}</ControlLabel>
            <FormControl
              name="startDate"
              defaultValue={this.state.startDate}
              value={this.state.startDate}
              type="date"
              onChange={e => this.onChangeDate(e, 'startDate')}
            />
          </FormColumn>
          <FormColumn>
            <ControlLabel>{__('End Date')}</ControlLabel>
            <FormControl
              name="endDate"
              defaultValue={this.state.endDate}
              value={this.state.endDate}
              type="date"
              onChange={e => this.onChangeDate(e, 'endDate')}
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
      </>
    );

    return <Wrapper.ActionBar left={actionBarLeft} wideSpacing />;
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  render() {
    const { queryParams, total, count } = this.props;

    return (
      // <Contents hasBorder={true}>
      //   {/* {leftSidebar} */}
      //   {this.renderContent()}
      //   {/* {rightSidebar} */}
      // </Contents>
      <form>{this.renderContent()}</form>
    );
  }
}

export default List;
