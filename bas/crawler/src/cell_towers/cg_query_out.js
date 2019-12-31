import axios from "axios";
import queryString from "query-string";
import cheerio from "cheerio";
import sleep from "../sleep";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from 'tough-cookie';

axiosCookieJarSupport(axios);

const CODE = "qgjzyjq";
const LOGIN_URL = "/CGQueryOut/CheckLogin.php"
const QUERY_CELL_URL = "/CGQueryOut/QueryCGlac.php"
const FRONT_PAGE_URL = "/CGQueryOut/index.jsp"
const QUERY_LAC_CI_URL = "/CGQueryOut/QuerySoloCell.php"

class CGQueryOut {

    constructor() {
        const cookieJar = new tough.CookieJar();
        this.instance = axios.create({
            jar: cookieJar,
            withCredentials: true,
            baseURL: 'http://112.74.173.159:8000/',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'http://112.74.173.159:8000/CGQueryOut/cgdata.jsp',
                'Origin': 'http://112.74.173.159:8000',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
            }
        });
    }

    async login(){
        return this.instance.post(LOGIN_URL, queryString.stringify({checkkey: CODE, submit: "%B5%C7%C2%BC"}));
    }

    async front_page() {
        return this.with_login(() => this.front_page_0());
    }

    async query_city_cell(city, lac, yys) { 
        let result = await this.query_city_cell_one_page(city, lac, yys, 1);
        let total = result.total;
        let rows = result.rows;
        let total_page = Math.trunc((total - 1) / 100) + 1;
        for(let page = 2; page <= total_page; page ++) {
            let result1 = await this.query_city_cell_one_page(city, lac, yys, page);
            let next_rows = result1.rows;
            rows = rows.concat(next_rows);
        }
        return rows;
    }
    

    async query_lac_ci(lac, ci, yys) {
        
        let response = await this.with_login(() => this.query_lac_ci_page_0(lac, ci, yys, 1));
        let content_type = response.headers['content-type'];
        if (content_type && content_type.match(/application\/json/)) {
            let data = response.data;
            return data.rows;
        } else {
            throw("expected_response_json");
        }
    }

    async query_city_cell_one_page(city, yys, lac, page) {
        let response = await this.with_login(() => this.query_city_cell_one_page_0(city, lac, yys, page));
        let content_type = response.headers['content-type'];
        if (content_type && content_type.match(/application\/json/)) {
            let data = response.data;
            return data;
        } else {
            throw("expected_response_json");
        }
    }

    front_page_0() {
        return this.instance.get(FRONT_PAGE_URL);
    }

    query_city_cell_one_page_0(city, lac, yys, page) {
        let args = queryString.stringify({city: city, lac: lac, yys : yys});
        let formData = queryString.stringify({page: page, rows : 100});
        return this.instance.post(QUERY_CELL_URL + "?" + args, formData);
    }

    query_lac_ci_page_0(lac, ci, yys, page) {
        let args = queryString.stringify({lac: lac, ci, ci, yys : yys});
        let formData = queryString.stringify({page: page, rows : 100});
        //console.log({args});
        return this.instance.post(QUERY_LAC_CI_URL + "?" + args, formData);
    }

    async with_login(fun, max_retry = 5) {
        if(max_retry < 0) {
            throw("retry_exceed");
        }
        let response = await fun();
        if(this.is_login(response)) {
            response = await this.login();
            await sleep(500);
            return this.with_login(fun, max_retry - 1);
        } else {
            return response;
        }
    }

    is_login(response) {
        let content_type = response.headers['content-type'];
        if (content_type && content_type.match(/text\/html/)) {
            const $ = cheerio.load(response.data);
            let length = $('input[name="checkkey"]').length;
            if(length > 0) {
                return true;
            }
        }
        return false;
    }
}

export default CGQueryOut;