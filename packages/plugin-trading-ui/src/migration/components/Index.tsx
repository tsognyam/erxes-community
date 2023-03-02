import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { DataWithLoader, Uploader } from '@erxes/ui/src/components';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import Select from 'react-select-plus';
type Props = {
  history?: any;
  queryParams: any;
};
type FinalProps = {} & Props & IRouterProps;
class Index extends React.Component<FinalProps> {
  renderContent = () => {
    return (
      <>
        <Select></Select>
        <Uploader
          defaultFileList={[]}
          onChange={(e: any) => {}}
          single={true}
        />
      </>
    );
  };
  render() {
    const { queryParams, history } = this.props;
    const breadcrumb = [
      { title: __('Trading migration'), link: '/trading/migration' }
    ];
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Trading migration')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={
          <DataWithLoader
            data={this.renderContent()}
            loading={false}
            count={1}
            emptyText="There is no data."
            emptyImage="/images/actions/20.svg"
          />
        }
        transparent={true}
        hasBorder
      />
    );
  }
}
export default Index;
