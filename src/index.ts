import {Command, flags} from '@oclif/command'
import * as clipboardy from 'clipboardy'
import * as qs from 'querystring'
import * as open from 'open'

import {defaults} from './config'
import {base64URLEncode, logger, sha256} from './utils'
import initServer from './server'
import {randomBytes} from 'crypto'

class Oauth2CLIHelper extends Command {
  static description =
    'oauth2-cli-helper CLI\n\n' +
    'Use this cli to generate a oauth2 access token for various APIs.\n\n' +
    'You need to have an app set up with the redirect (callback) URL pointing to\n' +
    `"${defaults.redirectUri}" (or the specified custom redirect URL).`;

  static flags = {
    authorization_uri: flags.string({
      char: 'a',
      description: 'the uri used for authorization',
      required: true,
    }),
    client_id: flags.string({
      char: 'i',
      description: 'client id of the app',
      required: true,
    }),
    client_secret: flags.string({
      char: 's',
      description: 'client secret of the app',
      required: true,
    }),
    grant_type: flags.string({
      char: 'g',
      description: 'the authorization code grant type',
      default: defaults.grantType,
    }),
    help: flags.help({char: 'h'}),
    redirect_uri: flags.string({
      char: 'r',
      description: 'redirect (callback) uri',
      default: defaults.redirectUri,
    }),
    delimiter: flags.string({
      char: 'd',
      description: 'delimiter to concatenate the scopes',
      default: defaults.delimiter,
    }),
    scope: flags.string({
      char: 'o',
      description: 'scope of the permissions',
      default: defaults.scope,
      multiple: true,
    }),
    state: flags.string({
      char: 'e',
      description: 'state of the request',
      default: defaults.state,
    }),
    timeout: flags.integer({
      char: 'n',
      description:
        'the time in seconds to listen for a request on the callback uri',
      default: defaults.timeout,
    }),
    token_in_body: flags.boolean({
      char: 'b',
      description: 'if the params should be send in body in token request',
      default: false,
    }),
    token_method: flags.string({
      char: 'm',
      description: 'the method used to fetch the token',
      default: defaults.tokenMethod,
    }),
    token_uri: flags.string({
      char: 't',
      description: 'the uri used to request a token',
      required: true,
    }),
    pkce: flags.boolean({
      char: 'p',
      description: 'use PKCE',
      default: false,
    }),

    verbose: flags.boolean({char: 'v'}),
    version: flags.version({char: 'V'}),
  };

  async run() {
    const {flags} = this.parse(Oauth2CLIHelper)
    const log = logger(flags.verbose)
    const {
      redirect_uri,
      scope,
      client_id,
      state,
      authorization_uri,
      delimiter,
      timeout,
      pkce,
    } = flags

    let pkce_verifier: string | undefined
    if (pkce) {
      pkce_verifier = base64URLEncode(randomBytes(32))
    }

    const server = initServer(
      log,
      setTimeout(
        () => this.error('Command execution timeout', {exit: 1}),
        timeout * 1000,
      ),
    )

    server(
      flags,
      pkce_verifier,
      res => {
        this.log('')
        this.log('Token request response')
        this.log('')
        Object.entries(res).forEach(([key, value]) => {
          this.log(key)
          this.log(value)
          this.log('')
        })
        clipboardy.writeSync(res.access_token)
        process.exit(0) // eslint-disable-line no-process-exit, unicorn/no-process-exit
      },
      err => this.error(err.message || err, {exit: 1}),
    )

    // Start authorization process
    const params = qs.stringify({
      client_id,
      redirect_uri: redirect_uri,
      response_type: 'code',
      scope: scope.join(delimiter),
      state: state,
      ...(pkce_verifier ?
        {
          code_challenge: base64URLEncode(sha256(pkce_verifier)),
          code_challenge_method: 'S256',
        } :
        {}),
    })
    const url = `${authorization_uri}?${params}`
    log(`Open auth url "${url}"`)
    open(url)
  }
}

export = Oauth2CLIHelper;
