import React from 'react';
import FormControl from '@erxes/ui/src/components/form/Control';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  bulk: any;
  type?: string;
};

class ChangeCommission extends React.Component<Props> {
  onSubmit = e => {};

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>{__('Commission Rate')}</ControlLabel>
          <FormControl
            type="number"
            placeholder={__('Enter commission rate')}
          />
        </FormGroup>
      </form>
    );
  }
}

export default ChangeCommission;
