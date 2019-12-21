

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTimeState, ISaveEntry} from './ITrackMyTimeState';

import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import * as strings from 'TrackMyTimeWebPartStrings';

import ButtonCompound from './createButtons/ICreateButtons';
import { IButtonProps,ISingleButtonProps,IButtonState } from "./createButtons/ICreateButtons";
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import { TextField } from "office-ui-fabric-react";
import styles from './TrackMyTime.module.scss';

import {
    Button,
    ButtonType
  } from 'office-ui-fabric-react';

  export function createBasicTextField(thisField, currentValue, updateField){
    let textField = 
    <TextField
      className={ styles.textField }
      defaultValue={ currentValue ? currentValue : "" }
      label={thisField}
      placeholder={ 'Enter ' + thisField }
      autoComplete='off'
      onChanged={ updateField }
    />
    
    return textField;
  }

export function createComment(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, updateField){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return "" }
    let thisField = "Comments";
    let currentValue = parentState.formEntry.comments.value;

    return createBasicTextField(thisField, currentValue, updateField);

  }

  export function createProjectTitle(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, updateField){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return "" }
    let thisField = "Project Title";
    let currentValue = parentState.formEntry.titleProject;

    return createBasicTextField(thisField, currentValue, updateField);

  }
  
  export function createProjectID1(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, updateField){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return "" }
    let thisField = "Project ID";
    let currentValue = parentState.formEntry.projectID1.value;
    
    return createBasicTextField(thisField, currentValue, updateField);

  }



  export function createProjectID2(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, updateField){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return "" }
    let thisField = "Project ID";
    let currentValue = parentState.formEntry.projectID2.value;
    
    return createBasicTextField(thisField, currentValue, updateField);

  }