import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { Button, DataWithLoader, Uploader } from '@erxes/ui/src/components';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { __, Alert } from '@erxes/ui/src/utils';
import { FlexPad, StepButton } from '@erxes/ui/src/components/step/styles';
import Select from 'react-select-plus';
import { IAttachment } from '@erxes/ui/src/types';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import migration from '../../graphql/mutations/migration';
import { Content, LeftContent, MiddleContent } from '../../styles';
import { Step, Steps } from '@erxes/ui/src/components/step';
type Props = {
  history?: any;
  queryParams: any;
  onSave: (type: string, file: any) => void;
};
type FinalProps = {} & Props & IRouterProps;
type State = {
  file?: any;
  type: string;
};
class Index extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);
    this.state = {
      type: 'walletBalance'
    };
  }
  onChangeFile = ev => {
    const file = ev.target.files[0];
    this.setState({
      file: file
    });
  };
  typeChange = e => {
    const value = e.target.value;
    this.setState({ type: value });
  };
  onSubmit = () => {
    const { file, type } = this.state;
    const { onSave } = this.props;
    if (!file) {
      Alert.warning('Please choose csv file');
    } else onSave(type, file);
  };
  renderImportButton = () => {
    return (
      <StepButton next={true} onClick={this.onSubmit}>
        Import
      </StepButton>
    );
    return <></>;
  };
  render() {
    const { queryParams, history } = this.props;
    const breadcrumb = [
      { title: __('Trading migration'), link: '/trading/migration' }
    ];
    const migration_type = [
      {
        label: 'Wallet balance migration',
        value: 'walletBalance'
      },
      {
        label: 'Order migration',
        value: 'order'
      },
      {
        label: 'Transaction migration',
        value: 'transaction'
      }
    ];
    const content = (
      <Content>
        <LeftContent>
          <Steps active={1} direction="horizontal">
            <Step title="Type">
              <FlexPad type="stepper" direction="column">
                <MiddleContent>
                  <FormControl
                    name="migrationType"
                    componentClass="select"
                    options={migration_type}
                    value={this.state.type}
                    onChange={this.typeChange}
                    required={true}
                  />
                </MiddleContent>
              </FlexPad>
            </Step>
            <Step title="Upload" additionalButton={this.renderImportButton()}>
              <FlexPad type="stepper" direction="column">
                <MiddleContent>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={this.onChangeFile}
                  />
                  {/* <Uploader
                    defaultFileList={[]}
                    text={`Choose a file to upload your csv file`}
                    warningText={'Only .csv file is supported.'}
                    onChange={this.onChangeAttachment}
                    single={true}
                    accept=".csv"
                  /> */}
                </MiddleContent>
              </FlexPad>
            </Step>
          </Steps>
        </LeftContent>
      </Content>
    );
    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__('Trading migration')}
            breadcrumb={breadcrumb}
            queryParams={queryParams}
          />
        }
        content={content}
        transparent={true}
      />
    );
  }
}
export default Index;
