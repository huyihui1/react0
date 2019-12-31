import React, {Component, Fragment} from 'react';
import {Input, Radio, Button} from '@alifd/next';
import IceContainer from '@icedesign/container';
import {FormBinderWrapper, FormBinder, FormError} from '@icedesign/form-binder';

import DailyCount from './DailyCount';
import HourDist from './HourDistAndWeekDist';
import TableAndMapDemo from './TableAndMapDemo';
import DurationAndCalls from './DurationAndCalls';
import InCommons from './InCommons';
import MutualTravel from './MutualTravel'
import MeetanalyzeMap from './MeetanalyzeMap'

import '../mutual.css';

class MutualBody extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        mutual_call: "0",
        loc_rule: 'same_lac'
      },
    }
    this.fetchMeetData = this.fetchMeetData.bind(this);
  }

  onRef = (ref) => {
    this.child = ref
  }

  fetchMeetData() {
    this.child.fetchData();
  }

  render() {
    return (
      <IceContainer>
        <div className="mutual-box">
          <div className="mutual-item">
            <div className="mutual-item-6" style={{height: '250px'}}>
              <DailyCount/>
            </div>
            <div className="mutual-item-6" style={{marginTop: '10px', height: '250px'}}>
              <DurationAndCalls/>
            </div>
            <div className="mutual-item-4" style={{height: '510px', position: 'absolute', right: 0, top: 0}}>
              <HourDist/>
            </div>
          </div>
          {/*<div className="mutual-item">*/}
            {/*<div className="mutual-item-10" style={{height: '500px', textAlign: 'left'}}>*/}
              {/*<h3 style={{*/}
                {/*fontSize: '18px',*/}
                {/*color: '#333',*/}
                {/*fontWeight: 'bold',*/}
                {/*display: 'flex',*/}
                {/*justifyContent: 'space-around',*/}
                {/*alignItems: 'center'*/}
              {/*}}>*/}
                {/*<span>*/}
                  {/*互相碰面*/}
                {/*</span>*/}
                {/*<div>*/}
                  {/*<FormBinderWrapper*/}
                    {/*ref="form"*/}
                    {/*value={this.state.values}*/}
                  {/*>*/}
                    {/*<FormBinder name="mutual_call">*/}
                      {/*<Radio.Group>*/}
                        {/*<Radio value="1">当天双方相互有通话</Radio>*/}
                        {/*<Radio value="0">当天双方不一定相互通话</Radio>*/}
                      {/*</Radio.Group>*/}
                    {/*</FormBinder>*/}
                    {/*<FormBinder name="loc_rule">*/}
                      {/*<Radio.Group style={{marginLeft: '60px'}}>*/}
                        {/*<Radio value="same_ci">相同基站号(CI)</Radio>*/}
                        {/*<Radio value="same_lac">相同位置区号(LAC)</Radio>*/}
                        {/*<Radio value="scope_ct">*/}
                          {/*相邻*/}
                          {/*<FormBinder name="radius">*/}
                            {/*<Input type="text"*/}
                                   {/*size="small"*/}
                                   {/*style={{*/}
                                     {/*width: '50px',*/}
                                     {/*margin: '0 5px',*/}
                                     {/*height: '20px',*/}
                                     {/*border: 'none',*/}
                                     {/*borderBottom: '1px solid #111',*/}
                                     {/*borderRadius: 0*/}
                                   {/*}}*/}
                            {/*/>*/}
                          {/*</FormBinder>*/}
                          {/*米基站*/}
                        {/*</Radio>*/}
                      {/*</Radio.Group>*/}
                    {/*</FormBinder>*/}
                  {/*</FormBinderWrapper>*/}
                {/*</div>*/}
                {/*<div>*/}
                  {/*<Button onClick={this.fetchMeetData}>查询</Button>*/}
                {/*</div>*/}
              {/*</h3>*/}
              {/*<div className="item-flex-10">*/}
              {/*</div>*/}
              {/*<TableAndMapDemo values={this.state.values} onRef={this.onRef}/>*/}
            {/*</div>*/}
          {/*</div>*/}
          <div className="mutual-item">
            <div className="mutual-item-10" style={{ textAlign: 'left'}}>
              <h3 style={{
                fontSize: '18px',
                color: '#333',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginBottom: 0
              }}>
                <span>
                  互相碰面
                </span>
                <div>
                  <FormBinderWrapper
                    ref="form"
                    value={this.state.values}
                  >
                    <FormBinder name="mutual_call">
                      <Radio.Group>
                        <Radio value="1">当天双方相互有通话</Radio>
                        <Radio value="0">当天双方不一定相互通话</Radio>
                      </Radio.Group>
                    </FormBinder>
                    <FormBinder name="loc_rule">
                      <Radio.Group style={{marginLeft: '60px'}}>
                        <Radio value="same_ci">相同基站号(CI)</Radio>
                        <Radio value="same_lac">相同位置区号(LAC)</Radio>
                        <Radio value="scope_ct">
                          相邻
                          <FormBinder name="radius">
                            <Input type="text"
                                   size="small"
                                   style={{
                                     width: '50px',
                                     margin: '0 5px',
                                     height: '20px',
                                     border: 'none',
                                     borderBottom: '1px solid #111',
                                     borderRadius: 0
                                   }}
                            />
                          </FormBinder>
                          米基站
                        </Radio>
                      </Radio.Group>
                    </FormBinder>
                  </FormBinderWrapper>
                </div>
                <div>
                  <Button onClick={this.fetchMeetData}>查询</Button>
                </div>
              </h3>
              <MeetanalyzeMap values={this.state.values} onRef={this.onRef} />
            </div>
          </div>
          <div className="mutual-item">
            <div className="mutual-item-10" style={{ textAlign: 'center' }}>
              <InCommons />
            </div>
          </div>
          <div className="mutual-item">
            <div className="mutual-item-10" style={{minHeight: '500px', textAlign: 'left'}}>
              <MutualTravel/>
            </div>
          </div>
        </div>
      </IceContainer>
    );
  }
}

export default MutualBody;
