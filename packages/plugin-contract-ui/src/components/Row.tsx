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

type Props = {
  toggleBulk: (target: any, toAdd: boolean) => void;
  contract: any;
  isChecked: boolean;
  index: number;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
} & ICommonListProps;

class Row extends React.Component<Props> {
  renderForm = props => {
    return <Form {...props} renderButton={this.props.renderButton} />;
  };

  renderAttachAction = object => {
    const { save } = this.props;

    const attachTrigger = (
      <Button btnStyle="link">
        <Tip text={__('Attach')} placement="bottom">
          <Icon icon="file-plus" />
        </Tip>
      </Button>
    );

    const content = props => {
      return this.renderForm({ ...props, object, save });
    };

    return (
      <ModalTrigger
        size="lg"
        title="Attach"
        trigger={attachTrigger}
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
    return (
      <ActionButtons>
        {this.renderAttachAction(object)}
        {object.status === 'Contract Signed' && (
          <>
            {this.renderShowAction()}
            {this.renderExportAction()}
          </>
        )}
      </ActionButtons>
    );
  };

  render() {
    const { isChecked, index, contract, toggleBulk } = this.props;

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(contract, e.target.checked);
      }
    };

    const onClick = e => {
      e.stopPropagation();
    };

    return (
      <StyledTr key={index}>
        <td id="ordersCheckBox" onClick={onClick}>
          <FormControl
            checked={isChecked}
            componentClass="checkbox"
            onChange={onChange}
          />
        </td>
        <td>{index + 1}</td>
        <td>{contract.firstName}</td>
        <td>{contract.registry}</td>
        <td>{contract.sentDate}</td>
        <td>{contract.contractNumber}</td>
        <td>
          <Label
            lblStyle={
              contract.status === 'Contract Signed' ? 'success' : 'warning'
            }
          >
            {contract.status}
          </Label>
        </td>
        <td>{contract.signedDate}</td>
        <td>{this.renderActions(contract)}</td>
      </StyledTr>
    );
  }
}

export default Row;
