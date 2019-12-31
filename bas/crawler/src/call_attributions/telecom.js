import promisify from "util.promisify";
import request from "request";


async function crawl(number) {
    let url = "http://189.cn/trade/recharge/captcha/type.do";
    let data = {"phone": number + "0163"};
    let post_await = promisify(request.post);
    let response = await post_await({url : url, form: data});
    if(response.body) {
        try {
            let response_data = JSON.parse(response.body);
            let code = response_data.code;
            if(code == 0) {
                if(response_data.dataObject) {
                    let data = response_data.dataObject;
                    return {code: 0, province: data.province, city: data.city, zone: data.cityCode}
                } else {
                    return {};
                }
            } else {
                return {code: code, msg: response_data.errorDescription}
            }
        } catch (err) {
            console.log("Invalid json:", err);
            console.log("The body of response:", response.body);
            return {code: -1, msg: "invalid json"};
        }
    } else {
        return {code: -1, msg: "empty response body"};
    }
}

export default crawl;