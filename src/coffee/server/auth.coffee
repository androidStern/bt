google = require 'googleapis'
creds  = require('./google_creds.json').web
OAuth2 = google.auth.OAuth2
plus   = google.plus('v1')

CLIENT_ID     = creds.client_id
CLIENT_SECRET = creds.client_secret
REDIRECT_URL  = creds.redirect_uris[0]

oauth2Client  = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

getUser = (token, cb)->
  oauth2Client.setCredentials(access_token: token)
  plus.people.get { userId: 'me', auth: oauth2Client }, (err, response)->
    if err?
      cb(err, null)
    else
      cb(null, response)

module.exports = {getUser}
