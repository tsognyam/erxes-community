import { Tabs, TabTitle } from '@erxes/ui/src/components/tabs';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import { REGISTER_TYPES } from '../constants';
import { RegisterConfig } from '../types';
import Form from './Form';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
type Props = {
  config: RegisterConfig;
  handleUpdate: (doc: RegisterConfig) => void;
};

class Register extends React.Component<Props, { currentTab: string }> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'general'
    };
  }

  tabOnClick = (currentTab: string) => {
    this.setState({ currentTab });
  };

  renderContent() {
    const { config, handleUpdate } = this.props;
    const { currentTab } = this.state;

    const commonProps = {
      defaultConfigValues: config,
      handleUpdate
    };

    const TYPE = REGISTER_TYPES[currentTab.toLocaleUpperCase()];

    return <Form {...commonProps} configType={TYPE.VALUE} />;
  }

  renderFullContent() {
    const { currentTab } = this.state;

    return (
      <>
        <Tabs full={true}>
          {Object.values(REGISTER_TYPES).map((type, index) => (
            <TabTitle
              key={index}
              className={currentTab === type.VALUE ? 'active' : ''}
              onClick={this.tabOnClick.bind(this, type.VALUE)}
            >
              {__(type.LABEL)}
            </TabTitle>
          ))}
        </Tabs>
        {this.renderContent()}
      </>
    );
  }

  render() {
    const breadcrumb = [
      { title: __('Top 20 Organizations'), link: '/topOrganizations' },
      { title: __('Register Organization') }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Register')} breadcrumb={breadcrumb} />
        }
        content={
          <DataWithLoader
            data={this.renderFullContent()}
            loading={false}
            count={90}
            emptyText="There is no organization."
            emptyImage="/images/actions/20.svg"
          />
        }
        hasBorder
      />
    );
  }
}

export default Register;
