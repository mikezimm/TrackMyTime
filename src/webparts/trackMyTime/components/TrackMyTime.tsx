import * as React from 'react';
import styles from './TrackMyTime.module.scss';
import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, Web } from '@pnp/sp';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, autobind } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';

import * as strings from 'TrackMyTimeWebPartStrings';
import Utils from './utils';

import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../../services/createAnalytics';
import {IProject, ITimeEntry, IProjects, IProjectInfo, ITrackMyTimeState} from './ITrackMyTimeState'

export default class TrackMyTime extends React.Component<ITrackMyTimeProps, ITrackMyTimeState> {
    
  private createprojectInfo() {

    let projectInfo = {} as IProjectInfo;

    projectInfo.master = [];
    projectInfo.user = [];
    projectInfo.masterPriority = [];
    projectInfo.userPriority = [];
    projectInfo.current = [];
    projectInfo.lastFiltered = [];
    projectInfo.lastProject = [];
    projectInfo.all = [];
    
    return projectInfo;

  }

  public constructor(props:ITrackMyTimeProps){
    super(props);
    this.state = { 

      // 1 - Analytics options

      // 2 - Source and destination list information
      projectListURL: '', //Get from list item
      timeTrackerListURL: '', //Get from list item

      projectListName: '',  // Static Name of list (for URL) - used for links and determined by first returned item
      timeTrackListName: '',  // Static Name of list (for URL) - used for links and determined by first returned item

      // 3 - General how accurate do you want this to be

      // 4 -Project options
      projects: this.createprojectInfo(),
      
      pivtTitles:[],
      filteredCategory: this.props.defaultProjectPicker,
      pivotDefSelKey:"",

      // 5 - UI Defaults
      currentProjectPicker: '', //User selection of defaultProjectPicker:  Recent, Your Projects, All Projects etc...
      currentTimePicker: '', //User selection of :defaultTimePicker  SinceLast, Slider, Manual???
      locationChoice: '',  //semi-colon separated choices

      // 6 - User Feedback:
      showElapsedTimeSinceLast: true,  // Idea is that it can be like a clock showing how long it's been since your last entry.
      elapsedTime: 0,   //Elapsed Time since last entry

      recentEntries: [],  //List of recent entries

      // 7 - Slider Options
      timeSliderValue: 0,  //incriment of time slider
      projectMasterPriorityChoice: '', //Use to determine what projects float to top.... your most recent?  last day?
      projectUserPriorityChoice: '',  //Use to determine what projects float to top.... your most recent?  last day?

      // 9 - Other web part options

      loadStatus:"Loading",
      showTips: "none",
      loadError: "",

      listError: false,
      itemsError: false,

      searchType: '',
      searchShow: true,
      searchCount: 0,
      searchWhere: '',

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    this.onLinkClick = this.onLinkClick.bind(this);
    this.toggleTips = this.toggleTips.bind(this);
    this.minimizeTiles = this.minimizeTiles.bind(this);
    this.searchMe = this.searchMe.bind(this);
    this.showAll = this.showAll.bind(this);
    this.toggleLayout = this.toggleLayout.bind(this);
    this.onChangePivotClick = this.onChangePivotClick.bind(this);
    
  }

  public componentDidMount() {
    this._getListItems();
  }
  
  public componentDidUpdate(prevProps){

    let rebuildTiles = false;
    if (this.props.defaultProjectPicker !== prevProps.defaultProjectPicker) {  rebuildTiles = true ; }

    if (rebuildTiles === true) {
      this._updateStateOnPropsChange({});
    }
  }




  public render(): React.ReactElement<ITrackMyTimeProps> {
    return (
      <div className={ styles.trackMyTime }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }








  


  private searchMe = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    console.log(e);
    let searchType = "";
    let newSearchShow =  e.altKey === true ? true : !this.state.searchShow;
    let searchCount = this.state.projects.lastFiltered.length;
    let searchWhere = this.state.searchWhere;
    if (e.altKey) { 
      searchType = "all";
      newSearchShow = true;
      //searchCount = this.state.projects.all.length;
      searchWhere = ' in all categories'
    }
    
    let projects = this.state.projects;
    //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

    console.log('newSearchShow: ', newSearchShow, searchType)
    this.setState({
      searchType: searchType,
      searchShow: ( e.altKey === true ? true : !this.state.searchShow ),
      projects: projects,
      searchCount: searchCount,
      searchWhere: searchWhere,
    });

    
  } //End searchMe

  public searchForItems = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
 
    console.log('searchForItems: e',e);
    console.log('searchForItems: item', item);
    console.log('searchForItems: this', this);
    /*
    */

    let searchItems = [];
    if (this.state.searchType === 'all'){
      searchItems =this.state.projects.all;
    } else {
      searchItems =this.state.projects.lastFiltered;
    }
    let searchCount = searchItems.length;
    let newFilteredProjects = [];
    for (let thisItem of searchItems) {
      let fileName = thisItem.href.substring(thisItem.href.lastIndexOf('/'));

      let searchString = 'title:' + thisItem.title.toLowerCase() + 'tescription:' + thisItem.description.toLowerCase() + 'href:' + fileName;
      if(searchString.indexOf(item.toLowerCase()) > -1) {
        //console.log('fileName', fileName);
        newFilteredProjects.push(thisItem);
      }
    }

    searchCount = newFilteredProjects.length;

    let projects = this.state.projects;
    //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

    this.setState({
      projects: projects,
      searchCount: searchCount,
    });


    return ;
    
  } //End searchForItems

