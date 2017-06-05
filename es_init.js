"use strict";

let fs = require('fs');
let esClient = require('./es');

let json = fs.readFileSync('./data.json');
let data = JSON.parse(json);

let bulkBody = [];
data.forEach(function (item) {
  bulkBody.push({
    index: {
      _index: 'bestbuy',
      _type: 'product',
      _id: item._id['$oid']
    }
  });
  delete item._id;
  bulkBody.push(item);
});

esClient.bulk({body: bulkBody}).then(response => {
  response.items.forEach(item => {
    let errorCount = 0;
    if(item.index && item.index.error){
      errorCount++;
      console.log('Item index error');
      console.log(item.index.error);
    }
    console.log(`Success Index ${data.length - errorCount} and total items is ${data.length}`);
  });
});