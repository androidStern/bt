r = require 'ramda'
SockJS = require('sockjs-browserify')


windows = {}

user_pages = []

updateUserPages = (new_pages)->
  user_pages = r.concat user_pages, new_pages



inUserPages = (url)->
  for k,v in user_pages
    if k is url then return true
  return false

sock = new SockJS('http://localhost:9001/sock')





console.log sock

sock.onopen = -> console.log "CONNECTED -----"

sock.onmessage = (e)->
  console.log e.data
  msg = JSON.parse e.data
  console.log msg
  updateUserPages(msg)
  console.log user_pages

updateTabs = (tab)->
  window_id = tab.windowId
  tab_id = tab.id
  url = tab.url
  if !windows.hasOwnProperty(window_id)
    windows[window_id] = {}

  windows[window_id][tab_id] = url
  sock.send(JSON.stringify(windows))
  console.log(windows)

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab)->
  if changeInfo.status is "complete" and tab.active
    if inUserPages(tab.url)
      console.log "FOUND MATCH"
