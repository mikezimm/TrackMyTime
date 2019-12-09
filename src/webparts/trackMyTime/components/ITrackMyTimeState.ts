
import { ITrackMyTimeProps } from './ITrackMyTimeProps';

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
  duration: any; //Number

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

  projects: IProjectInfo;

  projectMasterPriorityChoice: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriorityChoice: string; //Use to determine what projects float to top.... your most recent?  last day?

  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderValue: number; //incriment of time slider

  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.
  lastEntry?: any;  //Should be a time entry
  elapsedTime?: any;  //Elapsed Time since last entry

  recentEntries: ITimeEntry[]; //List of recent entries

}


