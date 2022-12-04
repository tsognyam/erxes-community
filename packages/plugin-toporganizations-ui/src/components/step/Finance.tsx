import { FormControl } from '@erxes/ui/src/components/form';
import FormGroup from '@erxes/ui/src/components/form/Group';
import ControlLabel from '@erxes/ui/src/components/form/Label';
import { __ } from '@erxes/ui/src/utils/core';
import React from 'react';
import { Block, Divider, FlexWrap } from '../../styles';

type Props = {
  netWorth?: number;
  liabilities?: number;
  equity?: number;
  issuedShares?: number;
  grossSalesRevenue?: number;
  costOfSales?: number;
  totalProfit?: number;
  netProfit?: number;
  dividends?: number;
  dividendsSimple?: number;
  accountPricePerShare?: number;
  returnOnTotalAssets?: number;
  returnOfPerShare?: number;
  returnOnEquity?: number;
  PERatio?: number;
  circulationOfTotalEquity?: number;
  handleFormChange: (name: string, value: string | object) => void;
};

function Appearance({
  handleFormChange,
  netWorth,
  liabilities,
  equity,
  issuedShares,
  grossSalesRevenue,
  costOfSales,
  totalProfit,
  netProfit,
  dividends,
  dividendsSimple,
  accountPricePerShare,
  returnOnTotalAssets,
  returnOfPerShare,
  returnOnEquity,
  PERatio,
  circulationOfTotalEquity
}: Props) {
  const renderInput = (title, name, value) => {
    return (
      <FormGroup>
        <ControlLabel>{__(`${title}`)}</ControlLabel>
        <FormControl
          id={name}
          type="text"
          defaultValue={value}
          name={name}
          onChange={e => handleFormChange(name, e)}
        />
      </FormGroup>
    );
  };
  return (
    <>
      <Block>
        <FormGroup horizontal>
          <ControlLabel>{__('Season')}</ControlLabel>
          <FormControl
            componentClass="select"
            options={[
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
              { label: '4', value: '4' }
            ]}
          />
        </FormGroup>
        <h4>{__('Finance Indicators')}</h4>
        <Divider />
        <FlexWrap>
          {renderInput('Net Worth', 'netWorth', netWorth)}
          {renderInput(
            'The Total Amount of Liabilities',
            'liabilities',
            liabilities
          )}
          {renderInput("The Amount of Owners' Equity", 'equity', equity)}
          {renderInput('Total Issued Shares', 'issuedShares', issuedShares)}
        </FlexWrap>
      </Block>

      <Block>
        <h4>{__('Income Statement Indicators')}</h4>
        <Divider />
        <FlexWrap>
          {renderInput(
            'Gross Sales Revenue',
            'grossSalesRevenue',
            grossSalesRevenue
          )}
          {renderInput('Cost of Sales', 'costOfSales', costOfSales)}
          {renderInput('Total Profit', 'totalProfit', totalProfit)}
          {renderInput('Net Profit', 'netProfit', netProfit)}
          {renderInput('Dividends', 'dividends', dividends)}
          {renderInput(
            'Dividends (Simple)',
            'dividendsSimple',
            dividendsSimple
          )}
          {renderInput(
            'Account Price per Share',
            'accountPricePerShare',
            accountPricePerShare
          )}
        </FlexWrap>
      </Block>

      <Block>
        <h4>{__('Financial Relationships')}</h4>
        <Divider />
        <FlexWrap>
          {renderInput(
            'Return on Total Assets',
            'returnOnTotalAssets',
            returnOnTotalAssets
          )}
          {renderInput(
            'Return of Per Share',
            'returnOfPerShare',
            returnOfPerShare
          )}
          {renderInput('Return on Equity', 'returnOnEquity', returnOnEquity)}
          {renderInput('P / E Ratio', 'PERatio', PERatio)}
          {renderInput(
            'Circulation of Total Equity',
            'circulationOfTotalEquity',
            circulationOfTotalEquity
          )}
        </FlexWrap>
      </Block>
    </>
  );
}

export default Appearance;
