import FormControl from '@erxes/ui/src/components/form/Control';
import React from 'react';
import { StyledTr } from '../styles';
import Label from '@erxes/ui/src/components/Label';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import Icon from '@erxes/ui/src/components/Icon';
import Form from './Form';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { __, getEnv } from '@erxes/ui/src/utils';
import { ICommonListProps } from '@erxes/ui-settings/src/common/types';
import Toggle from '@erxes/ui/src/components/Toggle';
import { withProps } from '@erxes/ui/src/utils';
import * as compose from 'lodash.flowright';
import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import { Link } from 'react-router-dom';

type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  bond: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  changeStatus: (id: string) => void;
  history: any;
} & ICommonListProps;

type FinalProps = {} & Props & IRouterProps;

class Row extends React.Component<FinalProps> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  renderEditAction = object => {
    const { save } = this.props;

    const editTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Edit')} placement="bottom">
          <Icon icon="edit" />
        </Tip>
      </Button>
    );

    const content = props => {
      return this.renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        size="lg"
        title="Edit"
        trigger={editTrigger}
        content={content}
      />
    );
  };

  renderExportAction = () => {
    // const { integration } = this.props;
    const { REACT_APP_API_URL } = getEnv();

    const onClick = () => {
      window.open(
        // `${REACT_APP_API_URL}/pl:contacts/file-export?type=customer&popupData=true&form=${integration.formId}`,
        '_blank'
      );
    };

    return (
      <Tip text={__('Download')} placement="top">
        <Button btnStyle="link" onClick={onClick} icon="down-arrow" />
      </Tip>
    );
  };

  renderShowAction = () => {
    return (
      <Tip text={__('Show')} placement="top">
        <Button btnStyle="link" icon="eye" />
      </Tip>
    );
  };

  renderActions = object => {
    if (object.status === 'Success' || object.status === 'Canceled') {
      return null;
    }

    return (
      <ActionButtons>
        <ActionButtons>
          {this.renderEditAction(object)}
          {this.renderShowAction()}
          {this.renderExportAction()}
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
    const { isChecked, index, bond, toggleBulk } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(bond, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    const onToggleChange = () => this.props.changeStatus(bond._id);

    return (
      <StyledTr key={index}>
        <td id="ordersCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>
          <Label lblStyle={bond.type === 'Opening' ? 'success' : 'warning'}>
            {bond.type}
          </Label>
        </td>
        <td>
          <Link to={`/bond-list/bond/details/${bond.bondId}`}>
            {bond.bondName}
          </Link>
        </td>
        <td>{bond.bondCode}</td>
        <td>
          {bond.unitPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>{bond.periodMonth}</td>
        <td>{bond.interestRate}%</td>
        <td>
          <Link
            to={`/bond-list/interestPayment/details/${bond.interestPaymentId}`}
          >
            {bond.interestPayment}
          </Link>
        </td>
        <td>{bond.interestDay}</td>
        <td>{bond.mainPayment}</td>
        <td>
          {bond.quantity.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          {bond.necessaryAssets.toLocaleString(undefined, {
            maximumFractionDigits: 2
          })}
        </td>
        <td>
          <Toggle
            defaultChecked={bond.isClosed}
            icons={{
              checked: <span>Yes</span>,
              unchecked: <span>No</span>
            }}
            onChange={onToggleChange}
          />
        </td>
        <td>{bond.registeredDate}</td>
        <td>{bond.registeredEmployee}</td>
        <td>{bond.accumulativeInterest}</td>
        <td>{this.renderActions(bond)}</td>
      </StyledTr>
    );
  }
}

export default withProps<Props>(compose()(withRouter<FinalProps>(Row)));
