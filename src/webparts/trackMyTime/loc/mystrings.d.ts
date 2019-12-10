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
  propLabelProjectListTitle: string;
  propLabelProjectListWeb: string;

  propLabelTimeTrackListTitle: string;
  propLabelTimeTrackListWeb: string;

  // 3 - General how accurate do you want this to be
  propLabelRoundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  propLabelForceCurrentUser: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  propLabelConfirmPrompt: string; //Up 5 minutes, Down 5 minutes, No Rounding;

  // 4 -Project options
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?

  // 5 - UI Defaults
  propLabelDefaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  propLabelDefaultTimePicker: string; //SinceLast, Slider, Manual???

  // 6 - User Feedback:

  propLabelShowElapsedTimeSinceLast:  string; //Day, Week, Both?
  propLabelShowTargetBar:  string; //Day, Week, Both?
  propLabelShowTargetToggle:  string; //Day, Week, Both?
  propLabelTargetValue:  string; //Day, Week, Both?
  propLabelTargetType:  string; //Day, Week, Both?

  // 7 - Slider Options

  propLabelShowTimeSlider: string; // "Show Time Slider",
  propLabelTimeSliderInc: string; // "Incriment of time slider",
  propLabelTimeSliderMax: string; // "Max of time slider",

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.
  propLabelToggleTextOff: string;
  propLabelToggleTextOn: string;
  
  propLabelPivSize: string;
  propLabelPivFormat: string;
  propLabelPivOptions: string;

}

declare module 'TrackMyTimeWebPartStrings' {
  const strings: ITrackMyTimeWebPartStrings;
  export = strings;
}
