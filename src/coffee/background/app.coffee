requestStart = (access_token, method, url, onComplete)->
  xhr = new XMLHttpRequest()
  xhr.open(method, url)
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token)
  xhr.onload = onComplete
  xhr.send()

xhrWithAuth = (method, url, callback)->
  chrome.identity.getAuthToken { 'interactive': true }, (token)->
    console.log "TOKEN: "
    console.log token
    requestStart(token, method, url, callback)

getUserInfo = (callback)->
  xhrWithAuth('GET', 'https://www.googleapis.com/plus/v1/people/me', callback)

logit = (r)->
  console.log JSON.parse(this.response)

# getUserInfo(logit)

chrome.identity.getAuthToken {interactive: true}, (token)->
  xhr = new XMLHttpRequest()
  xhr.open("POST", "http://localhost:9001/auth/")
  xhr.setRequestHeader('Authorization', token)
  xhr.onload = ->
    console.log this.response
  xhr.send()


#
# OAuthSimple = require "./chrome_ex_oauthsimple.js"
# {ChromeExOAuth} = require "./chrome_ex_oauth.js"
#
# console.log ChromeExOAuth
#
#
# oauth = ChromeExOAuth.initBackgroundPage({
#   'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
#   'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
#   'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
#   'consumer_key': 'anonymous',
#   'consumer_secret': 'anonymous',
#   'scope': 'https://www.googleapis.com/auth/plus.login',
#   'app_name': 'been-there'
# });
#
#
# oauth.authorize ->
#   console.log "Authroizing"
#
#
# r = require 'ramda'
# SockJS = require('sockjs-browserify')
#
#
# windows = {}
#
# user_pages = []
#
# updateUserPages = (new_pages)->
#   user_pages = r.concat user_pages, new_pages
#
#
#
# inUserPages = (url)->
#   for k,v in user_pages
#     if k is url then return true
#   return false
#
# sock = new SockJS('http://localhost:9001')
#
#
#
#
# console.log sock
#
# sock.onopen = -> console.log "CONNECTED -----"
#
# sock.onmessage = (e)->
#   console.log e.data
#   msg = JSON.parse e.data
#   console.log msg
#   updateUserPages(msg)
#   console.log user_pages
#
# updateTabs = (tab)->
#   window_id = tab.windowId
#   tab_id = tab.id
#   url = tab.url
#   if !windows.hasOwnProperty(window_id)
#     windows[window_id] = {}
#
#   windows[window_id][tab_id] = url
#   sock.send(JSON.stringify(windows))
#   console.log(windows)
#
# chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab)->
#   if changeInfo.status is "complete" and tab.active
#     if inUserPages(tab.url)
#       console.log "FOUND MATCH"
