import axios from "axios";
import CGQueryOut from "./cg_query_out";
import mysql from "promise-mysql";
import sleep from "../sleep";

const bas_deve_database = {
    host     : 'localhost',
    user     : 'admin',
    password : '',
    database : 'bas_deve',
    connectionLimit: 10
  };

const pool = mysql.createPool(bas_deve_database);
const instance = new CGQueryOut();

const ERROR_NO_RESULT = '0';
const INVALID_CT_CODE = '1';

/**
 * 7726:AF01:B
 * 715A:DF5:B                                    |
 * 6B7C:6B87E32:B
 */
async function request(options) {

    await instance.front_page();

    let sql = "SELECT code, count(1) as c FROM missed_ct_requests " + 
              "WHERE resolved_at IS NULL " + 
              "GROUP BY code ORDER BY c DESC";
             
    let sql2 = "SELECT code FROM cell_towers WHERE mnc = ? AND lac = ? AND ci = ?";
    let resolvedSql = "update missed_ct_requests set resolved_at = now() where code = ?";
    let resolvedSql2 = "update missed_ct_requests set resolved_at = now(), err_code = ? where code = ? and err_code is null";

    let missedReqs = await pool.query(sql, []);
    console.log({missedReqs})

    if(missedReqs.length > 0) {
        for(let i = 0; i < missedReqs.length; i ++) {
            let missedReq = missedReqs[i];
            let ctCode = missedReq["code"];
            
            if( validCtCode(ctCode)) {
                let mnc = get_mnc(ctCode);
                let lac = get_lac(ctCode);
                let ci = get_ci(ctCode);

                // check database again
                let hitted = await pool.query(sql2, [mnc, lac, ci]);
                console.log("check database:", {ctCode, mnc, lac, ci});

                if(hitted.length > 0) {
                    console.log(new Date(), ":" + ctCode + " exsits in celltowers");
                    await pool.query(resolvedSql, [ctCode]);
                } else {
                    if(await already_fetched_and_no_result(ctCode)) {
                        await pool.query(resolvedSql2, [ERROR_NO_RESULT, ctCode]);
                        console.log(new Date(), ":" + ctCode + " fetched and no result");
                    } else {
                        console.log(new Date(), ":Requesting " + ctCode );
                        let yys = get_yys(ctCode);
                        //console.log({yys})
                        let rows = await instance.query_lac_ci(lac, ci, yys);
                        if(rows) {
                            console.log("Returns " + rows.length + " items");
                            if(rows.length > 0) {
                                for(let j = 0; j < rows.length; j ++) {
                                    let row = rows[j];
                                    //console.log({row, mnc});
                                    await save_celltower_0(row, mnc, yys);

                                    let city = extract_city_from_addr(row.addr);
                                    if(city) {
                                        await sleep(500);
                                        console.log("Requesting city and lac", {city, lac});
                                        let rows2 = await instance.query_city_cell(city, yys, lac);

                                        console.log("Returns " + rows2.length + " items");
                                        for(let x = 0; x < rows2.length; x++) {
                                            await save_celltower(rows2[x], yys);
                                        }
                                        /*
                                        if(rows2.length == 0) {
                                            await sleep(500);
                                        } else if(rows2.length > 2000) {
                                            await sleep(10 * (options.sleep || 3000));
                                        } else if(rows2.length > 1000) {
                                            await sleep(20 * (options.sleep || 3000));                
                                        } else {
                                            await sleep(options.sleep || 3000);
                                        } */
                                        await sleep(300);
                                    }             
                                }

                                await pool.query(resolvedSql, [ctCode]);
                            } else { // result is empty
                                await pool.query(resolvedSql2, [ERROR_NO_RESULT, ctCode]);
                                await sleep(300);
                            }
                        }
                    }
                }
            } else {
                await pool.query(resolvedSql2, [INVALID_CT_CODE, ctCode]);
            }
        }
    } else {
        await sleep(500);
    } 
}

