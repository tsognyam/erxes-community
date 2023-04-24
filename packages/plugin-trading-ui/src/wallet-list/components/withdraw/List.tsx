import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { STOCK_LIST } from '../../../constants';
import Row from './Row';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import {
  VerticalContent,
  MainContent,
  MainHead,
  HeightedWrapper
} from '@erxes/ui/src/layout/styles';
import Button from '@erxes/ui/src/components/Button';
import Form from '../Form';
import { Contents } from '../../../styles';
import { FormControl, SortHandler } from '@erxes/ui/src/components';

type Props = {
  queryParams: any;
  history: any;
  tradingWithdrawGet: any[];
  total: number;
  count: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class List extends React.Component<Props> {
  renderContent = () => {
    const { tradingWithdrawGet } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th>
              <FormControl
                // checked={isAllSelected}
                componentClass="checkbox"
                // onChange={onChangeAll}
              />
            </th>
            <th>№</th>
            <th>Prefix</th>
            <th>LastName</th>
            <th>FirstName</th>
            <th>
              <SortHandler sortField={'Type'} label={__('Type')} />
            </th>
            <th>
              <SortHandler sortField={'Amount'} label={__('Amount')} />
            </th>
            <th>
              <SortHandler sortField={'FeeAmount'} label={__('Fee amount')} />
            </th>
            <th>
              <SortHandler
                sortField={'Description'}
                label={__('Description')}
              />
            </th>
            <th>
              <SortHandler sortField={'Status'} label={__('Status')} />
            </th>
            <th>
              <SortHandler sortField={'CreatedAt'} label={__('Created date')} />
            </th>
            <th>
              <SortHandler
                sortField={'CreatedUser'}
                label={__('Created user')}
              />
            </th>

            <th>{__('')}</th>
          </tr>
        </thead>
        <tbody id="withdraw-list">
          {(tradingWithdrawGet || []).map((data, index) => (
            <Row index={index} data={data} />
          ))}
        </tbody>
      </Table>
    );
  };
  renderActionBar() {
    // const title = <ControlLabel>{__('Stock Order')}</ControlLabel>;
    // console.log("fefefefefe", this.CountDownTimer(1,35,6))
    const actionBarRight = (
      <>
        <ModalTrigger
          title="Add stock"
          size={'lg'}
          trigger={
            <Button id="add-stock" btnStyle="success" icon="plus-circle">
              {__('Add Stock')}
            </Button>
          }
          content={this.renderForm}
        />
      </>
    );

    return <Wrapper.ActionBar right={actionBarRight} wideSpacing />;
  }
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };
  render() {
    const { queryParams, total, count } = this.props;

    return (
      //   <Wrapper
      //     header={
      //       <Wrapper.Header
      //         title={__('List')}
      //         breadcrumb={breadcrumb}
      //         queryParams={queryParams}
      //       />
      //     }
      //     content={
      //       <DataWithLoader
      //         data={this.renderContent()}
      //         loading={false}
      //         count={total}
      //         emptyText="There is no fee list."
      //         emptyImage="/images/actions/20.svg"
      //       />
      //     }
      //     // actionBar={this.renderActionBar()}
      //     footer={<Pagination count={total} />}
      //     hasBorder
      //   />
      <VerticalContent>
        {<Wrapper.Header title={__('List')} queryParams={queryParams} />}
        {/* <MainHead>{mainHead}</MainHead> */}
        <HeightedWrapper>
          <Contents hasBorder={true}>
            {/* {leftSidebar} */}
            {this.renderContent()}
            {/* {rightSidebar} */}
          </Contents>
        </HeightedWrapper>
      </VerticalContent>
    );
  }
}

export default List;
