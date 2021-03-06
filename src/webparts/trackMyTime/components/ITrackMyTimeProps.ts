import { string } from "prop-types";

import { PageContext } from '@microsoft/sp-page-context';

export interface ITrackMyTimeProps {
  description: string;

  // 0 - Context
  pageContext: PageContext;
  tenant: string;
  urlVars: {};

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;
  stressMultiplier?: number;

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
  projectMasterPriority: string; //Yours, Team, Others?
  projectUserPriority: string; //Yours, Team, Others?
  onlyActiveProjects: boolean; //Only read in active projects.
  projectKey: string[];
  syncProjectPivotsOnToggle; //always keep pivots in sync when toggling projects/history

  projectType:boolean; //Projects = 0 History = 1

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???
  locationChoices: string;  //semi-colon separated choices
  defaultLocation: string; //Office, Customer, Traveling, Home
  
  // 6 - User Feedback:
  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  // Target will be used to provide user feedback on how much/well they are tracking time
  showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
  showTargetToggle: boolean; //Maybe give user option to toggle between day/week
  dailyTarget: number; // Target hours per day to have tracked in a day - propLabelDailyTarget
  weeklyTarget:  number;  // Target hours per day to have tracked in a week - propLabelWeeklyTarget

  // 7 - Slider Options
  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;
  pivotTab: string;  //May not be needed because we have projectMasterPriority

}
