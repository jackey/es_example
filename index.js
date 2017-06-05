"use strict";

let host = '104.109.34.3';
let port = '3306';
let es = require('elasticsearch');
let client = new es.Client({
  host: host+':'+port,
  log: 'trace'
});

client.ping({requestTimeout: 30000}, function (err) {
  if (err) {
    console.log('server errror: [' + err+ ']');
  } else {
    console.log('all is well');
  }
});