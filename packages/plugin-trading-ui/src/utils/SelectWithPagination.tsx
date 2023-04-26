import React, { Component } from 'react';
import Select, { OptionsType, Option, Options } from 'react-select-plus';
import _ from 'lodash';
import client from '@erxes/ui/src/apolloClient';
import gql from 'graphql-tag';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { __, Alert } from '@erxes/ui/src/utils';
type IInitialValue = string | string[] | undefined;
type Props = {
  disabled: boolean;
  label: string;
  name: string;
  multi: boolean;
  onSelect: (values: string[] | string, name: string) => void;
  initialValue: IInitialValue;
  customQuery: any;
  generateOptions: (data: any[]) => Option[];
  generateFilterParams: (data: any, searchValue: string) => any;
};
type State = {
  options: OptionsType<OptionType>;
  isLoading: boolean;
  inputValue: string;
  selectedValues: string[];
  hasMore: boolean;
  page: number;
  selectedOptions: Option | Option[] | null;
};
interface OptionType {
  value: string;
  label: string;
}
const PAGE_SIZE = 50;
class SelectWithPagination extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { initialValue } = this.props;
    let initialValues: string[] = [];

    if (initialValue) {
      initialValues =
        typeof initialValue === 'string' ? [initialValue] : initialValue;
    }
    this.state = {
      options: undefined,
      isLoading: false,
      inputValue: '',
      selectedValues: initialValues,
      hasMore: true,
      page: 1,
      selectedOptions: undefined
    };
  }
  componentDidMount() {
    this.loadOptions('', 1);
  }
  loadOptions = async (inputValue: string, page: number) => {
    this.setState({ isLoading: true });
    const { customQuery, generateOptions, generateFilterParams } = this.props;
    const { selectedValues } = this.state;
    try {
      let variables: any = {
        perPage: PAGE_SIZE,
        page,
        ...generateFilterParams(selectedValues, inputValue)
      };
      client
        .query({
          query: gql(customQuery),
          variables: variables
        })
        .then(({ data }: any) => {
          let newOptions = generateOptions(data?.tradingUserByPrefix?.values);
          const totalOptions = newOptions || [];
          const totalOptionsValues = totalOptions.map(option => option.value);
          const uniqueLoadedOptions = newOptions.filter(
            data => !totalOptionsValues.includes(data.value)
          );
          const updatedTotalOptions = [...totalOptions, ...uniqueLoadedOptions];
          this.setState({
            options: updatedTotalOptions,
            hasMore: newOptions.length === PAGE_SIZE,
            isLoading: false
          });
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };
  handleMenuScrollToBottom = () => {
    if (!this.state.isLoading && this.state.hasMore) {
      this.setState(
        prevState => ({ page: prevState.page + 1 }),
        () => {
          this.loadOptions(this.state.inputValue, this.state.page);
        }
      );
    }
  };
  render() {
    const { isLoading, selectedOptions, selectedValues } = this.state;
    const { label, disabled, multi, onSelect, name } = this.props;
    let { options } = this.state;
    const selectMultiple = (ops: OptionType[]) => {
      const selectedOptionsValues = ops.map(option => option.value);
      onSelect(selectedOptionsValues, name);
      this.setState({
        selectedValues: selectedOptionsValues,
        selectedOptions: [...ops]
      });
    };
    const selectSingle = (option: OptionType) => {
      const selectedOptionValue = option ? option.value : '';

      onSelect(selectedOptionValue, name);

      this.setState({
        selectedValues: [selectedOptionValue],
        selectedOptions: [{ ...option }]
      });
    };
    const onChange = multi ? selectMultiple : selectSingle;

    const onSearch = async (searchValue: string) => {
      this.setState(
        {
          inputValue: searchValue,
          page: 1,
          hasMore: true,
          isLoading: true
        },
        () => {
          _.debounce(() => {
            this.loadOptions(this.state.inputValue, this.state.page);
          }, 1000)();
        }
      );
    };

    const onOpen = () => {
      this.setState(
        {
          page: 1,
          hasMore: true,
          isLoading: true
        },
        () => {
          this.loadOptions('', this.state.page);
        }
      );
    };

    const selectOptions = [...(options || [])];
    return (
      <Select
        placeholder={__(label)}
        options={selectOptions}
        isLoading={isLoading}
        onInputChange={onSearch}
        onMenuScrollToBottom={this.handleMenuScrollToBottom}
        onChange={onChange}
        onOpen={onOpen}
        value={multi ? selectedValues : selectedValues[0]}
        disabled={disabled}
        isMenuScrollable={true}
        maxMenuHeight={200}
        menuShouldScrollIntoView={false}
        noResultsText={isLoading ? 'Loading...' : 'No results found'}
        multi={multi}
      />
    );
  }
}
export default SelectWithPagination;
