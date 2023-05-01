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
import _ from 'lodash';
import SelectWithPagination from '../../utils/SelectWithPagination';
import queries from '../../graphql/queries';
import SelectCompanies from '@erxes/ui-contacts/src/companies/containers/SelectCompanies';
import SelectCustomers from '@erxes/ui-contacts/src/customers/containers/SelectCustomers';

type Props = {
  queryParams: any;
  clearFilter: () => void;
  onSearch: (search: string, type: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  configs: any;
};

type State = {
  showMenu: boolean;
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
    this.state = {
      showMenu: false
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

  renderFilter() {
    const { queryParams, onSelect, configs } = this.props;
    const selectedCurrencies = queryParams ? queryParams.currencyCode : [];
    const dealCurrency =
      configs.find(x => x.code == 'dealCurrency')?.value || [];
    const currencies = dealCurrency.map(item => {
      return {
        value: item,
        label: item
      };
    });
    const generateOptions = (array: any = []): Option[] => {
      return array.map(item => {
        return {
          value: item.prefix,
          label: item.prefix,
          value2: item.registerNumber
        };
      });
    };
    const generateFilterParams = (value: any, searchValue: string) => {
      return {
        searchValue: searchValue,
        prefixs: value
      };
    };
    const onFilterSelect = (ops: Option[], type: string) => {
      let values: any = [];
      ops.map(item => {
        values.push(item.value);
      });
      onSelect(values, type);
    };
    const selectedValue = queryParams?.prefix;
    return (
      <FilterBox>
        <ControlLabel>{__('Prefix&RegisterNumber')}</ControlLabel>
        <SelectWithPagination
          queryName="tradingUserByPrefix"
          label={__('Filter by prefix and registerNumber')}
          name="prefix"
          onSelect={onSelect}
          multi={true}
          disabled={false}
          customQuery={queries.UserQueries.tradingUsers}
          generateOptions={generateOptions}
          initialValue={selectedValue}
          generateFilterParams={generateFilterParams}
          uniqueValue="prefix"
        />
        <ControlLabel>Currency</ControlLabel>
        <Select
          options={currencies}
          value={selectedCurrencies}
          onChange={ops => onFilterSelect(ops, 'currencyCode')}
          multi={true}
        />
        <SelectCompanies
          label={__('Filter by companies')}
          name="companyIds"
          queryParams={queryParams}
          onSelect={onSelect}
        />
        <SelectCustomers
          label="Filter by customers"
          name="customerIds"
          queryParams={queryParams}
          onSelect={onSelect}
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
