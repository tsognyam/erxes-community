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
import { TYPE } from '../constants';
import { IOption } from '@erxes/ui/src/types';
import SelectTeamMembers from '@erxes/ui/src/team/containers/SelectTeamMembers';
import { FormGroup } from '@erxes/ui/src/components/form';
import { router as routerUtils } from '@erxes/ui/src/utils';

type Props = {
  queryParams: any;
  history: any;
  clearFilter: () => void;
  onSearch: (search: string) => void;
  onSelect: (values: string[] | string, key: string) => void;
};

type State = {
  showMenu: boolean;
  canRecall?: boolean;
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
      if (type === 'unitPrice') {
        data = { unitPrice: target.value || '' };
      }
      if (type === 'interestRate') {
        data = { interestRate: target.value || '' };
      }
      if (type === 'bondPeriod') {
        data = { bondPeriod: target.value || '' };
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

    const typeValues = TYPE.map(p => ({ label: p.label, value: p.value }));
    const type = queryParams ? queryParams.type : [];

    const bondValues = TYPE.map(p => ({ label: p.label, value: p.value }));
    const bond = queryParams ? queryParams.bond : [];

    const cuponValues = TYPE.map(p => ({ label: p.label, value: p.value }));
    const cupon = queryParams ? queryParams.cupon : [];

    const mainPaymentValues = TYPE.map(p => ({
      label: p.label,
      value: p.value
    }));
    const mainPayment = queryParams ? queryParams.mainPayment : [];

    const toggleCanRecall = () => {
      console.log('Clicked', this.props.history);
      this.setState({ canRecall: !this.state.canRecall });
      if (!this.state.canRecall) {
        return routerUtils.setParams(this.props.history, { canRecall: 'true' });
      }
      return routerUtils.removeParams(this.props.history, 'canRecall');
    };

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
        <ControlLabel>{__('Type')}</ControlLabel>
        <Select
          placeholder={__('Filter by type')}
          value={type}
          options={typeValues}
          name="type"
          onChange={ops => onFilterSelect(ops, 'type')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Bond')}</ControlLabel>
        <Select
          placeholder={__('Filter by bond')}
          value={bond}
          options={bondValues}
          name="bond"
          onChange={ops => onFilterSelect(ops, 'bond')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Unit Price')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.unitPrice}
          type="number"
          placeholder={__('Enter unitPrice')}
          onKeyPress={e => this.onSearch(e, 'unitPrice')}
        />
        <ControlLabel>{__('Bond period')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.bondPeriod}
          placeholder={__('Enter Bond Period')}
          type="text"
          onKeyPress={e => this.onSearch(e, 'bondPeriod')}
        />
        <ControlLabel>{__('Interest Rate')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.interestRate}
          placeholder={__('Enter interest')}
          type="number"
          onKeyPress={e => this.onSearch(e, 'interestRate')}
        />
        <ControlLabel>{__('Cupon payment')}</ControlLabel>
        <Select
          placeholder={__('Filter by cupon payment')}
          value={cupon}
          options={cuponValues}
          name="cupon"
          onChange={ops => onFilterSelect(ops, 'cupon')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Main payment')}</ControlLabel>
        <Select
          placeholder={__('Filter by main payment')}
          value={mainPayment}
          options={mainPaymentValues}
          name="mainPayment"
          onChange={ops => onFilterSelect(ops, 'mainPayment')}
          multi={true}
          loadingPlaceholder={__('Loading...')}
        />
        <ControlLabel>{__('Registered Employee')}</ControlLabel>
        <SelectTeamMembers
          label="Filter by Registered Employee"
          name="userIds"
          queryParams={queryParams}
          onSelect={onSelect}
        />
        <FormGroup>
          <FormControl
            name="toPrimaryTrade"
            checked={this.state.canRecall}
            componentClass="checkbox"
            onChange={toggleCanRecall}
          />
          <ControlLabel>{__('Can Recalled')}</ControlLabel>
        </FormGroup>
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
