import React from 'react';
import { StyledTr } from '../../styles';
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Tip from '@erxes/ui/src/components/Tip';
import Button from '@erxes/ui/src/components/Button';
import { __, getEnv } from '@erxes/ui/src/utils';
type Props = {
  shareHolder: any;
  index: number;
};

class Row extends React.Component<Props> {
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

  render() {
    const { index, shareHolder } = this.props;

    return (
      <StyledTr key={index}>
        <td>&nbsp;&nbsp;{index + 1}</td>
        <td>{shareHolder.companyName}</td>
        <td>{shareHolder.symbol}</td>
        <td>{shareHolder.briefDesc ? shareHolder.briefDesc : '-'}</td>
        <td>{shareHolder.date}</td>
        <td>
          <ActionButtons>{this.renderExportAction()}</ActionButtons>
        </td>
      </StyledTr>
    );
  }
}

export default Row;
