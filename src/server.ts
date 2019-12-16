import * as express from 'express'
import {URL} from 'url'
import * as qs from 'querystring'
import * as rp from 'request-promise-native'

import {Oauth2CLIHelperFlags} from './config'
import {parseSeconds, LogFunction} from './utils'

declare type AuthResponse = {
  access_token: string;
  expires_in: string;
  parsed_expires_in: string;
};

const renderHTML = (auth: AuthResponse): string => {
  const values = Object.entries(auth)
  .map(([key, value]) => {
    const attribute = `onClick="copyStringToClipboard('${value}')" style="cursor: pointer;"`
    return `<div ${attribute}><h3>${key}</h3><p>${value}</p></div>`
  })
  .join('\n')

  return `
<section style="font-family: monospace;">
  <h1>Token request response</h1>
  <code>(click values to copy to clipboard)</code>
  ${values}
</section>
<script>
  function copyStringToClipboard(str) {
    var el = document.createElement('textarea');
    console.log(el);
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  console.log(${JSON.stringify(auth)});
</script>
`
}

const getRequestOptions = (
  flags: Oauth2CLIHelperFlags,
  query: any,
): rp.RequestPromiseOptions => {
  const {
    redirect_uri,
    client_id,
    client_secret,
    grant_type,
    token_method,
    token_in_body,
  } = flags

  const params = {
    grant_type,
    client_id,
    client_secret,
    redirect_uri,
    ...query,
  }

  const options: rp.RequestPromiseOptions = {
    method: token_method,
    followRedirect: true,
  }

  if (token_in_body) {
    options.body = qs.stringify(params)
  } else {
    options.qs = params
  }
  return options
}

export default (log: LogFunction, timeout: NodeJS.Timeout) => (
  flags: Oauth2CLIHelperFlags,
  resolve: (auth: AuthResponse) => void,
  reject: (err: Error) => void,
) => {
  const {redirect_uri, token_uri} = flags

  const {pathname, port, origin} = new URL(redirect_uri)
  const app = express()

  app.get(pathname, async (req, res, next) => {
    clearTimeout(timeout)
    log('Callback triggered')

    if (!req.query.code) throw new Error('Authorization failed')

    try {
      log(`Fetching auth url "${token_uri}"`)

      const options = getRequestOptions(flags, req.query)
      const auth = JSON.parse(await rp(token_uri, options)) as AuthResponse

      auth.parsed_expires_in = parseSeconds(auth.expires_in)

      res.status(200).send(renderHTML(auth))
      next()
      resolve(auth)
    } catch (error) {
      next(error)
    }
  })

  // error handler
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _: express.NextFunction,
    ) => {
      res.status(500).send(err.stack)
      reject(err)
    },
  )

  app.listen(port, err => {
    if (err) return reject(err)
    if (flags.verbose) log(`Express server listening at ${origin}`)
  })
}
