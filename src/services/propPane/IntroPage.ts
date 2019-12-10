import {
  IPropertyPanePage,
  PropertyPaneLabel,
  IPropertyPaneLabelProps,
  PropertyPaneHorizontalRule,
  PropertyPaneTextField, IPropertyPaneTextFieldProps,
  PropertyPaneLink, IPropertyPaneLinkProps,
  PropertyPaneDropdown, IPropertyPaneDropdownProps,
  IPropertyPaneDropdownOption,PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'TrackMyTimeWebPartStrings';
import { imageOptionsGroup } from './index';
import { pivotOptionsGroup} from './index';


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
  scenario: string // pre-set through json defaults... used to determine what is available by default in web part

    */

export class IntroPage {
  public getPropertyPanePage(webPartProps): IPropertyPanePage {
    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: strings.PropertyPaneAbout
      },
      groups: [
        {
          groupFields: [
            PropertyPaneLabel('About Text', {
              text: 'This webpart gets tile defintion from a list in SharePoint :).'
            }),

            PropertyPaneLink('About Link' , {
              text: 'Github Repo:  Pivot-Tiles',
              href: 'https://github.com/mikezimm/TrackMyTime',
            }),
          ]
        },


        { groupName: 'Basic list info',
        groupFields: [
          PropertyPaneTextField('projectListWeb', {
              label: strings.propLabelProjectListWeb
          }),
          PropertyPaneTextField('projectListTitle', {
            label: strings.propLabelProjectListTitle
          }),
          PropertyPaneTextField('timeTrackListWeb', {
            label: strings.propLabelTimeTrackListWeb
          }),
          PropertyPaneTextField('timeTrackListTitle', {
            label: strings.propLabelTimeTrackListTitle
          }),
        ]}, // this group
/* */
        { groupName: 'Pivot Styles',
          groupFields: [
            PropertyPaneToggle('advancedPivotStyles', {
              label: '',
              offText: strings.propLabelToggleOffText,
              onText: strings.propLabelToggleOnText,
            }),
          ]}, // this group

        { isCollapsed: !webPartProps.advancedPivotStyles,
          groupFields: [
            PropertyPaneDropdown('setPivSize', <IPropertyPaneDropdownProps>{
              label: strings.setPivSize,
              options: pivotOptionsGroup.pivSizeChoices,
            }),
            PropertyPaneDropdown('setPivFormat', <IPropertyPaneDropdownProps>{
              label: strings.setPivFormat,
              options: pivotOptionsGroup.pivFormatChoices,
            }),
            PropertyPaneDropdown('setPivOptions', <IPropertyPaneDropdownProps>{
              label: strings.setPivOptions,
              options: pivotOptionsGroup.pivOptionsChoices,
              disabled: true,
            }),
          ]}, // this group

        ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();