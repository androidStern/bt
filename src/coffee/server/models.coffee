r = require 'rethinkdb'
_ = require 'ramda'

r.use('been_dev')

HOST = 'localhost'
PORT = 28015


connect = (cb)->
  r.connect {host: HOST, port: PORT}, (err, conn)->
    if err? then throw err
    cb(conn)

Users = r.table('users')

addUser = _.curry (conn, user)->
  Users.insert(user)
    .run conn, (err, res)->
      if err? then throw err
      console.log JSON.stringify(res, null, 2)

getUser = _.curry (conn, props, cb)->
  Users.filter(props)
    .run conn, cb

module.exports = {connect, addUser, getUser}
