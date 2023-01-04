import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { PREFIX, STOCK, TYPE, ORDER_TYPE, STOCKTYPE, EXCHANGE, IPO } from '../../constants';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import dayjs from 'dayjs';
import _ from 'lodash';
type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

class Forms extends React.Component<Props & ICommonFormProps> {
  generateDoc = (values: { id?: string; exchangeid: string; symbol: string; stockname: string; stocktypeId: string; stockcode: string; stockprice: string; cnt: string; ipo: string; startdate: Date; enddate: Date }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues.id = object.id;
    }
    return {
      id: finalValues.id,
      exchangeid: parseInt(finalValues.exchangeid),
      symbol: finalValues.symbol,
      stockname: finalValues.stockname,
      stocktypeId: parseInt(finalValues.stocktypeId),
      stockcode: parseInt(finalValues.stockcode),
      stockprice: parseFloat(finalValues.stockprice),
      cnt: parseInt(finalValues.cnt),
      ipo: parseInt(finalValues.ipo),
      startdate: finalValues.startdate,
      enddate: finalValues.enddate
    };
  };
  prefixChange = val => { };
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

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Exchange')}</ControlLabel>
          <FormControl
            {...formProps}
            componentClass='select'
            name="exchangeid"
            placeholder={__('Хөрөнгийн бирж')}
            options={EXCHANGE}
            // onChange={this.prefixChange}
            value={object.exchangeid}
          />
        </FormGroup>

        <FormGroup>
          <ControlLabel>{__('Symbol')}</ControlLabel>
          <FormControl
            {...formProps}
            placeholder={__('Үнэт цаасны симбол')}
            defaultValue={object.symbol}
            name="symbol"
            // options={_.sortBy(prefixList, ['label'])}
            // onChange={this.prefixChange}
            value={object.symbol}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock name')}</ControlLabel>
          <FormControl
            {...formProps}
            placeholder={__('Үнэт цаасны нэр')}
            name="stockname"
            value={object.stockname}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock type')}</ControlLabel>
          <FormControl
            {...formProps}
            componentClass='select'
            name="stocktypeId"
            placeholder={__('Үнэт цаасны төрөл')}
            options={STOCKTYPE}
            // onChange={this.prefixChange}
            value={object.stocktypeId}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Stock code')}</ControlLabel>
          <FormControl
            {...formProps}
            placeholder={__('Үнэт цаасны код')}
            name="stockcode"
            defaultValue={object.stockcode}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Price')}</ControlLabel>
          <FormControl
            {...formProps}
            name="stockprice"
            defaultValue={object.stockprice}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Quantity')}</ControlLabel>
          <FormControl
            {...formProps}
            name="cnt"
            defaultValue={object.quantity}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('IPO')}</ControlLabel>
          <FormControl
            {...formProps}
            componentClass='select'
            name="ipo"
            placeholder={__('Монголын хөрөнгийн бирж дээр IPO хийж байгаа эсэх')}
            options={IPO}
            // onChange={this.prefixChange}
            value={object.ipo}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Эхлэх өдөр')}</ControlLabel>
          <FormControl
            {...formProps}
            type="date"
            defaultValue={dayjs(object.endDate || new Date()).format(
              'YYYY-MM-DD'
            )}
            required={true}
            name="startdate"
            placeholder={'Эхлэх өдөр'}
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
