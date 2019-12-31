import promisify from "util.promisify";
import request from "request";

async function crawl(number) {
    let url = "https://shop.10086.cn/i/v1/res/numarea/" + number;
    let get_await = promisify(request.get);
    let response = await get_await({url : url});
    if(response.body) {
        let response_data = JSON.parse(response.body);
        let code = response_data.retCode;
        if(code == "000000") {
            if(response_data.data) {
                let data = response_data.data;
                return {code: 0, province : data.prov_cd, city: data.id_name_cd, zone: data.id_area_cd}
            }
        } else {
            return {code: code, msg: "msg"}
        }
    } else {
        return {code: -1, msg: "empty body"}
    }
}

export default crawl;