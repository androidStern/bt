db   = require './models'
auth = require './auth'

server = require('http').createServer()
sock_server = require('sockjs').createServer()

db.connect ({addUser, getUser, findCrumbs, addCrumb})->

  maybeAddUser = (goog_user_info)->
    getUser {id: goog_user_info.id}, (_user)->
      if _user? then return true
      else addUser(goog_user_info)

  sock_server.on 'connection', (socket)->
    console.log "Socket Connection Opened"

    userId = null

    sockWrite = (obj)-> socket.write(JSON.stringify(obj))

    respondWithCrumbs = findCrumbs(sockWrite)

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
            userId = res.id
      else if !socket.authenticated
        sockWrite {error: "Not authorized"}
        socket.end()
      else
        if msg.url?
          console.log "user ID: #{userId}"
          console.log "msg url #{msg.url}"
          respondWithCrumbs(userId, msg.url)
        else if msg.crumb?
          addCrumb(userId, msg.crumb.url, msg.crumb.txt)
        # console.log msg




sock_server.installHandlers(server, {prefix:'/auth'})
server.listen(9001, '0.0.0.0')
