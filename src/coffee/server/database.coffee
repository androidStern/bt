_ = require 'ramda'
config = require("#{__dirname}/config.js")
thinky = require('thinky')(config.rethinkdb)

r = thinky.r

User = thinky.createModel('User', {
  id: String,
  first_name: String,
  last_name: String,
  email: String,
})

Crumb = thinky.createModel('Crumb', {
  id: String,
  user_id: String,
  url: String,
  content: String,
  })

Crumb.belongsTo(User, "user", "user_id", "id")
User.hasMany(Crumb, "crumbs", "id", "user_id")

addUser = (user_obj)->
  user = new User(user_obj)
  user.save()

getUser = (id)->
  User.get(id).run()

updateUser = (id, props)->
  getUser(id).then (user)->
    user.merge(props).save()

findUser = (props)->
  User.filter(props).run()

deleteUser = (id)->
  getUser(id).then (user)-> user.delete()

addCrumb = (user_id, data)->
  crumb = new Crumb(_.mixin(data, {user_id: user_id}))
  crumb.save()

getCrumbs = (user_id)->
  Crumb.getAll(user_id, {index: "user_id"}).run()

getCrumbsForUrl = (user_id, url)->
  Crumb.getAll(user_id, {index: "user_id"}).filter({url}).run()

User.count().execute().then (count)->
  if count is 0
    # Mock Users
    [
      {user_id: "as2f", first_name: "harri", last_name: "stern", email: "harri@email.com"},
      {user_id: "asdf", first_name: "andrew", last_name: "stern", email: "andrew@email.com"}
      {user_id: "123", first_name: "billy", last_name: "bozo", email: "bozo@email.com"}
      {user_id: "13kdh23", first_name: "emma", last_name: "stone", email: "stoned@email.com"}
    ].forEach(addUser)

    # Mock Crumbs
    [
      {url: "http://thinky.io/documentation/api/query/#reql", content: "what nice docs"}
      {url: "http://rethinkdb.com/api/javascript/#get_all", content: "also nice docs"}
      {url: "https://www.google.com/", content: "a search engine"}
    ].forEach(_.lPartial(addCrumb, "as2f"))

module.exports = {addUser, getUser, updateUser, findUser, deleteUser, addCrumb, getCrumbsForUrl}
