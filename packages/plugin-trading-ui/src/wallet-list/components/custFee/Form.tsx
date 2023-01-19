import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
import { STOCKTYPE } from '../../../constants';
type Props = {
  object: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any[];
  stocks: any[];
  closeModal: () => void;
};
type State = {
  name: string;
  name2: string;
  stocktypeId: number;
  userId: string;
  value: number;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { object } = this.props;
    this.state = {
      name: object?.name,
      name2: object?.name2,
      stocktypeId: object?.stocktypeId,
      userId: object?.userId,
      value: object?.value
    };
  }
  generateDoc = (values: { id: number; value: number }) => {
    const { object } = this.props;
    const finalValues = values;
    return {
      id: object.id,
      value: Number(finalValues.value)
    };
  };
  renderContent = (formProps: IFormProps) => {
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Name')}</ControlLabel>
          <FormControl name="name" disabled={true} value={this.state.name} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock type')}</ControlLabel>
          <Select
            options={_.sortBy(STOCKTYPE, ['label'])}
            value={this.state.stocktypeId}
            disabled={true}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Value')}</ControlLabel>
          <FormControl
            {...formProps}
            name="value"
            defaultValue={this.state.value}
            type="number"
          />
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
