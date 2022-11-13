import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import { StyledTr } from '../styles';
import Label from '@erxes/ui/src/components/Label';
import { __ } from '@erxes/ui/src/utils';

type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  commission: any;
  isChecked: boolean;
  index: number;
};

class Row extends React.Component<Props> {
  render() {
    const { isChecked, index, commission, toggleBulk } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(commission, e.target.checked);
      }
    };

    return (
      <StyledTr key={index}>
        <td id="commissionsCheckBox">
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{index + 1}</td>
        <td>{commission.createdDate}</td>
        <td>
          <Label lblStyle={commission.type === 'Buy' ? 'success' : 'warning'}>
            {commission.type}
          </Label>
        </td>
        <td>{commission.prefix}</td>
        <td>{commission.register}</td>
        <td>{commission.name}</td>
        <td>{commission.stock}</td>
        <td>
          {commission.total.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {commission.commission.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {commission.pending.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
      </StyledTr>
    );
  }
}

export default Row;
