import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
//import Utils from './utils';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import {ITimeEntry} from '../ITrackMyTimeState';
//export default class NoListFound extends React.Component<IPivotTilesProps, IPivotTilesState> {


/**
 * 
 * @param parentProps 
 * @param parentState 
 */

export function listViewBuilder(parentProps,parentState, theseAreItems: ITimeEntry[]){
  // Carousel option from https://github.com/hugoabernier/WebPartDesignSeries

  let groupByFields: IGrouping[] = [  {   name: 'timeGroup',   order: 1,   }  ]

  //remap props to correct ones for HGcarouselLayout
  const viewFields: IViewField[]=[
    {
        /*
        name: "editLink",
        displayName: "Edit",
        //linkPropertyName: "editLink",
        isResizable: false,
        maxWidth: 40,
    },{  */  
        name: "userInitials",
        displayName: "User",
        isResizable: true,
        sorting: true,
        minWidth: 10,
        maxWidth: 30
    },{
        name: "listTimeSpan",
        displayName: "Timespan",
        //linkPropertyName: "c",
        isResizable: true,
        sorting: true,
        minWidth: 30,
        maxWidth: 150
    },{
        name: "titleProject",
        displayName: "Project",
        isResizable: true,
        sorting: true,
        minWidth: 50,
        maxWidth: 100
    },{
        name: "description",
        displayName: "Description",
        //linkPropertyName: "c",
        isResizable: true,
        sorting: true,
        minWidth: 20,
        maxWidth: 100
    },{
        name: "comments",
        displayName: "Comments",
        //linkPropertyName: "c",
        isResizable: true,
        sorting: true,
        minWidth: 20,
        maxWidth: 100
    },{
        name: "listCategory",
        displayName: "Category",
        //linkPropertyName: "c",
        isResizable: true,
        sorting: true,
        minWidth: 20,
        maxWidth: 100
    },
  ];

  let listView = 
    <ListView
      items={theseAreItems}
      viewFields={viewFields}
      compact={true}
      selectionMode={SelectionMode.none}
      selection={this._getSelection}
      showFilter={true}
      //defaultFilter="John"
      filterPlaceHolder="Search..."
      groupByFields={groupByFields}
    />;

  return listView;

}

