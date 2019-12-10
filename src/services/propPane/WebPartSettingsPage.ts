import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneToggle
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'TrackMyTimeWebPartStrings';
  import { pivotOptionsGroup, imageOptionsGroup } from './index';
  
  export class WebPartSettingsPage {

/*

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;

  // 2 - Source and destination list information
  projectListTitle: string;
  projectListWeb: string;

  timeTrackListTitle: string;
  timeTrackListWeb: string;

  // 3 - General how accurate do you want this to be
  roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  forceCurrentUser: boolean; //false allows you to put in data for someone else
  confirmPrompt: boolean;  //Make user press confirm

  // 4 -Project options
  allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???

  // 6 - User Feedback:
  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  // Target will be used to provide user feedback on how much/well they are tracking time
  showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
  showTargetToggle: boolean; //Maybe give user option to toggle between day/week
  targetType:  string; //Day, Week, Both?
  targetValue: number; //Hours for typical day/week

  // 7 - Slider Options
  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;

    */


    public getPropertyPanePage(webPartProps): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [

          /** 3 - General how accurate do you want this to be
            roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
            forceCurrentUser: boolean; //false allows you to put in data for someone else
            confirmPrompt: boolean;  //Make user press confirm
          */
          { groupName: 'Accuracy',
          groupFields: [
            
            PropertyPaneDropdown('roundTime', <IPropertyPaneDropdownProps>{
              label: strings.propLabelRoundTime,
              options: imageOptionsGroup.hoverZoomChoices,
            }),

            PropertyPaneToggle('forceCurrentUser', {
              label: strings.propLabelForceCurrentUser,
              offText: strings.propLabelToggleTextOff,
              onText: strings.propLabelToggleTextOn,
            }),

            PropertyPaneToggle('confirmPrompt', {
              label: strings.propLabelConfirmPrompt,
              offText: strings.propLabelToggleTextOff,
              onText: strings.propLabelToggleTextOn
            }),

          ]}, // this group
       
          /** 4 -Project options
            allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
            projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
            projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
          */

          { groupName: 'Project options',
            isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
            groupFields: [
              PropertyPaneToggle('allowUserProjects', {
                label: strings.propLabelConfirmPrompt,
                offText: strings.propLabelToggleTextOff,
                onText: strings.propLabelToggleTextOn
              }),

              PropertyPaneDropdown('projectMasterPriority', <IPropertyPaneDropdownProps>{
                label: strings.propLabelRoundTime,
                options: imageOptionsGroup.hoverZoomChoices,
              }),

              PropertyPaneDropdown('projectUserPriority', <IPropertyPaneDropdownProps>{
                label: strings.propLabelRoundTime,
                options: imageOptionsGroup.hoverZoomChoices,
              }),              

            ]}, // this group

          /** 5 - UI Defaults
            defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
            defaultTimePicker: string; //SinceLast, Slider, Manual???
          */

          { groupName: 'UI Defaults',
           isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
          groupFields: [

            PropertyPaneDropdown('defaultProjectPicker', <IPropertyPaneDropdownProps>{
              label: strings.propLabelRoundTime,
              options: imageOptionsGroup.hoverZoomChoices,
            }),

            PropertyPaneDropdown('defaultTimePicker', <IPropertyPaneDropdownProps>{
              label: strings.propLabelRoundTime,
              options: imageOptionsGroup.hoverZoomChoices,
            }),              

          ]}, // this group


          /** 6 - User Feedback:
            showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

            // Target will be used to provide user feedback on how much/well they are tracking time
            showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
            showTargetToggle: boolean; //Maybe give user option to toggle between day/week
            targetType:  string; //Day, Week, Both?
            targetValue: number; //Hours for typical day/week
          */

         { groupName: 'User Feedback',
          isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
         groupFields: [

            PropertyPaneToggle('showElapsedTimeSinceLast', {
              label: strings.propLabelShowElapsedTimeSinceLast,
              offText: strings.propLabelToggleTextOff,
              onText: strings.propLabelToggleTextOn
            }),
                        
            PropertyPaneToggle('showTargetToggle', {
              label: strings.propLabelShowTargetToggle,
              offText: strings.propLabelToggleTextOff,
              onText: strings.propLabelToggleTextOn
            }),

            PropertyPaneToggle('showTargetBar', {
              label: strings.propLabelShowTargetBar,
              offText: strings.propLabelToggleTextOff,
              onText: strings.propLabelToggleTextOn
            }),

            PropertyPaneDropdown('targetType', <IPropertyPaneDropdownProps>{
              label: strings.propLabelRoundTime,
              options: imageOptionsGroup.hoverZoomChoices,
            }),

            PropertyPaneDropdown('targetValue', <IPropertyPaneDropdownProps>{
              label: strings.propLabelRoundTime,
              options: imageOptionsGroup.hoverZoomChoices,
            }),              

         ]}, // this group


          /** 7 - Slider Options
            showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
            timeSliderInc: number; //incriment of time slider
            timeSliderMax: number; //max of time slider
          */

         { groupName: 'Slider Options',
          isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
         groupFields: [

          PropertyPaneToggle('showTimeSlider', {
            label: strings.propLabelShowTimeSlider,
            offText: strings.propLabelToggleTextOff,
            onText: strings.propLabelToggleTextOn
          }),

          PropertyPaneSlider('timeSliderInc', {
            label: strings.propLabelTimeSliderInc,
            min: 5,
            max: 60,
            step: 5,
          }),

          PropertyPaneSlider('timeSliderMax', {
            label: strings.propLabelTimeSliderMax,
            min: 1,
            max: 10,
            step: 1,
          }),
            
         ]}, // this group

      ]}; // Groups 
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();