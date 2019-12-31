// 定义handontable列宽
export const DATA_COL_WIDTH = 100;      //日期
export const TAGGING_COL_WIDTH = 136;   // 标注
export const TOTAL_COL_WIDTH = 45;      // 总计
export const FL_TIME_COL_WIDTH = 80;    // first last time
export const TIME_CL1_COL_WIDTH = 38;  //时间格式格式为（04:30~08:12）
export const TIME_CL3_COL_WIDTH = 38;   //时间格式格式为（21时）


export const NUMBER_COL_WIDTH = 102;    //号码 基站代码
export const RELEVANCE_COL_WIDTH = 100; //关联度
export const CONTACTS_COL_WIDTH = 38;  //联系人个数 联系人次数  联系次数
export const ACTIVE_PASSIVE_COL_WIDTH = 38; //主叫 被叫  主短 被短 呼叫
export const CALL_TIME__PASSIVE_COL_WIDTH = 120; //总通话时间  通话时间
export const CALL_TIME__PASSIVE_S_COL_WIDTH = 60; //总通话时间s
export const TIME_CL2_COL_WIDTH = 180;  //时间格式格式为（2019-07-12）
export const DAYS_COL_WIDTH = 100;  //首末相距 使用天数 未使用天数 天数
export const DETAILED_COL_WIDTH = 40;  //详单 可视化


//基站
export const LAC_CID_COL_WIDTH = 50; //lac  cid
export const ADDRESS_CID_COL_WIDTH = 140; //地址
export const DAY_COL_WIDTH = 38;   //天数
export const FL_NO_COL_WIDTH = 38; //首末期间未出现天数
export const FL_APPEAR_COL_WIDTH = 45; //首次出现时间 末次出现时间
export const FREQUENCY_COL_WIDTH = 80;  //出现频率


//对方号码
// export const LABEL_COL_WIDTH = 140;      //标签
export const F_TINE_COL_WIDTH = 88;     //首次通话时间
export const L_TINE_COL_WIDTH = 146;     //最后通话时间
export const ATTRN_COL_WIDTH = 80;      //归属地
export const ISP_COL_WIDTH = 40;        //运营商
export const CALLCOUNT_COL_WIDTH = 38;  //语音数
export const INFO_COL_WIDTH = 38;       //短信数
export const WORK_REST_TINE_COL_WIDTH = 38; //工作时间 休息时间
export const FIVE_COL_WIDTH = 80;       //5分钟以上
export const TWENTYONE_COL_WIDTH = 80;  //21小时后
export const TCT_COL_WIDTH = 110;        //通话时间合计
export const TT_COL_WIDTH = 80;         //合计时间
export const OTHER_COL_WIDTH = 38;      //其他


export const FIRST_TIME_COL_WIDTH = 85;      //首次时间
export const LAST_TIME_COL_WIDTH = 140;       //末次时间
export const FIRST_AND_LAST_COL_WIDTH = 38;       //首末相距






export const OWNERNUM_COL_WIDTH = 102;         //本方号码
export const NUMBERLABEL_COL_WIDTH = 136;      //号码标注
export const LABEL_COL_WIDTH = 140;           //标签
export const POST_COL_WIDTH = 100;            //职务
export const CENTRAlITY_COL_WIDTH = 38;       //中心度
export const VOICE_COL_WIDTH = 60;            //语音
export const CONTACTDAYS_COL_WIDTH = 38;      //联系天数
export const TWONUMBERTYPE_COL_WIDTH = 38;    //sms 主叫 被叫 呼转 私人 工作
export const MORETHAN5COUNT_COL_WIDTH = 38;   //5分钟以上
export const AFTER21COUNT_COL_WIDTH = 38;     //21小时后
export const CALLTIME_COL_WIDTH = 110;         //通话时间
export const AVERAGETIME_COL_WIDTH = 38;     //平均时长
export const TIMESEGMENTATION_COL_WIDTH = 200;//时间分割
export const FRIST_COL_WIDTH = 100;           //首次
export const LAST_COL_WIDTH = 100;            //最后

export const TODAY_CONTACTS_NUMBER_COL_WIDTH =38;
export const NOTE_COL_WIDTH = 600;
export const DISTRIBUTION_MAP_COL_WIDTH = 38;
export const TIME_CATEGORY_COL_WIDTH = 100; //时长类别


