import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import RTG from 'react-transition-group';
import dayjs from 'dayjs';
import Select, { OptionsType } from 'react-select-plus';
import {
  CustomRangeContainer,
  FilterBox,
  RightMenuContainer,
  BarItems,
  MenuFooter
} from '../../styles';
import { STATE_LIST, STOCK, TYPE, ORDER_TYPE } from '../../constants';
import { IOption } from '@erxes/ui/src/types';
import _ from 'lodash';
import SelectWithPagination from '../../utils/SelectWithPagination';
import queries from '../../graphql/queries';
import client from '@erxes/ui/src/apolloClient';
import gql from 'graphql-tag';
type Props = {
  queryParams: any;
  clearFilter: () => void;
  onSearch: (search: string, type: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  prefix: any[];
};

type State = {
  showMenu: boolean;
  selectedOptions: Option[];
  isLoading: boolean;
  hasMore: boolean;
  options: OptionsType<Option>;
  selectedValue: any;
};
interface Option {
  value: string;
  label: string;
}
const PAGE_SIZE = 50;
export default class RightMenu extends React.Component<Props, State> {
  private wrapperRef;

  constructor(props) {
    super(props);
    const prefixList = props.prefix.map(x => {
      return {
        value: x.prefix,
        label: x.prefix
      };
    });
    this.state = {
      showMenu: false,
      selectedOptions: [],
      isLoading: false,
      hasMore: true,
      options: prefixList,
      selectedValue: this.props.queryParams?.prefix
        ? this.props.queryParams.prefix
        : []
    };
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }
  DateControl;

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showMenu: false });
    }
  };

  toggleMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  onSearch = (e: React.KeyboardEvent<Element>, type: string) => {
    if (e.key === 'Enter') {
      const target = e.currentTarget as HTMLInputElement;
      let data;
      if (type === 'prefix') {
        data = { prefix: target.value || '' };
      }
      this.props.onSearch(data, type);
    }
  };

  onChangeRangeFilter = (kind: string, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';

    const { queryParams, onSelect } = this.props;

    if (queryParams[kind] !== formattedDate) {
      onSelect(formattedDate, kind);
    }
  };
  loadOptions = _.debounce(async (inputValue: string, page: number) => {
    this.setState({ isLoading: true });
    try {
      new Promise((resolve, reject) => {
        client
          .query({
            query: gql(queries.UserQueries.tradingUserByPrefix),
            variables: {
              perPage: PAGE_SIZE,
              page,
              prefix: inputValue
            }
          })
          .then(({ data }: any) => {
            let newOptions =
              data?.tradingUserByPrefix?.values.map(x => {
                return {
                  value: x.prefix,
                  label: x.prefix
                };
              }) || [];

            this.setState(prevState => ({
              options: [...prevState.options, ...newOptions],
              hasMore: newOptions.length === PAGE_SIZE,
              isLoading: false
            }));
            resolve('Time is up!');
          })
          .catch(() => {
            this.setState({ isLoading: false });
            resolve('Time is up');
          });
      }).then(value => {});
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  }, 500);
  renderFilter() {
    const { queryParams, onSelect, prefix } = this.props;
    const statusValues = STATE_LIST.map(p => ({
      label: p.statusName,
      value: p.status
    }));
    const status = queryParams ? queryParams.orderstatus : [];

    const typeValues = TYPE.map(p => ({ label: p.label, value: p.value }));
    const type = queryParams ? queryParams.txntype : [];

    const orderTypeValues = ORDER_TYPE.map(p => ({
      label: p.label,
      value: p.value
    }));
    const orderType = queryParams ? queryParams.ordertype : [];

    const onFilterSelect = (ops: Option[], type: string) => {
      let values: any = [];
      ops.map(item => {
        values.push(item.value);
      });
      onSelect(values, type);
    };
    const selectedValue = queryParams?.prefix ? queryParams.prefix : [];
    return (
      <FilterBox>
        <CustomRangeContainer>
          <div>
            <ControlLabel>{__('Start date')}:</ControlLabel>
            <DateControl
              value={queryParams.startDate}
              required={false}
              name="startDate"
              onChange={date => this.onChangeRangeFilter('startDate', date)}
              placeholder={'Start date'}
              dateFormat={'YYYY-MM-DD'}
            />
          </div>
          <div>
            <ControlLabel>{__('End date')}:</ControlLabel>
            <DateControl
              value={queryParams.endDate}
              required={false}
              name="endDate"
              placeholder={'End date'}
              onChange={date => this.onChangeRangeFilter('endDate', date)}
              dateFormat={'YYYY-MM-DD'}
            />
          </div>
        </CustomRangeContainer>
        <ControlLabel>{__('Prefix')}</ControlLabel>
        <SelectWithPagination
          placeholder={__('Filter by prefix')}
          options={this.state.options}
          name="prefix"
          onChange={ops => onFilterSelect(ops, 'prefix')}
          isMulti={true}
          disabled={false}
          selectedOptions={selectedValue}
          selectedValue={selectedValue}
          loadOptions={this.loadOptions}
          isLoading={this.state.isLoading}
          hasMore={this.state.hasMore}
        />
        {/* <Select
          placeholder={__('Filter by prefix')}
          value={userPrefix}
          options={prefixList}
          name="stockcode"
          onChange={ops => onFilterSelect(ops, 'prefix')}
          loadingPlaceholder={__('Loading...')}
          multi={true}
        /> */}

        <ControlLabel>{__('Buy/Sell')}</ControlLabel>
        <Select
          placeholder={__('Filter by buy and sell')}
          value={type}
          options={typeValues}
          name="type"
          onChange={ops => onFilterSelect(ops, 'txntype')}
          loadingPlaceholder={__('Loading...')}
          multi={true}
        />
        <ControlLabel>{__('Order Type')}</ControlLabel>
        <Select
          placeholder={__('Filter by order type')}
          value={orderType}
          options={orderTypeValues}
          name="orderType"
          onChange={ops => onFilterSelect(ops, 'ordertype')}
          loadingPlaceholder={__('Loading...')}
          multi={true}
        />
        <ControlLabel>{__('Status')}</ControlLabel>
        <Select
          placeholder={__('Filter by Status')}
          value={status}
          options={_.sortBy(statusValues, ['label'])}
          name="status"
          onChange={ops => onFilterSelect(ops, 'orderstatus')}
          loadingPlaceholder={__('Loading...')}
          multi={true}
        />
      </FilterBox>
    );
  }

  render() {
    const { showMenu } = this.state;
    const { queryParams } = this.props;

    const isFiltered = Object.keys(queryParams).length !== 0;

    return (
      <div ref={this.setWrapperRef}>
        <BarItems>
          {isFiltered && (
            <Button
              btnStyle="warning"
              icon="times-circle"
              onClick={this.props.clearFilter}
            >
              {__('Clear Filter')}
            </Button>
          )}
          <Button btnStyle="simple" icon="bars" onClick={this.toggleMenu}>
            {showMenu ? __('Hide Menu') : __('Show Menu')}
          </Button>
        </BarItems>
        <RTG.CSSTransition
          in={this.state.showMenu}
          timeout={300}
          classNames="slide-in-right"
          unmountOnExit={true}
        >
          <RightMenuContainer>
            {this.renderFilter()}
            {isFiltered && (
              <MenuFooter>
                <Button
                  block={true}
                  btnStyle="warning"
                  onClick={this.props.clearFilter}
                  icon="times-circle"
                >
                  {__('Clear Filter')}
                </Button>
              </MenuFooter>
            )}
          </RightMenuContainer>
        </RTG.CSSTransition>
      </div>
    );
  }
}
