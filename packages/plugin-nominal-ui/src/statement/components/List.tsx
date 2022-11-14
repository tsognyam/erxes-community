import { __, router } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Sidebar from '../containers/Sidebar';
import RightMenu from '../components/RightMenu';
import {
  DATA_DOMESTIC,
  DATA_INTERNATIONAL,
  DATA_BOND,
  LIST
} from '../../constants';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
}

type State = {
  statementType: any;
};

class ListComp extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      statementType: []
    };
  }

  componentDidMount() {
    const { queryParams, history } = this.props;

    if (Object.keys(queryParams).length === 0) {
      router.setParams(history, { statementType: 'Domestic' });
      this.setState({ statementType: DATA_DOMESTIC });
    }
    if (queryParams.statementType === 'Domestic') {
      this.setState({ statementType: DATA_DOMESTIC });
    }
    if (queryParams.statementType === 'International') {
      this.setState({ statementType: DATA_INTERNATIONAL });
    }
    if (queryParams.statementType === 'Bond') {
      this.setState({ statementType: DATA_BOND });
    }
  }

  chooseStatementType = (obj: any) => {
    this.setState({ statementType: obj });
  };

  renderContent = () => {
    const { statementType } = this.state;

    return (
      <Table>
        <thead>
          <tr>
            <th>№</th>
            {(LIST || []).map(({ name, label }) => (
              <th key={name}>
                <SortHandler sortField={name} label={__(label)} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody id="statement">
          {(statementType || []).map((statement, index) => (
            <Row index={index} statement={statement} />
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
    const breadcrumb = [{ title: __('Statement'), link: '/nominal/statement' }];

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('List')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        actionBar={<Wrapper.ActionBar right={this.renderFilter()} />}
        leftSidebar={
          <Sidebar
            statementType={this.chooseStatementType}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no statement."
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
