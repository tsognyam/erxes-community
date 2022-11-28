import React from 'react';
import { __ } from '@erxes/ui/src/utils';
import CommonForm from '@erxes/ui-settings/src/common/components/Form';
import { ICommonFormProps } from '@erxes/ui-settings/src/common/types';
import { IButtonMutateProps } from '@erxes/ui/src/types';

type Props = {
  bulk?: any[];
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonFormProps;

class Forms extends React.Component<Props & ICommonFormProps> {
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

  renderContent = () => {
    const { bulk } = this.props;
    return (
      <>
        {bulk.length === 1 && (
          <div>
            Are you sure to confirm the request of{' '}
            {bulk[0].cashAmount.toLocaleString(undefined, {
              maximumFractionDigits: 2
            })}{' '}
            {bulk[0].currency} for customer with registration number{' '}
            {bulk[0].register}?
          </div>
        )}
        {bulk.length !== 1 && (
          <div>
            Are you sure to confirm the requests of <br />
            {bulk.map(item => (
              <>
                {item.cashAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2
                })}{' '}
                {item.currency} for customer with registration number{' '}
                {item.register}
                <br />
              </>
            ))}
          </div>
        )}
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
