import React, { Component } from 'react';
import Select, { OptionsType, Option, Options } from 'react-select-plus';
import _ from 'lodash';
import client from '@erxes/ui/src/apolloClient';
import gql from 'graphql-tag';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { graphql } from 'react-apollo';
import { __, Alert, confirm } from '@erxes/ui/src/utils';
import styled from 'styled-components';
import Icon from '@erxes/ui/src/components/Icon';
export const SelectValue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: -7px;
  padding-left: 25px;

  img {
    position: absolute;
    left: 0;
  }
`;
const SelectOption = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: #f0f0f0;
  object-fit: cover;
  float: left;
  margin-right: 5px;
`;
const SelectWrapper = styled.div`
  position: relative;

  .Select-clear-zone {
    visibility: hidden;
  }
`;

const ClearButton = styled.div`
  position: absolute;
  right: 18px;
  font-size: 16px;
  top: 50%;
  width: 18px;
  z-index: 2;
  color: #999;
  line-height: 24px;
  margin-top: -14px;

  &:hover {
    color: #ea475d;
    cursor: pointer;
  }
`;
type IInitialValue = string | string[] | undefined;
type Props = {
  initialValues: string[];
  searchValue: string;
  search: (search: string, loadMore?: boolean) => void;
  abortController;
} & WrapperProps;
type State = {
  options: OptionsType<OptionType>;
  selectedValues: string[];
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
      options: undefined,
      selectedValues: props.initialValues,
      selectedOptions: undefined
    };
  }
  componentWillReceiveProps(nextProps: Props) {
    const { queryName, customQuery, generateOptions, uniqueValue } = nextProps;
    const { selectedValues } = this.state;

    if (customQuery.loading !== this.props.customQuery.loading) {
      const datas = customQuery[queryName] || [];

      const totalOptions = this.state.options || ([] as Option[]);
      const totalOptionsValues = totalOptions.map(option => option.value);

      const uniqueLoadedOptions = generateOptions(
        datas.values.filter(
          data => !totalOptionsValues.includes(data[uniqueValue])
        )
      );
      const updatedTotalOptions = [...totalOptions, ...uniqueLoadedOptions];

      const selectedOptions = updatedTotalOptions.filter(option =>
        selectedValues.includes(option.value)
      );

      this.setState({
        options: updatedTotalOptions,
        selectedOptions
      });
    }
  }
  renderClearButton = () => {
    if (!this.props.multi) {
      return null;
    }

    const { selectedValues = [] } = this.state;

    if (selectedValues.length > 0) {
      return (
        <ClearButton onClick={this.onClear}>
          <Icon icon="times" />
        </ClearButton>
      );
    }

    return null;
  };
  onClear = e => {
    confirm().then(() => {
      this.props.onSelect([], this.props.name);
      this.setState({ selectedValues: [], selectedOptions: [] });
    });
  };
  // loadOptions = async (inputValue: string, page: number) => {
  //   this.setState({ isLoading: true });
  //   const { customQuery, generateOptions, generateFilterParams } = this.props;
  //   const { selectedValues } = this.state;
  //   try {
  //     let variables: any = {
  //       perPage: PAGE_SIZE,
  //       page,
  //       ...generateFilterParams(selectedValues, inputValue)
  //     };
  //     client
  //       .query({
  //         query: gql(customQuery),
  //         variables: variables
  //       })
  //       .then(({ data }: any) => {
  //         let newOptions = generateOptions(data?.tradingUserByPrefix?.values);
  //         const totalOptions = newOptions || [];
  //         const totalOptionsValues = totalOptions.map(option => option.value);
  //         const uniqueLoadedOptions = newOptions.filter(
  //           data => !totalOptionsValues.includes(data.value)
  //         );
  //         const updatedTotalOptions = [...totalOptions, ...uniqueLoadedOptions];
  //         this.setState({
  //           options: updatedTotalOptions,
  //           hasMore: newOptions.length === PAGE_SIZE,
  //           isLoading: false
  //         });
  //       })
  //       .catch(() => {
  //         this.setState({ isLoading: false });
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     this.setState({ isLoading: false });
  //   }
  // };
  render() {
    const { selectedOptions, selectedValues } = this.state;
    const {
      label,
      disabled,
      multi,
      onSelect,
      name,
      search,
      customQuery
    } = this.props;
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

    const onSearch = (searchValue: string) => {
      if (searchValue) {
        _.debounce(() => search(searchValue), 1000)();
      }
    };

    const onOpen = () => search('reload');
    const selectOptions = [...(options || [])];
    return (
      <SelectWrapper>
        <Select
          placeholder={__(label)}
          options={selectOptions}
          isLoading={customQuery.loading}
          onInputChange={onSearch}
          onChange={onChange}
          onOpen={onOpen}
          value={multi ? selectedValues : selectedValues[0]}
          disabled={disabled}
          loadingPlaceholder={__('Loading...')}
          multi={multi}
          noResultsText={
            customQuery.loading ? 'Loading...' : 'No results found'
          }
        />
        {this.renderClearButton()}
      </SelectWrapper>
    );
  }
}
const withQuery = ({ customQuery }) =>
  withProps<Props>(
    compose(
      graphql<Props, {}>(gql(customQuery), {
        name: 'customQuery',
        options: ({
          searchValue,
          initialValues,
          abortController,
          generateFilterParams
        }) => {
          const context = { fetchOptions: { signal: abortController.signal } };
          console.log(searchValue);
          if (searchValue === 'reload') {
            return {
              context,
              variables: {
                perPage: 30,
                page: 1,
                ...generateFilterParams(initialValues, '')
              },
              fetchPolicy: 'network-only',
              notifyOnNetworkStatusChange: true
            };
          }

          if (searchValue) {
            return {
              context,
              variables: {
                perPage: 20,
                page: 1,
                ...generateFilterParams(initialValues, searchValue)
              }
            };
          }

          return {
            context,
            fetchPolicy: 'network-only',
            variables: {
              perPage: 20,
              page: 1,
              ...generateFilterParams(initialValues, '')
            }
          };
        }
      })
    )(SelectWithPagination)
  );
type WrapperProps = {
  disabled: boolean;
  queryName: string;
  label: string;
  name: string;
  multi?: boolean;
  onSelect: (values: string[] | string, name: string) => void;
  initialValue: IInitialValue;
  customQuery?: any;
  generateOptions: (data: any[]) => Option[];
  generateFilterParams: (data: any, searchValue: string) => any;
  uniqueValue: string;
};
class Wrapper extends React.Component<
  WrapperProps,
  { searchValue: string; abortController },
  { WithQuery: React.ReactNode }
> {
  private withQuery;

  constructor(props) {
    super(props);

    this.withQuery = withQuery({ customQuery: this.props.customQuery });

    this.state = { searchValue: '', abortController: new AbortController() };
  }

  search = (searchValue: string) => {
    const { abortController } = this.state;
    if (abortController) {
      abortController.abort();
    }
    this.setState({ searchValue, abortController: new AbortController() });
  };

  render() {
    const { searchValue, abortController } = this.state;
    const { initialValue } = this.props;

    const Component = this.withQuery;

    let initialValues: string[] = [];

    if (initialValue) {
      initialValues =
        typeof initialValue === 'string' ? [initialValue] : initialValue;
    }

    return (
      <Component
        {...this.props}
        initialValues={initialValues}
        abortController={abortController}
        search={this.search}
        searchValue={searchValue}
      />
    );
  }
}
export default Wrapper;
