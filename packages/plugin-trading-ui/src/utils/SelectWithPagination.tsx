import React, { Component } from 'react';
import Select, { OptionsType, Option, Options } from 'react-select-plus';
import _ from 'lodash';
type Props = {
  options: Option[];
  selectedValue: string;
  disabled: boolean;
  placeholder: string;
  name: string;
  selectedOptions: Option | Option[] | null;
  onChange: (value: Option | Option[] | null) => void;
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
  selectedOptions: Option | Option[] | null;
};
interface OptionType {
  value: string;
  label: string;
}

class SelectWithPagination extends Component<Props, State> {
  _isMounted = false;
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
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentWillReceiveProps(nextProps: Props) {
    const {
      isLoading,
      options,
      hasMore,
      selectedOptions,
      selectedValue
    } = nextProps;
    console.log('selectedOptions', selectedOptions);
    console.log('nextProps', nextProps.selectedOptions);
    if (this.props.isLoading != isLoading) {
      if (this._isMounted) {
        this.setState({
          isLoading,
          hasMore,
          options,
          selectedOptions,
          selectedValue
        });
      }
    }
    if (this.props.selectedValue != selectedValue) {
      if (this._isMounted)
        this.setState({
          selectedOptions,
          selectedValue
        });
    }
  }
  handleChange = (selectedOption: Option | Option[] | null) => {
    const { onChange } = this.props;
    onChange(selectedOption);
  };
  handleInputChange = (inputValue: string) => {
    let newOptions: any = [];
    let { isMulti, options, selectedValue } = this.props;
    if (isMulti)
      newOptions = options.filter(x => selectedValue.includes(x.value));
    this.setState(
      {
        inputValue,
        options: newOptions,
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
    const { options, isLoading, selectedOptions, selectedValue } = this.state;
    const { placeholder, disabled, onChange, isMulti } = this.props;
    return (
      <Select
        placeholder={placeholder}
        options={options}
        isLoading={isLoading}
        onInputChange={this.handleInputChange}
        onMenuScrollToBottom={this.handleMenuScrollToBottom}
        onChange={this.handleChange}
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
