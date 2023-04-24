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
import { STOCKTYPE } from '../../constants';
type Props = {
  object: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
  prefix: any[];
};
type State = {
  userId: string;
};
class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { object } = this.props;
    this.state = {
      userId: object?.userId
    };
  }
  prefixChange = (option: { value: string; label: string }) => {
    const value = !option ? '' : option.value;
    this.setState({ userId: value });
  };
  generateDoc = (values: { id: number; userId: string }) => {
    const { object } = this.props;
    const finalValues = values;
    return {
      id: object.id,
      userId: this.state.userId
    };
  };
  renderContent = (formProps: IFormProps) => {
    const prefixList = this.props.prefix?.map(x => {
      return {
        value: x.userId,
        label: x.prefix
      };
    });
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          <Select
            placeholder={__('Prefix')}
            value={this.state.userId}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.prefixChange}
            required={true}
            name="userId"
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
