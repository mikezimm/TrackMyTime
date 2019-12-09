import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneToggle
  } from '@microsoft/sp-webpart-base';
  
  import * as strings from 'PivotTilesWebPartStrings';
  import { devListMapping } from './../../webparts/pivotTiles/DevListMapping';
  import { corpListMapping } from './../../webparts/pivotTiles/CorpListMapping';
  import { teamListMapping } from './../../webparts/pivotTiles/TeamListMapping';

  export class ListMappingPage1 {

    public getPropertyPanePage(webPartProps): IPropertyPanePage {
        /*  Removed Header from above groups in return statement... formatting was not bold.
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },
            */

        let theListChoices : IPropertyPaneDropdownOption[] = devListMapping.listChoices;

        if (webPartProps.scenario === "DEV"){
            theListChoices = devListMapping.listChoices;

        } else if (webPartProps.scenario === "CORP"){
            theListChoices = corpListMapping.listChoices;

        } else if (webPartProps.scenario === "TEAM"){
            theListChoices = teamListMapping.listChoices;
        }
        //console.log('theListChoices: ', theListChoices);
        /*
*/
        return <IPropertyPanePage>        { // <page3>
            header: {
                description: strings.PropertyPaneColumnsDescription1
            },
            groups: [
            {
                groupName: strings.PropertyPaneColumnsDescription1,
                groupFields: [

                PropertyPaneDropdown('listDefinition', <IPropertyPaneDropdownProps>{
                    label: strings.listDefinition,
                    options: theListChoices,
                }),

                PropertyPaneTextField('listTitle', {
                    label: strings.listTitle
                }),
                
                PropertyPaneToggle('getAll', {
                    label: strings.Property_getAll_Label,
                    offText: strings.Property_ShowHero_OffText,
                    onText: strings.Property_ShowHero_OnText
                  }),

                PropertyPaneTextField('colTitleText', {
                    label: strings.colTitleText
                }),
                PropertyPaneTextField('colHoverText', {
                    label: strings.colHoverText
                }),
                PropertyPaneTextField('colCategory', {
                    label: strings.colCategory
                }),
                PropertyPaneTextField('colGoToLink', {
                    label: strings.colGoToLink
                }),
                PropertyPaneTextField('colImageLink', {
                    label: strings.colImageLink
                }),
                PropertyPaneTextField('colSort', {
                    label: strings.colSort
                }),

              ]
            }
          ]
        }; // <page3>
      } // getPropertyPanePage()
  }


  export let listMappingPage1 = new ListMappingPage1();