  public onLinkClick = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    if (e.ctrlKey) {
      //Set clicked pivot as the hero pivot
      this._updateStateOnPropsChange({heroCategory: item.props.headerText});

    } else if (e.altKey) {
      //Enable-disable ChangePivots options
      this.setState({
        
      });

    } else {

      //Filter tiles per clicked category

      const defaultSelectedIndex = this.state.pivtTitles.indexOf(item.props.headerText);
      let defaultSelectedKey = defaultSelectedIndex.toString();
      defaultSelectedKey = item.props.headerText.toString();  // Added this because I think this needs to be the header text, not the index.
      defaultSelectedKey = Utils.convertCategoryToIndex(defaultSelectedKey);

      let newFilteredProjects = [];
      let pivotProps = this.props;
      let pivotState = this.state;

//      newFiltered = this.getOnClickFilteredProjects(pivotProps, pivotState, newCollection, heroIds, newHeros, thisCatColumn, lastCategory)

     // newFilteredProjects = this.getOnClickFilteredProjects(pivotProps, pivotState, this.state.projects.all, this.state.heroIds, this.state.heroTiles, this.state.thisCatColumn, item.props.headerText)


      console.log('onLinkClick: this.state', this.state);
      console.log('onLinkClick: item.props.headerText', item.props.headerText);
      console.log('onLinkClick: defaultSelectedIndex', defaultSelectedIndex);
      console.log('onLinkClick: defaultSelectedKey', defaultSelectedKey);
      
      let projects = this.state.projects;
      //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

      this.setState({
        filteredCategory: item.props.headerText,
        projects: projects,
        searchCount: newFilteredProjects.length,
        searchType: '',
        searchWhere: ' in ' + item.props.headerText,
        pivotDefSelKey: defaultSelectedKey,

      });

    }

  } //End onClick

  public onChangePivotClick = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    this._updateStateOnPropsChange({

    });

  } //End onClick

  private showAll = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    if (e.altKey && e.shiftKey && !e.ctrlKey) { 

    } else if (e.ctrlKey) { 

    } else {
      let newFilteredProjects = [];
      for (let thisItem of this.state.projects.all) {
          let showthisItem = true;
          if (showthisItem === true) {newFilteredProjects.push(thisItem) ; }
      }

      let projects = this.state.projects;
      projects.lastFiltered = (this.state.searchType === 'all' ? this.state.projects.all : this.state.projects.lastFiltered );

      this.setState({
        projects: projects,
        searchCount: this.state.projects.all.length,
        pivotDefSelKey: "-100",
        searchWhere: ' in all categories'
      });
    }
    
  }

  private minimizeTiles = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    console.log(e);
    if (e.altKey && e.shiftKey && !e.ctrlKey) { 

      if (strings.analyticsWeb.indexOf(this.props.tenant) === 0 ) {
        let openThisWindow = strings.analyticsWeb + '/lists/' + strings.analyticsList;
        window.open(openThisWindow, '_blank');
        event.preventDefault();
      } else {

        console.log('the analyticsWeb is not in the same tenant...',strings.analyticsWeb,this.props.tenant);

      }
    } else if (e.ctrlKey) { 

      if (strings.minClickWeb.indexOf(this.props.tenant) === 0 ) {
        let openThisWindow = strings.minClickWeb + this.props.pageContext.web.absoluteUrl;
        window.open(openThisWindow, '_blank');
        event.preventDefault();
      } else {

        console.log('the minClickWeb is not in the same tenant...',strings.minClickWeb,this.props.tenant);

      }
    } else {
      let newFilteredProjects = [];
      let projects = this.state.projects;
      projects.newFiltered = [];
      projects.lastFiltered = projects.all;

      this.setState({
        projects: projects,
        searchCount: this.state.projects.all.length,
        pivotDefSelKey: "-100",
        searchWhere: ' in all categories'
      });
    }
    


  } //End onClick

  public toggleLayout = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    /*
    let setLayout = this.state.setLayout;

    if (setLayout === "Card") {
      setLayout = this.props.setSize
    } else if (setLayout === "List") {
      setLayout = "Card"
    } else {       setLayout = "List" }

    this.setState({
      setLayout: setLayout,
    });
    */

  } //End toggleTips  

  public toggleTips = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.

    let newshowTips = this.state.showTips === 'none' ? 'yes' : 'none';

    this.setState({
      showTips: newshowTips,
    });

  } //End toggleTips  

  //http://react.tips/how-to-create-reactjs-components-dynamically/ - based on createImage
  public createPivot(pivT) {
    console.log('createPivot: ', pivT);
    const thisItemKey :string = Utils.convertCategoryToIndex(pivT);
      return (
        <PivotItem headerText={pivT} itemKey={thisItemKey}/>
      );
  }

  public createPivots(thisState,thisProps){

    if (thisState.showOtherTab && thisState.pivtTitles.indexOf(thisProps.otherTab) === -1) {
       thisState.pivtTitles.push(thisProps.otherTab);
    }
    let piv = thisState.pivtTitles.map(this.createPivot);
    console.log('createPivots: ', piv);
    return (
      piv
    );
  }



  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  @autobind 







































  private _updateStateOnPropsChange(params: any ): void {
    this.setState({

    });
  }

  //    private async loadListItems(): Promise<IPivotTileItemProps[]> {
  private _getListItems(): void {

    let useProjectList: string = strings.DefaultProjectListTitle;
    if ( this.props.projectListTitle ) {
      useProjectList = this.props.projectListTitle;
    }

    let useProjectWeb: string = this.props.pageContext.web.absoluteUrl;
    if ( this.props.projectListWeb ) {
      useProjectWeb = this.props.projectListWeb;
    }

    let useTrackMyTimeList: string = strings.DefaultTrackMyTimeListTitle;
    if ( this.props.timeTrackListTitle ) {
      useTrackMyTimeList = this.props.timeTrackListTitle;
    }

    let useTrackMyTimeWeb: string = this.props.pageContext.web.absoluteUrl;
    if ( this.props.timeTrackListWeb ) {
      useTrackMyTimeWeb = this.props.timeTrackListWeb;
    }

    
    //const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);

    let restFilter: string = "";

    let restSort: string = "Title";

    let selectCols: string = "*";
    let expandThese = "";

    let allColumns = this.getKeysLike(this.props,"col","Begins");
    let expColumns = this.getExpandColumns(allColumns);
    let selColumns = this.getSelectColumns(allColumns);

    selColumns.length > 0 ? selectCols += "," + selColumns.join(",") : selectCols = selectCols;
    if (expColumns.length > 0) { expandThese = expColumns.join(","); }

    let projectWeb = new Web(useProjectWeb);
    let trackTimeWeb = new Web(useTrackMyTimeWeb);

    let batch: any = sp.createBatch();

    let loadProjectItems = new Array<IProjects>();
    let loadTrackMyTimeItems = new Array<ITimeEntry>();
    let trackMyProjectsInfo = {};
    
    projectWeb.lists.getByTitle(useProjectList).items
    .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).inBatch(batch).getAll()
    .then((response) => {
      loadProjectItems = response.map((p) => {
            let project : any;

            return project;
        });
      }).catch((e) => {
        this.processCatch(e);
      });

      sp.web.siteUsers
      .inBatch(batch).get().then((response) => {
          console.table(response);
          trackMyProjects.siteUsers = response.map((u) => {
              let user: SPSiteUser = new SPSiteUser();
              return user;
          });
          return trackMyProjects.siteUsers;
      });

      sp.web.siteGroups.expand("Users").select("Title", "Id", "IsHiddenInUI", "IsShareByEmailGuestUse", "IsSiteAdmin", "IsSiteAdmin")
          .inBatch(batch).get().then((response) => {
          let AdGroupPromises: Array<Promise<any>> = [];
          // if group contains an ad group(PrincipalType=4) expand it
          trackMyProjects.siteGroups = response.map((grp) => {
              let siteGroup: SPSiteGroup = new SPSiteGroup();
              return siteGroup;
          });
          return Promise.all(AdGroupPromises).then(() => {
              return trackMyProjects.siteGroups;
          });

      });

      return batch.execute().then(() => {
          return trackMyProjects;
      });




  }  
  private processCatch(e) {
    console.log("Can't load data");
    //var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
    //alert(m);
    console.log(e);
    console.log(e.status);
    console.log(e.message);
    let sendMessage = e.status + " - " + e.message;
    this.setState({  loadStatus: "ListNotFound", loadError: e.message, listError: true, });

  }

  private processResponse(response){

    if (response.length === 0){
      this.setState({  loadStatus: "NoItemsFound", itemsError: true,  });
      return ;
    }

    console.log(response);


    /*
    const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);

    let listStaticName = this.props.listTitle;

    */

      let projectListName = "";  // Static Name of list (for URL) - used for links and determined by first returned item
      let timeTrackListName = "";  // Static Name of list (for URL) - used for links and determined by first returned item  
      let listStaticName = "";
      //listStaticName = response[0].File.ServerRelativeUrl.replace(this.props.pageContext.web.serverRelativeUrl,"");
      //listStaticName = listStaticName.substring(1,listStaticName.indexOf('/',1));

    /*
    
    const listURL = fixedURL + ( this.props.listDefinition.indexOf("Library") < 0 ? "lists/" : "" ) + listStaticName;

    const currentPageUrl = this.props.pageContext.web.absoluteUrl + this.props.pageContext.site.serverRequestPath;

    const editItemURL = listURL + (listURL.indexOf('/lists/') > -1 ? '' : '/Forms') + "/DispForm.aspx?ID=" + "ReplaceID" + "&Source=" + currentPageUrl;
    //console.log('editItemURL',editItemURL);

    let pivotProps = this.props;
    let pivotState = this.state;

    let tileCollectionResults = Utils.buildTileCollectionFromResponse(response, pivotProps, editItemURL, pivotProps.heroCategory);
    console.log('tileCollectionResults: ', tileCollectionResults);
    let tileCollection = tileCollectionResults.tileCollection

    let tileCategories = Utils.buildTileCategoriesFromResponse(pivotProps, pivotState, tileCollection, pivotProps.heroCategory, 'category');
        */
    let tileCategories = []; // ERASE THIS LINE SINCE IT SHOULD BE determined above?
    const defaultSelectedIndex = tileCategories.indexOf(this.props.defaultProjectPicker);
    let defaultSelectedKey = defaultSelectedIndex.toString();
    defaultSelectedKey = this.props.defaultProjectPicker.toString();  // Added this because I think this needs to be the header text, not the index.
    defaultSelectedKey = Utils.convertCategoryToIndex(defaultSelectedKey);
    /*
    tileCollectionResults.categoryInfo.lastCategory = tileCategories[0];

    let heroTiles = this.getHeroTiles(pivotProps, pivotState, tileCollection, pivotProps.heroCategory);

    let heroIds = this.getHeroIds(heroTiles);

    let newFilteredProjects = this.getnewFilteredProjects(pivotProps, pivotState, tileCollection, heroIds, heroTiles, 'category');
    console.log('processResponse: tileCategories', tileCategories);
    console.log('processResponse: this.props.defaultProjectPicker', this.props.defaultProjectPicker);   
    console.log('processResponse: defaultSelectedIndex', defaultSelectedIndex);
    console.log('processResponse: defaultSelectedKey', defaultSelectedKey);

    */

    let projects = this.state.projects;
    //projects.all = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

    this.setState({
      projects: projects,
      pivotDefSelKey: defaultSelectedKey,
      loadStatus:"Ready",
      loadError: "",
      endTime: this.state.endTime ? this.state.endTime : getTheCurrentTime(),
      searchCount: projects.newFiltered.length,
      searchWhere: ' in ' + this.props.defaultProjectPicker,
      projectListName: projectListName,  // Static Name of list (for URL) - used for links and determined by first returned item
      timeTrackListName: timeTrackListName,  // Static Name of list (for URL) - used for links and determined by first returned item

    });

    saveAnalytics(this.props,this.state);
    
    return true;

  }

  /**
   * Copied from Pivot-Tiles
   * @param thisProps 
   * @param findMe 
   * @param findOp 
   */
  private getKeysLike(thisProps,findMe,findOp){
    //Sample call:  getKeysLike(this.props,"col","begins")
    //console.log('FoundProps that ' + findOp + ' with ' + findMe);
    //console.log(thisProps);
    const allKeys = Object.keys(thisProps);
    let foundKeys = [];
    const lFind = findMe.length;

    findMe = findMe.toLowerCase();
    findOp = findOp.toLowerCase();

    if (findOp==="begins") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === 0);
    } else if (findOp === "ends") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === ( k.length - lFind));
    } else {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) > -1);
    }

    let foundProps = [];
    for (let thisProp of foundKeys) {
      if (thisProp && thisProp !== "" ) { foundProps.push(thisProps[thisProp]) ; }
    }

    return foundProps;
  }

  /**
   * Copied from Pivot-Tiles
   * @param lookupColumns 
   */
  private getSelectColumns(lookupColumns){

    let baseSelectColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let isLookup = thisColumn.indexOf("/");
        if(isLookup) {
          baseSelectColumns.push(thisColumn);
        }
      }
    }
    return baseSelectColumns;
  }

  /**
   * Copied from Pivot-Tiles
   * @param lookupColumns 
   */
  private getExpandColumns(lookupColumns){

    let baseExpandColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let splitCol = thisColumn.split("/");
        let leftSide = splitCol[0];
        if(baseExpandColumns.indexOf(leftSide) < 0) {
          baseExpandColumns.push(leftSide);
        }
      }
    }
    return baseExpandColumns;
  }

}
