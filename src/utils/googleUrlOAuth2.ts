import configs from '../configs';
import { stringify } from 'querystring';

const redirectUri = `${configs.GOOGLE_AUTH.SERVER_ROOT_URI}/api/auth/${configs.GOOGLE_AUTH.REDIRECT_URI}`;
export const generateUrlGoogle = () => {
  const rootUrl = configs.GOOGLE_AUTH.URL;
  const options = {
    redirect_uri: redirectUri,
    client_id: configs.GOOGLE_AUTH.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: configs.GOOGLE_AUTH.SCOPES.join(' '),
  };
  return `${rootUrl}?${stringify(options)}`;
};

export const clientToken = {
  clientId: configs.GOOGLE_AUTH.GOOGLE_CLIENT_ID,
  clientSecret: configs.GOOGLE_AUTH.GOOGLE_CLIENT_SECRET,
  redirectUri: redirectUri,
};
