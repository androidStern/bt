r = require 'ramda'

do ->
  authenticated = false
  SockJS = require('sockjs-browserify')
  sock = new SockJS('http://localhost:9001/auth')

  sendMsg = (obj)-> sock.send JSON.stringify(obj)

  crumbs = [
    {
      crumb: {
        url: "https://developer.chrome.com/extensions/tabs#event-onUpdated",
        txt: "man this page is sooo cool i cant wait to tell my friends"
      }
    },
    {
      crumb: {
          url: "http://rethinkdb.com/api/python/get_all/",
          txt: "note to self: rethink db."
      }
    }
  ]

  sock.onopen = ->
    console.log "CONNECTED -----"
    chrome.identity.getAuthToken {interactive: true}, (token)->
      sendMsg {auth: token}


  sock.onmessage = (e)->
    msg = JSON.parse e.data
    if authenticated
      console.log msg
    else if msg.authenticated
      authenticated = true
      sendMsg crumb for crumb in crumbs

  chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab)->
    if tab.active then sendMsg({url: tab.url})
