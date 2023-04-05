import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { IFormProps } from '@erxes/ui/src/types';
import React from 'react';
import { Alert, __ } from '@erxes/ui/src/utils';
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
import { Button, Spinner } from '@erxes/ui/src';
type Props = {
  object?;
  file: any;
  isLoading: boolean;
  message?: any;
  onSave: (type: string, file?: any) => void;
} & ICommonFormProps;
type State = {
  file?: any;
};
class Forms extends React.Component<Props & ICommonFormProps, State> {
  private fileInputRef: any;
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
  }
  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.file != this.props.file) {
      this.fileInputRef.current.value = null;
      this.setState({
        file: null
      });
    }
  };
  generateDoc = (values: {
    id?: string;
    exchangeid: string;
    symbol: string;
    stockname: string;
    stocktypeId: string;
    stockcode: string;
    stockprice: string;
    cnt: string;
    ipo: string;
    startdate: Date;
    enddate: Date;
  }) => {
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

  onChangeFile = (ev: any) => {
    const file = ev.target.files[0];
    this.setState({
      file: file
    });
  };
  onSubmit = () => {
    const { file } = this.state;
    const { onSave } = this.props;
    if (!file) {
      Alert.warning('Please choose csv file');
    } else onSave(file);
  };
  renderImportButton = () => {
    const { isLoading } = this.props;
    if (isLoading) return <Spinner />;
    return <Button onClick={this.onSubmit}>Import</Button>;
  };
  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);
    console.log('object', object);

    return (
      <>
        <FormGroup>
          <ControlLabel required={true}>Choose csv file</ControlLabel>
          <input
            type="file"
            accept=".csv"
            onChange={this.onChangeFile}
            ref={this.fileInputRef}
          />
        </FormGroup>
        {this.renderImportButton()}
        {this.props.message}
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
        renderButton={undefined}
        object={this.props.object}
      />
    );
  }
}

export default Forms;
