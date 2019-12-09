declare interface ITrackMyTimeWebPartStrings {
  PropertyPaneAbout: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;

  description: string;

  // 1 - Analytics options
  analyticsWeb: string;
  analyticsList: string;

  // 2 - Source and destination list information
  projectListTitle: string;
  projectListWeb: string;

  timeTrackListTitle: string;
  timeTrackListWeb: string;

  // 3 - General how accurate do you want this to be
  roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;

  // 4 -Project options
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???

  // 6 - User Feedback:
  targetType:  string; //Day, Week, Both?

  // 7 - Slider Options

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

}

declare module 'TrackMyTimeWebPartStrings' {
  const strings: ITrackMyTimeWebPartStrings;
  export = strings;
}
