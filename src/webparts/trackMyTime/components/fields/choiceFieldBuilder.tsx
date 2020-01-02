

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTimeState, ISaveEntry} from '../ITrackMyTimeState';

import { ITrackMyTimeProps } from '../ITrackMyTimeProps';
import * as strings from 'TrackMyTimeWebPartStrings';

import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import styles from '../TrackMyTime.module.scss';

import { IFieldDef } from './fieldDefinitions'

import  choiceStyles from './choice.module.scss';

/*
Entry Type Choices need to match these:  \src\services\propPane\WebPartSettingsPage.ts

    public defaultTimePickerChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'sinceLast', text: "Since last entry"  },
        {   index: 1,   key: 'slider', text: "Slider - use Now as start or end"  },
        {   index: 2,   key: 'manual', text: "Manual enter start and end"  },
    ];

*/

export function creatEntryTypeChoices(parentProps:ITrackMyTimeProps , parentState: ITrackMyTimeState, _onChange){

  let options : IChoiceGroupOption[] = [];
  let choiceSpacer = '\u00A0\u00A0';
  let spacer4x = choiceSpacer + choiceSpacer + choiceSpacer + choiceSpacer;
  options.push(  {key: 'sinceLast', text: 'Since last' + spacer4x });
  options.push(  {key: 'slider', text: 'Slider' + spacer4x });
  options.push(  {key: 'manual', text: 'Manual' + choiceSpacer });

  return (
    
    <ChoiceGroup
      // className = "inlineflex" //This didn't do anything
      //className="defaultChoiceGroup" //This came with the example but does not seem to do anything
      //https://github.com/OfficeDev/office-ui-fabric-react/issues/8079#issuecomment-479136073
      styles={{ flexContainer: { display: "flex" , paddingLeft: 30} }}
      selectedKey={ parentState.currentTimePicker }
      options={options}
      onChange={_onChange}
      label="Time entry mode"
      required={true}
    />
  );
};

/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/