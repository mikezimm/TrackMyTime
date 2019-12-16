
import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import { string } from 'prop-types';

export interface theTime {
  now: Date;
  theTime : string;
  milliseconds : number;
}

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
  id?: any; //Item ID on list
  editLink? : ILink; //Link to view/edit item link
  titleProject: string;
  comments?: ISmartText;
  category1?: string[];
  category2?: string[];
  leader?: IUser;  //Likely single person column
  team?: IUser[];  //Likely multi person column
  leaderId?: number;
  teamIds?: number[];

  filterFlags?: string[]; // what flags does this match?  yourRecent, allRecent etc...

  projectID1?: ISmartText;  //Example Project # - look for strings starting with * and ?
  projectID2?: ISmartText;  //Example Cost Center # - look for strings starting with * and ?

  //Values that relate to project list item
  sourceProject?: ILink; //Link back to the source project list item.
  activity?: ILink; //Link to the activity you worked on
  ccList?: ILink; //Link to CC List to copy item
  ccEmail?: string; //Email to CC List to copy item 
  
  //Values specific to Time Entry
  user: IUser;  //Single person column
  userId: number;
  startTime: any; //Time stamp
  endTime: any; // Time stamp
  duration?: any; //Number  -- May not be needed based on current testing with start and end dates.

  //Saves what entry option was used... Since Last, Slider, Manual
  entryType?: string;
  deltaT?: any; //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)
  timeEntryTBD1?: string;
  timeEntryTBD2?: string;
  timeEntryTBD3?: string;  

  //Other settings and information
  location?: string; // Location
  settings?: string;

  created?: Date;
  modified?: Date;
  createdBy?: Number;
  modifiedBy?: Number;

}

export interface ISmartText {
  value: string;
  required: boolean;
  default: string;
  defaultIsPrefix: boolean;
  prefix?: string;
}

export interface IProjectTarget {
  value: string; //value from field - ; separated options which could be parsed
  daily?: number; //Maybe have function see if something like daily=4 means 4 hours per day?
  weekly?: number; //Maybe have function see if something like weekly=8 means 8 hours per week?
  total?: number; //Maybe have function see if something like total=40 means 40 hours total?
  dailyStatus?: boolean;
  weeklyStatus?: boolean;
  totalStatus?: boolean;
}

export interface IProject {
  //Values that would come from Project item
  projectType?: string; //master or user
  id?: any; //Item ID on list
  editLink? : ILink; //Link to view/edit item link
  titleProject?: string;
  comments?: ISmartText; // syntax similar to ProjID?
  active?: boolean;  //Used to indicate inactive projects
  everyone?: boolean; //Used to designate this option should be available to everyone.
  sort?: number; //Used to prioritize in choices.... ones with number go first in order, followed by empty
  key?: string;
  category1?: string[];
  category2?: string[];
  leader?: IUser;  //Likely single person column
  team?: IUser[];  //Likely multi person column
  leaderId?: number;
  teamIds?: number[];

  filterFlags?: string[]; // what flags does this match?  yourRecent, allRecent etc...

  projectID1?: ISmartText;  //Example Project # - look for strings starting with * and ?
  projectID2?: ISmartText;  //Example Cost Center # - look for strings starting with * and ?

  timeTarget?: IProjectTarget;

  //This might be computed at the time page loads
  lastEntry?: any;  //Should be a time entry

  //Values that relate to project list item
  sourceProject?: ILink; //Link back to the source project list item.
  ccList?: ILink; //Link to CC List to copy item
  ccEmail?: string; //Email to CC List to copy item 

  created?: Date;
  modified?: Date;
  createdBy?: Number;
  modifiedBy?: Number;

}

export interface IProjects {
  projects: IProject[];
}

export interface IProjectInfo {

  all: IProject[];
  master: IProject[]; //Projects coming from the Projects list
  masterKeys: string[];
  user: IProject[]; //Projects coming from TrackMyTime list
  userKeys: string[],
  masterPriority: IProject[]; //Projects visible based on settings
  userPriority: IProject[]; //Projects visible based on settings
  current: IProject[]; //Makes up the choices
  lastFiltered: IProject[];
  lastProject: IProject[];
  newFiltered: IProject[];
  
}


export interface ITrackMyTimeState {

  projects?: IProjectInfo;

  // 1 - Analytics options
  endTime?: theTime;

  // 2 - Source and destination list information
  projectListURL?: string; //Get from list item
  timeTrackerListURL?: string; //Get from list item

  projectListName: string;  // Static Name of list (for URL) - used for links and determined by first returned item
  timeTrackListName: string;  // Static Name of list (for URL) - used for links and determined by first returned item

  // 3 - General how accurate do you want this to be

  // 4 -Project options
  pivtTitles?:string[];
  filteredCategory?: string;
  pivotDefSelKey?: string;
  onlyActiveProjects?: boolean, //Only read in active projects.

  userCounts?: any;  // user based (from trackTimeList) projects that are assigned to current user.
  projectCounts?: any;  // project based (from trackTimeList) projects that are assigned to current user.
  allCounts?: any;

  projectType?:boolean; //Projects = 0 History = 1

  // 5 - UI Defaults
  currentProjectPicker: string; //User selection of defaultProjectPicker:  Recent, Your Projects, All Projects etc...
  currentTimePicker: string; //User selection of :defaultTimePicker  SinceLast, Slider, Manual???
  locationChoice: string;  //semi-colon separated choices

  // 6 - User Feedback:
  showElapsedTimeSinceLast?: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.
  lastEntry?: ITimeEntry;  //Should be a time entry
  elapsedTime?: any;  //Elapsed Time since last entry

  allEntries?: ITimeEntry[]; //List of all entries
  filteredEntries?: ITimeEntry[]; //List of recent entries

  // 7 - Slider Options
  timeSliderValue: number; //incriment of time slider

  //These maybe other choices end user can use to find projects?
  projectMasterPriorityChoice?: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriorityChoice?: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 9 - Other web part options


  loadStatus?: string;

  projectsLoadStatus?: string;
  projectsLoadError?: string;
  projectsListError: boolean;
  projectsItemsError: boolean;

  timeTrackerLoadStatus?: string;
  timeTrackerLoadError?: string;
  timeTrackerListError: boolean;
  timeTrackerItemsError: boolean;

  showTips?: string;
  loadError?: string;

  listError?: boolean;
  itemsError?: boolean;

  searchType?: string;
  searchShow?: boolean;
  searchCount?: number;
  searchWhere?: string;


}


