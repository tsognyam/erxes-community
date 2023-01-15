import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import {
  PREFIX,
  STOCK,
  TYPE,
  ORDER_TYPE,
  STOCKTYPE,
  EXCHANGE,
  IPO
} from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Table, Tabs, TabTitle } from '@erxes/ui/src';
import { TabContainer } from '@erxes/ui/src/components/tabs/styles';
import { TabCaption } from '@erxes/ui/src/components/tabs/styles';
import { TabContent } from '@erxes/ui/src/styles/main';
import List from '../containers/custFee/List';
import ListStatement from '../containers/statement/List';
// import Row from './custFee/Row';
// import List from '../containers/custFee/List';
type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;
type State = {
  currentTab: string;
};
class Forms extends React.Component<Props & ICommonFormProps, State> {
  constructor(props) {
    super(props);
    const custFee = props.custFee || {};

    this.state = {
      currentTab: custFee ? 'custFee' : 'Category'
    };
  }
  generateDoc = (values: any) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues.id = object.id;
    }
    return {};
  };
  onChangeCurrentTab = selecteTab => {
    switch (selecteTab) {
      case 'Fee':
        this.setState({ currentTab: selecteTab });
        break;
      case 'Statement':
        this.setState({ currentTab: selecteTab });
        break;
    }
  };
  // renderCustFee(trigger: React.ReactNode) {
  //   const content = props => (
  //     <List {...props} />
  //   );

  //   return (
  //     <></>
  //   );
  // }
  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);
    // const prefixList = this.props.prefix.map(x => {
    //   return {
    //     value: x.prefix,
    //     label: x.prefix
    //   };
    // });
    // const stockList = this.props.stocks.map(x => {
    //   return {
    //     value: x.stockcode,
    //     label: x.symbol + ') ' + x.stockname
    //   };
    // });

    const currentTabItem = () => {
      const { currentTab } = this.state;

      const handleSelect = (value, name) => {
        this.setState({ [name]: value } as Pick<State, keyof State>);
      };

      if (currentTab === 'Fee') {
        const updatedProps = {
          userId: object.userId
        };
        return <List {...updatedProps} {...object} />;
      }
      const updatedProps = {
        walletId: object.id,
        startDate: '2023-01-01',
        endDate: new Date()
      };
      return <ListStatement {...updatedProps} {...object} />;
    };
    return (
      <>
        <TabContainer>
          <TabCaption>
            <Tabs full>
              {['Fee', 'Statement'].map(item => (
                <TabTitle
                  className={this.state.currentTab === item ? 'active' : ''}
                  key={item}
                  onClick={this.onChangeCurrentTab.bind(this, item)}
                >
                  {item}
                </TabTitle>
              ))}
            </Tabs>
          </TabCaption>
        </TabContainer>
        <TabContent>{currentTabItem()}</TabContent>
      </>
    );
  };

  render() {
    return (
      <CommonForm
        {...this.props}
        name="name"
        renderContent={this.renderContent}
        generateDoc={this.generateDoc}
        renderButton={this.props.renderButton}
        object={this.props.object}
      />
    );
  }
}

export default Forms;
