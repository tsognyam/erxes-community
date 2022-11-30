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
} from '../../styles';
import { TYPE_ARRAY } from '../../constants';
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
      if (type === 'usedAccount') {
        data = { usedAccount: target.value || '' };
      }
      if (type === 'registry') {
        data = { registry: target.value || '' };
      }
      if (type === 'realAccount') {
        data = { realAccount: target.value || '' };
      }
      if (type === 'journalNumber') {
        data = { journalNumber: target.value || '' };
      }
      if (type === 'transactionMeaning') {
        data = { transactionMeaning: target.value || '' };
      }
      if (type === 'transactionAmount') {
        data = { transactionAmount: target.value || '' };
      }
      if (type === 'nominalAccount') {
        data = { nominalAccount: target.value || '' };
      }
      if (type === 'name') {
        data = { name: target.value || '' };
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

    const typeValues = TYPE_ARRAY.map(p => ({ label: p, value: p }));
    const type = queryParams ? queryParams.type : [];

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
        <ControlLabel>{__('Registry number')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.registry}
          type="text"
          placeholder={__('Enter registry number')}
          onKeyPress={e => this.onSearch(e, 'registry')}
        />
        <ControlLabel>{__('Used Account')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.usedAccount}
          type="number"
          placeholder={__('Enter used account')}
          onKeyPress={e => this.onSearch(e, 'usedAccount')}
        />
        <ControlLabel>{__('Real Account')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.realAccount}
          type="number"
          placeholder={__('Enter real account')}
          onKeyPress={e => this.onSearch(e, 'realAccount')}
        />
        <ControlLabel>{__('User Name')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.name}
          placeholder={__('Enter user name')}
          onKeyPress={e => this.onSearch(e, 'name')}
        />
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
        <ControlLabel>{__('Journal Number')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.journalNumber}
          type="number"
          placeholder={__('Enter journal number')}
          onKeyPress={e => this.onSearch(e, 'journalNumber')}
        />
        <ControlLabel>{__('Transaction Meaning')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.transactionMeaning}
          placeholder={__('Enter transaction meaning')}
          onKeyPress={e => this.onSearch(e, 'transactionMeaning')}
        />
        <ControlLabel>{__('Transaction Amount')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.transactionAmount}
          type="number"
          placeholder={__('Enter transaction amount')}
          onKeyPress={e => this.onSearch(e, 'transactionAmount')}
        />
        <ControlLabel>{__('Nominal Account')}</ControlLabel>
        <FormControl
          defaultValue={queryParams.nominalAccount}
          type="number"
          placeholder={__('Enter nominal account')}
          onKeyPress={e => this.onSearch(e, 'nominalAccount')}
        />
      </FilterBox>
    );
  }

  render() {
    const { showMenu } = this.state;
    const { queryParams } = this.props;

    const isFiltered = Object.keys(queryParams).length !== 1;

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
