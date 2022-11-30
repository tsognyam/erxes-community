import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import { StyledTr } from '../styles';
import Label from '@erxes/ui/src/components/Label';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  application: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
};

class Row extends React.Component<Props> {
  render() {
    const { isChecked, index, application, toggleBulk } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(application, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    return (
      <StyledTr key={index}>
        <td id="applicationsCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{index + 1}</td>
        <td>{application.firstName}</td>
        <td>{application.registry}</td>
        <td>
          {application.cashAmount.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{application.currency}</td>
        <td>{application.receivingBank}</td>
        <td>{application.accountNumber}</td>
        <td>{application.createdDate}</td>
        <td>
          <Label
            lblStyle={
              application.status === 'Transfered'
                ? 'success'
                : application.status === 'Canceled'
                ? 'danger'
                : 'warning'
            }
          >
            {application.status}
          </Label>
        </td>
        <td>{application.settledDate}</td>
        <td>{application.settledEmployee}</td>
        <td>{application.trasnferedDate}</td>
        <td>{application.reason}</td>
      </StyledTr>
    );
  }
}

export default Row;
