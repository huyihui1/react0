// 正则表达式测试工具: https://regex101.com/r/nX5XnH/2/
const CN_PHONE_NUM_RULE = /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[35678]\d{2}|4(?:0\d|1[0-2]|9\d))|9[189]\d{2}|66\d{2})\d{6}$/;
const CN_SHORT_NUM_RULE = /^\d{6}(\d{2})?$/;
const CN_CTCODE_RULE = /^/;
const CN_PHONE_NUM_VAGUE_RULE = /^\b\d{1,11}\b$/;
const CN_SHORT_NUM_VAGUE_RULE = /^\b\d{1,6}\b$/;


const CN_ANY_NUM_RULE = /^\d{3,12}$/;
const CN_MOBILE_NUM_RULE = /^\d{11}$$/;
const CN_VEN_NUM_RULE = /^6\d{4,5}$/;
const CN_REL_NUM_RULE = /^\d{3,6}$/;
const CN_CT_CODE_RULE = /^[a-fA-F0-9]+:[a-fA-F0-9]+:[a-fA-F0-9]+$/;
const NUM_IN_SEARCH_RULE = /^\d{3,12}$/;
const DURATION_RULE = /^\d+(\-\d+)?$/; //`时长`
const TIME_RANGE_RULE = /^\d+:\d+(\-\d+:\d+)?$/; //时间
const DECIMAL_RULE = /^\d+$/;
const HEX_RULE = /^[a-fA-F0-9]+$/;
const POSITIVE_NUM = /^\d+([.]\d+)?$/; // ___天， ___米 等输入框需要进行校验




const searchFun = function (value) {
  console.log(value);

};


export {
  searchFun,
  CN_PHONE_NUM_RULE,
  CN_SHORT_NUM_RULE,
  CN_PHONE_NUM_VAGUE_RULE,
  CN_SHORT_NUM_VAGUE_RULE,
  CN_ANY_NUM_RULE,
  CN_MOBILE_NUM_RULE,
  CN_VEN_NUM_RULE,
  CN_REL_NUM_RULE,
  CN_CT_CODE_RULE,
  NUM_IN_SEARCH_RULE,
  DURATION_RULE,
  TIME_RANGE_RULE,
  DECIMAL_RULE,
  HEX_RULE,
  POSITIVE_NUM
}
