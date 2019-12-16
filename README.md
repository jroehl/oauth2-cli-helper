# oauth2-cli-helper

A small helper CLI to create oauth2 tokens programmatically

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oauth2-cli-helper.svg)](https://npmjs.org/package/oauth2-cli-helper)
[![Downloads/week](https://img.shields.io/npm/dw/oauth2-cli-helper.svg)](https://npmjs.org/package/oauth2-cli-helper)
[![License](https://img.shields.io/npm/l/oauth2-cli-helper.svg)](https://github.com/jroehl/oauth2-cli-helper/blob/master/package.json)

## Description

Use this cli to generate a oauth2 access token for various APIs.

You need to have an app set up with the redirect (callback) URL pointing to
"http://localhost:3000/callback" (or the specified custom redirect URL).

## Usage

### Example for Linkedin

```bash
$ oauth2-cli-helper --client_id=<client_id> \
    --client_secret=<client_secret> \
    --authorization_uri=https://www.linkedin.com/oauth/v2/authorization \
    --token_uri=https://www.linkedin.com/oauth/v2/accessToken \
    --scope=r_liteprofile --scope=r_emailaddress --scope=w_member_social
```

### Example for Withings

```bash
$ oauth2-cli-helper --client_id=<client_id> \
    --client_secret=<client_secret> \
    --authorization_uri=https://account.withings.com/oauth2_user/authorize2 \
    --token_uri=https://account.withings.com/oauth2/token \
    --token_method=POST --token_in_body \
    --scope=user.info
```

## Options

```bash
  -V, --version                              show CLI version
  -a, --authorization_uri=authorization_uri  (required) the uri used for authorization
  -d, --delimiter=delimiter                  [default:  ] delimiter to concatenate the scopes
  -e, --state=state                          [default: 1576475685455] state of the request
  -g, --grant_type=grant_type                [default: authorization_code] the authorization code grant type
  -h, --help                                 show CLI help
  -i, --client_id=client_id                  (required) client id of the app
  -m, --token_method=token_method            [default: GET] the method used to fetch the token
  -n, --timeout=timeout                      [default: 30] the time in seconds to listen for a request on the callback uri
  -o, --scope=scope                          [default: ] scope of the permissions
  -p, --token_in_body                        if the params should be send in body in token request
  -r, --redirect_uri=redirect_uri            [default: http://localhost:3000/callback] redirect (callback) uri
  -s, --client_secret=client_secret          (required) client secret of the app
  -t, --token_uri=token_uri                  (required) the uri used to request a token
  -v, --verbose
```
