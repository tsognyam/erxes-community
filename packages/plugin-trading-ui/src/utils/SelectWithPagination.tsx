import React, { Component } from 'react';
import Select, { OptionsType, Option, Options } from 'react-select-plus';
import client from '@erxes/ui/src/apolloClient';
import gql from 'graphql-tag';
import _ from 'lodash';
type Props = {
  query: any;
  options: Option[];
  selectedValue: string;
  disabled: boolean;
  placeholder: string;
  name: string;
  selectedOptions: Option[] | null;
  onChange: (selectedOptions: Option[] | null) => void;
  isMulti: boolean;
};
const PAGE_SIZE = 50;
type State = {
  options: OptionsType<OptionType>;
  isLoading: boolean;
  inputValue: string;
  selectedValue: string;
  hasMore: boolean;
  page: number;
};
interface OptionType {
  value: string;
  label: string;
}

class SelectWithPagination extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      options: this.props.options,
      isLoading: false,
      inputValue: '',
      selectedValue: this.props.selectedValue,
      hasMore: true,
      page: 1
    };
  }
  loadOptions = _.debounce(async (inputValue: string, page: number) => {
    this.setState({ isLoading: true });

    // Simulate an API call with pagination
    try {
      client
        .query({
          query: gql(this.props.query),
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
                value: x.userId,
                label: x.prefix
              };
            }) || [];
          this.setState(prevState => ({
            options: [...prevState.options, ...newOptions],
            hasMore: newOptions.length === PAGE_SIZE,
            isLoading: false
          }));
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
    } catch (error) {
      console.log(error);
      this.setState({ isLoading: false });
    }
  }, 500);

  handleInputChange = (inputValue: string) => {
    this.setState(
      {
        inputValue,
        options: [],
        page: 1,
        hasMore: true,
        isLoading: true
      },
      () => {
        this.loadOptions(this.state.inputValue, this.state.page);
      }
    );
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
    const { options, isLoading } = this.state;
    const {
      placeholder,
      disabled,
      onChange,
      selectedOptions,
      isMulti
    } = this.props;
    return (
      <Select
        placeholder={placeholder}
        options={options}
        isLoading={isLoading}
        onInputChange={this.handleInputChange}
        onMenuScrollToBottom={this.handleMenuScrollToBottom}
        onChange={selectedOption => onChange(selectedOption)}
        value={selectedOptions}
        disabled={disabled}
        isMenuScrollable={true}
        maxMenuHeight={200}
        menuShouldScrollIntoView={false}
        noResultsText={this.state.isLoading ? 'Loading...' : 'No results found'}
        multi={isMulti}
      />
    );
  }
}

export default SelectWithPagination;