// 账单
export const CARD_NUM = 165; //卡号, 账号
export const NAME = 95; // 户名
export const BRANCH_NUM = 85; // 银行机构号
export const TELLER_CODE = 110; // 柜员号
export const BRANCH = 150; // 对方银行机构名称
export const TOTAL_COUNT = 50; // 次数
export const MONEY_RANGE = 100; // 金额范围次数
export const MONEY = 135; // 金额
export const DATE = 140; // 日期时间


export const setBBColWidth = (colHeaders, type) => {
  let colWidthsArr = [];

  for (let i = 0; i < colHeaders.length; i++) {
    let data = colHeaders[i];
    if (data === '对方卡号' || data === '对方账号' || data === '本方账号' || data === '本方卡号') {
      colWidthsArr.push(CARD_NUM)
    } else if (data === '本方户名' || data === '对方户名' || data === '户名') {
      colWidthsArr.push(NAME)
    } else if (data.indexOf('机构号') !== -1) {
      colWidthsArr.push(BRANCH_NUM)
    } else if (data === '柜员号') {
      colWidthsArr.push(TELLER_CODE)
    } else if (data.indexOf('机构名称') !== -1) {
      colWidthsArr.push(BRANCH)
    } else if (data === '次数' || data === '首末次交易时间相隔天数' || data === '交易过的对方卡号数' || data === '总交易次数' || data === '交易次数' || data === '金额名次' || data === '次数名次' || data === '存款次数' || data === '取款次数' || data === '私人时间次数' || data === '工作时间次数' || data === '5万元以上次数') {
      colWidthsArr.push(TOTAL_COUNT)
    } else if (data.indexOf('金额') !== -1 || data === '合计金额' || data === '存款金额' || data === '取款金额') {
      colWidthsArr.push(MONEY)
    } else if (data === '< 200(含)元' || data === '200 ~ 1000元' || data === '1000(含) ~ 4500元' || data === '4500(含) ~ 9000元' || data === '9000(含) ~ 5万元' || data === '5万(含) ~ 9万元' || data === '9万(含) ~ 50万元' || data === '50万(含) ~ 100万元' || data === '> 100万(含)元') {
      colWidthsArr.push(MONEY_RANGE)
    } else if (data.indexOf('~') !== -1 || data.indexOf('>') !== -1 || data.indexOf('时') !== -1 && data.length <= 3) {
      if (type === 'money') {
        colWidthsArr.push(MONEY_RANGE)
      } else {
        colWidthsArr.push(TOTAL_COUNT)
      }
    } else if (data === '日期' || data === '首次交易时间' || data === '最后交易时间' || data.indexOf('交易时间') !== -1) {
      colWidthsArr.push(DATE)
    } else {
      colWidthsArr.push(95)
    }
  }
  console.log(colWidthsArr);
  return colWidthsArr
}




