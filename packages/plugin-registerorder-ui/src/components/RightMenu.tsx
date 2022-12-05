import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import { __ } from '@erxes/ui/src/utils';
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
} from '../styles';
import { STATUS, IPO, INTEREST_PAYMENT, MAIN_PAYMENT } from '../constants';
import { IOption } from '@erxes/ui/src/types';

type Props = {
  queryParams: any;
  clearFilter: () => void;
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
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
      if (type === 'registry') {
        data = { registry: target.value || '' };
      }
      if (type === 'firstName') {
        data = { firstName: target.value || '' };
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
    const { queryParams, onSelect } = this.props;

    const bondValues = IPO.map(p => ({ label: p.label, value: p.value }));
    const bond = queryParams ? queryParams.bond : [];

    const statusValues = STATUS.map(p => ({
      label: p.label,
      value: p.value
    }));
    const status = queryParams ? queryParams.status : [];

    const interestPaymentValues = INTEREST_PAYMENT.map(p => ({
      label: p.label,
      value: p.value
    }));
    const interestPayment = queryParams ? queryParams.interestPayment : [];

    const mainPaymentValues = MAIN_PAYMENT.map(p => ({
      label: p.label,
      value: p.value
    }));
    const mainPayment = queryParams ? queryParams.mainPayment : [];

    const onFilterSelect = (ops: IOption[], type: string) =>
      onSelect(ops[ops.length - 1].value, type);

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
        <FormControl
          defaultValue={queryParams.prefix}
          placeholder={__('Enter prefix')}
          type="number"
          onKeyPress={e => this.onSearch(e, 'prefix')}
        />
        <ControlLabel>{__('Registry number')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.registry}
          type="text"
          placeholder={__('Enter registry number')}
          onKeyPress={e => this.onSearch(e, 'registry')}
        />
        <ControlLabel>{__('First Name')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.firstName}
          placeholder={__('Enter First Name')}
          type="text"
          onKeyPress={e => this.onSearch(e, 'firstName')}
        />
        <ControlLabel>{__('Bond')}</ControlLabel>
        <Select
          placeholder={__('Filter by Bond')}
          value={bond}
          options={bondValues}
          name="bond"
          onChange={ops => onFilterSelect(ops, 'bond')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Interest Payment')}</ControlLabel>
        <Select
          placeholder={__('Filter by interest payment')}
          value={interestPayment}
          options={interestPaymentValues}
          name="interestPayment"
          onChange={ops => onFilterSelect(ops, 'interestPayment')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Main Payment')}</ControlLabel>
        <Select
          placeholder={__('Filter by main payment')}
          value={mainPayment}
          options={mainPaymentValues}
          name="mainPayment"
          onChange={ops => onFilterSelect(ops, 'mainPayment')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Status')}</ControlLabel>
        <Select
          placeholder={__('Filter by status')}
          value={status}
          options={statusValues}
          name="status"
          onChange={ops => onFilterSelect(ops, 'status')}
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
