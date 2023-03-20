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
import ListWithdrawal from '../containers/withdraw/List';
import ListOrder from '../../order-list/containers/List';
import ListWallet from '../containers/wallet/List';
import ListStock from '../containers/stock-list/List';
import ListPosition from '../containers/account-position/List';
import { generateQueryParams } from '../../App';
type Props = {
  contentType: string;
  object: any;
  toEmail?: string;
  toEmails?: string[];
  extraTabs?: React.ReactNode;
  queryParams: any;
  history: any;
};

type State = {
  currentTab: string;
};

class Tab extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const { contentType } = this.props;
    this.state = {
      currentTab: contentType == 'account-top' ? 'wallet-list' : 'order-list'
    };
  }

  onChangeTab = currentTab => {
    // const params = generateQueryParams(this.props.history);

    this.setState({ currentTab });
  };

  renderTabContent() {
    const { contentType, object, queryParams } = this.props;
    const { currentTab } = this.state;

    if (currentTab === 'trading-fee') {
      const updatedProps = {
        userId: object.userId
      };
      return <List {...updatedProps} {...object} />;
    }
    if (currentTab === 'wallet-statement') {
      let walletId = 0;
      if (object.Wallet?.length > 0) walletId = object.Wallet[0].id;
      const updatedProps = {
        userId: object.userId,
        walletId: walletId
      };
      return <ListStatement {...updatedProps} {...object} />;
    }
    if (currentTab === 'withdraw') {
      let walletIdList: any = [];
      for (let i = 0; i < object.Wallet.length; i++) {
        walletIdList.push(object.Wallet[i].id);
      }
      const updatedProps = {
        walletId: {
          in: walletIdList
        }
      };
      return <ListWithdrawal {...updatedProps} {...object} />;
    }
    if (currentTab === 'order-list') {
      queryParams.userId = object.userId;
      const updatedProps = {
        queryParams: queryParams,
        full: false
      };
      return <ListOrder {...updatedProps} {...object} />;
    }
    if (currentTab === 'wallet-list') {
      const updatedProps = {
        id: object.userId,
        queryParams: queryParams
      };
      return <ListWallet {...updatedProps} />;
    }
    if (currentTab === 'stock-list') {
      let walletIdList: any = [];
      for (let i = 0; i < object.Wallet.length; i++) {
        walletIdList.push(object.Wallet[i].id);
      }
      const updatedProps = {
        id: '',
        walletIds: walletIdList,
        queryParams: queryParams
      };
      return <ListStock {...updatedProps} />;
    }
    if (currentTab === 'account-position') {
      const updatedProps = {
        id: '',
        queryParams: queryParams,
        walletIds: []
      };
      return <ListPosition {...updatedProps} />;
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
      tabs.push(this.renderTabTitle('withdraw', '', 'Withdrawal'));
      tabs.push(this.renderTabTitle('order-list', '', 'Order list'));
      tabs.push(this.renderTabTitle('trading-fee', '', 'Trading fee'));
    }
    if (contentType === 'account-top') {
      tabs.push(this.renderTabTitle('wallet-list', '', 'Wallet list'));
      tabs.push(this.renderTabTitle('stock-list', '', 'Stock wallet'));
      tabs.push(
        this.renderTabTitle('account-position', '', 'Account position')
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
          <Tabs>{this.renderExtraTab()}</Tabs>

          {this.renderTabContent()}
        </WhiteBoxRoot>
      </ErrorBoundary>
    );
  }
}

export default Tab;
