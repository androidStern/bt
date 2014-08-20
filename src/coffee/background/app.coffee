r = require 'ramda'

do ->
  authenticated = false
  SockJS = require('sockjs-browserify')
  sock = new SockJS('http://localhost:9001/auth')

  sendMsg = (obj)->
    sock.send JSON.stringify(obj)

  addCrumb = (url, txt)->
    sendMsg({rpc: "add", url: url, txt: txt})

  fetchByUrl = (url)->
    sendMsg({rpc: "fetch", url: url})

  sock.onopen = ->
    console.log "STATUS: connected"
    chrome.identity.getAuthToken {interactive: true}, (token)->
      sendMsg {rpc: "auth", auth: token}

  sock.onmessage = (e)->
    msg = JSON.parse e.data
    console.log  msg
    if authenticated
      console.log msg
    else if msg.authenticated
      authenticated = true

  chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab)->
    if tab.active then sendMsg({rpc: "fetch", url: tab.url})

  chrome.tabs.onActivated.addListener (tab_id_obj)->
    chrome.tabs.get tab_id_obj.tabId, (tab)->
      if tab.active then fetchByUrl(tab.url)

  chrome.runtime.onMessage.addListener (txt)->
    chrome.tabs.query {active: true}, (tab)->
      addCrumb(tab[0].url, txt)
