import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';

  export class ListMappingPage2 {
    /*
            header: {
                description: strings.PropertyPaneColumnsDescription2
            },
    */

    public getPropertyPanePage(): IPropertyPanePage {
        return <IPropertyPanePage>        { // <page3>
            header: {
                description: strings.PropertyPaneColumnsDescription2
            },
             groups: [
            {
                groupName: strings.PropertyPaneColumnsDescription2,
                groupFields: [

                PropertyPaneTextField('colColor', {
                    label: strings.colColor
                }),
                PropertyPaneTextField('colSize', {
                    label: strings.colSize
                }),

                PropertyPaneTextField('colOpenBehaviour', {
                    label: strings.colOpenBehaviour
                }),

                PropertyPaneTextField('colTileStyle', {
                    label: strings.colTileStyle
                }),
              ]
            }
          ]
        }; // <page3>
      } // getPropertyPanePage()
  }


  export let listMappingPage2 = new ListMappingPage2();