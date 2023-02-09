import React from 'react';
import GeneralRoutes from './generalRoutes';
import { PluginLayout } from '@erxes/ui/src/styles/main';
import { AppProvider } from 'coreui/appContext';
import { FinanceAmount } from './styles';
import dayjs from 'dayjs';
import queryString from 'query-string';
const App = () => {
  return (
    <AppProvider>
      <PluginLayout>
        <GeneralRoutes />
      </PluginLayout>
    </AppProvider>
  );
};
export const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};
export function displayValue(value, type = 'number') {
  if (type == 'raw-number') {
    return (
      <FinanceAmount>
        {parseFloat(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
      </FinanceAmount>
    );
  } else if (type == 'number') {
    return (
      <FinanceAmount>
        {(value || 0).toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 4
        })}
      </FinanceAmount>
    );
  } else if (type == 'date') {
    return (
      <>
        {/* {(value || 0).toLocaleString('default', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        })} */}
        {dayjs(value).format('YYYY-MM-DD HH:mm:ss')}
      </>
    );
  }

  return value;
}
export default App;
