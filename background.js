var windows = {};


var updateTabs = function(tab){
  var window_id = tab.windowId;
  var tab_id = tab.id;
  var url = tab.url;
  if (!windows.hasOwnProperty(window_id)){
    windows[window_id] = {};
  }
  windows[window_id][tab_id] = url;
  console.log(windows);
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (changeInfo.status === "complete"){
    updateTabs(tab);
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  
});
