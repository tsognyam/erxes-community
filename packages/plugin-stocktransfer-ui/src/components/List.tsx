import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import Form from './Form';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Sidebar from '../containers/Sidebar';
import RightMenu from '../components/RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import { DATA, LIST } from '../constants';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IOrder } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: IOrder[], containerId: string) => void;
  requests?: IOrder[]; //buh request
  isAllSelected: boolean;
  bulk: any[];
  // emptyBulk: () => void;
  // remove: (tradeId: string) => void;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
}

class ListComp extends React.Component<IProps> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  renderContent = () => {
    const {
      toggleAll,
      requests,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton
    } = this.props;

    const onChangeAll = () => {
      toggleAll(DATA, 'requests');
    };

    return (
      <Table>
        <thead>
          <tr>
            <th>
              <FormControl
                checked={isAllSelected}
                componentClass="checkbox"
                onChange={onChangeAll}
              />
            </th>
            <th>№</th>
            <th>
              <SortHandler sortField="requests.name" label={__('Name')} />
            </th>
            <th>
              <SortHandler
                sortField="requests.register"
                label={__('Register Number')}
              />
            </th>
            <th>{__('Phone')}</th>
            <th>{__('Registered Stock Company')}</th>
            <th>{__('Registered Stock Account')}</th>
            <th>{__('Stock')}</th>
            <th>
              <SortHandler
                sortField="requests.quantity"
                label={__('Quantity')}
              />
            </th>
            <th>
              <SortHandler
                sortField="requests.requestedDate"
                label={__('Requested Date')}
              />
            </th>
            <th>{__('Status')}</th>
            <th>
              <SortHandler
                sortField="requests.approvedDate"
                label={__('Approved Date')}
              />
            </th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="requests">
          {(DATA || []).map((request, index) => (
            <Row
              index={index}
              request={request}
              isChecked={bulk.includes(request)}
              toggleBulk={toggleBulk}
              renderButton={renderButton}
            />
          ))}
        </tbody>
      </Table>
    );
  };

  renderFilter() {
    const { queryParams, onSearch, onSelect, clearFilter } = this.props;

    const rightMenuProps = {
      queryParams,
      onSearch,
      onSelect,
      clearFilter
    };

    return <RightMenu {...rightMenuProps} />;
  }

  render() {
    const { queryParams } = this.props;
    const breadcrumb = [
      { title: __('Stock Transfer Request'), link: '/stockTransfer' }
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
        actionBar={
          <Wrapper.ActionBar
            right={
              <Flex>
                <ModalTrigger
                  title="Add Price Information of Stock Transfer Request"
                  size={'lg'}
                  trigger={
                    <Button
                      id={'NewPriceInfoButton'}
                      btnStyle="success"
                      block={true}
                      icon="plus-circle"
                    >
                      {__('Add Price Information')}
                    </Button>
                  }
                  content={this.renderForm}
                />
                {this.renderFilter()}
              </Flex>
            }
          />
        }
        leftSidebar={<Sidebar queryParams={queryParams} />}
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no stock transfer request."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={<Pagination count={90} />}
        hasBorder
      />
    );
  }
}

export default ListComp;
