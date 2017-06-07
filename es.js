"use strict";

let esConfig = require('./es_config');

let es = require('elasticsearch');
let client = new es.Client({
  host: `${esConfig.host}:${esConfig.port}`,
  log: 'error',
  httpAuth: esConfig.httpAuth
});

module.exports = client;