import gql from 'graphql-tag';
import React from 'react';
import Response from '../components/Response';
import PerResponse from '../components/PerResponse';
import withCurrentUser from '@erxes/ui/src/auth/containers/withCurrentUser';
import { IUser } from '@erxes/ui/src/auth/types';
import { subscriptions } from '../graphql';
import { useSubscription } from 'react-apollo';

type Props = {
  currentUser: IUser;
};

const ReturnResponseBody = ({ currentUser }: Props) => {
  let contents;
  let responseId;

  const { data: response, loading } = useSubscription(
    gql(subscriptions.automationSubscription),
    {
      variables: {
        userId: currentUser._id,
        sessionCode: sessionStorage.getItem('sessioncode') || ''
      },
      shouldResubscribe: false
    }
  );

  if (!response || loading) {
    return <></>;
  }

  contents = response.automationResponded.content;

  responseId = response.automationResponded.responseId;

  if (!contents || !contents.length) {
    return <></>;
  }

  // if (
  //   localStorage.getItem('automationResponseId') &&
  //   localStorage.getItem('automationResponseId') === responseId
  // ) {
  //   return <></>;
  // }

  const printContents: any[] = [];
  let counter = 0;

  for (const content of contents) {
    printContents.push(PerResponse(content, counter));
    counter += 1;
  }

  const printMainContent = Response(printContents);

  const myWindow =
    window.open(`__`, '_blank', 'width=800, height=800') || ({} as any);

  localStorage.setItem('automationResponseId', responseId);

  if ('document' in myWindow && 'write' in myWindow.document) {
    myWindow.document.write(printMainContent);
  } else {
    alert('please allow Pop-ups and redirects on site settings!!!');
  }

  return <></>;
};

const WithCurrentUser = withCurrentUser(ReturnResponseBody);

const ReturnResponse = () => {
  return <WithCurrentUser />;
};

export default ReturnResponse;
