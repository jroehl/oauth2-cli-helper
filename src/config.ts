export declare type Oauth2CLIHelperFlags = {
  authorization_uri: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  help: void;
  redirect_uri: string;
  delimiter: string;
  scope: string[];
  state: string;
  timeout: number;
  token_in_body: boolean;
  token_method: string;
  token_uri: string;
  verbose: boolean;
  version: void;
};

const state = String(Date.now())
export const defaults = {
  delimiter: ' ',
  grantType: 'authorization_code',
  timeout: 30,
  redirectUri: 'http://localhost:3000/callback',
  scope: [],
  state,
  tokenMethod: 'GET',
}
