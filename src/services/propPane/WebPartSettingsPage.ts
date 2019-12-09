import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneToggle
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';
  import { pivotOptionsGroup, imageOptionsGroup } from './index';
  
  export class WebPartSettingsPage {

    private setSize: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {        index: 0,        key: '100',        text: '100px high'      },
      {        index: 1,        key: '150',        text: '150px high'      },
      {        index: 2,        key: '300',        text: '300px high'      },
      {        index: 4,        key: 'Card',        text: 'Document Card'      },
      {        index: 5,        key: 'List',        text: 'List View'      },      
      {        index: 3,        key: 'Custom',        text: 'Custom'      },      
    ];

    private setRatio: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
      {        index: 0,        key: '1xy',        text: 'Square Tile'      },
      {        index: 1,        key: '4x1',        text: 'Fit 4 Tiles wide'      },
      {        index: 2,        key: '3x1',        text: 'Fit 3 Tiles wide'      },
      {        index: 3,        key: '2x1',        text: 'Fit 2 Tiles wide'      },
      {        index: 4,        key: '1x1',        text: 'Fit 1 Tiles wide'      }
    ];




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


    public getPropertyPanePage(webPartProps): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {
          description: strings.PropertyPaneMainDescription
        },
        groups: [

          { groupName: 'Image settings',
          groupFields: [
            
            PropertyPaneDropdown('onHoverZoom', <IPropertyPaneDropdownProps>{
              label: strings.onHoverZoom,
              options: imageOptionsGroup.hoverZoomChoices,
            }),

            PropertyPaneDropdown('onHoverEffect', <IPropertyPaneDropdownProps>{
              label: strings.onHoverEffect,
              options: imageOptionsGroup.hoverEffectChoices,
            }),
            

            PropertyPaneDropdown('setSize', <IPropertyPaneDropdownProps>{
              label: strings.setSize,
              options: this.setSize,
            }),

          ]}, // this group

          // Group of props for standard sizes
          { isCollapsed: webPartProps.setSize === "Custom" ? true : false ,
          groupFields: [
            
            PropertyPaneDropdown('setRatio', <IPropertyPaneDropdownProps>{
              label: strings.setRatio,
              options: this.setRatio,
            }),
            PropertyPaneDropdown('setImgFit', <IPropertyPaneDropdownProps>{
              label: strings.setImgFit,
              options: imageOptionsGroup.imgFitChoices,
            }),
            PropertyPaneDropdown('setImgCover', <IPropertyPaneDropdownProps>{
              label: strings.setImgCover,
              options: imageOptionsGroup.imgCoverChoices,
            }),

          ]}, // this group
          
          // Group of props for standard sizes
          { isCollapsed: webPartProps.setSize === "Custom" ? false : true ,
            groupFields: [

              PropertyPaneSlider('imageWidth', {
                label: strings.Property_ImageWidth_Label,
                min: 50,
                max: 300,
                step: 25,
              }),
              PropertyPaneSlider('imageHeight', {
                label: strings.Property_ImageHeight_Label,
                min: 50,
                max: 300,
                step: 25,
              }),
              PropertyPaneSlider('textPadding', {
                label: strings.Property_TextPadding_Label,
                min: 2,
                max: 20
              }),

            ]}, // this group

            { groupName: 'Hero Panel',
            groupFields: [
              
              PropertyPaneToggle('showHero', {
                label: strings.Property_ShowHero_Label,
                offText: strings.Property_ShowHero_OffText,
                onText: strings.Property_ShowHero_OnText
              }),
  
            ]}, // this group

            { 
            isCollapsed: !webPartProps.showHero,
            groupFields: [
              PropertyPaneLabel('HeroPanelSettings', {
                text: 'Hero Panel Settings'
              }),

              PropertyPaneDropdown('heroType', <IPropertyPaneDropdownProps>{
                label: strings.heroChoices,
                options: imageOptionsGroup.heroChoices,
              }),
              
              PropertyPaneTextField('heroCategory', {
                label: strings.heroCategory
              }),

              PropertyPaneSlider('heroRatio', {
                label: strings.heroRatio,
                min: 3,
                max: 24,
                step: 1,
              }),
              
              PropertyPaneDropdown('setHeroFit', <IPropertyPaneDropdownProps>{
                label: strings.setImgFit,
                options: imageOptionsGroup.imgFitChoices,
              }),

              PropertyPaneDropdown('setHeroCover', <IPropertyPaneDropdownProps>{
                label: strings.setImgCover,
                options: imageOptionsGroup.imgCoverChoices,
              }),

            ]}, // this group

          ]}; // Groups
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();