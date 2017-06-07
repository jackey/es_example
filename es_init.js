"use strict";

let fs = require('fs');
let esClient = require('./es');

let json = fs.readFileSync('./data.json');
let data = JSON.parse(json);

let bulkgroup = [];
let bulkBody = [];
data.forEach(function (item) {
  bulkBody.push({
    index: {
      _index: 'bestbuy',
      _type: 'product',
      _id: item.sku
    }
  });
  //delete item._id;
  bulkBody.push(item);

  if (bulkBody.length > 500) {
    bulkgroup.push(bulkBody);
    bulkBody = [];
  } 
});

if (bulkgroup.length <= 0 ) {
  bulkgroup.push(bulkBody);
}

console.log("Finished construct bulk body");

[bulkgroup[0]].forEach(bulkBody=> {

  console.log("Gona to push items with length: " + bulkBody.length);

  esClient.bulk({body: bulkBody}).then(response => {
    response.items.forEach(item => {
      let errorCount = 0;
      if(item.index && item.index.error){
        errorCount++;
        console.log('Item index error');
        console.log(item.index.error);
      }
      console.log(`Success Index ${bulkBody.length - errorCount} and total items is ${bulkBody.length}`);
    });
  }).catch(e => {
    console.log(e);
  });

});