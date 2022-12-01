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
import { IRegisterbond } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';
import { NoWrap, ShowOverflow } from '../styles';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  toggleAll: (targets: IRegisterbond[], containerId: string) => void;
  bonds?: IRegisterbond[]; //buh bond
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

  changeStatus = (id: string): void => {
    // const { statusChangedMutation, listQuery } = this.props;

    // statusChangedMutation({
    //   variables: { _id: id }
    // })
    //   .then(() => {
    //     listQuery.refetch();

    Alert.success('Congrats, Successfully updated.');
    // })
    // .catch((error: Error) => {
    //   Alert.error(error.message);
    // });
  };

  renderContent = () => {
    const {
      toggleAll,
      bonds,
      isAllSelected,
      bulk,
      toggleBulk,
      renderButton
    } = this.props;

    const onChangeAll = () => {
      toggleAll(DATA, 'bonds');
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
            {(LIST || []).map(({ name, label }) => (
              <th key={name}>
                <SortHandler sortField={name} label={__(label)} />
              </th>
            ))}
            <th>{__('Is Closed')}</th>
            <th>{__('Registered Date')}</th>
            <th>{__('Registered Employee')}</th>
            <th>{__('Accumulative Interest')}</th>
            <th>{__('Actions')}</th>
          </tr>
        </thead>
        <tbody id="bonds">
          {(DATA || []).map((bond, index) => (
            <Row
              index={index}
              bond={bond}
              isChecked={bulk.includes(bond)}
              toggleBulk={toggleBulk}
              renderButton={renderButton}
              changeStatus={this.changeStatus}
              history={this.props.history}
            />
          ))}
        </tbody>
      </Table>
    );
  };

  renderFilter() {
    const {
      queryParams,
      history,
      onSearch,
      onSelect,
      clearFilter
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
    const { queryParams, bulk } = this.props;
    const breadcrumb = [{ title: __('Bond List'), link: '/bond-list' }];

    let actionBarLeft: React.ReactNode;

    if (bulk.length > 0) {
      const onClick = () => confirm('Are you sure? This cannot be undone.');
      // .then(() => {
      //     this.removeOrders(bulk);
      //   })
      //   .catch(e => {
      //     Alert.error(e.message);
      //   });

      actionBarLeft = (
        <Button
          btnStyle="danger"
          size="small"
          icon="times-circle"
          onClick={onClick}
        >
          {__('Delete')}
        </Button>
      );
    }

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
            left={actionBarLeft}
            right={
              <Flex>
                <NoWrap>
                  <Button
                    id={'Interest'}
                    btnStyle="success"
                    block={true}
                    icon="calcualtor"
                  >
                    {__('Calculate Interest')}
                  </Button>
                </NoWrap>
                <ShowOverflow>
                  <ModalTrigger
                    title="Register Bond"
                    trigger={
                      <Button
                        id={'NewBondButton'}
                        btnStyle="success"
                        block={true}
                        icon="plus-circle"
                      >
                        {__('Register Bond')}
                      </Button>
                    }
                    content={this.renderForm}
                  />
                </ShowOverflow>
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
            emptyText="There is no registered bond."
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
