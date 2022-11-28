import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, router } from '@erxes/ui/src/utils';
import React from 'react';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Sidebar from '../containers/Sidebar';
import RightMenu from '../components/RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import { DATA, LIST, DATA1, DATA2 } from '../constants';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IApplications } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';
import Form from './Form';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: IApplications[], containerId: string) => void;
  applications?: IApplications; //buh applications
  bulk: any[];
  isAllSelected: boolean;
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
}

type State = {
  moneyType: any;
};

class ListComp extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      moneyType: []
    };
  }

  componentDidMount() {
    const { queryParams, history } = this.props;

    if (Object.keys(queryParams).length === 0) {
      router.setParams(history, { moneyType: 'UTSTKHT' });
      this.setState({ moneyType: DATA });
    }
    if (queryParams.moneyType === 'UTSTKHT') {
      this.setState({ moneyType: DATA });
    }
    if (queryParams.moneyType === 'International') {
      this.setState({ moneyType: DATA1 });
    }
    if (queryParams.moneyType === 'Bond') {
      this.setState({ moneyType: DATA2 });
    }
  }

  chooseType = (obj: any) => {
    this.setState({ moneyType: obj });
  };

  renderForm = () => {
    return (
      <Form bulk={this.props.bulk} renderButton={this.props.renderButton} />
    );
  };

  renderContent = () => {
    const {
      toggleAll,
      applications,
      bulk,
      isAllSelected,
      toggleBulk,
      renderButton
    } = this.props;

    const onChangeAll = () => {
      toggleAll(DATA, 'applications');
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
              <SortHandler
                sortField={'applications.firstName'}
                label={__('First Name')}
              />
            </th>
            <th>{__('Register number')}</th>
            {LIST.map(list => (
              <th>
                <SortHandler sortField={list.name} label={__(list.label)} />
              </th>
            ))}
            <th>{__('Reason')}</th>
          </tr>
        </thead>
        <tbody id="applications">
          {(this.state.moneyType || []).map((application, index) => (
            <Row
              index={index}
              application={application}
              isChecked={bulk.includes(application)}
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
      { title: __('Application For Money'), link: '/applicationformoney' }
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
                  title="Application for Money"
                  size={'lg'}
                  trigger={
                    <Button id={'SettleApplicationButton'}>
                      {__('Settle Application')}
                    </Button>
                  }
                  content={this.renderForm}
                />
                {this.renderFilter()}
              </Flex>
            }
          />
        }
        leftSidebar={
          <Sidebar type={this.chooseType} queryParams={queryParams} />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no application for money."
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
