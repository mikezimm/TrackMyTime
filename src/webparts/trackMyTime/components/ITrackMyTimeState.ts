
import { ITrackMyTimeProps, IProject, IProjects, ITimeEntry } from './components/ITrackMyTimeProps';

export interface ITrackMyTimeState {
  description: string;

  projectsMaster: IProjects[]; //Projects coming from the Projects list
  projectsUser: IProjects[]; //Projects coming from TrackMyTime list
  projectsMasterPriority: IProjects[]; //Projects visible based on settings
  projectsUserPriority: IProjects[]; //Projects visible based on settings
  projectsCurrent: IProjects[]; //Makes up the choices

  projectMasterPriorityChoice: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriorityChoice: string; //Use to determine what projects float to top.... your most recent?  last day?

  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderValue: number; //incriment of time slider

  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.
  lastEntry?: any;  //Should be a time entry
  elapsedTime?: any;  //Elapsed Time since last entry

  recentEntries: ITimeEntry[]; //List of recent entries

}


