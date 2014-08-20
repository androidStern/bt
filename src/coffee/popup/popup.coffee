$ = require 'jquery-browserify'

$('button#submit').click (event)->
  txt = $("input").val()
  console.log txt
  chrome.runtime.sendMessage(txt)
