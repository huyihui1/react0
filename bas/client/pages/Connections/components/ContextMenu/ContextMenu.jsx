import React, { Component } from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
export default class ContextMenu extends Component {
    state = {

    };

    componentDidMount() {

    };


    render() {
        const onClick = ({ event, props }) => console.log(event,props);
        return(
          <Menu id='menu_id'>
             <Item onClick={onClick}>查看以及标注</Item>
             <Separator />
             <Item onClick={onClick}>以此号码为本方号码</Item>
             <Item onClick={onClick}>以此号码为对方号码</Item>
             <Item onClick={onClick}>查看两号码的相互通话详单</Item>
             <Item onClick={onClick}>两号码进行碰撞</Item>
             <Item onClick={onClick}>查询两号码碰面情况</Item>
             <Separator />
             <Item onClick={onClick}>该号码的统计报表</Item>
             <Item onClick={onClick}>查看两号码之间的统计报表</Item>
             <Item onClick={onClick}>可视化统计</Item>
             <Separator />
             <Item onClick={onClick}>查看所有本基站中的通话</Item>
             <Item onClick={onClick}>定位选中的基站</Item>
             <Item onClick={onClick}>所有当天本基站中的通话</Item>
             <Item onClick={onClick}>当天在该LAC上的所有通话</Item>
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
        )
    };
}
