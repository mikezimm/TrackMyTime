

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTimeState, ISaveEntry} from '../ITrackMyTimeState';

import { ITrackMyTimeProps } from '../ITrackMyTimeProps';
import * as strings from 'TrackMyTimeWebPartStrings';

import ButtonCompound from '../createButtons/ICreateButtons';
import { IButtonProps,ISingleButtonProps,IButtonState } from "../createButtons/ICreateButtons";
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import { TextField, MaskedTextField } from "office-ui-fabric-react";
import styles from '../TrackMyTime.module.scss';

import { IFieldDef } from './fieldDefinitions'

import {
    Button,
    ButtonType
  } from 'office-ui-fabric-react';


 export function createBasicTextField(field: IFieldDef, currentValue, updateField){
   // it is possible to have an option to hide labels in lue of placeholder text for more compressed look
   let placeHolder = 'Enter ' + field.title;
   placeHolder = '';
    let textField = 
    <TextField
      className={ styles.textField }
      defaultValue={ currentValue ? currentValue : "" }
      label={field.title}
      disabled={field.disabled}
      placeholder={ placeHolder }
      autoComplete='off'
      onChanged={ updateField }
      required={field.required}
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


  export function createSmartTextBox(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, field: IFieldDef, onChanged){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return ""; }
    let thisField = parentState.formEntry[field.name]['title'];
    let currentValue = parentState.formEntry[field.name]['value'];
    // 2019-12-22:  Removed this line when I created fieldDefs... but don't yet have state for that in the new object
    //let required = parentState.formEntry[field.name]['required'];
    let mask = parentState.formEntry[field.name]['mask'];
    if (mask !== '') {
      return createMaskedTextField(thisField, mask, currentValue, onChanged);
    } else {
      return createBasicTextField(field, currentValue, onChanged);
    }
    
  }

  export function createThisField(parentProps: ITrackMyTimeProps, parentState : ITrackMyTimeState, field: IFieldDef, onChanged){

    //Return nothing if user has not been loaded because that is when formEntry gets created.
    if ( parentState.userLoadStatus !== "Complete" ) { return ""; }


    if (field.type === "Smart") {
      return createSmartTextBox(parentProps, parentState, field, onChanged );

    } else if ( field.type === "Text" ) {
      // 2019-12-22:  Removed this line when I created fieldDefs... but don't yet have state for that in the new object
      //let required = currentValue === "*" ? true : false;
      let currentValue = parentState.formEntry[field.name];

      return createBasicTextField(field, currentValue, onChanged);

    } 

    return ;

  }