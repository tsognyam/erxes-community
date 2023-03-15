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
import Spinner from '@erxes/ui/src/components/Spinner';
import _ from 'lodash';
type Props = {
  history?: any;
  queryParams: any;
  onSave: (type: string, file: any) => void;
  isLoading: boolean;
  file?: any;
};
type FinalProps = {} & Props & IRouterProps;
type State = {
  file?: any;
  type: string;
};
class Index extends React.Component<FinalProps, State> {
  private fileInputRef: any;
  constructor(props) {
    super(props);
    this.state = {
      type: 'walletBalance'
    };
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
    const { isLoading } = this.props;
    if (isLoading) return <Spinner />;
    return (
      <StepButton next={true} onClick={this.onSubmit}>
        Import
      </StepButton>
    );
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
                  <FormGroup>
                    <ControlLabel required={true}>Migration type</ControlLabel>
                    <FormControl
                      name="migrationType"
                      componentClass="select"
                      options={migration_type}
                      value={this.state.type}
                      onChange={this.typeChange}
                      required={true}
                    />
                  </FormGroup>
                </MiddleContent>
              </FlexPad>
            </Step>
            <Step title="Upload" additionalButton={this.renderImportButton()}>
              <FlexPad type="stepper" direction="column">
                <MiddleContent>
                  <FormGroup>
                    <ControlLabel required={true}>Choose csv file</ControlLabel>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={this.onChangeFile}
                      ref={this.fileInputRef}
                    />
                  </FormGroup>
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
