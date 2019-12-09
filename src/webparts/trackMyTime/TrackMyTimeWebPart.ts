import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TrackMyTimeWebPartStrings';
import TrackMyTime from './components/TrackMyTime';
import { ITrackMyTimeProps } from './components/ITrackMyTimeProps';

export interface ITrackMyTimeWebPartProps {
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

}

export default class TrackMyTimeWebPart extends BaseClientSideWebPart<ITrackMyTimeWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITrackMyTimeProps > = React.createElement(
      TrackMyTime,
      {
        description: strings.description,

        // 1 - Analytics options  
        useListAnalytics: this.properties.useListAnalytics,
        analyticsWeb: strings.analyticsWeb,
        analyticsList: strings.analyticsList,
      
        // 2 - Source and destination list information
        projectListTitle: this.properties.projectListTitle,
        projectListWeb: this.properties.projectListWeb,
      
        timeTrackListTitle: this.properties.timeTrackListTitle,
        timeTrackListWeb: this.properties.timeTrackListWeb,
      
        // 3 - General how accurate do you want this to be
        roundTime: this.properties.roundTime, //Up 5 minutes, Down 5 minutes, No Rounding,
        forceCurrentUser: this.properties.forceCurrentUser, //false allows you to put in data for someone else
        confirmPrompt: this.properties.confirmPrompt,  //Make user press confirm
      
        // 4 -Project options
        allowUserProjects: this.properties.allowUserProjects, //Will build list of ProjectsUser based on existing data from TrackMyTime list
        projectMasterPriority: this.properties.projectMasterPriority, //Use to determine what projects float to top.... your most recent?  last day?
        projectUserPriority: this.properties.projectUserPriority, //Use to determine what projects float to top.... your most recent?  last day?
      
        // 5 - UI Defaults
        defaultProjectPicker: this.properties.defaultProjectPicker, //Recent, Your Projects, All Projects etc...
        defaultTimePicker: this.properties.defaultTimePicker, //SinceLast, Slider, Manual???
      
        // 6 - User Feedback:
        showElapsedTimeSinceLast: this.properties.showElapsedTimeSinceLast,  // Idea is that it can be like a clock showing how long it's been since your last entry.
        showTargetBar: this.properties.showTargetBar, //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
        showTargetToggle: this.properties.showTargetToggle, //Maybe give user option to toggle between day/week
        targetType:  this.properties.targetType, //Day, Week, Both?
        targetValue: this.properties.targetValue, //Hours for typical day/week
      
        // 7 - Slider Options
        showTimeSlider: this.properties.showTimeSlider, //true allows you to define end time and slider for how long you spent
        timeSliderInc: this.properties.timeSliderInc, //incriment of time slider
        timeSliderMax: this.properties.timeSliderMax, //max of time slider
      
        // 9 - Other web part options
        webPartScenario: this.properties.webPartScenario, //Choice used to create mutiple versions of the webpart.

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
