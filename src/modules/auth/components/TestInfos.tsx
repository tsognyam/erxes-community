import {
  AvatarUpload,
  ControlLabel,
  FormControl,
  FormGroup,
  ModifiableSelect
} from 'modules/common/components';
import {
  ColumnTitle,
  FormColumn,
  FormWrapper
} from 'modules/common/styles/main';
import { IFormProps } from 'modules/common/types';
import { __ } from 'modules/common/utils';
import { timezones } from 'modules/settings/integrations/constants';
import * as React from 'react';
import { IUser } from '../types';

type Props = {
  user: IUser;
  onAvatarUpload: (url: string) => void;
  formProps?: IFormProps;
};

type State = {
  emails?: string[];
  doNotDisturb: string;
  isChecked: boolean;
  checkItems: string[];
};

class TestInfos extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      doNotDisturb: 'No',
      isChecked: false,
      checkItems: ['check 1', 'check 2', 'check 3', 'check 4']
    };
  }

  onEmailChange = ({ options }) => {
    this.setState({ emails: options });
  };

  onCheckboxChange = (label: string) => {
    this.setState({ isChecked: !this.state.isChecked });
  };

  renderFormGroup = (label, props) => {
    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  };

  renderCheckbox() {
    return this.state.checkItems.map((label, index) => (
      <FormControl
        key={index}
        name={label}
        componentClass="checkbox"
        checked={this.state.isChecked}
        onChange={this.onCheckboxChange.bind(this, label)}
      >
        {label}
      </FormControl>
    ));
  }

  render() {
    const { user, onAvatarUpload, formProps } = this.props;
    const details = user.details || {};
    const links = user.links || {};

    return (
      <React.Fragment>
        <AvatarUpload avatar={details.avatar} onAvatarUpload={onAvatarUpload} />
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Full name</ControlLabel>
              <FormControl
                type="text"
                name="fullName"
                defaultValue={details.fullName || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Short name</ControlLabel>
              <FormControl
                type="text"
                name="shortName"
                defaultValue={details.shortName || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel required={true}>Email</ControlLabel>
              <FormControl
                type="email"
                name="email"
                defaultValue={user.email}
                {...formProps}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Emails</ControlLabel>
              <ModifiableSelect
                type="email"
                value={user.email}
                options={['aweweafeew', 'appeoeoqqww', 'utututututrirr']}
                placeholder="Choose primary email"
                buttonText="Add Email"
                onChange={this.onEmailChange}
                formProps={formProps}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                type="text"
                name="description"
                max={250}
                componentClass="textarea"
                defaultValue={details.description || ''}
                {...formProps}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel required={true}>Username</ControlLabel>
              <FormControl
                type="text"
                name="username"
                defaultValue={user.username}
                required={true}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Position</ControlLabel>
              <FormControl
                type="text"
                name="position"
                defaultValue={details.position || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Location</ControlLabel>
              <FormControl
                componentClass="select"
                defaultValue={details.location}
                name="userLocation"
                options={timezones}
                {...formProps}
              />
            </FormGroup>

            {this.renderFormGroup('Do not disturb', {
              componentClass: 'radio',
              options: [
                {
                  childNode: 'Yes',
                  value: 'Yes',
                  checked: this.state.doNotDisturb === 'Yes',
                  onChange: e => this.setState({ doNotDisturb: e.target.value })
                },
                {
                  childNode: 'No',
                  value: 'No',
                  checked: this.state.doNotDisturb === 'No',
                  onChange: e => this.setState({ doNotDisturb: e.target.value })
                }
              ]
            })}
            <FormGroup>
              <ControlLabel>Checkbox options</ControlLabel>
              {this.renderCheckbox()}
            </FormGroup>

            <FormGroup>
              <ControlLabel>Phone number</ControlLabel>
              <FormControl
                type="number"
                name="phone"
                defaultValue=""
                {...formProps}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>
        <ColumnTitle>{__('Links')}</ColumnTitle>
        <FormWrapper>
          <FormColumn>
            <FormGroup>
              <ControlLabel>LinkedIn</ControlLabel>
              <FormControl
                type="url"
                name="linkedin"
                defaultValue={links.linkedIn || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Twitter</ControlLabel>
              <FormControl
                type="url"
                name="twitter"
                defaultValue={links.twitter || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Facebook</ControlLabel>
              <FormControl
                type="url"
                name="facebook"
                defaultValue={links.facebook || ''}
                {...formProps}
              />
            </FormGroup>
          </FormColumn>
          <FormColumn>
            <FormGroup>
              <ControlLabel>Youtube</ControlLabel>
              <FormControl
                type="url"
                name="youtube"
                defaultValue={links.youtube || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Github</ControlLabel>
              <FormControl
                type="url"
                name="github"
                defaultValue={links.github || ''}
                {...formProps}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Website</ControlLabel>
              <FormControl
                type="url"
                name="website"
                defaultValue={links.website || ''}
                {...formProps}
              />
            </FormGroup>
          </FormColumn>
        </FormWrapper>
      </React.Fragment>
    );
  }
}

export default TestInfos;
