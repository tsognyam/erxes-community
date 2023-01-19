import { TabTitle, Tabs } from '@erxes/ui/src/components/tabs';

import ErrorBoundary from '@erxes/ui/src/components/ErrorBoundary';
import Icon from '@erxes/ui/src/components/Icon';
import NoteForm from '@erxes/ui-internalnotes/src/containers/Form';
import React from 'react';
import { WhiteBoxRoot } from '@erxes/ui/src/layout/styles';
import { __ } from '@erxes/ui/src/utils';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';
import { isEnabled } from '@erxes/ui/src/utils/core';
import List from '../containers/custFee/List';
import ListStatement from '../containers/statement/List';

type Props = {
  contentType: string;
  object: any;
  toEmail?: string;
  toEmails?: string[];
  extraTabs?: React.ReactNode;
};

type State = {
  currentTab: string;
};

class Tab extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: 'trading-fee'
    };
  }

  onChangeTab = currentTab => {
    this.setState({ currentTab });
  };

  renderTabContent() {
    const { contentType, object } = this.props;
    const { currentTab } = this.state;

    if (currentTab === 'trading-fee') {
      const updatedProps = {
        userId: object.userId
      };
      return <List {...updatedProps} {...object} />;
    }
    if (currentTab === 'wallet-statement') {
      console.log('wallet=', object);
      let walletId = 0;
      if (object.Wallet?.length > 0) walletId = object.Wallet[0].id;
      console.log('walletId=', walletId);
      const updatedProps = {
        userId: object.userId,
        walletId: walletId
      };
      return <ListStatement {...updatedProps} {...object} />;
    }

    return null;
  }

  renderTabTitle(type: string, icon: string, title: string) {
    const currentTab = this.state.currentTab;

    return (
      <TabTitle
        key={Math.random()}
        className={currentTab === type ? 'active' : ''}
        onClick={this.onChangeTab.bind(this, type)}
      >
        <Icon icon={icon} /> {__(title)}
      </TabTitle>
    );
  }

  renderExtraTab() {
    const { extraTabs, contentType } = this.props;
    const tabs: any = [];

    if (contentType === 'account') {
      tabs.push(
        this.renderTabTitle('wallet-statement', '', 'Wallet statement')
      );
    }

    return (
      <>
        {tabs}
        {extraTabs}
      </>
    );
  }

  render() {
    return (
      <ErrorBoundary>
        <WhiteBoxRoot>
          <Tabs>
            {this.renderTabTitle('trading-fee', '', 'Trading fee')}

            {this.renderExtraTab()}
          </Tabs>

          {this.renderTabContent()}
        </WhiteBoxRoot>
      </ErrorBoundary>
    );
  }
}

export default Tab;