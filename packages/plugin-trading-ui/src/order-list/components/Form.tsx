import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from 'coreui/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { PREFIX, STOCK, TYPE, ORDER_TYPE } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Select from 'react-select-plus';
import dayjs from 'dayjs';
import _ from 'lodash';
type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  prefix: any[];
  stocks: any[];
} & ICommonFormProps;

class Forms extends React.Component<Props & ICommonFormProps> {
  generateDoc = (values: { id?: string; enddate: Date }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues.id = object.id;
    }
    return {
      id: finalValues.id,
      enddate: finalValues.enddate
    };
  };
  prefixChange = val => {};
  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);
    const prefixList = this.props.prefix.map(x => {
      return {
        value: x.prefix,
        label: x.prefix
      };
    });
    const stockList = this.props.stocks.map(x => {
      return {
        value: x.stockcode,
        label: x.symbol + ') ' + x.stockname
      };
    });
    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Prefix')}</ControlLabel>
          <Select
            placeholder={__('Prefix')}
            defaultValue={object.prefix}
            options={_.sortBy(prefixList, ['label'])}
            onChange={this.prefixChange}
            //value={object.prefix}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Хувьцаа')}</ControlLabel>
          <Select
            placeholder={__('Хувьцаагаа сонгоно уу')}
            options={_.sortBy(stockList, ['label'])}
            value={object.stockcode}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Авах/Зарах')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={TYPE}
            defaultValue={object.type}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Хувьцааны төрөл')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={ORDER_TYPE}
            defaultValue={object.orderType}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Үнэ')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.price}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Quantity')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.quantity}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Successful')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.successful}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Дуусах өдөр')}</ControlLabel>
          <FormControl
            {...formProps}
            type="date"
            defaultValue={dayjs(object.endDate || new Date()).format(
              'YYYY-MM-DD'
            )}
            required={true}
            name="enddate"
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

export default Forms;
