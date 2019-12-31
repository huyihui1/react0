import pathToRegexp from 'path-to-regexp';
import postscribe from 'postscribe';
import appConfig from '../appConfig';
import ajaxs from './ajax';
import { coordOffsetDecrypt } from './basCoord';

//  高级搜索 条件显示数据

const keyMap = {
  peer_short_num: '短号',
  owner_num: '本方号码',
  peer_num: '对方号码',
  peer_num_type: '对方号码类型',
  started_at: '日期时间',
  started_day: '实际日期',
  started_time: '时间',
  weekday: '周几',
  owner_lac: '位置区号',
  owner_ci: '小区号',
  alyz_day: '名义日期',
  started_time_l1_class: '时间类别',
  started_time_l2_class: '时间类别（详细）',
  started_hour_class: '时间类别（小时）',
  time_class: '时间性质',
  bill_type: '计费类型',
  duration: '时长',
  duration_class: '时长类别',
  comm_direction: '联系类型',
  long_dist: '长途标志',
  ven: '虚拟标志',
  owner_num_status: '通话状态',
  owner_comm_loc: '本方通话地',
  peer_comm_loc: '对方通话地',
  peer_num_attr: '号码归属地',
  owner_ct_code: '本方基站',
  peer_ct_code: '对方基站',
  x_nums: '横向号码',
  y_nums: '纵向号码',
  numA: '甲方话单',
  numB: '乙方话单',
};

// 高级搜索字段
const advancedSearchKey = {
  peer_num_type: '对方号码类型',
  peer_num_attr: '号码归属地',
  alyz_day: '名义日期',
  started_at: '日期时间',
  weekday: '周几',
  started_day: '实际日期',
  started_time: '时间',
  owner_lac: '位置区号',
  owner_ci: '小区号',
  started_time_l1_class: '时间类别',
  started_time_l2_class: '时间类别（详细）',
  started_hour_class: '时间类别（小时）',
  time_class: '时间性质',
  bill_type: '计费类型',
  duration: '时长',
  duration_class: '时长类别',
  comm_direction: '联系类型',
  long_dist: '长途标志',
  ven: '虚拟标志',
  owner_num_status: '通话状态',
  owner_comm_loc: '本方通话地',
  peer_comm_loc: '对方通话地',
  owner_ct_code: '本方基站',
}

// 筛选模板保留高级搜索字段

function formatAdvancedSearch(searchConds) {
  let panlSearch = {};
  for(const field in advancedSearchKeys) {
    if(searchConds[field]) {
      panlSearch[field] = searchConds[field];
    }
  }
  return panlSearch;
}

function renameLabel(values) {
  const tempObj = {};
  for (const key in values) {
    let newKey = null;
    if (key === 'owner_comm_loc' && values['owner_loc_type'] === '排除' || key === 'peer_comm_loc' && values['peer_loc_type'] === '排除') {
      newKey = `排除${keyMap[key]}`;
    } else if (key === 'owner_lac' && values['owner_lac_type'] === '排除' || key === 'owner_ci' && values['owner_ci_type'] === '排除') {
      newKey = `排除${keyMap[key]}`;
    } else if (key === 'owner_ct_code' && values['owner_ct_code_type'] === '排除') {
      newKey = `排除${keyMap[key]}`;
    } else {
      newKey = keyMap[key];
    }
    if (newKey) {
      if (Array.isArray(values[key])) {
        tempObj[newKey] = values[key].join(',').replace(/,/ig, ', ');
      } else {
        tempObj[newKey] = values[key];
      }
    }
  }
  return tempObj;
}

// 高级搜索默认字段
const searchKey = {
  ciFmt: '16进制',
  lacFmt: '16进制',
  owner_loc_type: '包含',
  peer_loc_type: '包含',
  owner_lac_type: '包含',
  owner_ci_type: '包含',
  owner_ct_code_type: '包含',
}


/**
 * 格式化菜单数据结构，如果子菜单有权限配置，则子菜单权限优先于父级菜单的配置
 * 如果子菜单没有配置，则继承自父级菜单的配置
 * @param {Array} menuData
 * @param {String} parentPath
 * @param {string} parentAuthority
 */
function formatterMenuData(menuData, parentPath = '', parentAuthority) {
  return menuData.map((item) => {
    const {path} = item;
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatterMenuData(
        item.children,
        `${parentPath}${item.path}`,
        item.authority
      );
    }
    return result;
  });
}

