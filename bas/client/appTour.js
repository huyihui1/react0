import React, {Component} from 'react';
const maxWidth = '815px';

const pageTour = {
  //  案件概览
  caseOverview: [
    {
      selector: '[data-tut="tour_caseOverview_step0"]',
      content: () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>汇总展示该案件的基本信息，包括话单数目、通话地区分布、事件标注、号码标注及异常话单提示等，且可以提供补全话单里的对方所在的基站位置，关联号码到人员库里的人员信息和解析基站的位置信息等功能。
            以上案件概览信息能直观展现该案件的基础信息、分析标注及异常信息，便于调查人员掌握案件分析进度，断点续查，提高宏观把控能力。
          </div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 异常话单提示：点击「搜索异常话单」按钮，可以把长时间没有使用的话单，或者非常用手机等异常情况识别出来。</div>
          <div>● 补全对方基站：补全已调取的话单里的对方所在的基站位置（要求通话双方都已经调取话单）。新话单导入或者虚拟网、亲情网转换之后，点击这个按钮来补全对方基站。</div>
          <div>● 解析基站信息：把基站代码转换为经纬度和区县、街道等具体地理位置信息。当基站地图显示不出来，基站相邻性无法判断的时候，需要点击本按钮。</div>
          <div>●
            关联人员信息：把话单中的本方号码和对方号码与人员库信息进行比对，这样子在显示号码的时候同时可以显示人员的姓名、类别等信息，其中以g、b、j、z开头的人员代码分别表示公务员、企业人员（老板）、国企人员、一般人员类别。
          </div>
          <strong className='suggestion'>使用建议</strong>
          <div>本功能界面主操作区右上角的这三个按钮（补全对方基站，解析基站信息，关联人员信息）经常性需要调用，请熟悉其作用。若基站地图显示不出来到时候，请点击「解析基站信息」。若某个号码在人员库里有人员信息，但是在号码标注这里没有显示出来的时候，请点击「关联人员信息」。若对方号码也有话单，但是对方基站没有显示出来的时候，请点击「补全对方基站」。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 号码标注
  labelPn: [
    {
      selector: '[data-tut="tour_labelPn_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>在话单分析过程中，对关注的号码取个名字，并标上颜色和分类，以及添加对该号码的备注信息。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 添加号码标注：可以在本界面点击添加「添加」按钮，也可以在其他任意页面双击要标注的号码就会弹出一个标注页面，该标注页面同时提供了关于该号码的概述性信息。灵活运用这个快捷功能可以极大提高分析效率。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>可以通过标注背景颜色的设置来对号码进行分类管理，分类的建议：对象、亲友、同事、职权相关、重点关注（情人、中间人等特殊关系人）等。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 事件标注
  caseEvent: [
    {
      selector: '[data-tut="tour_caseEvent_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>在话单分析过程中，对某个重要的日期或者日期期间标注发生的重要事件内容，并标上颜色，这样在分析过程中就可以起到提示作用。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 添加事件标注：可以在本界面点击添加「添加」按钮，也可以在其他任意页面双击「日期」就会弹出一个事件标注页面。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>事件可以在日期上重叠。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 基站标注
  labelCell: [
    {
      selector: '[data-tut="tour_labelCell_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>在话单分析过程中，对关注的基站取个名字，并标上颜色和分类，以及添加对该基站的备注信息。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 添加号码标注：可以在本界面点击添加「添加」按钮，也可以在其他任意页面双击要标注的基站那就会弹出一个标注页面，该标注页面同时提供了关于该基站的概述性信息。灵活运用这个快捷功能可以极大提高分析效率。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>可以通过标注背景颜色的设置来对基站进行分类管理，分类的建议：单位、家中、玩乐场所等</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 转换导入
  filesImport: [
    {
      selector: '[data-tut="tour_filesImport_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>这里导入的是使用「话单转换器」软件转换以后生成的bis格式的话单文件。</div>
          <br/>
          <div>「话单转换器」可以自动批量导入原始话单文件，并对话单分析中需要的数据进行自动整理，把不同的话单格式统一成标准格式，实现不同来源的话单数据统一处理。同时通过制作话单模板可以很方便地对系统进行扩展，从而实现对全国各地所有运营商话单的支持。
          </div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 话单转换器操作：选择话单地区、运营商和话单格式，并填写话单所属区号（用来补全原始话单中部分固定号码没有区号的情况），然后可以从电脑桌面或者文件管理器里脱拽一个文件或者一个文件夹到话单转换器界面，点击「开始转换」按钮进行转换，如果提示转换不成功的，很大原因是你的话单格式变化了或者是新的话单格式，那么请联系开发公司制作话单模板，一次制作永久使用。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>注意这里导入的不是原始的话单数据哦（如execl格式，csv格式等）。这里导入的是bis格式。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 他案导入
  casesImport: [
    {
      selector: '[data-tut="tour_casesImport_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可以相同帐号名下其他案件中已经存在的话单导入到当前选择的案件中。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>如果要查询某个号码是否在其他案件中已经存在话单，那么本功能界面的搜索框中输入号码进行查询。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 话单列表
  pbills: [
    {
      selector: '[data-tut="tour_pbills_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>对案件中的所有话单进行管理，可以批量设置常驻地、虚拟网、亲情网，也可展现异常话单，也可以用来删除话单。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 设置常驻地、虚拟网、亲情网：可以勾选多个号码进行设置。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 虚拟网
  venNumbers: [
    {
      selector: '[data-tut="tour_venNumbers_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可用来将对方号码当中的虚拟网短号转化成手机长号。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 虚拟网添加：可以通过多种方式添加。1.在本界面点击添加按钮录入，2.可以双击号码，弹出号码标注页面添加，3.通过csv文件模板批量导入，4.「话单列表」功能里对本方号码的虚拟网短号进行批量设置。</div>
          <div>● 虚拟网短号转长号操作：点击「虚拟网短号转换为长号」按钮，会将列表中虚拟网短号转换成长号，注意：你如果想将某个话单里的短号转成长号，也必须先将这个话单对应的本方号码也要加入到这个虚拟网列表中。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>如果点击「虚拟网短号转换为长号」按钮后，你想要看到某个话单里的短号没有转成长号，那么请你检查一下，这个本方号码和对方号码是否都已经加入到这个虚拟网列表里，并且虚拟网名称是一致的。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 亲情网
  relNumbers: [
    {
      selector: '[data-tut="tour_relNumbers_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可用来将对方号码当中的亲情网短号转化成手机长号。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 亲情网添加：可以通过多种方式添加。1.在本界面点击添加按钮录入，3.通过csv文件模板批量导入，3.「话单列表」功能里对本方号码的亲情网短号进行批量设置。</div>
          <div>● 亲情网短号转长号操作：点击「亲情网短号转换为长号」按钮，会将列表中亲情网短号转换成长号，注意：你如果想将某个话单里的亲情网短号转成长号，也必须先将这个话单对应的本方号码也要加入到这个亲情网列表中。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>如果点击「亲情网短号转换为长号」按钮后，你想要看到某个话单里的短号没有转成长号，那么请你检查一下，这个本方号码和对方号码是否都已经加入到这个亲情网列表里，并且亲情网名称是一致的。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 时间分割点
  caseBreakpoint: [
    {
      selector: '[data-tut="tour_caseBreakpoint_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>对案件时间根据关键的时间节点进行分段，这样子可以在报表里或者相互关系分析里在这些关键时间点前后的联系情况进行分段查看，如在某工程项目投标前嫌疑人员联系较密切，但项目结束后很联系明显少了。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 时间分割点显示效果：例如在对方号码报表里有个列「时间分割」，假如有两个时间分割点，它会把整个时间分割为三段，那么系统会显示如 8:56:2三个时间段内的联系次数</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 基站补正
  normalizeCT: [
    {
      selector: '[data-tut="tour_normalizeCT_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>因部分通讯运营商提供的原始话单数据中基站信息缺失（LAC值为0，在基站代码上显示为如0:A56D:0样式），此功能利用案件中的其他数据进行完整基站信息补正，使得不完整的基站信息变为有效的完整基站数据。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 基站定位
  bsSearch: [
    {
      selector: '[data-tut="tour_bsSearch_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>通过手工输入基站代码来显示一个或者多个基站的地图位置。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● LAC+CI+MNC定位。</div>
          <div>● 城市+CI定位。</div>
          <div>● 基站代码粘贴定位。</div>
          <div>● 多个基站定位：可以多次点击查询按钮，它不会把之前查询的基站清空掉，而是叠加显示。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>● LAC指的是大区号，或者位置区号，范围比CI更广，一个LAC可以包含覆盖多个CI，也就是说一个LAC可以对应多个CI。</div>
          <div>● CI指的是基站号。</div>
          <div>● MNC指的是网络号，0代表移动，1代表联通，B（11）代表电信。</div>
          <div>● CDMA的定位参数与移动，联通和电信4G用的参数不一样。</div>
          <div>● 特别说明的是直接从浙江电信调取的话单里的基站代码不是真正的基站编号，而是电信内部自己使用的一个编码，所以导致定位不成功。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 人员库
  citizensImport: [
    {
      selector: '[data-tut="tour_citizensImport_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>人员库是所有人共享的，每个人都可以把通讯录等导入到这个人员库中，人人贡献，人人分享。</div>
          <br/>
          <div>这个库可以用来与本方号码和对方号码进行关联提示，具体操作可以通过案件概览页面右上角的「关联人员信息」。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 人员库的输入方式有三种。</div>
          <div>● 批量导入：通过「导入」按钮，打开批量导入界面，注意通讯录版本号以日期为版本号，如输入20190910。批量导入的文件有格式要求，第一行必须为标题行。如果有多个号码，那么号码要分为多列（每列一个号码），要求列标题里以【/号码】结尾。如果有多个地址，那么地址要分为多列（每列一个地址），要求列标题里以【/地址】结尾。</div>
          <div>● 单个添加：点击「添加」按钮，打开一个添加界面，这里可以结合汉王速录笔，直接扫描通讯录录入。</div>
          <div>● 「号码标注」页面，点击「保存到人员库」按钮，进行保存。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 特殊号码
  pubserviceNums: [
    {
      selector: '[data-tut="tour_pubserviceNums_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可以用来把这些特殊共用号码从号码碰撞、共同号码等结果中排除出去，提高分析准确度。也可以用来对嫌疑对象使用的特殊服务进行标识。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 个人设置
  bassSetting: [
    {
      selector: '[data-tut="tour_bassSetting_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>修改人员名称，头像以及修改帐号密码。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 关系图
  connections: [
    {
      selector: '[data-tut="tour_connections_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>关系图能较直观的显示人员的主要关系圈，以及关系圈内相互联络情况，对于排摸人际关系联络网有较大参考价值。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 不显示对方联系人：用来判断选定的本方号码之间的联系情况。</div>
          <div>● 显示对方联系人：用来判断以本方号码为主体的关系圈相互之间的关联情况。</div>
          <div>● 相互有关系认定：通过设置相互联系次数来掌控是否在关系图上显示一根连线，判断双方有关系。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>可以通过关系图结果显示区域的放大缩小按钮来控制图形大小缩放。</div>
          <div>当鼠标悬停在圆点上的时候，用来查看这个圆点代表的号码和哪几个号码有联系。</div>
          <div>当鼠标悬停在连线上的时候，用来查看连线两端的号码之间的联系情况。</div>
          <div>关系图颜色说明：单线联系的号码与主号的相同，灰色圆点代表这个号码与两个号码有联系，黑色圆点代表这个号码与三人以上联系，从关系图交错情况可以判断其同事或亲戚关系或者单线联系。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 矩阵关系
  matrix: [
    {
      selector: '[data-tut="tour_matrix_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>用来查看横向号码代表一组群体和纵向号码代表的一组群体相互之间的联系情况，如按供应方与采购方（招标方与行贿方），行成纵横矩阵查询，将上述手机号码的话单进行矩阵排列，从中可以清晰地反映出相互之间的关系亲密程度，分析出是否多方参与事件。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 号码碰撞
  inCommon: [
    {
      selector: '[data-tut="tour_inCommon_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>该功能主要用于寻找多个号码之间共同联系人,可以是两个号码之间,也可以是多个号码之间。</div>
          <div>每当查处行业性，系统性的案子时，找出多个单位负责人之间共同的外部联系人，可以帮助侦查部门扩展侦查视野，挖掘已掌握线索之外的其他可能的案件来源。</div>
          <div>也可以用来查找新号码或者消失的号码，或者老号码新使用等情况。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 规则附加：三个规则可以叠加使用。</div>
          <div>● 第一个规则设定：指的是目标结果号码与部分本方号码的联系是在某个时间点之后才开始的。</div>
          <div>● 第二个规则设定：指的是目标结果号码与部分本方号码的联系是在某个时间点之后没有了联系。</div>
          <div>● 第三个规则设定：指的是目标结果号码与部分本方号码的联系是在某个时间点之前有一段时间没有联系了。这种主要针对老号码在某个关键时间点后开始活跃使用的情况。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 通话轨迹
  calltrack: [
    {
      selector: '[data-tut="tour_calltrack_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>设定条件筛选出符合条件的通话记录，然后把通话记录对应的位置显示在地图上，形成轨迹点，然后把轨迹点进行连线，形成轨迹线。不同日期的轨迹线的颜色不一致。如果启用了“时间同步”功能，还可以对每日内的轨迹进一步按照不同人员区分为不同人员的轨迹。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 当前点闪烁：可以对右侧清单里的位置在地图上进行闪烁提示。</div>
          <div>● 时间同步：每日内的轨迹进一步按照不同人员区分为不同人员的轨迹，而且一个人员的轨迹点被选中的时候，其他人员的轨迹点也同步跳转提示。</div>
          <div>● 显示基站信息窗口：显示在这个基站轨迹点上的通话情况。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>如果筛选条件里的通话记录量很大的话，性能会降低，建议</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 互相碰面
  meetanalyze: [
    {
      selector: '[data-tut="tour_meetanalyze_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>用来查找两个人一天内到过位于同一基站CI或同一位置区号LAC或者相邻基站位置的情况。可以快速判断出双方何时何地进行了碰面，从而帮助掌握对象与关系人一起娱乐宴请，一起旅游度假等情况，如果在案发后，还可以掌握两人碰面串供的情况。当应用于对象与其女朋友约会时，可以掌握两人约会的时间及具体地点。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 认定碰面的条件有三种。</div>
          <div>● 相同基站号CI：当双方都是相同运营商时使用，在相同的基站位置。</div>
          <div>● 相邻x米基站：通过基站位置距离来判断，可以相同运营商使用，也可以是不同运营商时使用，灵活度较高。</div>
          <div>● 认定为碰面之后，显示在界面上是每一天内认为是碰面地点的基站会分组显示，如果有多组碰面基站，那么每一组都会按照不同颜色显示。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>由于只有嫌疑对象在使用语音通话情况下才会有基站记录，因此进行碰面查询的时候，不一定要求双方互有语音通话，他们之间可以短信约定，也可以是微信等其它工具约定，具体碰面与否需结合轨迹和其他信息来综合判定。</div>
          <div>如果想查看在工作地点之外的碰面情况，那么在筛选条件里「LAC」设定为排除工作地点基站LAC。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 伴随号码
  backupNums: [
    {
      selector: '[data-tut="tour_backupNums_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可以找出某个号码某个时间点在某个地方通话前后时间内同时出现在相邻位置的其他号码，即伴随号码，这个功能可以用来找出与某个号码经常在一起的其他号码，这些伴随号码可能是他的亲密关系人，也可能是他自己本人的其他号码。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>如果想查看某个号码晚上的伴随号码，那么在筛选条件里「时间性质」设定为私人时间，或者时间里输入晚上时间段。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 新号搜索
  newNums: [
    {
      selector: '[data-tut="tour_newNums_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可以非常智能化地找出某个时间点后开始出现的新号码。只要找准了关系人或者调取了足够多的关系人的话单，对于常规案件就可以快速找出被控对象新号码。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>如果想找出一个号码上面新出现的号码，那么输入条件里本方号码选择一个号码，新号码至少与1个号码有联系即可。</div>
          <div>要找出新号码，条件里新号码至少与x个号码有联系的x个数可以从大到小进行尝试。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 一对一分析
  mutuai: [
    {
      selector: '[data-tut="tour_mutuai_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>从联系时间，联系方式，碰面情况，共同联系人等多个角度对两个人之间的关系进行深入分析。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 话单浏览
  pbAnalyze: [
    {
      selector: '[data-tut="tour_pbAnalyze_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>主要用来帮助调查人员根据案件的情况设定特定的筛选条件组合，然后来筛选出所需要的通话详单。话单浏览中的筛选组合设定完全开放，调查人员可以随心所欲根据需要进行组合，方便查看各种条件组合下的通话详单。例如，将通话详单条件设定为：时间：周几；具体时间段；通话时长；联系类型：主叫、被叫、呼叫转移；通话状态：漫游、本地；对方号码归属地等，这样就能很快地帮助调查人员提取调查所需要的通话数据。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 每日显示选择：可以分别显示每日全部数据，或者每日最晚，最早数据。当选择每日早晚两条的时候，可以用来帮助查看每日的晚上过夜基站位置。</div>
          <div>● 查看双方通话位置：悬停在基站代码上，如果双方有基站的，也可以悬停在联系方式（主叫、被叫）上查看双方的通话位置。</div>
          <div>● 多选操作：在显示结果话单清单里，同时按Alt+鼠标点击某一个内容，高亮显示这个列里相同内容值的话单记录，如按Alt点话单浏览中的上午时间，则界面会高亮显示上午的话单并提示选中的数目。</div>
          <div>● 模板保存：这个功能是把当前选中的筛选条件保存下来，方便以后直接点击模板名称调用，或者其他功能里调用这个筛选条件。可将习惯常用的几个筛选条件保存为模板，方便快速调用，如下班后的活动。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>分析过程中要多使用对“号码、基站、日期”三个关键信息的双击快捷键跳转，通过此快捷键可快速跳转到此号码、时间、基站的标注信息。</div>
          <div>要多保存筛选条件为模板，方便快速输入筛选条件。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 话单统计
  pbstat: [
    {
      selector: '[data-tut="tour_pbstat_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>主要用来帮助调查人员根据案件的情况设定特定的筛选条件组合，然后针对某个维度来生成统计报表，统计报表展示形式有数字报表以及图表。通过设定各种话单检索条件能有效排摸嫌疑对象活动规律、活动范围、人际交往密切情况等。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 重点报表：A1-对方号码报表。反映的是对方号码亲疏关系、电话时间长短、通话次数、主被叫、短信情况、夜间通话等，从而可以判断关系人之间的密切程度。</div>
          <div>● 重点报表：B4-基站vs24小时通话时段报表。提供的是相关基站在某个时间段、每小时内出现的次数，从而确定对象所在地点，进而判断其在家、工作场所或其它场所等。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>本系统设计了三十多个统计报表，每个报表从不同的角度统计描述了通话情况，请仔细琢磨每个报表的含义，思考每个报表可以在什么场景中应用，这样方便不同的报表组合在一起进行查看。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 话单统计
  iWork: [
    {
      selector: '[data-tut="tour_iWork_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>可用来创建案件，选择或者切换不同案件，编辑案件信息以及删除案件。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 选择案件或者切换不同案件操作：点击案件卡片。</div>
          <div>● 删除案件操作：点击某案件卡片的「编辑」图标，进入案件编辑页面后，点击「删除」按钮删除案件。注意：删除案件的时候同时会把案件的话单</div>
          <div>● 切换案件列表：你可以在右上角区点击切换“在办”、“存档”、“全部”三个案件列表。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>建议案件的编号中加入年份日期，便于以后查找案件，如：JW-201909。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],

//  账单案件概览
  BBCaseOverview: [
    {
      selector: '[data-tut="tour_BBCaseOverview_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>汇总展示该案件的基本信息，包括账单数目、重要事件、账户标注及异常账单提示等。
            以上案件概览信息能直观展现该案件的基础信息、分析标注及异常信息，便于调查人员掌握案件分析进度，断点续查，提高宏观把控能力。
          </div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 转换导入
  BBFilesImport: [
    {
      selector: '[data-tut="tour_BBFilesImport_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>这里导入的是使用「账单转换器」软件转换以后生成的zfs格式的账单文件。</div>
          <br/>
          <div>「账单转换器」可以自动批量导入原始账单文件，并对账单分析中需要的数据进行自动整理，把不同的账单格式统一成标准格式，实现不同来源的账单数据统一处理。同时通过制作账单模板可以很方便地对系统进行扩展，从而实现对全国各地所有运营商账单的支持。
          </div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 账单转换器操作：在银行关键字输入框中输入关键字（如“农业”），点击「查询」按钮，在下方显示出来的银行列表中选择一个银行，然后可以从电脑桌面或者文件管理器里脱拽一个文件或者一个文件夹到账单转换器界面，点击「开始转换」按钮进行转换，如果提示转换不成功的，很大原因是你的账单格式变化了或者是新的账单格式，那么请联系开发公司制作账单模板，一次制作永久使用。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>注意这里导入的不是原始的账单数据（如execl格式，csv格式等）。这里导入的是zfs格式。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 账单列表
  bbills: [
    {
      selector: '[data-tut="tour_bbills_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>对案件中的所有账单进行管理，可以设置某个户名下的所有账户或者某几个银行账户的户名，也可以用来删除账单。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 设置银行账户户名：点击户名旁边的“+”号，展开银行卡列表，选择其中一个银行卡，然后点击列表上方的「设置账户户名」按钮，在弹出的对话框中输入“户名”，再点击「确认」按钮。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
//  银行卡标识
  bins: [
    {
      selector: '[data-tut="tour_bins_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>
            用来识别账户的银行卡卡号归属的银行名称。用户可以自行导入，添加数据。
          </div>
        </div>
      ),
      style: {
        maxWidth: maxWidth,
      }
    },
  ],

  bbAnalyze: [
    {
      selector: '[data-tut="tour_bbAnalyze_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>主要用来帮助调查人员根据案件的情况设定特定的筛选条件组合，然后来筛选出所需要的银行流水详单。账单浏览中的筛选组合设定完全开放，调查人员可以随心所欲根据需要进行组合，方便查看各种条件组合下的通话详单。例如，将通话详单条件设定为：时间：周几；具体时间段；转账金额；转账余额；借贷类型：存、取；网点：交易机构号、交易机构名称、柜员号等，这样就能很快地帮助调查人员提取调查所需要的银行流水详单。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 排序依据：交易时间、金额倒序</div>
          <div>● 多选操作：在显示结果账单清单里，同时按Alt+鼠标点击某一个内容，高亮显示这个列里相同内容值的账单记录，如按Alt点账单浏览中的上午时间，则界面会高亮显示上午的账单并提示选中的数目。</div>
          <div>● 多选操作：模板保存：这个功能是把当前选中的筛选条件保存下来，方便以后直接点击模板名称调用，或者其他功能里调用这个筛选条件。可将习惯常用的几个筛选条件保存为模板，方便快速调用，如下班后的活动。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>分析过程中要多使用对“账号、卡号“关键信息的双击快捷键跳转，通过此快捷键可快速跳转到此账号的标注信息。</div>
          <div>要多保存筛选条件为模板，方便快速输入筛选条件。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth,
        left: '140px'
      }
    },
  ],
  // 账单统计
  bbstat: [
    {
      selector: '[data-tut="tour_bbstat_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>主要用来帮助调查人员根据案件的情况设定特定的筛选条件组合，然后针对某个维度来生成统计报表，统计报表展示形式有数字报表以及图表。通过设定各种账单检索条件能有效排摸嫌疑对象交易构成、交易规律，交易地点、交易对手等重点信息。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 重点报表：A1-对方账户报表。反映的是对方账户交易次数、交易金额、转入转出情况、交易时间等，从而发现重点交易对手。</div>
          <strong className='suggestion'>使用建议</strong>
          <div>本系统设计了二十多个统计报表，每个报表从不同的角度统计描述了通话情况，请仔细琢磨每个报表的含义，思考每个报表可以在什么场景中应用，这样方便不同的报表组合在一起进行查看。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  // 收支分析
  cashTrends: [
    {
      selector: '[data-tut="tour_cashTrends_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>「收支趋势」能较直观地展示账户的收入、支出和净收入支出随时间变化情况。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 不同的分析时间粒度：包括每日、每周、每旬、每月、每季、每年等。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  cashAcc: [
    {
      selector: '[data-tut="tour_cashAcc_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>「累计收支」能较直观地展示账户的收入和支出随时间累计变化情况。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 不同的分析时间粒度：包括每日、每周、每旬、每月、每季、每年等。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    },
  ],
  blsOverview: [
    {
      selector: '[data-tut="tour_blsOverview_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>「资产概况」能较直观地展示账户的特定时间粒度里最初、最末和最大、最小变化情况。</div>
          <strong className='keypoint'>重点操作</strong>
          <div>● 不同的分析时间粒度：包括每日、每周、每旬、每月、每季、每年等。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    }
  ],
  comboBills: [
    {
      selector: '[data-tut="tour_comboBills_step0"]',
      content : () => (
        <div className='tous'>
          <strong className='cases'>应用场景</strong>
          <div>通过对话单和账单的记录详单通过各自筛选条件的过滤后按时间轴进行联合展现，便于比对发掘异常数据。</div>
        </div>
      ),
      style: {
        maxWidth: maxWidth
      }
    }
  ]
};
export default pageTour;
