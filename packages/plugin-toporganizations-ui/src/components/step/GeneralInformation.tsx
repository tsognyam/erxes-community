import { readFile } from '@erxes/ui/src/utils/core';
import Button from '@erxes/ui/src/components/Button';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import Icon from '@erxes/ui/src/components/Icon';
import Info from '@erxes/ui/src/components/Info';
import Spinner from '@erxes/ui/src/components/Spinner';
import { LeftItem } from '@erxes/ui/src/components/step/styles';
import { __ } from '@erxes/ui/src/utils/core';
import { uploadHandler } from '@erxes/ui/src/utils';
import ActionBar from '@erxes/ui/src/layout/components/ActionBar';
import React from 'react';
import {
  FlexColumn,
  FlexItem,
  ImagePreview,
  ImageUpload
} from '@erxes/ui/src/components/step/style';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import {
  STOCK_TYPE,
  ISIN,
  OPERATION_STATUS,
  ACTIVITY_FIELD,
  ACTIVITY_DIRECTION,
  BUSINESS_DIRECTION
} from '../../constants';

type Props = {
  onChange: (
    name:
      | 'companyName'
      | 'registryNumber'
      | 'phoneNumber'
      | 'email'
      | 'address',
    value: string | boolean | object | any
  ) => void;
  registryNumber?: string;
  companyName?: string;
  phoneNumber?: string;
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
  registryNumber?: string;
  companyName?: string;
  address?: string;
};

class GeneralInformation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  onChangeFunction = <T extends keyof State>(name: T, value: State[T]) => {
    this.setState(({ [name]: value } as unknown) as Pick<State, keyof State>);
    this.props.onChange(name, value);
  };

  render() {
    const {
      companyName,
      registryNumber,
      address,
      phoneNumber,
      establishedDate,
      registeredDate,
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

    return (
      <FlexItem>
        <FlexColumn>
          <LeftItem>
            <FormGroup>
              <ControlLabel>{__('Company Name')}</ControlLabel>
              <FormControl
                id="companyName"
                type="text"
                value={companyName}
                name="companyName"
                onChange={e => onChange('companyName', e)}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Registry Number')}</ControlLabel>
              <FormControl
                id="registryNumber"
                type="text"
                name="registryNumber"
                value={registryNumber}
                onChange={e => onChange('registryNumber', e)}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Established Date')}</ControlLabel>
              <DateControl
                value={establishedDate}
                required={true}
                name="establishedDate"
                onChange={date => handleDate('established', date)}
                placeholder={'Established Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{'Phone Number'}</ControlLabel>
              <FormControl
                id="phoneNumber"
                type="number"
                name="phoneNumber"
                value={phoneNumber}
                onChange={e => onChange('phoneNumber', e)}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Address')}</ControlLabel>
              <FormControl
                id="address"
                name="address"
                componentClass="textarea"
                value={address}
                onChange={e => onChange('address', e)}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Email')}</ControlLabel>
              <FormControl
                id="email"
                componentClass="text"
                name="email"
                value={email}
                onChange={e => onChange('email', e)}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Registered Date for MSE')}</ControlLabel>
              <DateControl
                value={registeredDate}
                required={true}
                name="registeredDate"
                onChange={date => handleDate('registered', date)}
                placeholder={'Registered Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>

            <FormGroup>
              <ControlLabel>{__('Stock Type')}</ControlLabel>
              <FormControl
                id="stockType"
                componentClass="select"
                value={stockType}
                onChange={e => onChange('stockType', e)}
                options={STOCK_TYPE}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('Business Direction')}</ControlLabel>
              <FormControl
                id="businessDirection"
                componentClass="select"
                value={businessDirection}
                onChange={e => onChange('businessDirection', e)}
                options={BUSINESS_DIRECTION}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('Activity Type')}</ControlLabel>
              <FormControl
                id="activityDirection"
                componentClass="select"
                value={activityDirection}
                onChange={e => onChange('activityDirection', e)}
                options={ACTIVITY_DIRECTION}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('Auxiliary Field of Action')}</ControlLabel>
              <FormControl
                id="actionField"
                componentClass="select"
                value={actionField}
                onChange={e => onChange('actionField', e)}
                options={ACTIVITY_FIELD}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('Operational Status')}</ControlLabel>
              <FormControl
                id="operationalStatus"
                componentClass="select"
                value={operationalStatus}
                onChange={e => onChange('operationalStatus', e)}
                options={OPERATION_STATUS}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('ISIN')}</ControlLabel>
              <FormControl
                id="ISIN"
                componentClass="select"
                value={isin}
                onChange={e => onChange('ISIN', e)}
                options={ISIN}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{'Total Shares'}</ControlLabel>
              <FormControl
                id="total-shares"
                type="number"
                value={totalShares}
                onChange={e => onChange('totalShares', e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{'Issued Shares'}</ControlLabel>
              <FormControl
                id="issued-shares"
                type="number"
                value={issuedShares}
                onChange={e => onChange('issuedShares', e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{'Market Value'}</ControlLabel>
              <FormControl
                id="market-value"
                type="number"
                value={marketValue}
                onChange={e => onChange('marketValue', e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{'52 weeks'}</ControlLabel>
              <FormControl
                id="weeks"
                type="number"
                value={weeks}
                onChange={e => onChange('weeks', e)}
              />
            </FormGroup>
          </LeftItem>
        </FlexColumn>
      </FlexItem>
    );
  }
}

export default GeneralInformation;