/**
 * 将 Array 结构的 Menu 数据转化成以 path 为 key 的 Object 结构
 * 扁平化 Menu 数据，通过递归调用将父子层结构的数据处理为扁平化结构
 * @param {array} menuConfig
 *
 * eg：
 *  "/dashboard": {name: "dashboard", icon: "dashboard", path: "/dashboard", children: Array(3), authority: undefined}
 *  "/form": {name: "表单页", icon: "form", path: "/form", children: Array(3), authority: undefined}
 *  "/list": {name: "列表页", icon: "table", path: "/list", children: Array(4), authority: undefined}
 */
function getFlatMenuData(menuConfig) {
  let keys = {};
  menuConfig.forEach((item) => {
    if (item.children) {
      keys[item.path] = {...item};
      keys = {...keys, ...getFlatMenuData(item.children)};
    } else {
      keys[item.path] = {...item};
    }
  });
  return keys;
}

/**
 *
 * @param {Array}  routerConfig
 * @param {Object} menuConfig
 */
function getRouterData(routerConfig, menuConfig) {
  const menuData = getFlatMenuData(formatterMenuData(menuConfig));

  const routerData = [];

  routerConfig.forEach((item, index) => {
    // 匹配菜单中的路由，当路由的 path 能在 menuData 中找到匹配（即菜单项对应的路由），则获取菜单项中当前 path 的配置 menuItem
    // eg.  router /product/:id === /product/123
    const pathRegexp = pathToRegexp(item.path);
    const menuKey = Object.keys(menuData).find((key) =>
      pathRegexp.test(`${key}`)
    );

    let menuItem = {};
    if (menuKey) {
      menuItem = menuData[menuKey];
    }

    let router = routerConfig[index];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };

    routerData.push(router);
  });

  return routerData;
}

function isCas(url) {
  url = url || window.location.pathname;
  if (RegExp(/cas/).test(url)) {
    return true;
  }
  return false;
}

function isTas(url) {
  url = url || window.location.pathname;
  if (url.indexOf('tas') !== -1) {
    return true;
  }
  return false;
}

function isWindows() {
  return /windows|win32/i.test(navigator.userAgent);
}

function formatFormData(values, isRemove = false) {
  const v = JSON.parse(JSON.stringify(values));
  console.log(v);
  for (const key in v) {
    if (Array.isArray(v[key]) && v[key][0] !== undefined) {
      v[key].forEach((item, index) => {
        if (key !== 'owner_ci' && key !== 'owner_lac' && item.indexOf('-') > -1 && key !== 'alyz_day' && key !== 'started_day' && key !== 'started_at' && key !== 'started_time' && key != 'duration') {
          v[key][index] = parseInt(item, 0);
        }
      });
      if (key === 'alyz_day' || key === 'started_day' || key === 'started_at' || key === 'started_time' || key === 'duration') {
        let newArr = [];
        console.log(key);
        if (v[key]) {
          v[key].forEach(item => {
            if (key === 'started_time' || key === 'duration') {
              newArr = [...newArr, ...item.split('-')];
            } else {
              newArr = [...newArr, ...item.split('~')];
            }
          });
        }
        v[key] = ['BETWEEN', [...newArr]];
      } else if (key === 'owner_comm_loc' || key === 'peer_comm_loc' || key === 'owner_lac' || key === 'owner_ci' || key === 'owner_ct_code') {
        if (key === 'owner_comm_loc') {
          if (v.owner_loc_type === '包含') {
            v.owner_comm_loc = ['FUZZY', v.owner_comm_loc];
          } else {
            v.owner_comm_loc = ['NOT_CONTAIN', v.owner_comm_loc];
          }
        }
        if (key === 'peer_comm_loc') {
          if (v.peer_loc_type === '包含') {
            v.peer_comm_loc = ['FUZZY', v.peer_comm_loc];
          } else {
            v.peer_comm_loc = ['NOT_CONTAIN', v.peer_comm_loc];
          }
        }
        if (key === 'owner_lac') {
          if (v.owner_lac_type === '包含') {
            v.owner_lac = ['IN', v.owner_lac];
          } else {
            v.owner_lac = ['NOT_IN', v.owner_lac];
          }
        }
        if (key === 'owner_ci') {
          if (v.owner_ci_type === '包含') {
            v.owner_ci = ['IN', v.owner_ci];
          } else {
            v.owner_ci = ['NOT_IN', v.owner_ci];
          }
        }
        if (key === 'owner_ct_code') {
          if (v.owner_ct_code_type === '包含') {
            v.owner_ct_code = ['IN', v.owner_ct_code];
          } else {
            v.owner_ct_code = ['NOT_IN', v.owner_ct_code];
          }
        }
      } else if (key === 'peer_num_attr') {
        if (v.loc_type === '排除') {
          v[key] = ['NOT_CONTAIN', [...v[key]]];
        } else {
          v[key] = ['FUZZY', [...v[key]]];
        }
      } else {
        v[key] = ['IN', [...v[key]]];
      }
    } else if (typeof v[key] === 'string') {
      if (key === 'ciFmt' || key === 'lacFmt') {

      } else if (key === 'daily_rec' || key === 'order-by' || key === 'owner_loc_type' || key === 'peer_loc_type' || key === 'owner_lac_type' || key === 'owner_ci_type' || key === 'owner_ct_code_type' || key === 'loc_type') {

      } else if (key === 'peer_num_attr') {
        v[key] = ['FUZZY', v[key]];
      } else if (key === 'started_day') {
        v[key] = ['>=', v[key]]
      } else {
        v[key] = ['IN', [v[key]]];
      }
    }
    if (v[key] && v[key].length === 0) {
      delete v[key];
    }
  }
  if (isRemove) {
    delete v.owner_loc_type
    delete v.peer_loc_type
    delete v.owner_lac_type
    delete v.owner_ci_type
    delete v.owner_ct_code_type
    delete v.loc_type
  }
  return v;
}

