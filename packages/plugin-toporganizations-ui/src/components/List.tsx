import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import { ORGANIZATION_LIST } from '../constants';
import Row from './Row';
import { Link } from 'react-router-dom';
import Button from '@erxes/ui/src/components/Button';

type Props = {
  queryParams: any;
  history: any;
};

class ListComp extends React.Component<Props> {
  renderContent = () => {
    return (
      <Table>
        <thead>
          <tr>
            <th>&nbsp;&nbsp;№</th>
            <th>{__('Date')}</th>
            <th>{__('Symbol')}</th>
            <th>{__('Company Name')}</th>
            <th>{__('Close Price')}</th>
            <th>{__('Market value')}</th>
            <th>{__('Areas of activity')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="orders">
          {(ORGANIZATION_LIST || []).map((organization, index) => (
            <Row index={index} organization={organization} />
          ))}
        </tbody>
      </Table>
    );
  };

  render() {
    const breadcrumb = [
      { title: __('Top 20 Organizations'), link: '/topOrganizations' }
    ];

    return (
      <Wrapper
        header={<Wrapper.Header title={__('List')} breadcrumb={breadcrumb} />}
        actionBar={
          <Wrapper.ActionBar
            right={
              <Link to="/organizaion/register">
                <Button
                  id={'NewRegisterButton'}
                  btnStyle="success"
                  block={true}
                  icon="plus-circle"
                >
                  {__('Register')}
                </Button>
              </Link>
            }
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no top organizations."
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
