require("@babel/register");
const commandLineArgs = require('command-line-args')


const optionDefinitions = [
    { name: 'head', alias: 'h', type: String },
    { name: 'start', type: Number },
    { name: 'end', type: Number }
  ]

const options = commandLineArgs(optionDefinitions)

const crawl = require("../src/call_attributions/crawl").default;

crawl(options).then((val) => {
    console.log("ok");
    console.log(val);
}).catch((err) => {
    console.log(err);
});
