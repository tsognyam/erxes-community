import React from 'react';
import { StyledTr } from '../styles';
import { __ } from '@erxes/ui/src/utils';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';
import Icon from '@erxes/ui/src/components/Icon';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { Link } from 'react-router-dom';

type Props = {
  organization: any;
  index: number;
} & ICommonListProps;

class Row extends React.Component<Props> {
  renderActions = object => {
    return (
      <ActionButtons>
        <ActionButtons>
          <Link to="/organizaion/register">
            <Button btnStyle="link">
              <Tip text={__('Edit')} placement="bottom">
                <Icon icon="edit" />
              </Tip>
            </Button>
          </Link>
          <Tip text={__('Delete')} placement="bottom">
            <Button
              btnStyle="link"
              // onClick={() => this.remove(object)}
              icon="cancel-1"
            />
          </Tip>
        </ActionButtons>
      </ActionButtons>
    );
  };

  render() {
    const { index, organization } = this.props;

    return (
      <StyledTr key={index}>
        <td>&nbsp;&nbsp;{index + 1}</td>
        <td>{organization.date}</td>
        <td>{organization.symbol}</td>
        <td>{organization.companyName}</td>
        <td>
          {organization.closePrice.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {organization.marketValue.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{organization.activity}</td>
        <td>{this.renderActions(organization)}</td>
      </StyledTr>
    );
  }
}

export default Row;
