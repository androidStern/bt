google = require 'googleapis'

OAuth2 = google.auth.OAuth2

creds = require('./google_creds.json').web

CLIENT_ID = creds.client_id

CLIENT_SECRET = creds.client_secret

REDIRECT_URL = creds.redirect_uris[0]

oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

plus = google.plus('v1')

getUser = (token)->
  oauth2Client.setCredentials(access_token: token)
  plus.people.get { userId: 'me', auth: oauth2Client }, (err, response)->
    console.log err
    console.log response

app = require('express')()

server = require('http').Server(app)


morgan = require 'morgan'
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
methodOverride = require('method-override')
session = require('express-session')

app.use morgan('combined')
app.use cookieParser()
app.use bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }))
app.use methodOverride()

app.post '/auth', (req, res)->
  token = req.headers.authorization
  getUser(token)


app.listen(9001, '0.0.0.0')
