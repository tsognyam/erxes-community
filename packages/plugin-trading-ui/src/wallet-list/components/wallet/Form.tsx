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

class Forms extends React.Component<Props & ICommonFormProps> {
  constructor(props) {
    super(props);
  }
  generateDoc = (values: { amount: string }) => {
    const { object } = this.props;
    const finalValues = values;
    console.log('this.generateDoc', finalValues);
    return {
      walletId: object.id,
      amount: parseInt(finalValues.amount)
    };
  };

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);
    console.log('object', object);
    console.log('formProps', formProps);
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Мөнгөн дүн')}</ControlLabel>
          <FormControl
            {...formProps}
            name="amount"
            type="number"
            placeholder={__('Оруулах дүн')}
            defaultValue={0}
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
        name="deposit"
        renderContent={this.renderContent}
        generateDoc={this.generateDoc}
        renderButton={this.props.renderButton}
        object={this.props.object}
      />
    );
  }
}

export default Forms;
