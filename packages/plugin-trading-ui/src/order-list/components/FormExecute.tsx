import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { TYPE, ORDER_TYPE } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
import gql from 'graphql-tag';
import queries from '../../graphql/queries';
import client from '@erxes/ui/src/apolloClient';
type Props = {
  object: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  closeModal: () => void;
};
class FormExecute extends React.Component<Props> {
  constructor(props) {
    super(props);
  }
  generateDoc = (values: {
    doneprice: number;
    donecnt: number;
    donedate: Date;
    orderId: number;
  }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues.orderId = object.txnid;
    }
    return {
      orderId: finalValues.orderId,
      donedate: new Date(finalValues.donedate),
      doneprice: Number(finalValues.doneprice),
      donecnt: Number(finalValues.donecnt)
    };
  };
  txntypeChange = e => {
    const value = e.target.value;
    this.setState({ txntype: value });
  };
  renderContent = (formProps: IFormProps) => {
    const order = this.props.object || ({} as any);
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Биелсэн үнэ')}</ControlLabel>
          <FormControl
            {...formProps}
            name="doneprice"
            defaultValue={order?.price || 0}
            min={0}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Биелсэн тоо ширхэг')}</ControlLabel>
          <FormControl
            {...formProps}
            name="donecnt"
            defaultValue={order?.cnt || 0}
            type="number"
            min={1}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Биелсэн өдөр')}</ControlLabel>
          <FormControl
            {...formProps}
            type="date"
            defaultValue={dayjs(order.endDate || new Date()).format(
              'YYYY-MM-DD'
            )}
            required={true}
            name="donedate"
            placeholder={'Дуусах өдөр'}
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

export default FormExecute;
