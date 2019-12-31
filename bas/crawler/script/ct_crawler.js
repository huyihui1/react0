require("@babel/register");
require("@babel/polyfill");

const commandLineArgs = require('command-line-args')
var fs = require('fs');
var cities = JSON.parse(fs.readFileSync('./src/city-area-zipcode.json', 'utf8'));

const optionDefinitions = [
    { name: 'city', alias: 'h', type: String },
    { name: 'start', type: Number },
    { name: 'end', type: Number },
    { name: 'yys', type: String }
  ]

async function main() {
  let options = commandLineArgs(optionDefinitions)
  const crawl = require("../src/cell_towers/crawl").default;

  for(let i=0; i<cities.length; i++) {
    let sub = cities[i];
  	if(sub.name == "浙江") {
      for(let j=0; j<sub.child.length; j++) {
        let sub2 = sub.child[j];
  			console.log(`${new Date()} => ${sub2.name}`);
  			options.city = sub2.name;
  			await crawl(options);
        /*.then((data) => {
  			    console.log(data);
  			});*/
  		}
  	}
  	
  }
  /*
  crawl(options).then(() => {
      console.log("finish");
  });
  */
}

main();
