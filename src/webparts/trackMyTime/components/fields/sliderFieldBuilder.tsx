

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTimeState, ISaveEntry} from '../ITrackMyTimeState';

import { ITrackMyTimeProps } from '../ITrackMyTimeProps';
import * as strings from 'TrackMyTimeWebPartStrings';

import { Slider, ISliderProps } from 'office-ui-fabric-react/lib/Slider';

import styles from '../TrackMyTime.module.scss';


export function createSlider(parentProps:ITrackMyTimeProps , parentState: ITrackMyTimeState, _onChange){

  if ( parentState.currentTimePicker !== 'slider') { return ""; }
  return (
    <div style={{minWidth: 400, }}>
      <Slider 
      label={ ((parentState.timeSliderValue < 0)  ? "Start time is in the past" : "End time is Back to the future" ) }
      min={-120} 
      max={120} 
      step={5} 
      defaultValue={0} 
      valueFormat={value => `${value} mins`}
      showValue 
      originFromZero
      onChange={_onChange}
     />

    </div>

  );

};

/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/