import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import {
  BoxContent,
  BoxContentContainer,
  ChartContentContainer
} from '../../styles';
import Chart from './Chart';
type Props = {
  history?: any;
  queryParams: any;
};
type FinalProps = Props & IRouterProps;
class Index extends React.Component<FinalProps> {
  renderContent = () => {
    return (
      <>
        <BoxContentContainer>
          <BoxContent>
            <Chart chartType="line" />
          </BoxContent>
          <BoxContent>
            <Chart chartType="pie" />
          </BoxContent>
        </BoxContentContainer>
        <ChartContentContainer>
          <h3>Нийт харилцагч </h3>
          <Chart chartType="line" />
        </ChartContentContainer>
      </>
    );
  };
  render() {
    const { queryParams, history } = this.props;
    const breadcrumb = [
      { title: __('Trading Home Page'), link: '/trading/home' }
    ];
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Trading Home Page')}
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
