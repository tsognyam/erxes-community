import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __, Alert, router } from '@erxes/ui/src/utils';
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
import {
  DATA_DOMESTIC,
  DATA_IPO,
  DATA_INTERNATIONAL,
  DATA_BOND,
  DATA_AUTOMATED,
  LIST
} from '../constants';
import FormControl from '@erxes/ui/src/components/form/Control';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import { IOrder } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import Row from './Row';

interface IProps extends IRouterProps {
  queryParams: any;
  history: any;
  toggleAll: (targets: IOrder[], containerId: string) => void;
  isAllSelected: boolean;
  bulk: any[];
  clearFilter: () => void;
  onSearch: (search: string, key?: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  toggleBulk: (target: any, toAdd: boolean) => void;
}

type State = {
  tradingType: any;
};

class ListComp extends React.Component<IProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      tradingType: []
    };
  }

  componentDidMount() {
    const { queryParams, history } = this.props;

    if (Object.keys(queryParams).length === 0) {
      router.setParams(history, { tradingType: 'DomesticTrading' });
      this.setState({ tradingType: DATA_DOMESTIC });
    }
    if (queryParams.tradingType === 'IPO') {
      this.setState({ tradingType: DATA_IPO });
    }
    if (queryParams.tradingType === 'DomesticTrading') {
      this.setState({ tradingType: DATA_DOMESTIC });
    }
    if (queryParams.tradingType === 'InternationalTrading') {
      this.setState({ tradingType: DATA_INTERNATIONAL });
    }
    if (queryParams.tradingType === 'BondTrading') {
      this.setState({ tradingType: DATA_BOND });
    }
    if (queryParams.tradingType === 'IPO') {
      this.setState({ tradingType: DATA_AUTOMATED });
    }
  }

  chooseTradingType = (obj: any) => {
    this.setState({ tradingType: obj });
  };

  renderContent = () => {
    const {
      toggleAll,
      isAllSelected,
      queryParams,
      bulk,
      toggleBulk
    } = this.props;

    const { tradingType } = this.state;

    const onChangeAll = () => {
      toggleAll(tradingType, 'commission');
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
          </tr>
        </thead>
        <tbody id="commission">
          {(tradingType || []).map((commission, index) => (
            <Row
              index={index}
              commission={commission}
              isChecked={bulk.includes(commission)}
              toggleBulk={toggleBulk}
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
      { title: __('Primary Trading'), link: '/primarytrade' }
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
                <Button
                  id={'ExportButton'}
                  btnStyle="success"
                  href="/settings/exportHistories"
                >
                  Export
                </Button>
                {this.renderFilter()}
              </Flex>
            }
          />
        }
        leftSidebar={
          <Sidebar
            tradingType={this.chooseTradingType}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={90}
            emptyText="There is no order."
            emptyImage="/images/actions/20.svg"
          />
        }
        footer={<Pagination count={90} />}
        noPadding
        hasBorder
      />
    );
  }
}

export default ListComp;
