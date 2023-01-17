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

type Props = {
  queryParams: any;
  history: any;
  tradingTransactionGet: any[];
  beginBalance: number;
  endBalance: number;
  total: number;
  count: number;
  startDate: Date;
  endDate: Date;
  renderButton: (props: any) => JSX.Element;
};

class List extends React.Component<Props & ICommonFormProps> {
  generateDoc = (values: {
    walletId?: number;
    startDate: Date;
    endDate: Date;
  }) => {
    const { object } = this.props;
    const finalValues = values;

    return {
      walletId: finalValues.walletId,
      startDate: finalValues.startDate,
      endDate: finalValues.endDate
    };
  };
  renderContent = () => {
    const { tradingTransactionGet, beginBalance, endBalance } = this.props;

    return (
      <>
        {this.renderActionBar()}
        <div style={{ float: 'right', paddingRight: '20px' }}>
          <div>Begin Balance: {displayValue(beginBalance)}</div>
          <div>End Balance: {displayValue(endBalance)}</div>
        </div>

        <Table>
          <thead>
            <tr>
              <th>{__('Index')}</th>
              <th>{__('Type')}</th>
              <th>{__('Amount')}</th>
              <th>{__('Before balance')}</th>
              <th>{__('After balance')}</th>
              <th>{__('Status')}</th>
              <th>{__('Description')}</th>
              <th>{__('CreatedAt')}</th>
            </tr>
          </thead>
          <tbody id="transactions">
            {(tradingTransactionGet || []).map((transaction, index) => (
              <Row index={index} transaction={transaction} />
            ))}
          </tbody>
        </Table>
      </>
    );
  };
  renderActionBar() {
    const { renderButton } = this.props;
    // const { values } = formProps;
    // console.log('formProps',formProps)
    // const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    // console.log("fefefefefe", this.CountDownTimer(1,35,6))
    const actionBarLeft = (
      <>
        <FormWrapper>
          <FormColumn>
            <ControlLabel>{__('Start Date')}</ControlLabel>
            <FormControl
              // {...formProps}
              name="startDate"
              defaultValue={this.props.startDate}
              type="date"
            />
          </FormColumn>
          <FormColumn>
            <ControlLabel>{__('End Date')}</ControlLabel>
            <FormControl
              // {...formProps}
              name="endDate"
              defaultValue={this.props.endDate}
              type="date"
            />
          </FormColumn>
          <FormColumn>
            {/* <Button onClick={this.props.renderButton} id="find-transactions" btnStyle="default" block>
                            {__('Find')}
                        </Button> */}
            {renderButton({
              // values: this.generateDoc(values),
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
      <Contents hasBorder={true}>
        {/* {leftSidebar} */}
        {this.renderContent()}
        {/* {rightSidebar} */}
      </Contents>
      // <CommonForm
      //     {...this.props}
      //     name="name"
      //     renderContent={this.renderContent}
      //     generateDoc={this.generateDoc}
      //     renderButton={this.props.renderButton}
      //     object={this.props.object}
      // />
    );
  }
}

export default List;
