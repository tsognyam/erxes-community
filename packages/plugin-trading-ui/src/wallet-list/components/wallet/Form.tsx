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
} from '../../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import dayjs from 'dayjs';
import _ from 'lodash';
import { Table, Tabs, TabTitle } from '@erxes/ui/src';
import { TabContainer } from '@erxes/ui/src/components/tabs/styles';
import { TabCaption } from '@erxes/ui/src/components/tabs/styles';
import { TabContent } from '@erxes/ui/src/styles/main';
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
    console.log('object', object);

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Мөнгөн дүн')}</ControlLabel>
          <FormControl
            name="amount"
            placeholder={__('Оруулах дүн')}
            value={0}
            required
          ></FormControl>
        </FormGroup>
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
