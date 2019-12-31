
import commandLineArgs from 'command-line-args';
import telecom_crawl from "./telecom";
import unicom_crawl from "./unicom";
import mobile_crawl from "./mobile";
import mysql from "promise-mysql";
import sleep from "../sleep";

import database from "../mysql";

const pool = mysql.createPool(database);

const unicom_head = ["130", "131", "132", "155", "156", "185", "186", "175", "176", "145", "166"];
const telecom_head = ["133", "153", "180", "181", "189", "199", "177", "173", "149"];
const mobile_head = ["139", "138", "137", "136", "135", "134", "147", "150", "151", "152", "157", "158", "159", "182", "183", "184", "187", "188", "178", "198"];

async function update_heads(heads, type, acc) {
    heads.forEach((head) => {
        acc[head] = type;
    });
    return acc;
}

async function initialize() {
    let acc = {};
    update_heads(unicom_head, "CUCC", acc);
    update_heads(telecom_head, "CTCC", acc);
    update_heads(mobile_head, "CMCC", acc);
    for(let head in acc) {
        let isp = acc[head];
        let rows = await pool.query("select id from ca_progress where head = ?", [head]);
        if(!rows[0]) {
            await pool.query("insert into ca_progress (head, isp) values (?, ?)", [head, isp]);
        }
    }
}

async function crawl_all(options) {
    let head = options.head;
    await initialize();
    let progresses;
    if (head) {
        progresses = await pool.query("select * from ca_progress where head = ?", [head]);
    } else {
        progresses = await pool.query("select * from ca_progress");
    }
    for(let i = 0; i < progresses.length; i ++) {
        let progress = progresses[i];
        let head = progress["head"];
        let isp = progress["isp"];
        let current = progress["progress"];
        let current_end = 9999;
        if(options.end) {
            current_end = options.end
            if(options.end > 9999) {
                current_end = 9999
            }
        }
        if(options.start !== undefined) {
            current = options.start
            if(options.start < 0) {
                current = 0
            }
        }
        while(current >=0 && current <= current_end) {
            let middle = ("000" + current).slice(-4);
            let area = await crawl(head, isp, middle);
            let num = head + middle;
            if(area.code == 0) {
                let attrs = await pool.query("select * from call_attributions where num = ?", [num]);
                if (attrs.length > 0) {
                    await pool.query("update call_attributions set isp = ?, num = ?, province = ?, city = ?, zone = ?, updated_at = now()", [isp, num, area.province, area.city, area.zone]);
                } else {
                    await pool.query("insert into call_attributions (isp, num, province, city, zone, created_at, updated_at) values (?, ?, ?, ?, ?, now(), now())", [isp, num, area.province, area.city, area.zone]);
                }
            } else {
                await pool.query("insert into ca_progress_error (num, isp, code, msg, created_at) values (?, ?, ?, ?, now())", [num, isp, area.code, area.msg]);
            }
            if(current % 20 == 0) {
                console.log("gettting num " + num);
            }
            current = current + 1;
            await pool.query("update ca_progress set progress = ? where head = ? and isp = ?", [current, head, isp]);
            await sleep(1500);
        }
    }
}



function crawl(head, isp, middle) {
    if(isp == "CUCC") {
        return unicom_crawl(head + middle);
    } else if(isp == "CTCC") {
        return telecom_crawl(head + middle);
    } else if(isp == "CMCC") {
        return mobile_crawl(head + middle);
    }
}

export default crawl_all;