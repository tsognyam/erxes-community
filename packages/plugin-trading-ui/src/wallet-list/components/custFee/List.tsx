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

type Props = {
  queryParams: any;
  history: any;
  tradingCustFeeGetList: any[];
  total: number;
  count: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class List extends React.Component<Props> {
  renderContent = () => {
    const { tradingCustFeeGetList } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th>{__('Index')}</th>
            <th>{__('Name')}</th>
            <th>{__('Stock type')}</th>
            <th>{__('Value')}</th>
            <th>{__('Status')}</th>
            <th>{__('Updated date')}</th>
          </tr>
        </thead>
        <tbody id="fees">
          {(tradingCustFeeGetList || []).map((custFee, index) => (
            <Row index={index} custFee={custFee} />
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