export const setColWidths = function (colHeaders) {
  let colWidthsArr = [];

  for (let i = 0; i < colHeaders.length; i++) {
    let data = colHeaders[i];
    if (data === '对方号码' || data === '话单号码' || data === '基站代码' || data === '日期' || data === '基站') {
      colWidthsArr.push(NUMBER_COL_WIDTH)
    }
    if (data === '标注' || data === '基站标注') {
      colWidthsArr.push(TAGGING_COL_WIDTH)
    }
    if (data === '总计') {
      colWidthsArr.push(TOTAL_COL_WIDTH)
    }
    if (data === '首次通话时间') {
      colWidthsArr.push(F_TINE_COL_WIDTH)
    }
    if (data === '最后通话时间') {
      colWidthsArr.push(L_TINE_COL_WIDTH)
    }
    if (data === '归属地') {
      colWidthsArr.push(ATTRN_COL_WIDTH)
    }
    if (data === '运营商') {
      colWidthsArr.push(ISP_COL_WIDTH)
    }
    if (data === '语音数') {
      colWidthsArr.push(CALLCOUNT_COL_WIDTH)
    }
    if (data === '联系次数') {
      colWidthsArr.push(CONTACTS_COL_WIDTH)
    }
    if (data === '短信数') {
      colWidthsArr.push(INFO_COL_WIDTH)
    }
    if (data === '工作时间' || data === '休息时间') {
      colWidthsArr.push(WORK_REST_TINE_COL_WIDTH)
    }
    if (data === '通话时间合计') {
      colWidthsArr.push(TCT_COL_WIDTH)
    }
    if (data === '合计时间') {
      colWidthsArr.push(TT_COL_WIDTH)
    }
    if (data === '详单' || data === '可视化') {
      colWidthsArr.push(DETAILED_COL_WIDTH)
    }
    if (data === '其他') {
      colWidthsArr.push(OTHER_COL_WIDTH)
    }
    if (data.indexOf('~') !== -1 || data.indexOf('>') !== -1) {
      colWidthsArr.push(TIME_CL1_COL_WIDTH)
    }
    if (data.indexOf('时') !== -1 && data.length <= 3) {
      colWidthsArr.push(TIME_CL3_COL_WIDTH)
    }
    if (data === 'LAC' || data === 'CI') {
      colWidthsArr.push(LAC_CID_COL_WIDTH)
    }
    if (data === '地址') {
      colWidthsArr.push(ADDRESS_CID_COL_WIDTH)
    }
    if (data === '首末期间未出现天数') {
      colWidthsArr.push(FL_NO_COL_WIDTH)
    }
    if (data === '首次出现时间' || data === '最后出现时间') {
      colWidthsArr.push(FL_APPEAR_COL_WIDTH)
    }
    if (data === '天数' || data === '使用天数') {
      colWidthsArr.push(DAY_COL_WIDTH)
    }
    if (data === '未使用天数'){
      colWidthsArr.push(DAY_COL_WIDTH)
    }
    if (data === '出现频率') {
      colWidthsArr.push(FREQUENCY_COL_WIDTH)
    }
    if (data === '末次时间') {
      colWidthsArr.push(LAST_TIME_COL_WIDTH)
    }



    if (data === '本方号码'){
      colWidthsArr.push(OWNERNUM_COL_WIDTH)
    }
    if (data === '号码标注'){
      colWidthsArr.push(NUMBERLABEL_COL_WIDTH)
    }
    if (data === '标签' || data === '号码标签'){
      colWidthsArr.push(LABEL_COL_WIDTH)
    }
    if (data === '职务'){
      colWidthsArr.push(POST_COL_WIDTH)
    }
    if (data === '中心度'){
      colWidthsArr.push(CENTRAlITY_COL_WIDTH)
    }
    if (data === '联系天数'){
      colWidthsArr.push(CONTACTDAYS_COL_WIDTH)
    }
    if (data === 'sms' || data === '主叫' || data === '被叫' || data === '主短' || data === '被短' || data==='呼转' || data === '私人' || data === '工作' || data === '语音'){
      colWidthsArr.push(TWONUMBERTYPE_COL_WIDTH)
    }
    if (data === '5分钟以上'){
      colWidthsArr.push(MORETHAN5COUNT_COL_WIDTH)
    }
    if (data === '21时后'){
      colWidthsArr.push(AFTER21COUNT_COL_WIDTH)
    }
    if (data === '通话时间'){
      colWidthsArr.push(CALLTIME_COL_WIDTH)
    }
    if (data === '平均时长'){
      colWidthsArr.push(AVERAGETIME_COL_WIDTH)
    }
    if (data === '时间分割'){
      colWidthsArr.push(TIMESEGMENTATION_COL_WIDTH)
    }
    if (data === '首次'){
      colWidthsArr.push(FRIST_COL_WIDTH)
    }
    if (data === '最后'){
      colWidthsArr.push(LAST_COL_WIDTH)
    }
    if (data === '联系人个数' || data === '联系人次数'){
      colWidthsArr.push(CONTACTS_COL_WIDTH)
    }
    if (data === '总通话时间s'){
      colWidthsArr.push(CALL_TIME__PASSIVE_S_COL_WIDTH)
    }
    if (data === '首次时间'){
      colWidthsArr.push(FIRST_TIME_COL_WIDTH)
    }
    if (data === '末次'){
      colWidthsArr.push(LAST_TIME_COL_WIDTH)
    }
    if (data === '首末相距'){
      colWidthsArr.push(FIRST_AND_LAST_COL_WIDTH)
    }
    if (data === '次数'){
      colWidthsArr.push(CONTACTS_COL_WIDTH)
    }
    if (data === '当日联系次数'){
      colWidthsArr.push(TODAY_CONTACTS_NUMBER_COL_WIDTH)
    }
    if (data === '备注'){
      colWidthsArr.push(NOTE_COL_WIDTH)
    }
    if (data === '24小时分布图'){
      colWidthsArr.push(DISTRIBUTION_MAP_COL_WIDTH)
    }
    if (data === '时长类别'){
      colWidthsArr.push(TIME_CATEGORY_COL_WIDTH)
    }
  }
  return colWidthsArr;
};


