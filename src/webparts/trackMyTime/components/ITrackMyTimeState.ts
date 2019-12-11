
import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import { string } from 'prop-types';

export interface IUser {
  title: string;
  initials?: string;  //Single person column
  email?: string;  //Single person column
  id: any;
}

export interface ILink {
  description: string;
  url: string;
}

export interface IUser {
  title: string;
  initials?: string;  //Single person column
  email?: string;  //Single person column
  id: any;
}

export interface ITimeEntry {
  //Values that would come from Project item
  titleProject: string;
  category1?: string[];
  category2?: string[];
  leader?: IUser;  //Likely single person column
  team?: IUser[];  //Likely multi person column

  //Values that relate to project list item
  sourceProject?: ILink; //Link back to the source project list item.

  //Values specific to Time Entry
  user: IUser;  //Single person column
  startTime: any; //Time stamp
  endTime: any; // Time stamp
  duration?: any; //Number  -- May not be needed based on current testing with start and end dates.

  //Saves what entry option was used... Since Last, Slider, Manual
  entryOption?: string;
  timeFromEntry?: any; //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)

  //Other settings and information
  settings?: string;

}

export interface IProject {
  //Values that would come from Project item
  titleProject: string;

  category1?: string[];
  category2?: string[];
  leader?: IUser;  //Likely single person column
  team?: IUser[];  //Likely multi person column

  //This might be computed at the time page loads
  lastEntry?: any;  //Should be a time entry

  //Values that relate to project list item
  sourceProject?: ILink; //Link back to the source project list item.

}

export interface IProjects {
  projects: IProject[];
}

export interface IProjectInfo {

  master: IProjects[]; //Projects coming from the Projects list
  user: IProjects[]; //Projects coming from TrackMyTime list
  masterPriority: IProjects[]; //Projects visible based on settings
  userPriority: IProjects[]; //Projects visible based on settings
  current: IProjects[]; //Makes up the choices
  
}

export interface ITrackMyTimeState {
  description: string;

  projects?: IProjectInfo;

  // 1 - Analytics options

  // 2 - Source and destination list information

  // 3 - General how accurate do you want this to be

  // 4 -Project options

  // 5 - UI Defaults
  currentProjectPicker: string; //User selection of defaultProjectPicker:  Recent, Your Projects, All Projects etc...
  currentTimePicker: string; //User selection of :defaultTimePicker  SinceLast, Slider, Manual???
  locationChoice: string;  //semi-colon separated choices

  // 6 - User Feedback:
  showElapsedTimeSinceLast?: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.
  lastEntry?: IProject;  //Should be a time entry
  elapsedTime?: any;  //Elapsed Time since last entry

  recentEntries?: ITimeEntry[]; //List of recent entries

  // 7 - Slider Options
  timeSliderValue: number; //incriment of time slider

  //These maybe other choices end user can use to find projects?
  projectMasterPriorityChoice?: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriorityChoice?: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 9 - Other web part options



}


