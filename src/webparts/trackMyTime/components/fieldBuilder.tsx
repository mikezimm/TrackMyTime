

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTimeState, ISaveEntry} from './ITrackMyTimeState';

import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import * as strings from 'TrackMyTimeWebPartStrings';

import ButtonCompound from './createButtons/ICreateButtons';
import { IButtonProps,ISingleButtonProps,IButtonState } from "./createButtons/ICreateButtons";
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import { TextField, MaskedTextField } from "office-ui-fabric-react";
import styles from './TrackMyTime.module.scss';

import {
    Button,
    ButtonType
  } from 'office-ui-fabric-react';


 export function createBasicTextField(required, thisField, currentValue, updateField){
    let textField = 
    <TextField
      className={ styles.textField }
      defaultValue={ currentValue ? currentValue : "" }
      label={thisField}
      placeholder={ 'Enter ' + thisField }
      autoComplete='off'
      onChanged={ updateField }
      required={required}
    />;
    
    return textField;
  }

  /**
   * An object defining the format characters and corresponding regexp values.
   * Default format characters: \{
   *  '9': /[0-9]/,
   *  'a': /[a-zA-Z]/,
   *  '*': /[a-zA-Z0-9]/
   * \}
   */

  export function createMaskedTextField(thisField, mask, currentValue, onChanged){
    let label = thisField + " (" + mask + ")";
    let textField = 
    <MaskedTextField 
      defaultValue={ currentValue }
      className={ styles.textField }
      label={ label }
      mask={ mask }
      maskChar="?"
      onChanged={ onChanged }
      autoComplete='off'
     />;
    
    return textField;
  }


export function createTextField(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, name: string, title: string, onChanged){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return ""; }
    let thisField = title;
    //console.log('name',name)
    let currentValue = parentState.formEntry[name];
    let required = currentValue === "*" ? true : false;
    return createBasicTextField(required, thisField, currentValue, onChanged);

  }

  export function createSmartTextBox(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, smartFieldName: string, onChanged){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return ""; }
    let thisField = parentState.formEntry[smartFieldName]['title'];
    let currentValue = parentState.formEntry[smartFieldName]['value'];
    let required = parentState.formEntry[smartFieldName]['required'];
    let mask = parentState.formEntry[smartFieldName]['mask'];
    if (mask !== '') {
      return createMaskedTextField(thisField, mask, currentValue, onChanged);
    } else {
      return createBasicTextField(required, thisField, currentValue, onChanged);
    }

  }