import promisify from "util.promisify";
import request from "request";

async function crawl(number) {
    let url = "https://upay.10010.com/npfweb/getArea/init?callback=jsonp&commonBean.phoneNo=" + number + "1234";
    let get_await = promisify(request.get);
    let response = await get_await({url : url});
    if(response.body) {
        let match = response.body.match(/jsonp\((.*)\)/);
        if(match[1]) {
            let response_data = JSON.parse(match[1].replace(/'/g, "\""));
            if(response_data.prov) {
                let splited = response_data.prov.split("X");
                return {code: 0, province : splited[2], city: splited[3], zone: splited[1]};
            }
        }
    } else {
        return {code: -1, msg: "empty body"};
    }
}

export default crawl;