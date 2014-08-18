(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var getUserInfo, logit, requestStart, xhrWithAuth;

requestStart = function(access_token, method, url, onComplete) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.onload = onComplete;
  return xhr.send();
};

xhrWithAuth = function(method, url, callback) {
  return chrome.identity.getAuthToken({
    'interactive': true
  }, function(token) {
    console.log("TOKEN: ");
    console.log(token);
    return requestStart(token, method, url, callback);
  });
};

getUserInfo = function(callback) {
  return xhrWithAuth('GET', 'https://www.googleapis.com/plus/v1/people/me', callback);
};

logit = function(r) {
  return console.log(JSON.parse(this.response));
};

chrome.identity.getAuthToken({
  interactive: true
}, function(token) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:9001/auth/");
  xhr.setRequestHeader('Authorization', token);
  xhr.onload = function() {
    return console.log(this.response);
  };
  return xhr.send();
});



},{}]},{},[1])