google = require 'googleapis'

OAuth2 = google.auth.OAuth2

creds = require('./google_creds.json').web

CLIENT_ID = creds.client_id

CLIENT_SECRET = creds.client_secret

REDIRECT_URL = creds.redirect_uris[0]

oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)

plus = google.plus('v1')

getUser = (token, cb)->
  oauth2Client.setCredentials(access_token: token)
  plus.people.get { userId: 'me', auth: oauth2Client }, (err, response)->
    if err?
      cb(err, null)
    else
      cb(null, response)

server = require('http').createServer()
sock_server = require('sockjs').createServer()

sock_server.on 'connection', (socket)->
  console.log "Socket Connection Opened"
  socket.authenticated = false
  socket.on 'data', (message)->
    msg = JSON.parse(message)
    if msg.auth?
      getUser msg.auth, (err, res)->
        if err?
          console.log "User not found"
          socket.write(JSON.stringify({error: "User not found"}))
        else
          console.log "User successfuly authenticated"
          socket.authenticated = true
          socket.write(JSON.stringify({authenticated: true}))
    else if !socket.authenticated
      socket.write(JSON.stringify({error: "Not authorized"}))
      socket.end()
    else
      console.log msg

  socket.on('close', (-> console.log "Connection Closed"))


sock_server.installHandlers(server, {prefix:'/auth'})
server.listen(9001, '0.0.0.0')
