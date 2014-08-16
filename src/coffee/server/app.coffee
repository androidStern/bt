express = require 'express'

socks = require 'sockjs'

http = require 'http'

pages = ["https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify"]

sockjs_opts = {sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js"}


sock_server = socks.createServer(sockjs_opts)


sock_server.on 'connection', (conn)->
  conn.on 'data', (msg)->
    console.log "MESSAGE: ", msg
  conn.write(JSON.stringify(pages))


app = express()
server = http.createServer(app)
sock_server.installHandlers(server, {prefix: '/sock'})
server.listen(9001, '0.0.0.0')

