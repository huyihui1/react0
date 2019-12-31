#!/usr/bin/env node

require('babel-register');
const axios = require('axios');
const puppeteer = require('puppeteer');

const sleep = require('util').promisify(setTimeout);

const mysql = require('mysql');
const {asyncQuery} = require('../lib/mysql');

const CODE = "qgjzyjq";
const QUERY_URL = "http://112.74.173.159:8000/CGQueryOut/QueryCityCell.php";
const LOGIN_URL = "http://112.74.173.159:8000/CGQueryOut/CheckLogin.php"

var config = {
	//withCredentials: true,
  headers: {'Accept': 'text/html,application/xhtml+xml,application/xml',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'http://112.74.173.159:8000/CGQueryOut/login.jsp',
            'Origin': 'http://112.74.173.159:8000',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ru;q=0.7,it;q=0.6',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36}',
            'Cookie': 'Hm_lvt_c9e7e30e5b0090ca02432f04f757bc5f=1547973861,1548145013; Hm_lpvt_c9e7e30e5b0090ca02432f04f757bc5f=1549542263; JSESSIONID=EBCAA30995D2715EC49056D70455A3C9'}
};

async function login(){
	let resp = await axios.post(LOGIN_URL, {checkkey: CODE, 'Submit': '%B5%C7%C2%BC'}, config).catch(function (error) {
		console.log("login err", error);
		return false;
  });
  console.log(resp);
}

async function queryCell(city, cid) {
	let params = {city: city, cid3: cid, yys2: "dx4g", page: 1, rows: 100};
	let header = {"Referer": "http://112.74.173.159:8000/CGQueryOut/solocell.jsp"};

	let resp = await axios.post(QUERY_URL, params);
	console.log(resp);
}


async function main(){
	if(await login()) {
		for(let i=10000; i<10002; i++) {
			let city = "杭州";
			await queryCell(city, i);
			await sleep(1000);
		}
	}
}

// https://github.com/modood/Administrative-divisions-of-China
function cities(){
	return ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'];
}

function isp(){
	return ['lt', 'yd', 'dx4g', 'dxcdma'];
}

async function createOrUpdate(mysqlConn, rec) {

  let findSql = "SELECT * FROM cell_towers where out_id = ? and source = ?";
  let result = await asyncQuery(mysqlConn, findSql, [rec.out_id, rec.source]);

  if(result && result[0]) {
    return result[0];
    //let updateSql = "UPDATE cell_towers SET ? WHERE out_id = ? and source = ?";
    //return await asyncQuery(mysqlConn, updateSql, [rec, rec.out_id, rec.source]);
  } else {
    let saveSql = "INSERT cell_towers SET ?";
    rec.created_at = new Date();
    rec.updated_at = new Date();
    return await asyncQuery(mysqlConn, saveSql, [rec]);
  }
}

//main();

(async () => {

	let mysqlDB = 'bas_deve';
	let mysqlConn = mysql.createConnection({
	  host: '127.0.0.1',
	  user: 'admin',
	  password: '',
	  database: mysqlDB
	});

	mysqlConn.connect(function (err) {
	  if (err) {
	    console.error('[mysql] error connecting: ' + err.stack);
	    return;
	  }
	  console.log('[mysql] connected as id ' + mysqlConn.threadId);
	});

	setInterval(function() { mysqlConn.ping(); }, 1000);


  const browser = await puppeteer.launch();
  const page = await browser.newPage(
  	                                 // {headless: false,
                                    //   ignoreHTTPSErrors: true,
                                    //   args: [ '--start-maximized' //'--disable-setuid-sandbox', '--no-sandbox', '--disable-dev-shm-usage'
                                    //   ],
                                    //   timeout: 4500000,
                                    //   //devtools: true
                                    //   }
                                     );
  await page.goto('http://112.74.173.159:8000/CGQueryOut/login.jsp');
  const keyInput = await page.$('input[name="checkkey"]');
  const loginBtn = await page.$('input[name="Submit"]');
  // console.log("input", input);

  await keyInput.type('qgjzyjq');
  await loginBtn.click();

  await page.waitForNavigation();
  console.log('logged in:', page.url());

  // await page.goto('http://112.74.173.159:8000/CGQueryOut/cgdata.jsp');
	
	// await page.navigate({url: 'http://112.74.173.159:8000/CGQueryOut/QueryCGlac.php?lac=10000&city=%E6%9D%AD%E5%B7%9E&yys=yd'});

  // Allows you to intercept a request; must appear before
  // your first page.goto()
  // await page.setRequestInterception(true);

  // Request intercept handler... will be triggered with 
  // each page.goto() statement

  // page.on('request', interceptedRequest => {

  //     // Here, is where you change the request method and 
  //     // add your post data
  //     var data = {
  //         'method': 'GET',
  //         'getData': 'lac=10000&city=%E6%9D%AD%E5%B7%9E&yys=yd'
  //     };

  //     // Request modified... finish sending! 
  //     interceptedRequest.continue(data);
  // });

  // Navigate, trigger the intercept, and resolve the response



  const baseUrl = 'http://112.74.173.159:8000/CGQueryOut/QueryCGlac.php';
  const queryUrl = baseUrl + '?lac=10001&city=%E6%9D%AD%E5%B7%9E&yys=yd';

  const response = await page.goto(queryUrl);     
  const responseBody = await response.text();
  let result = JSON.parse(responseBody);
  let rows = result.rows;
  console.log(`There are ${result.total} records and now ${rows.length} rows`);

  for(let i=0; i<rows.length; i++) {
  	let row = rows[i];
  	row.cid = row.ci;
  	row.out_id = row.id;
  	row.source = 'cgquery';

  	delete row.id;
  	delete row.ci;
  	await createOrUpdate(mysqlConn, row);

  }

	// const lacInput = await page.$('#lac');
	// const cityInput = await page.$('#city');
	// const cidInput = await page.$('#ci3');
	// const queryBtn = await page.$('[id="tb1"] .l-btn > .l-btn-icon-left > .l-btn-text');

	// // console.log('city', cityInput);
	// // console.log('cid', cidInput);
 //  // console.log('query btn', queryBtn);

 //  await lacInput.type('10001');
	// await cityInput.type("杭州");
	// // await cidInput.type('10001');
 //  await queryBtn.click();

 //  page.on('response', response => {
 //  	if('xhr' !== response.request().resourceType()) {
 //  		return;
 //  	}
 //  	console.log(response.url());
 //  })
  // Page.navigate({url: 'http://localhost/'}); 
  // await page.waitForNavigation();
  // const data = await page.$('.datagrid-row');
  // console.log("data", data);
  //await browser.close();
})();

