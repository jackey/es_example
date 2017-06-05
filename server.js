"use strict";

let esClient = require('./es');
let express = require('express');
let path = require('path');
let url = require('url');
const esConfig = require('./es_config');

const app = express();

const staticPath = (localUri) => {
  return path.join(__dirname, 'statics', localUri);
};

app.use(express.static('statics'));

app.use((req, res, next) => {
  next();
});

app.get('/', (req, res) => {
  console.log(staticPath('index.html'));
  res.sendFile(staticPath('index.html'));
});

app.get('/search', (req, res) => {
  let urlParts = url.parse(req.url, true);
  let query = urlParts.query;

  let results = [];

  esClient.search({
    index: esConfig.index,
    type: esConfig.type,
    size: 10, // 默认10个
    body: {
      query: {
        bool: {
          should: [{match: {name: query.q}}, {match: {description: query.q}}] // 只搜索 name 和 description
        }
      }
    }
  }).then(esRes => {
    var hits = esRes.hits.hits;
    hits.forEach(item => {
      results.push(item._source);
    });
    res.json(results);
  }, err => {
    console.log('search err');
    console.log(err);
    res.json([])
  });
});

app.listen(8182, (err) => {
  if (err) {
    console.log('express error :');
    console.log(err);
  } else {
    console.log('server listen on *:8182');
  }
});