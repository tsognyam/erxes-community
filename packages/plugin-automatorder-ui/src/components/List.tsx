import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Sidebar from '../containers/Sidebar';
import RightMenu from '../components/RightMenu';
import { DATA } from '../constants';
import { IAutomatorder } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  open?: boolean;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  orders?: IAutomatorder[]; //buh order
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
}

class ListComp extends React.Component<IProps> {
  renderContent = () => {
    const { orders, renderButton } = this.props;

    return (
      <Table>
        <thead>
          <tr>
            <th></th>
            <th>№</th>
            <th>{__('Prefix')}</th>
            <th>{__('Stock')}</th>
            <th>{__('Order Type')}</th>
            <th>{__('Frequency')}</th>
            <th>{__('Order Day')}</th>
            <th>{__('Order Time')}</th>
            <th>{__('Amount')}</th>
            <th>{__('Active or not')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(DATA || []).map((order, index) => (
            <Row index={index} order={order} renderButton={renderButton} />
          ))}
        </tbody>
      </Table>
    );
  };

  renderFilter() {
    const {
      queryParams,
      onSearch,
      onSelect,
      clearFilter,
      history
    } = this.props;

    const rightMenuProps = {
      queryParams,
      history,
      onSearch,
      onSelect,
      clearFilter
    };

    return <RightMenu {...rightMenuProps} />;
  }

  render() {
    const { queryParams } = this.props;
    const breadcrumb = [{ title: __('Automat Order'), link: '/automatorders' }];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Automat Order')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        actionBar={<Wrapper.ActionBar right={this.renderFilter()} />}
        leftSidebar={<Sidebar queryParams={queryParams} />}
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no automat order."
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
