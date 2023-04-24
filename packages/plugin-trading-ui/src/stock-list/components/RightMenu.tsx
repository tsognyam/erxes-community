import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { __, Alert } from '@erxes/ui/src/utils';
import React from 'react';
import RTG from 'react-transition-group';
import dayjs from 'dayjs';
import Select from 'react-select-plus';
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
type Props = {
  queryParams: any;
  clearFilter: () => void;
  onSearch: (search: string, type: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
  tradingStocks: any[];
};

type State = {
  showMenu: boolean;
};

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
    const { queryParams, onSelect, tradingStocks } = this.props;
    const stockList = tradingStocks.map(x => {
      return {
        value: x.symbol,
        label: x.symbol + ' - ' + x.stockname
      };
    });
    const stock = queryParams?.symbol ? queryParams.symbol : [];
    const userPrefix = queryParams?.prefix ? queryParams.prefix : [];
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

    const onFilterSelect = (ops: IOption[], type: string) => {
      let values: any = [];
      ops.map(item => {
        values.push(item.value);
      });
      onSelect(values, type);
    };

    return (
      <FilterBox>
        <ControlLabel>{__('Stock')}</ControlLabel>
        <Select
          placeholder={__('Filter by stock')}
          value={stock}
          options={stockList}
          name="symbol"
          onChange={ops => onFilterSelect(ops, 'symbol')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
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
