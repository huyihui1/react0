import axios from "axios";
import CGQueryOut from "./cg_query_out";
import database from "../mysql";
import mysql from "promise-mysql";
import sleep from "../sleep";

const pool = mysql.createPool(database);
const instance = new CGQueryOut();


async function initialize(city) {
    const yys_group = ["dxcdma", "dx4g", "yd", "lt"];
    for(let yys_index in yys_group) {
        let yys = yys_group[yys_index];
        let rows = await pool.query("select id from ct_progress where city = ? and yys = ?", [city, yys]);
        if(!rows[0]) {
            await pool.query("insert into ct_progress (city, yys) values (?, ?)", [city, yys]);
        }
    }
}

async function request(options) {
    let city = options.city;
    await initialize(city);
    await instance.front_page();
    let progresses;
    if(options.yys) {
        progresses = await pool.query("select * from ct_progress where city = ? and yys = ?", [city, options.yys]);
    } else {
        progresses = await pool.query("select * from ct_progress where city = ?", [city]);
    }
    for(let i = 0; i < progresses.length; i ++) {
        let progress = progresses[i];
        let yys = progress["yys"];
        let lac;
        if(options.start) {
            lac = options.start;
        } else {
            lac = progress["progress"];
        }
        let rows = [];
        do {
            if(options.end) {
                if(lac > options.end) {
                    break;
                }
            }
            //await sleep(2000);
            lac += 1;
            rows = await instance.query_city_cell(city, yys, lac);
            console.log(new Date() +  ": return " + rows.length + " rows");
            for(let j = 0; j < rows.length; j ++) {
                let row = rows[j];
                await save_celltower(row, yys);
            }
            await pool.query("update ct_progress set progress = ? where city = ? and yys = ?", [lac, city, yys]);
            if(lac % 10 == 0) {
                console.log("gettting lac " + lac + " at " + city + " yys " + yys);
            }
            if(!(options.end)) {
                if (rows.length == 0) {
                    break;
                }
            }
            if(rows.length == 0) {
                await sleep(500);
            } else if(rows.length > 2000) {
                await sleep(10 * (options.sleep || 3000));
            } else if(rows.length > 1000) {
                await sleep(20 * (options.sleep || 3000));                
            } else {
                await sleep(options.sleep || 3000);
            }
        } while (true)
    }
}
function get_isp(yys) {
    if(yys == "dxcdma") {
        return 1;
    } else if (yys == "dx4g") {
        return 2;
    } else if (yys == "yd") {
        return 3;
    } else if (yys == "lt") {
        return 4;
    }
}

async function save_celltower(row, yys) {
    let { addr, ci, city, date, district, id, lac, lat, lng, mcc, mnc, province, town, radius } = row;
    row.version = date;
    row.out_id = id;
    row.isp = get_isp(yys);
    row.updated_at = new Date();
    delete row.date;
    delete row.id;    

    let cell_tower = await pool.query("select id from cell_towers where mnc = ? and mcc = ? and ci = ? and lac = ?", [mnc, mcc, ci, lac]);
    if(cell_tower.length > 0) {
        let updateSql = "update cell_towers set ? " + 
                        "where mnc = ? and mcc = ? and ci = ? and lac = ? ";
        await pool.query(updateSql, [row, mnc, mcc, ci, lac]);
    } else {
        row.created_at = row.updated_at;
        row.source = 'cgquery';
        let insertSql = "insert into cell_towers set ?";
        await pool.query(insertSql, [row]);
    }

}

export default request;