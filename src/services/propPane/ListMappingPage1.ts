import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneToggle
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'TrackMyTimeWebPartStrings';
//  import { devListMapping } from './../../webparts/pivotTiles/DevListMapping';
//  import { corpListMapping } from './../../webparts/pivotTiles/CorpListMapping';
//  import { teamListMapping } from './../../webparts/pivotTiles/TeamListMapping';

  export class ListMappingPage1 {

    public getPropertyPanePage(webPartProps): IPropertyPanePage {
        /*  Removed Header from above groups in return statement... formatting was not bold.
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },
            */

        //let theListChoices : IPropertyPaneDropdownOption[] = devListMapping.listChoices;

        if (webPartProps.scenario === "DEV"){
            //theListChoices = devListMapping.listChoices;

        } else if (webPartProps.scenario === "CORP"){
            //theListChoices = corpListMapping.listChoices;

        } else if (webPartProps.scenario === "TEAM"){
            //theListChoices = teamListMapping.listChoices;

        }
        //console.log('theListChoices: ', theListChoices);
        /*
*/


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
        return <IPropertyPanePage>        { // <page3>
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },
            groups: [
            {
                groupName: strings.PropertyPaneColumnsDescription1,
                groupFields: [

                PropertyPaneDropdown('listDefinition', <IPropertyPaneDropdownProps>{
                    label: strings.listDefinition,
                    options: theListChoices,
                }),

                PropertyPaneTextField('listTitle', {
                    label: strings.listTitle
                }),
                
                PropertyPaneToggle('getAll', {
                    label: strings.Property_getAll_Label,
                    offText: strings.Property_ShowHero_OffText,
                    onText: strings.Property_ShowHero_OnText
                  }),

                PropertyPaneTextField('colTitleText', {
                    label: strings.colTitleText
                }),
                PropertyPaneTextField('colHoverText', {
                    label: strings.colHoverText
                }),
                PropertyPaneTextField('colCategory', {
                    label: strings.colCategory
                }),
                PropertyPaneTextField('colGoToLink', {
                    label: strings.colGoToLink
                }),
                PropertyPaneTextField('colImageLink', {
                    label: strings.colImageLink
                }),
                PropertyPaneTextField('colSort', {
                    label: strings.colSort
                }),

              ]
            }
          ]
        }; // <page3>
      } // getPropertyPanePage()
  }


  export let listMappingPage1 = new ListMappingPage1();

  /*
    export class ListMappingPage1 {

    public getPropertyPanePage(webPartProps): IPropertyPanePage {
        /*  Removed Header from above groups in return statement... formatting was not bold.
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },


           let theListChoices : IPropertyPaneDropdownOption[] = devListMapping.listChoices;

           if (webPartProps.scenario === "DEV"){
               theListChoices = devListMapping.listChoices;
   
           } else if (webPartProps.scenario === "CORP"){
               theListChoices = corpListMapping.listChoices;
   
           } else if (webPartProps.scenario === "TEAM"){
               theListChoices = teamListMapping.listChoices;
           }
           //console.log('theListChoices: ', theListChoices);
           /*

           return <IPropertyPanePage>        { // <page3>
               header: {
                   description: strings.PropertyPaneColumnsDescription1
               },
               groups: [
               {
                   groupName: strings.PropertyPaneColumnsDescription1,
                   groupFields: [
   
                   PropertyPaneDropdown('listDefinition', <IPropertyPaneDropdownProps>{
                       label: strings.listDefinition,
                       options: theListChoices,
                   }),
   
                   PropertyPaneTextField('listTitle', {
                       label: strings.listTitle
                   }),
                   
                   PropertyPaneToggle('getAll', {
                       label: strings.Property_getAll_Label,
                       offText: strings.Property_ShowHero_OffText,
                       onText: strings.Property_ShowHero_OnText
                     }),
   
                   PropertyPaneTextField('colTitleText', {
                       label: strings.colTitleText
                   }),
                   PropertyPaneTextField('colHoverText', {
                       label: strings.colHoverText
                   }),
                   PropertyPaneTextField('colCategory', {
                       label: strings.colCategory
                   }),
                   PropertyPaneTextField('colGoToLink', {
                       label: strings.colGoToLink
                   }),
                   PropertyPaneTextField('colImageLink', {
                       label: strings.colImageLink
                   }),
                   PropertyPaneTextField('colSort', {
                       label: strings.colSort
                   }),
   
                 ]
               }
             ]
           }; // <page3>
         } // getPropertyPanePage()
     }
    */