async function already_fetched_and_no_result(ctCode) {
    let sql = "SELECT err_code FROM missed_ct_requests WHERE code = ? AND err_code = '0' limit 1"; 
    let rows = await pool.query(sql, [ctCode]);
    if(rows.length > 0) {
        return true;
    }

    return false;
}

function validCtCode(ctCode) {
    if(ctCode) {
        let regex = /^[a-fA-F0-9]+:[a-fA-F0-9]+:[a-fA-F0-9]+$/;
        let arr = ctCode.match(regex);
        if(arr && arr.length > 0) {
            return true;
        } 
    } 
    
    return false;   
}

function get_yys(ctCode) {
    let mnc = get_mnc(ctCode);
    if(mnc == 0) {
        return "yd";
    } else if(mnc == 1) {
        return "lt";
    } else if(mnc == 11) {
        return "dx4g";
    } else {
        return "dxcdma";
    }
}

function get_mnc(ctCode) {
    return parseInt(ctCode.split(":")[2], 16);
}

function get_lac(ctCode) {
    return parseInt(ctCode.split(":")[0], 16);
}

function get_ci(ctCode) {
    return parseInt(ctCode.split(":")[1], 16);
}

async function save_celltower_0(row, mnc, yys) {
    let {addr, ci, lac, lat, lng, radius } = row;
    
    //row.out_id = id;
    row.isp = get_isp(yys);
    row.updated_at = new Date();
    
    delete row.date;
    delete row.id;    
    
    let mcc = "460";
    row.mcc = mcc;
    row.mnc = mnc;
    row.code = buildCtCode(lac, ci, mnc);

    let xcoord = xyz(lng, lat);
    row.xlng = xcoord[0];
    row.xlat = xcoord[1];
    
    let sql = "select id from cell_towers where mnc = ? and mcc = ? and ci = ? and lac = ?";
    let cell_tower = await pool.query(sql, [mnc, mcc, ci, lac]);
    if(cell_tower.length > 0) {
        // let updateSql = "update cell_towers set ? " + 
        //                 "where mnc = ? and mcc = ? and ci = ? and lac = ? ";
        // await pool.query(updateSql, [row, mnc, mcc, ci, lac]);
    } else {
        row.created_at = row.updated_at;
        row.source = 'cgquery';
        let insertSql = "insert into cell_towers set ?";
        await pool.query(insertSql, [row]);
    }

}

async function save_celltower(row, yys) {
    let { addr, ci, city, date, district, id, lac, lat, lng, mcc, mnc, province, town, radius } = row;
    row.version = date;
    row.out_id = id;
    row.code = buildCtCode(lac, ci, mnc);
    row.isp = get_isp(yys);
    row.updated_at = new Date();

    let xcoord = xyz(lng, lat);
    row.xlng = xcoord[0];
    row.xlat = xcoord[1];

    delete row.date;
    delete row.id;    
    //console.log({row});
    
    let sql = "select id from cell_towers where mnc = ? and mcc = ? and ci = ? and lac = ? and city is null";
    let cell_tower = await pool.query(sql, [mnc, mcc, ci, lac]);
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

function extract_city_from_addr(addr) {
    let regex = /(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)?(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|市辖区|.*?市|.*?县)/;
    let matches = addr.match(regex);
    if(matches) {
        return matches.groups.city;
    } else {
        return null;
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

function buildCtCode(lac, ci, mnc) {
    return (lac.toString(16) + ":" + ci.toString(16) + ":" + mnc.toString(16)).toUpperCase();
}

function xyz(x, y) {
    let xm = 35000.0;
    let ym = 27000.0;
    let percision = 1000000.0;

    x = parseFloat(x) * 1000000 % 360000000; 
    y = parseFloat(y) * 1000000 % 360000000;

    let _x = parseInt(((Math.cos(y/percision))*(x/xm))+((Math.sin(x/percision))*(y/ym))+x);
    let _y = parseInt(((Math.sin(y/percision))*(x/xm))+((Math.cos(x/percision))*(y/ym))+y);

    return [_x/percision, _y/percision]; 
    
}
export default request;