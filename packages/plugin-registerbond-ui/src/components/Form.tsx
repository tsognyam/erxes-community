import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { CUPON, TYPE } from '../constants';
import DateControl from '@erxes/ui/src/components/form/DateControl';
import Uploader from '@erxes/ui/src/components/Uploader';
import {
  IAttachment,
  IButtonMutateProps,
  IFormProps
} from '@erxes/ui/src/types';

type Props = {
  object?;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

type State = {
  repaymentSchedule?: any;
  introductionBond?: any;
  signedDate: any;
  firstSeason?: any;
  secondSeason?: any;
  thirdSeason?: any;
  fourthSeason?: any;
  interestPayment: any;
  firstHalf?: any;
  secondHalf?: any;
  term?: any;
  mainFirstSeason?: any;
  mainSecondSeason?: any;
  mainThirdSeason?: any;
  mainFourthSeason?: any;
  mainPayment: any;
  mainFirstHalf?: any;
  mainSecondHalf?: any;
  mainTerm?: any;
  canRecalled?: boolean;
  toPrimaryTrade?: boolean;
};

class Forms extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      signedDate: new Date(),
      interestPayment: this.props.object
        ? this.props.object.interestPayment
        : 'Season',
      mainPayment: this.props.object ? this.props.object.mainPayment : 'Season'
    };
  }

  generateDoc = (values: { _id?: string; name: string; content: string }) => {
    const { object } = this.props;
    const finalValues = values;

    if (object) {
      finalValues._id = object._id;
    }

    return {
      _id: finalValues._id,
      name: finalValues.name
    };
  };

  handleDate = (type, date) => {
    this.setState({ [type]: date } as any);
  };

  onChangeAttachment = (name, files: IAttachment[]) => {
    this.setState({ [name]: files ? files[0] : undefined } as any);
  };

  renderDateInputs = (type, time) => {
    const firstSeason =
      type === 'main' ? this.state.mainFirstSeason : this.state.firstSeason;
    const secondSeason =
      type === 'main' ? this.state.mainSecondSeason : this.state.secondSeason;
    const thirdSeason =
      type === 'main' ? this.state.mainThirdSeason : this.state.thirdSeason;
    const fourthSeason =
      type === 'main' ? this.state.mainFourthSeason : this.state.fourthSeason;
    const firstHalf =
      type === 'main' ? this.state.mainFirstHalf : this.state.firstHalf;
    const secondHalf =
      type === 'main' ? this.state.mainSecondHalf : this.state.secondHalf;
    const term = type === 'main' ? this.state.mainTerm : this.state.term;
    const firstSeasonText = type === 'main' ? 'mainFirstSeason' : 'firstSeason';
    const secondSeasonText =
      type === 'main' ? 'mainSecondSeason' : 'secondSeason';
    const thirdSeasonText = type === 'main' ? 'mainThirdSeason' : 'thirdSeason';
    const fourthSeasonText =
      type === 'main' ? 'mainFourthSeason' : 'fourthSeason';
    const firstHalfText = type === 'main' ? 'mainFirstHalf' : 'firstHalf';
    const secondHalfText = type === 'main' ? 'mainSecondHalf' : 'secondHalf';
    const termText = type === 'main' ? 'mainTerm' : 'term';

    return (
      <>
        {time === 'Season' && (
          <>
            <FormGroup>
              <ControlLabel>{__('1st Season')}</ControlLabel>
              <DateControl
                value={firstSeason}
                required={true}
                name="firstSeasonDate"
                onChange={date => this.handleDate(firstSeasonText, date)}
                placeholder={'1st Season Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('2nd Season')}</ControlLabel>
              <DateControl
                value={secondSeason}
                required={true}
                name="secondSeasonDate"
                onChange={date => this.handleDate(secondSeasonText, date)}
                placeholder={'2nd Season Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('3rdt Season')}</ControlLabel>
              <DateControl
                value={thirdSeason}
                required={true}
                name="thirdSeasonDate"
                onChange={date => this.handleDate(thirdSeasonText, date)}
                placeholder={'3rdt Season Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('4th Season')}</ControlLabel>
              <DateControl
                value={fourthSeason}
                required={true}
                name="fourthSeasonDate"
                onChange={date => this.handleDate(fourthSeasonText, date)}
                placeholder={'4th Season Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>
          </>
        )}
        {time === 'Half Year' && (
          <>
            <FormGroup>
              <ControlLabel>{__('1st Half')}</ControlLabel>
              <DateControl
                value={firstHalf}
                required={true}
                name="firstHalfDate"
                onChange={date => this.handleDate(firstHalfText, date)}
                placeholder={'1st Half Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>{__('2nd Half')}</ControlLabel>
              <DateControl
                value={secondHalf}
                required={true}
                name="secondHalfDate"
                onChange={date => this.handleDate(secondHalfText, date)}
                placeholder={'2nd Half Date'}
                dateFormat={'YYYY / MM / DD'}
              />
            </FormGroup>
          </>
        )}
        {time === 'End of Term' && (
          <FormGroup>
            <ControlLabel>{__('Term Date')}</ControlLabel>
            <DateControl
              value={term}
              required={true}
              name="termDate"
              onChange={date => this.handleDate(termText, date)}
              placeholder={'Term Date'}
              dateFormat={'YYYY / MM / DD'}
            />
          </FormGroup>
        )}
      </>
    );
  };

  renderContent = (formProps: IFormProps) => {
    const object = this.props.object || ({} as any);

    const onChange = (type, e) => {
      this.setState({ [type]: e.target.value } as any);
    };

    const toggleCanRecalled = () => {
      this.setState({ canRecalled: !this.state.canRecalled });
    };

    const toggleToPrimaryTrading = () => {
      this.setState({ toPrimaryTrade: !this.state.toPrimaryTrade });
    };

    return (
      <>
        <FormGroup>
          <ControlLabel>{__('Type')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={TYPE}
            defaultValue={object.type}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Bond Name')}</ControlLabel>
          <FormControl
            type="text"
            name="bondName"
            defaultValue={object.bondName}
            {...formProps}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Bond Code')}</ControlLabel>
          <FormControl
            {...formProps}
            type="text"
            name="bondCode"
            defaultValue={object.bondCode}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Bond Interest (year)')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.bondInterest}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Cupon Payment')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={CUPON}
            defaultValue={object.interestPayment}
            onChange={e => onChange('interestPayment', e)}
          />
        </FormGroup>
        {this.renderDateInputs('interest', this.state.interestPayment)}
        <FormGroup>
          <ControlLabel>{__('Introduction of Bond')}</ControlLabel>
          <Uploader
            defaultFileList={[]}
            onChange={e => this.onChangeAttachment('introductionBond', e)}
            single={true}
            text={__('Choose a file to attach.')}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Main Payment')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={CUPON}
            defaultValue={object.mainPayment}
            onChange={e => onChange('mainPayment', e)}
          />
        </FormGroup>
        {this.renderDateInputs('main', this.state.mainPayment)}
        <FormGroup>
          <ControlLabel>{__('Bond Period')}</ControlLabel>
          <FormControl
            {...formProps}
            name="name"
            defaultValue={object.bondPeriod}
            type="text"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Bond Interest')}</ControlLabel>
          <FormControl
            {...formProps}
            name="bondInterest"
            defaultValue={object.bondInterest}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Bond Interest Tax')}</ControlLabel>
          <FormControl
            {...formProps}
            name="bondInterest"
            defaultValue={object.bondInterestTax}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="bondInterest"
            checked={this.state.canRecalled}
            componentClass="checkbox"
            onChange={toggleCanRecalled}
          />
          <ControlLabel>{__('Can Recalled')}</ControlLabel>
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Lowest Quantity')}</ControlLabel>
          <FormControl
            {...formProps}
            name="lowestQuantity"
            defaultValue={object.lowestQuantity}
            type="number"
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>{__('Repayment Schedule')}</ControlLabel>
          <Uploader
            defaultFileList={[]}
            onChange={e => this.onChangeAttachment('repaymentSchedule', e)}
            single={true}
            text={__('Choose a file to attach.')}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            name="toPrimaryTrade"
            checked={this.state.toPrimaryTrade}
            componentClass="checkbox"
            onChange={toggleToPrimaryTrading}
          />
          <ControlLabel>{__('Move to Primary Trade')}</ControlLabel>
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
