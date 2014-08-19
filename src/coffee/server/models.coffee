r = require 'rethinkdb'
_ = require 'ramda'

HOST = 'localhost'
PORT = 28015

Users = r.table('users')
Crumbs = r.table('crumbs')

_addUser = _.curry (conn, user)->
  Users.insert(user)
    .run conn, (err, res)->
      if err? then throw err
      console.log JSON.stringify(res, null, 2)

_getUser = _.curry (conn, props, cb)->
  Users.filter(props)
    .run conn, cb

_findCrumbs = _.curry (conn, cb, id, url)->
  console.log "find crumgs got id #{id}"
  console.log "find crumbs got url #{url}"
  Crumbs.getAll(id, {index: "user_id"})
    .run conn, (err, res)->
      console.log "FUCKING CRUMBS"
      res.toArray (err, res)->
        if err? then throw err
        matches = res.filter (r)-> r.url is url
        cb({url: url, crumbs: matches})

_addCrumb = _.curry (conn, id, url, txt)->
  Crumbs.insert({user_id: id, url: url, txt: txt})
    .run conn, (err, res)->
      if err? then throw err
      console.log JSON.stringify(res, null, 2)

connect = (cb)->
  r.connect {host: HOST, port: PORT, db: 'been_dev'}, (err, conn)->
    if err? then throw err
    cb({
      addUser: _addUser(conn),
      getUser: _getUser(conn),
      findCrumbs: _findCrumbs(conn)
      addCrumb: _addCrumb(conn)
      })

module.exports = {connect}
