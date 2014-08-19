db   = require './models'
auth = require './auth'

server = require('http').createServer()
sock_server = require('sockjs').createServer()

db.connect ({addUser, getUser})->

  maybeAddUser = (goog_user_info)->
    getUser {id: goog_user_info.id}, (_user)->
      if _user? then return
      else addUser(goog_user_info)

  sock_server.on 'connection', (socket)->
    console.log "Socket Connection Opened"
    sockWrite = (obj)-> socket.write(JSON.stringify(obj))
    socket.authenticated = false

    socket.on 'close', ->
      console.log "Connection Closed"

    socket.on 'data', (message)->
      msg = JSON.parse(message)
      if msg.auth?
        auth.getUser msg.auth, (err, res)->
          if err?
            console.log "User not found"
            sockWrite {error: "User not found"}
          else
            console.log "User successfuly authenticated"
            socket.authenticated = true
            sockWrite {authenticated: true}
            console.log res
            maybeAddUser(res)
      else if !socket.authenticated
        sockWrite {error: "Not authorized"}
        socket.end()
      else
        console.log msg




sock_server.installHandlers(server, {prefix:'/auth'})
server.listen(9001, '0.0.0.0')
