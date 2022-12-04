import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import { Block, Divider, FlexWrap, AddRowButton } from '../../styles';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import {
  STOCK_TYPE,
  ISIN,
  OPERATION_STATUS,
  ACTIVITY_FIELD,
  ACTIVITY_DIRECTION,
  BUSINESS_DIRECTION
} from '../../constants';
import Table from '@erxes/ui/src/components/Table';
import { INFLUENTIAL_SHAREHOLDERS } from '../../constants';
import Row from './GeneralRow';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './ShareholderForm';

type Props = {
  handleFormChange: (name: string, value: string | object) => void;
  registryNumber?: string;
  companyName?: string;
  phoneNumber?: number;
  email?: string;
  establishedDate?: any;
  registeredDate?: any;
  address?: string;
  stockType?: string;
  businessDirection?: string;
  activityDirection?: string;
  actionField?: string;
  operationalStatus?: string;
  isin?: string;
  totalShares?: number;
  issuedShares?: number;
  marketValue?: number;
  weeks?: number;
};

type State = {
  establishedDate?: any;
  registeredDate?: any;
};

class GeneralInformation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      establishedDate: this.props.establishedDate
        ? this.props.establishedDate
        : new Date(),
      registeredDate: this.props.registeredDate
        ? this.props.registeredDate
        : new Date()
    };
  }

  onChangeFunction = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState(({ [name]: value } as unknown) as Pick<State, keyof State>);
    this.props.handleFormChange(name, value);
  };

  renderForm() {
    return <Form />;
  }

  render() {
    const {
      companyName,
      registryNumber,
      address,
      phoneNumber,
      email,
      stockType,
      activityDirection,
      businessDirection,
      actionField,
      operationalStatus,
      isin,
      totalShares,
      issuedShares,
      marketValue,
      weeks
    } = this.props;

    const handleDate = (type: string, date: any) => {
      this.setState({ [type]: date } as any);
    };

    const onChange = (type, e) =>
      this.onChangeFunction(type, (e.currentTarget as HTMLInputElement).value);

    const renderInput = (title, name, value, additional?) => {
      return (
        <FormGroup>
          <ControlLabel>{__(`${title}`)}</ControlLabel>
          <FormControl
            id={name}
            type="text"
            defaultValue={value}
            name={name}
            onChange={e => onChange(name, e)}
            componentClass={additional && additional}
          />
        </FormGroup>
      );
    };

    const renderSelect = (title, id, value, options) => {
      return (
        <FormGroup>
          <ControlLabel>{__(`${title}`)}</ControlLabel>
          <FormControl
            id={id}
            componentClass="select"
            value={value}
            onChange={e => onChange(id, e)}
            options={options}
          />
        </FormGroup>
      );
    };

    const renderDateInput = (title, name, value) => {
      return (
        <FormGroup>
          <ControlLabel>{__(`${title}`)}</ControlLabel>
          <DateControl
            value={value}
            name={name}
            onChange={date => handleDate(name, date)}
            placeholder={__(`${title}`)}
            dateFormat={'YYYY / MM / DD'}
          />
        </FormGroup>
      );
    };

    return (
      <>
        <Block>
          <h4>{__('General Information')}</h4>
          <Divider />
          <FlexWrap>
            {renderInput('Company Name', 'companyName', companyName)}
            {renderSelect(
              'Business Direction',
              'businessDirection',
              businessDirection,
              BUSINESS_DIRECTION
            )}
            {renderInput('Registry Number', 'registryNumber', registryNumber)}
            {renderSelect(
              'Activity Type',
              'activityDirection',
              activityDirection,
              ACTIVITY_DIRECTION
            )}
            {renderDateInput(
              'Established Date',
              'establishedDate',
              this.state.establishedDate
            )}
            {renderSelect(
              'Auxiliary Field of Action',
              'actionField',
              actionField,
              ACTIVITY_FIELD
            )}
            {renderInput('Phone Number', 'phoneNumber', phoneNumber)}
            {renderSelect(
              'Operational Status',
              'operationalStatus',
              operationalStatus,
              OPERATION_STATUS
            )}
            {renderInput('Address', 'address', address, 'textarea')}
            {renderSelect('ISIN', 'isin', isin, ISIN)}
            {renderInput('Email', 'email', email)}
            {renderInput('Total Shares', 'totalShares', totalShares)}
            {renderDateInput(
              'Registered Date for MSE',
              'registeredDate',
              this.state.registeredDate
            )}
            {renderInput('Issued Shares', 'issuedShares', issuedShares)}
            {renderSelect('Stock Type', 'stockType', stockType, STOCK_TYPE)}
            {renderInput('Market Value', 'marketValue', marketValue)}
            {renderInput('52 weeks', 'weeks', weeks)}
          </FlexWrap>
        </Block>
        <Block>
          <AddRowButton>
            <h4>{__('Influential Shareholders')}</h4>
            <ModalTrigger
              title="Add Shareholder"
              size={'lg'}
              trigger={
                <Button
                  id={'AddRowButton'}
                  btnStyle="success"
                  block={true}
                  icon="plus-circle"
                >
                  {__('Add Shareholder')}
                </Button>
              }
              content={this.renderForm}
            />
          </AddRowButton>
          <Divider />
          <Table>
            <thead>
              <tr>
                <th>&nbsp;&nbsp;№</th>
                <th>{__('Full Name')}</th>
                <th>{__('Holding Shares')}</th>
                <th>{__('Has Other Companies Share')}</th>
                <th>{__('Same Interest Person')}</th>
              </tr>
            </thead>
            <tbody id="orders">
              {(INFLUENTIAL_SHAREHOLDERS || []).map((shareHolder, index) => (
                <Row index={index} shareHolder={shareHolder} />
              ))}
            </tbody>
          </Table>
        </Block>
      </>
    );
  }
}

export default GeneralInformation;
