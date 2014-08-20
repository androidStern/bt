{addUser, getUser, updateUser, findUser, deleteUser, addCrumb, getCrumbsForUrl} = require './database'
# db   = require './models'


auth = require './auth'

server = require('http').createServer()
sock_server = require('sockjs').createServer()

maybeAddUser = (goog_user_info)->
  findUser({user_id: goog_user_info.id}).then (_user)->
    if _user? then return true
    else
      user = {}
      user.first_name = goog_user_info.name.givenName
      user.last_name = goog_user_info.name.familyName
      user.email = "blah blah blah"
      addUser(user)

sock_server.on 'connection', (socket)->
  console.log "Socket Connection Opened"

  userId = null

  sockWrite = (obj)-> socket.write(JSON.stringify(obj))

  respondWithCrumbs = (userId, url)->
    getCrumbsForUrl(userId, url).then (crumbs)->
      console.log "?CRUMBS FOUND----"
      console.log crumbs
      sockWrite(crumbs)

  socket.authenticated = false

  socket.on 'close', ->
    console.log "Connection Closed"

  socket.on 'data', (message)->
    msg = JSON.parse(message)
    if msg.rpc is "auth"
      auth.getUser msg.auth, (err, res)->
        if err?
          console.log "User not found"
          sockWrite {error: "User not found"}
        else
          console.log "User successfuly authenticated"
          socket.authenticated = true
          sockWrite {authenticated: true}
          console.log res
          userId = res.id
    else if !socket.authenticated
      sockWrite {error: "Not authorized"}
      socket.end()
    else
      if msg.rpc is "add"
        console.log "user ID: #{userId}"
        console.log "msg url #{msg.url}"
        addCrumb(userId, msg)
      else if msg.rpc is "fetch"
        console.log "CRUMB : #{msg.url}"
        getCrumbsForUrl(userId, msg.url).then (c)->
          console.log "Found a crumb: #{c}"
        respondWithCrumbs(userId, msg.url)




sock_server.installHandlers(server, {prefix:'/auth'})
server.listen(9001, '0.0.0.0')
