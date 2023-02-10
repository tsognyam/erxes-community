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
import ErrorBoundary from '@erxes/ui/src/components/ErrorBoundary';
type Props = {
  queryParams: any;
  history: any;
  wallets: any;
  beginBalance: number;
  endBalance: number;
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
    const { wallets } = this.props;
    console.log('wallet', wallets);
    return (
      <>
        <></>
        <ErrorBoundary>
          <Table>
            <thead>
              <tr>
                <th>{__('Index')}</th>
                <th>{__('Stock code')}</th>
                <th>{__('Symbol')}</th>
                <th>{__('Balance')}</th>
                <th>{__('Income')}</th>
                <th>{__('Outcome')}</th>
                <th>{__('Avg price')}</th>
                <th>{__('+/-')}</th>
              </tr>
            </thead>
            <tbody id="stock-list">
              {(wallets || []).map((list, index) => (
                <Row index={index} wallet={list} />
              ))}
            </tbody>
          </Table>
        </ErrorBoundary>
      </>
    );
  };
  render() {
    const { queryParams } = this.props;

    return (
      <Contents headers="Wallet list" hasBorder={true}>
        {this.renderContent()}
      </Contents>
    );
  }
}

export default List;
