do ->
  authenticated = false
  SockJS = require('sockjs-browserify')
  sock = new SockJS('http://localhost:9001/auth')
  sock.onopen = ->
    console.log "CONNECTED -----"
    chrome.identity.getAuthToken {interactive: true}, (token)->
      sock.send JSON.stringify({auth: token})

  sock.onmessage = (e)->
    msg = JSON.parse e.data
    if authenticated
      console.log msg
    else if msg.authenticated
      authenticated = true
      sock.send JSON.stringify {rpc: "thanks"}
