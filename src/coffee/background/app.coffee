r = require 'ramda'
console.log r
windows = {}


updateTabs = (tab)->
  window_id = tab.windowId
  tab_id = tab.id
  url = tab.url
  if !windows.hasOwnProperty(window_id)
    windows[window_id] = {}

  windows[window_id][tab_id] = url
  console.log(windows)

chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab)->
  if changeInfo.status is "complete"
    updateTabs(tab)


