import React, { Component } from 'react';
import Select, { OptionsType, Option, Options } from 'react-select-plus';
import _ from 'lodash';
type Props = {
  options: Option[];
  selectedValue: string;
  disabled: boolean;
  placeholder: string;
  name: string;
  selectedOptions: Option[] | null;
  onChange: (selectedOptions: Option[] | Option) => void;
  isMulti: boolean;
  isLoading: boolean;
  loadOptions: (inputValue: string, page: number) => void;
  hasMore: boolean;
};
type State = {
  options: OptionsType<OptionType>;
  isLoading: boolean;
  inputValue: string;
  selectedValue: string;
  hasMore: boolean;
  page: number;
  selectedOptions: Option[] | null;
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
      isLoading: this.props.isLoading,
      inputValue: '',
      selectedValue: this.props.selectedValue,
      hasMore: this.props.hasMore,
      page: 1,
      selectedOptions: this.props.selectedOptions
    };
  }
  componentWillReceiveProps(nextProps: Props) {
    const {
      isLoading,
      options,
      hasMore,
      selectedOptions,
      selectedValue
    } = nextProps;
    if (this.props.isLoading != isLoading) {
      this.setState({
        isLoading,
        hasMore,
        options,
        selectedValue,
        selectedOptions
      });
    }
  }
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
        this.props.loadOptions(this.state.inputValue, this.state.page);
      }
    );
  };

  handleMenuScrollToBottom = () => {
    if (!this.state.isLoading && this.state.hasMore) {
      this.setState(
        prevState => ({ page: prevState.page + 1 }),
        () => {
          this.props.loadOptions(this.state.inputValue, this.state.page);
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
