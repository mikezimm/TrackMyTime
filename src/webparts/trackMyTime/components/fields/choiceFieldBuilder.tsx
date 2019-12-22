

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTimeState, ISaveEntry} from '../ITrackMyTimeState';

import { ITrackMyTimeProps } from '../ITrackMyTimeProps';
import * as strings from 'TrackMyTimeWebPartStrings';

import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import styles from '../TrackMyTime.module.scss';

import { IFieldDef } from './fieldDefinitions'

export function creatEntryTypeChoices(parentProps:ITrackMyTimeProps , parentState: ITrackMyTimeState){

  let options : IChoiceGroupOption[] = [];

  options.push(  {key: 'sinceLastInput', text: 'Since last' });
  options.push(  {key: 'sliderInput', text: 'Slider' });
  options.push(  {key: 'manualInput', text: 'Manual' });


  return (
    <ChoiceGroup
      className="defaultChoiceGroup"
      defaultSelectedKey="B"
      options={options}
      onChange={_onChange}
      label="Pick one"
      required={true}
    />
  );
};

function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}