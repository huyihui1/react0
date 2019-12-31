require("@babel/register");
require("@babel/polyfill");

const commandLineArgs = require('command-line-args')
var fs = require('fs');

const optionDefinitions = [
    { name: 'city', alias: 'h', type: String },
    { name: 'start', type: Number },
    { name: 'end', type: Number },
    { name: 'yys', type: String }
  ]

async function main() {
  let options = commandLineArgs(optionDefinitions)
  const adhoc_req = require("../src/cell_towers/adhoc").default;

  while(true) {
    await adhoc_req(options);
  }
}

main();


/*
POST
http://112.74.173.159:8000/CGQueryOut/QuerySoloCell.php?lac=26482&ci=14087&yys=yd
page=1&rows=100

{"total":1,"rows":[{"addr":"浙江省温州市瑞安市桐浦乡振兴桥;瑞枫线与明浦南路路口东南120米","ci":14087,"lac":26482,"lat":27.84848289988731,"lng":120.55669606650532,"radius":965}]}
*/