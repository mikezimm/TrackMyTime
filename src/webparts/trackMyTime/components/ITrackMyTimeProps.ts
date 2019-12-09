import { string } from "prop-types";



export interface ITrackMyTimeProps {
  description: string;

  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;

  roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
  forceCurrentUser: boolean; //false allows you to put in data for someone else

  defaultStart: string; //Last End Time, or ???
  defaultEnd: string; //Now

  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  confirmPrompt: boolean;  //Make user press confirm

  showTimesBeforeSave: boolean; //Shows start and end time before saving.
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?

  projectListTitle: string;
  projectListWeb: string;

  timeTrackListTitle: string;
  timeTrackListWeb: string;

}