function downloadIamge(myChart, name) {
  const img = new Image();
  img.src = myChart.getDataURL({
    type: 'png',
    backgroundColor: '#fff',
  });
  img.setAttribute('crossOrigin', 'anonymous');
  img.onload = () => {
    // 生成一个a元素
    const a = document.createElement('a');
    // 创建一个单击事件
    const event = new MouseEvent('click');

    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
    a.download = name || '图表';
    // 将生成的URL设置为a.href属性
    a.href = img.src;

    // 触发a的单击事件
    a.dispatchEvent(event);
  };
}

/**
 *
 * @param el 被挂载dom id
 * @param cb 加载完成后的回调函数
 */
function installExternalLibs(el, cb) {
  installBaiduMaps(el, cb);
}

function installBaiduMaps(el, cb) {
  postscribe(el, `<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=${appConfig.mapAK}"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
<script type="text/javascript" src="//api.map.baidu.com/library/CurveLine/1.5/src/CurveLine.min.js"></script>
<script type="text/javascript" src="//api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js"></script>
<script src="TextIconOverlay.js"></script>
<script type="text/javascript" src="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></script>
<link rel="stylesheet" href="http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css" />
<script type="text/javascript" src="http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js"></script>
<link rel="stylesheet" href="http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css" />
<!--<script type="text/javascript" src="//api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js"></script>-->
`, {
    done: () => {
      if (window.BMap) {
        if (cb) {
          cb();
        }
      }
    },
  });
}

// 获取url参数
function getUrlRequest(search) {
  const theRequest = {};
  if (search) {
    const str = search.substr(1);
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = [strs[i].split('=')[1]];
    }
  }
  return theRequest;
}

// 获取基站编码经纬度
async function getLocTransform(ct_codes, coord = '2', fmt = 16) {
  const res = await ajaxs.post('/cell-towers/loc/transform', { coord, fmt, ct_codes, });
  if (res.meta.success) {
    let data = res.data;
    for (const k in data) {
      data[k][0] = coordOffsetDecrypt(data[k][0][0] * 1, data[k][0][1] * 1);
    }
    return data
  } else {
    return []
  }
}

// 格式化联系类型
function trans_comm_direction(value) {
  const comm_direction = value;
  if (comm_direction == 0) {
    return '未知';
  } else if (comm_direction == 11) {
    return '主叫';
  } else if (comm_direction == 12) {
    return '<---';
  } else if (comm_direction == 13) {
    return '呼转';
  } else if (comm_direction == 21) {
    return '主短';
  } else if (comm_direction == 22) {
    return '被短';
  } else if (comm_direction == 31) {
    return '主彩';
  } else if (comm_direction == 32) {
    return '被彩';
  }
  return '';
}

export {
  keyMap,
  searchKey,
  formatAdvancedSearch,
  renameLabel,
  getFlatMenuData,
  getRouterData,
  formatterMenuData,
  isCas,
  isTas,
  isWindows,
  formatFormData,
  downloadIamge,
  installExternalLibs,
  getUrlRequest,
  getLocTransform,
  trans_comm_direction
};
