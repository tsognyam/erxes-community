import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import { Block, Divider, AddRowButton } from '../../styles';
import Table from '@erxes/ui/src/components/Table';
import { ACTIVITY_REPORT } from '../../constants';
import Row from './ActivityRow';
import Button from '@erxes/ui/src/components/Button';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Form from './ReportForm';

type Props = {};

class ActivityReport extends React.Component<Props> {
  renderForm() {
    return <Form />;
  }

  render() {
    return (
      <Block>
        <AddRowButton>
          <ModalTrigger
            title="Add Report"
            size={'lg'}
            trigger={
              <Button
                id={'AddRowButton'}
                btnStyle="success"
                block={true}
                icon="plus-circle"
              >
                {__('Add Report')}
              </Button>
            }
            content={this.renderForm}
          />
        </AddRowButton>
        <Divider />
        <Table>
          <thead>
            <tr>
              <th>&nbsp;&nbsp;№</th>
              <th>{__('Company Name')}</th>
              <th>{__('Symbol')}</th>
              <th>{__('Brief Description')}</th>
              <th>{__('Date')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody id="orders">
            {(ACTIVITY_REPORT || []).map((shareHolder, index) => (
              <Row index={index} shareHolder={shareHolder} />
            ))}
          </tbody>
        </Table>
      </Block>
    );
  }
}

export default ActivityReport;
