import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Message } from '@alifd/next';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import './contextMenu.css';
import { createTabItem } from '../../../../stores/PBAnalyze/actions';

class ContextMenu extends Component {
    state = {

    };

    componentDidMount() {

    }
    jumpPreviewPage(url, caseId = 1, params) {
      url = url || `/#/cases/${caseId}/pb_analyze${params}`;
      const w = window.open('about:blank');
      w.location.href = url;
    }
    render() {
      const onClick = ({ event, props, menuKey }) => {
        console.log(props);
        const columnData = event.target.innerText;
        const dataKey = props.rowData.dataKey;
        switch (menuKey) {
          case '查看以及标注':
            if (dataKey === 'owner_num' || dataKey === 'peer_num') {
              // this.jumpPreviewPage(null, props.caseId, `?owner_num=${columnData}`);
              return;
            }
            return Message.warning('选择错误, 请选择号码');
          case 'owner_num':
            if (dataKey === 'owner_num' || dataKey === 'peer_num') {
              this.jumpPreviewPage(null, props.caseId, `?owner_num=${columnData}`);
              return;
            }
            return Message.warning('选择错误, 请选择号码');
          case 'peer_num':
            if (dataKey === 'owner_num' || dataKey === 'peer_num') {
              this.jumpPreviewPage(null, props.caseId, `?peer_num=${columnData}`);
              return;
            }
            return Message.warning('选择错误, 请选择号码');
          case '查看两号码的相互通话详单':
            if (props.rowData.owner_num && props.rowData.peer_num) {
              this.jumpPreviewPage(null, props.caseId, `?owner_num=${props.rowData.owner_num}&peer_num=${props.rowData.peer_num}`);
              return;
            }
            return Message.warning('选择错误, 号码缺失');
          case '查看号码双方当天通话情况':
            if (props.rowData.owner_num && props.rowData.peer_num) {
              const started_day = props.rowData.started_day + '~' + props.rowData.started_day;
              this.jumpPreviewPage(null, props.caseId, `?owner_num=${props.rowData.owner_num}&peer_num=${props.rowData.peer_num}&started_day=${started_day}`);
              return;
            }
            return Message.warning('选择错误, 号码缺失');
          case '该号码的统计报表':
            if (dataKey === 'owner_num' || dataKey === 'peer_num') {
              this.jumpPreviewPage(`/#/cases/${props.caseId}/pb_stat/?${dataKey}=${columnData}`);
              return;
            }
            return Message.warning('选择错误, 请选择号码');
          case '查看两号码之间的统计报表':
            if (props.rowData.owner_num && props.rowData.peer_num) {
              this.jumpPreviewPage(`/#/cases/${props.caseId}/pb_stat/?owner_num=${props.rowData.owner_num}&peer_num=${props.rowData.peer_num}`);
              return;
            }
            return Message.warning('选择错误, 号码缺失');
          case '查看所有本基站中的通话':
            if (props.rowData.owner_ct_code) {
              const owner_lac = props.rowData.owner_ct_code.split(':')[0];
              const owner_ci = props.rowData.owner_ct_code.split(':')[1];
              this.jumpPreviewPage(null, props.caseId, `?owner_lac=${owner_lac}&owner_ci=${owner_ci}`);
              return;
            }
            return Message.warning('基站缺失');
          case '定位选中的基站':
            if (props.rowData.owner_ct_code) {
              const owner_lac = props.rowData.owner_ct_code.split(':')[0];
              const owner_ci = props.rowData.owner_ct_code.split(':')[1];
              const owner_mnc = props.rowData.owner_ct_code.split(':')[2];
              this.jumpPreviewPage(`/#/cases/${props.caseId}/celltowerloc?owner_lac=${owner_lac}&owner_ci=${owner_ci}&owner_mnc=${owner_mnc}`);
              return;
            }
            return Message.warning('选择错误, 基站缺失');
          case '所有当天本基站中的通话':
            if (props.rowData.owner_ct_code) {
              const owner_lac = props.rowData.owner_ct_code.split(':')[0];
              const owner_ci = props.rowData.owner_ct_code.split(':')[1];
              const started_day = props.rowData.started_day + '~' + props.rowData.started_day;
              this.jumpPreviewPage(null, props.caseId, `?owner_lac=${owner_lac}&owner_ci=${owner_ci}&started_day=${started_day}`);
              return;
            }
            return Message.warning('基站缺失');
          case '当天在该LAC上的所有通话':
            if (props.rowData.owner_ct_code) {
              const owner_lac = props.rowData.owner_ct_code.split(':')[0];
              const started_day = props.rowData.started_day + '~' + props.rowData.started_day;
              this.jumpPreviewPage(null, props.caseId, `?owner_lac=${owner_lac}&started_day=${started_day}`);
              return;
            }
            return Message.warning('基站缺失');
          case '一对一分析':
            if (props.rowData.owner_num && props.rowData.peer_num) {
              this.jumpPreviewPage(`/#/cases/${props.caseId}/pbills/mutual?owner_num=${props.rowData.owner_num}&peer_num=${props.rowData.peer_num}`);
              return;
            }
            return Message.warning('选择错误, 号码缺失');
          default:
            return null;
        }
        // this.jumpPreviewPage(props.caseId);
      };
      return (
        <Menu id="menu_id" style={{ zIndex: '9999', maxHeight: '90%', overflowY: 'auto', fontSize: '12px' }}>
          {/*<Item onClick={(data) => { onClick({ ...data, menuKey: '查看以及标注' }); }}>查看以及标注</Item>*/}
          {/*<Separator />*/}
          <Item onClick={(data) => { onClick({ ...data, menuKey: '一对一分析' }); }}>一对一分析 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: 'owner_num' }); }}>以此号码为本方号码 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: 'peer_num' }); }}>以此号码为对方号码 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: '查看两号码的相互通话详单' }); }}>查看两号码的相互通话详单 (可用)</Item>
          <Item onClick={onClick}>两号码进行碰撞</Item>
          <Item onClick={onClick}>查询两号码碰面情况</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: '查看号码双方当天通话情况' }); }}>查看号码双方当天通话情况 (可用)</Item>
          <Separator />
          <Item onClick={(data) => { onClick({ ...data, menuKey: '该号码的统计报表' }); }}>该号码的统计报表 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: '查看两号码之间的统计报表' }); }}>查看两号码之间的统计报表 (可用)</Item>
          <Item onClick={onClick}>可视化统计</Item>
          <Separator />
          <Item onClick={(data) => { onClick({ ...data, menuKey: '查看所有本基站中的通话' }); }}>查看所有本基站中的通话 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: '定位选中的基站' }); }}>定位选中的基站 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: '所有当天本基站中的通话' }); }}>所有当天本基站中的通话 (可用)</Item>
          <Item onClick={(data) => { onClick({ ...data, menuKey: '当天在该LAC上的所有通话' }); }}>当天在该LAC上的所有通话 (可用, 返回数据为空)</Item>
          <Item onClick={onClick}>查看当天活动轨迹</Item>
          <Item onClick={onClick}>查看关联通话</Item>
          <Item onClick={onClick}>查看当天的通话</Item>
          <Item onClick={onClick}>查看前后共5天的通话</Item>
          <Separator />
          <Item onClick={onClick}>隐藏选择的行（不显示）</Item>
          <Item onClick={onClick}>隐藏选择的行（永久）</Item>
          <Separator />
          <Item onClick={onClick}>只显示选择的行</Item>
          <Item onClick={onClick}>只显示选择的行（不连续）</Item>
          <Item onClick={onClick}>只显示被选择的行（永久）</Item>
        </Menu>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    criteria: state.search.criteria,
    PBAnalyze: state.PBAnalyze || [],
    caseId: state.cases.case.id,
  };
};

const mapDispatchToProps = {
  createTabItem,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContextMenu);
