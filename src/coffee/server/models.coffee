r = require 'rethinkdb'
_ = require 'ramda'

# r.use('been_dev')

HOST = 'localhost'
PORT = 28015

Users = r.table('users')

_addUser = _.curry (conn, user)->
  Users.insert(user)
    .run conn, (err, res)->
      if err? then throw err
      console.log JSON.stringify(res, null, 2)

_getUser = _.curry (conn, props, cb)->
  Users.filter(props)
    .run conn, cb

connect = (cb)->
  r.connect {host: HOST, port: PORT, db: 'been_dev'}, (err, conn)->
    if err? then throw err
    cb({addUser: _addUser(conn), getUser: _getUser(conn)})

module.exports = {connect}
