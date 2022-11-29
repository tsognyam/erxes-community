import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Form from './Form';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Button from '@erxes/ui/src/components/Button';
import Table from '@erxes/ui/src/components/Table';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import RightMenu from '../components/RightMenu';
import { Flex } from '@erxes/ui/src/styles/main';
import { DATA, LIST } from '../constants';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IContract } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';
import { NoWrapButton } from '../styles';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: IContract[], containerId: string) => void;
  contracts?: IContract[]; //buh contract
  isAllSelected: boolean;
  bulk: any[];
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
}

class ListComp extends React.Component<IProps> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  renderAttachAction = object => {
    const content = props => {
      return this.renderForm({ ...props, object });
    };

    return (
      <ModalTrigger
        title="Attach Contract"
        trigger={
          <NoWrapButton>
            <Button
              id={'AttachContractButton'}
              btnStyle="success"
              block={true}
              icon="plus-circle"
            >
              {__('Attach Contract')}
            </Button>
          </NoWrapButton>
        }
        content={content}
      />
    );
  };

  renderContent = () => {
    const {
      toggleAll,
      contracts,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton
    } = this.props;

    const onChangeAll = () => {
      toggleAll(DATA, 'contracts');
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
            {(LIST || []).map(({ name, label }) => (
              <th key={name}>
                <SortHandler sortField={name} label={__(label)} />
              </th>
            ))}
            <th>{__('Status')}</th>
            <th>
              <SortHandler sortField={'signedDate'} label={__('Signed Date')} />
            </th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="contracts">
          {(DATA || []).map((contract, index) => (
            <Row
              index={index}
              contract={contract}
              isChecked={bulk.includes(contract)}
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
    const { queryParams, bulk } = this.props;
    const breadcrumb = [{ title: __('Contracts'), link: '/contract' }];

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
                  title="Add Contract"
                  trigger={
                    <Button
                      id={'NewContractButton'}
                      btnStyle="success"
                      block={true}
                      icon="plus-circle"
                    >
                      {__('Add Contract')}
                    </Button>
                  }
                  content={this.renderForm}
                />
                {this.renderAttachAction(bulk)}
                {this.renderFilter()}
              </Flex>
            }
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no contract."
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
