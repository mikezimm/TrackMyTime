import * as React from 'react';
import styles from './TrackMyTime.module.scss';
import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, Web } from '@pnp/sp';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { DefaultButton, autobind } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import * as strings from 'TrackMyTimeWebPartStrings';
import Utils from './utils';

import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../../services/createAnalytics';
import {IProject, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, ITrackMyTimeState} from './ITrackMyTimeState'
import { pivotOptionsGroup, } from '../../../services/propPane';

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
      
      pivtTitles:['Yours', 'Your Team','Others'],
      filteredCategory: this.props.defaultProjectPicker,
      pivotDefSelKey:"",
      onlyActiveProjects: this.props.onlyActiveProjects,

      // 5 - UI Defaults
      currentProjectPicker: '', //User selection of defaultProjectPicker:  Recent, Your Projects, All Projects etc...
      currentTimePicker: '', //User selection of :defaultTimePicker  SinceLast, Slider, Manual???
      locationChoice: '',  //semi-colon separated choices

      // 6 - User Feedback:
      showElapsedTimeSinceLast: true,  // Idea is that it can be like a clock showing how long it's been since your last entry.
      elapsedTime: 0,   //Elapsed Time since last entry

      allEntries: [], // List of all entries
      filteredEntries: [],  //List of recent entries

      // 7 - Slider Options
      timeSliderValue: 0,  //incriment of time slider
      projectMasterPriorityChoice: '', //Use to determine what projects float to top.... your most recent?  last day?
      projectUserPriorityChoice: '',  //Use to determine what projects float to top.... your most recent?  last day?

      // 9 - Other web part options

      projectsLoadStatus:"Loading",
      projectsLoadError: "",
      projectsListError: false,
      projectsItemsError: false,

      timeTrackerLoadStatus:"Loading",
      timeTrackerLoadError: "",
      timeTrackerListError: false,
      timeTrackerItemsError: false,

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
    this.toggleType = this.toggleType.bind(this);
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

  public createProjectChoices(thisState){
    let elemnts = [];
    if (thisState.projects.all[0]){
      elemnts = thisState.projects.newFiltered.map(project => (
        <div>
          { project.titleProject } { project.category1 } { project.category2 }
        </div>
        ));
    }
    return ( elemnts );
  }

  
  public createHistoryItems(thisState){
    let elemnts = [];
    if (thisState.filteredEntries[0]){
      elemnts = thisState.filteredEntries.map(project => (
        <div>
          { project.titleProject } { project.startTime } { project.endTime }
        </div>
        ));
    }
    return ( elemnts );
  }

  public createProjectTypeToggle(thisState){

    let togglePart = <Toggle label="" 
      onText={strings.ToggleLabel_History } 
      offText={strings.ToggleLabel_Projects} 
      onChange={this.toggleType.bind(this)} 
      checked={this.state.projectType}
      styles={{ root: { width: 120 } }}
      />
    return togglePart;

  }

  public render(): React.ReactElement<ITrackMyTimeProps> {


    const defIndex = (this.state.pivotDefSelKey === '') ? Utils.convertCategoryToIndex(this.props.pivotTab) : Utils.convertCategoryToIndex(this.state.pivotDefSelKey);

    console.log('render props:', this.props);
    console.log('render state:', this.state);    

    return (
      <div className={ styles.trackMyTime }>
        <div className={ styles.container }>
        <div className={styles.floatLeft}>

            <Pivot 
              style={{ flexGrow: 1, paddingLeft: '10px' }}
              linkSize= { pivotOptionsGroup.getPivSize(this.props.pivotSize) }
              linkFormat= { pivotOptionsGroup.getPivFormat(this.props.pivotFormat) }
              onLinkClick= { this.onLinkClick.bind(this) }  //{this.specialClick.bind(this)}
              defaultSelectedKey={ defIndex }
              headersOnly={true}>
                {this.createPivots(this.state,this.props)}
            </Pivot>

            { this.createProjectTypeToggle(this.state) }
              
        </div>

          { this.createProjectChoices(this.state) }
          { this.createHistoryItems(this.state) }

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



//      newFiltered = this.getOnClickFilteredProjects(pivotProps, pivotState, newCollection, heroIds, newHeros, thisCatColumn, lastCategory)

     // newFilteredProjects = this.getOnClickFilteredProjects(pivotProps, pivotState, this.state.projects.all, this.state.heroIds, this.state.heroTiles, this.state.thisCatColumn, item.props.headerText)


      console.log('onLinkClick: this.state', this.state);
      console.log('onLinkClick: item.props.headerText', item.props.headerText);
      console.log('onLinkClick: defaultSelectedIndex', defaultSelectedIndex);
      console.log('onLinkClick: defaultSelectedKey', defaultSelectedKey);
      
      let thisFilter = [];
      if (item.props.headerText.toLowerCase().indexOf('team') > -1) { thisFilter.push('team')}
      else if (item.props.headerText.toLowerCase().indexOf('your') > -1) { thisFilter.push('your')}
      else { thisFilter.push('otherPeople')}

      let projects = this.state.projects;

      projects.lastFiltered = projects.newFiltered;    
      projects.newFiltered = this.getTheseProjects(this.state ,this.state.projectType, thisFilter);
      //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

      this.setState({
        filteredCategory: item.props.headerText,
        projects: projects,
        //searchCount: newFilteredProjects.length,
        searchType: '',
        searchWhere: ' in ' + item.props.headerText,
        pivotDefSelKey: defaultSelectedKey,

      });

    }

  } //End onClick

  public getTheseProjects(thisState: ITrackMyTimeState ,projectType: boolean, filterFlags : string[]){

    let startingProjects: IProject[] = [];
    let filteredProjects: IProject[] = [];
    if (projectType === false) {
      startingProjects = thisState.projects.master;
    } else {startingProjects = thisState.projects.user;}

    if (filterFlags.length === 0) {
      return startingProjects;
    }

    for (let thisItem of startingProjects) {
      if (Utils.arrayContainsArray(thisItem.filterFlags,filterFlags)) {
        filteredProjects.push(thisItem);
      }
    }
    return filteredProjects;
  }
  
  public toggleType = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    let newProjectType = !this.state.projectType;
    console.log('toggleType: item', item);
    console.log('toggleType from ' +  this.state.projectType + ' to ' + newProjectType);
    let projects = this.state.projects;

    projects.lastFiltered = projects.newFiltered;    
    projects.newFiltered = this.getTheseProjects(this.state ,newProjectType, []);
    
    this.setState({
      projectType: newProjectType,
      projects: projects,
    });


    return; 

    if (e.ctrlKey) {
      //Set clicked pivot as the hero pivot

    } else if (e.altKey) {
      //Enable-disable ChangePivots options
      this.setState({
        
      });

    } else {

      //Filter tiles per clicked category

      let newFilteredProjects = [];
      let pivotProps = this.props;
      let pivotState = this.state;

//      newFiltered = this.getOnClickFilteredProjects(pivotProps, pivotState, newCollection, heroIds, newHeros, thisCatColumn, lastCategory)

     // newFilteredProjects = this.getOnClickFilteredProjects(pivotProps, pivotState, this.state.projects.all, this.state.heroIds, this.state.heroTiles, this.state.thisCatColumn, item.props.headerText)
      
      let projects = this.state.projects;
      //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

      this.setState({
        filteredCategory: item.props.headerText,
        projects: projects,
        searchCount: newFilteredProjects.length,
        searchType: '',
        searchWhere: ' in ' + item.props.headerText,
        //pivotDefSelKey: defaultSelectedKey,

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

    let projectSort: string = "SortOrder";
    let trackTimeSort: string = "EndTime";

//    let projectRestFilter: string = "Team eq '" + 20 + "'";
//    let trackTimeRestFilter: string = "User eq '" + 20 + "'";

    let projectRestFilter: string = "";
    let trackTimeRestFilter: string = "";

    let selectCols: string = "*";
    let expandThese = "";
    let peopleColumns = ["Author","Editor","Team","Leader"];
    let peopleProps = ["Title","ID","Name","EMail","UserName"];
    let allColumns = [];

    for (let peep of peopleColumns){
      for (let pro of peopleProps){
        allColumns.push(peep + "/" +  pro)
      }     
    }

    let expColumns = this.getExpandColumns(allColumns);
    let selColumns = this.getSelectColumns(allColumns);
 
    selColumns.length > 0 ? selectCols += "," + selColumns.join(",") : selectCols = selectCols;
    if (expColumns.length > 0) { expandThese = expColumns.join(","); }

    let expandTheseTrack = expandThese + ',User';
    let selectColsTrack = selectCols + ',User/Title,User/ID,User/Name,User/EMail,User/UserName';   

    let projectWeb = new Web(useProjectWeb);
    let trackTimeWeb = new Web(useTrackMyTimeWeb);

    let batch: any = sp.createBatch();

    let loadProjectItems = new Array<IProject>();
    let loadTrackMyTimeItems = new Array<ITimeEntry>();

    let trackMyProjectsInfo = {
      projectData: loadProjectItems,
      timeTrackData: loadTrackMyTimeItems,
    };
    
    function buildSmartText (makeThisSmart) {

      let projectText : string = makeThisSmart ;
      let isRequired : boolean = ( projectText && projectText.indexOf("\*") === 0 ) ? true : false ;
      let projectString = isRequired ? makeThisSmart.substring(1) : makeThisSmart;
      let isDefault : boolean = (projectString && projectString.indexOf("\?") === 0 ) ? true : false ;
      projectString = isDefault ? projectString.substring(1) : projectString;
      let lastIndexOfDots : number = projectString ? projectString.lastIndexOf("...") : -1;
      let prefix : string = (projectString && lastIndexOfDots === projectString.length -3 ) ? projectString.substring(0,lastIndexOfDots) : null ;

      let thisProj : ISmartText = {
        value: makeThisSmart,
        required: isRequired,
        default: projectString ,
        defaultIsPrefix: lastIndexOfDots > -1 ? true : false ,
        prefix: prefix,
      };

      return thisProj;
    }
/**
 * projectWeb.lists.getByTitle(useProjectList).items
 * 
 * Another way.... go by full URL
 * http://www.ktskumar.com/2017/04/get-list-based-url-using-pnp-javascript-library/
 * $pnp.sp.web.getList("/sites/development/Lists/sample").items
 * projectWeb.getList("/sites/Templates/Tmt/Lists/TrackMyTime/").items
 * projectWeb.getList("/sites/Templates/Tmt/Lists/Projects").items
 * projectWeb.getList().items
 */

    projectWeb.lists.getByTitle(useProjectList).items
    .select(selectCols).expand(expandThese).filter(projectRestFilter).orderBy(projectSort,true).inBatch(batch).getAll()
    .then((response) => {
      trackMyProjectsInfo.projectData = response.map((p) => {
        //https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        let daily: any = false;
        let weekly: any = false;
        let total: any = false;

        if (p.TimeTarget) {
          let options = p.TimeTarget.split(';');
          for (let opt of options) {
            let thisOption = opt.split('=');
            if (thisOption[1] && thisOption[0].toLowerCase() === 'daily') {
              daily = parseInt(thisOption[1]);
            } else if (thisOption[1] && thisOption[0].toLowerCase() === 'weekly') {
              weekly = parseInt(thisOption[1]);
            } else if (thisOption[1] && thisOption[0].toLowerCase() === 'total') {
              total = parseInt(thisOption[1]);
            }
          }
        }

        let targetInfo : IProjectTarget = {
          value: p.TimeTarget,
          daily: daily ? daily : 0,
          weekly: weekly ? weekly : 0,
          total: total ? total : 0,
          dailyStatus: daily ? true : false,
          weeklyStatus: weekly ? true : false,
          totalStatus: total ? true : false,
        }


        let leader : IUser = {
          title: 'p.' , //
          initials: 'p.' , //Single person column
          email: 'p.' , //Single person column
          id: p.LeaderId , //
        }

        let team : IUser = {
          title: 'p.' , //
          initials: 'p.' , //Single person column
          email: 'p.' , //Single person column
          id: p.TeamId , //
        }

        let project : IProject = {
          projectType: 'Master',
          id: p.Id,
          editLink: null , //Link to view/edit item link
          titleProject: p.Title,
          comments: buildSmartText(p.Comments),
          active: p.Active,
          everyone: p.Everyone,
          sort: p.Sort,

          category1: p.Category1,
          category2: p.Category2,

          leader: p.Leader ,
          team: p.Team,

          leaderId: p.LeaderId,
          teamIds: p.TeamId,

          filterFlags: [],

          projectID1: buildSmartText(p.ProjectID1),
          projectID2: buildSmartText(p.ProjectID2),

          timeTarget: targetInfo,
          ccEmail: p.CCEmail,
          ccList: p.CCList,
        
          //Values that relate to project list item
          // sourceProject: , //Add URL back to item
        }

        return project;

      });
      //console.log('trackMyProjectsInfo:', trackMyProjectsInfo);
      this.processProjects(trackMyProjectsInfo.projectData);
      //return trackMyProjectsInfo.projectData;

    }).catch((e) => {
      this.processCatch(e);
    });

    //trackTimeSort

    trackTimeWeb.lists.getByTitle(useTrackMyTimeList).items
    .select(selectColsTrack).expand(expandTheseTrack).filter(trackTimeRestFilter).orderBy(trackTimeSort,false).top(200).inBatch(batch).get()
    .then((response) => {
      //console.log('response: timeTrackData', response);
      trackMyProjectsInfo.timeTrackData = response.map((item) => {
        //https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript


        let timeEntry : ITimeEntry = {

            //Values that would come from Project item
          id: item.Id ,
          editLink: null , //Link to view/edit item link
          titleProject : item.Title ,
          comments: buildSmartText(item.Comments),
          category1 : item.Category1 ,
          category2 : item.Category2 ,

          leader : item.Leader ,  //Likely single person column
          team : item.Team ,  //Likely multi person column

          leaderId: item.LeaderId,
          teamIds: item.TeamId,

          filterFlags: [],

          projectID1 : buildSmartText(item.ProjectID1) ,  //Example Project # - look for strings starting with * and ?
          projectID2 : buildSmartText(item.ProjectID2) ,  //Example Cost Center # - look for strings starting with * and ?

          //Values that relate to project list item
          sourceProject : item.SourceProject , //Link back to the source project list item.
          activity: item.Activity ,  //Link to the activity you worked on

          //Values specific to Time Entry
          user : item.User ,  //Single person column
          userId : item.UserId ,  //Single person column
          startTime : item.StartTime , //Time stamp
          endTime : item.EndTime , // Time stamp
          duration : item.Hours , //Number  -- May not be needed based on current testing with start and end dates.

          //Saves what entry option was used... Since Last, Slider, Manual
          entryType : item.EntryType ,
          deltaT : item.DeltaT , //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)
          timeEntryTBD1 : '' ,
          timeEntryTBD2 : '' ,
          timeEntryTBD3 : '' ,          

          //Other settings and information
          location : item.Location,
          settings : item.Settings,

          ccEmail: item.CCEmail,
          ccList: item.CCList,

        }
        //this.saveMyTime(timeEntry,'master');
        return timeEntry;

      });
      
      this.processTimeEntries(trackMyProjectsInfo.timeTrackData);

    }).catch((e) => {
      this.processCatch(e);
    });

    return batch.execute().then(() => {

      //this.processResponse(trackMyProjectsInfo);
      //return trackMyProjectsInfo;
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

  private processProjects(projectData){
    //projectData
    //console.log('projectData:  ', projectData);

    /**
     * Things we need to do during intial state
     * Populate all these arrays:
     * 
          all: IProject[];
          master: IProject[]; //Projects coming from the Projects list
          masterPriority: IProject[]; //Projects visible based on settings
          
          current: IProject[]; //Makes up the choices
          lastFiltered: IProject[];
          lastProject: IProject[];
          newFiltered: IProject[];
            
      *   Put them into state.projects
      */
     let master: IProject[] = [];
    let masterKeys: string[] = [];

     let userId = 20;
     for (let i = 0; i < projectData.length; i++ ) {
      let countThese = "all";
      let fromProject = projectData[i];
      let yours, team :boolean = false;

      //Check if project is tagged to you
      if (fromProject.teamIds && fromProject.teamIds.indexOf(userId) > -1 ) { team = true } ;
      if (fromProject.leaderId === userId ) { yours = true } ;
      if (yours) { fromProject.filterFlags.push('your') ; countThese = 'your' }
      else if (team) { fromProject.filterFlags.push('team') ; countThese = 'team' }
      else { fromProject.filterFlags.push('otherPeople') ; countThese = 'otherPeople' }
      fromProject.key = this.getProjectKey(fromProject);
      if (masterKeys.indexOf(fromProject.key) < 0) { 
        //This is a new project, add
        master.push(fromProject);
        masterKeys.push(fromProject.key);
      }
    }

     let all: IProject[] = master.concat(this.state.projects.all);
     let stateProjects = this.state.projects;
     stateProjects.all = all;
     stateProjects.master = master;
     stateProjects.masterKeys = masterKeys;
     stateProjects.lastFiltered = all;
     stateProjects.newFiltered = all;
     let masterPriority: IProject[] = [];

     if (this.state.timeTrackerLoadStatus === "Complete") { 
       console.log('all complete 1');
        /*NEED TO MERGE PROJECTS */ 
        console.log(this.state);
        console.log(stateProjects);
      } else { console.log('processProjects complete 2') }

    this.setState({  
      projects: stateProjects,
      projectsLoadStatus:"Complete",
      projectsLoadError: "",
      projectsListError: false,
      projectsItemsError: false,
    });

  }

  private createNewProjectCounts() {
    function createMe(){
      let yourCounts = {
        total: 0,
        today: 0,
        week: 0,
        month: 0,
        quarter: 0,
        recent: 0,
      }
      return yourCounts;
    }
    let counts = {
      all: createMe(),
      team: createMe(),
      your: createMe(),
      otherPeople: createMe(),
    }

    return counts;

  }

  private processTimeEntries(timeTrackData){
    //trackMyProjectsInfo
    //console.log('timeTrackData:  ', timeTrackData);
    
    /**
      * Things we need to do during intial state
      * Populate all these arrays:
      *    user: IProject[]; //Projects coming from TrackMyTime list
      *    userPriority: IProject[]; //Projects visible based on settings
      *   Put them into state.projects
    */
    let counts = this.createNewProjectCounts();
    let userKeys : string[] = [];

    let user: IProject[] = [];
    let userPriority: IProject[] = [];

    let stateProjects = this.state.projects;
    let userId = 20;
    let recentDays = 4;
    for (let i = 0; i < timeTrackData.length; i++ ) {
      let countThese = "all";
      let fromProject = this.convertToProject(timeTrackData[i]);
      let yours, team, today, week, month, quarter, recent :boolean = false;

      //Check if timeTrackData is tagged to you 
      if (timeTrackData[i].userId === userId ) { yours = true } ;
      if (yours) { fromProject.filterFlags.push('your') ; countThese = 'your' }

      //Check if project is tagged to you
      if (fromProject.teamIds.indexOf(userId) > -1 ) { team = true } ;
      if (fromProject.leaderId === userId ) { team = true } ;
      if (!yours  && team) { fromProject.filterFlags.push('team') ; countThese = 'team' }
      if (!yours && !team) { fromProject.filterFlags.push('otherPeople') ; countThese = 'otherPeople' }

      let now = new Date();
      let then = new Date(timeTrackData[i].endTime);
      let daysSince = (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);
      counts[countThese].total ++;

      if ( daysSince <= 1 ) { today = true;  fromProject.filterFlags.push('today') ; counts[countThese].today ++ }
      else if ( daysSince <= 7 ) { week = true;  fromProject.filterFlags.push('week') ; counts[countThese].week ++ }
      else if ( daysSince <= 31 ) { month = true;  fromProject.filterFlags.push('month') ; counts[countThese].month ++ }
      else if ( daysSince <= 91 ) { month = true;  fromProject.filterFlags.push('quarter') ; counts[countThese].quarter ++ }
      else if ( daysSince <= recentDays ) { recent = true; fromProject.filterFlags.push('recent') ; counts[countThese].recent ++ }
      
      if (userKeys.indexOf(fromProject.key) < 0) { 
        //This is a new project, add
        user.push(fromProject);
        userKeys.push(fromProject.key);
      }

    }
    //console.log('counts:', counts);
    //console.log('userKeys:', userKeys);

    /*
     {   index: 0,   key: 'yourRecent', text: "Your most recently used"  },
     {   index: 1,   key: 'yourToday', text: "Yours from today"  },
     {   index: 2,   key: 'yourWeek', text: "Yours from last week"  },
     {   index: 3,   key: 'allRecent', text: "All most recently used"  },
     {   index: 4,   key: 'allToday', text: "All from today"  },
     {   index: 5,   key: 'allWeek', text: "All from last week"  },
    */

   let all: IProject[] = this.state.projects.all.concat(user);
   stateProjects.all = all;
   stateProjects.user = user;
   stateProjects.lastFiltered = all;
   stateProjects.newFiltered = all;
   stateProjects.userKeys = userKeys;
   
   if (this.state.projectsLoadStatus === "Complete") { 
    console.log('all complete 3');
     /*NEED TO MERGE PROJECTS */ 
     console.log(this.state);
     console.log(stateProjects);
   } else { console.log('processTimeEntries complete 4') }

   this.setState({
    projects: stateProjects,
    userCounts: counts,
    allEntries: timeTrackData,
    filteredEntries: timeTrackData,
    timeTrackerLoadStatus:"Complete",
    timeTrackerLoadError: "",
    timeTrackerListError: false,
    timeTrackerItemsError: false,
   });

  }

  private processResponse(trackMyProjectsInfo){
    //trackMyProjectsInfo
    console.log('processResponse:  trackMyProjectsInfo', trackMyProjectsInfo);

    return;
    console.log('trackMyProjectsInfo.projectData', trackMyProjectsInfo.projectData);
    console.log('trackMyProjectsInfo.timeTrackData', trackMyProjectsInfo.timeTrackData);


    let all: IProject[] = trackMyProjectsInfo.projectData;

    let filteredEntries: ITimeEntry[] = trackMyProjectsInfo.timeTrackData;
    console.log('processResponse:  all', all);
    console.log('processResponse:  filteredEntries', filteredEntries);

    return;

    if (trackMyProjectsInfo.length === 0){
      this.setState({  loadStatus: "NoItemsFound", itemsError: true,  });
      return ;
    }

    console.log(trackMyProjectsInfo);


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
   * This builds unique string key based on properties passed in through this.props.projectKey
   * @param project 
   */
  private getProjectKey(project){

    let key = "";
    for (let k of this.props.projectKey ){
      //console.log('timeTrackData',timeTrackData[k])
      let partialKey = project[k];
      if ( k === 'comments' || k === 'projectID1' || k === 'projectID2' || k === 'timeTarget') {
        //These properties have custom object model to them so we need to check the .value
        if ( project[k] ) { partialKey = project[k].value } else { partialKey = '' }
      }
      if ( typeof partialKey === 'object') {
        if (partialKey) { key += partialKey.join(' '); }
      } else if (partialKey) { key += partialKey;}
      key += ' ';
    }

    return key;

  }

  private convertToProject(timeTrackData){

    let thisProject: IProject = {

        //Values that would come from Project item
      projectType: 'User', //master or user
      id: timeTrackData.id, //Item ID on list
      editLink: timeTrackData.editLink, //Link to view/edit item link
      titleProject: timeTrackData.titleProject,
      comments: timeTrackData.comments, // syntax similar to ProjID?
      active: timeTrackData.active,  //Used to indicate inactive projects
      everyone: timeTrackData.everyone, //Used to designate this option should be available to everyone.
      sort: timeTrackData.sort, //Used to prioritize in choices.... ones with number go first in order, followed by empty
      key: this.getProjectKey(timeTrackData),

      category1: timeTrackData.category1,
      category2: timeTrackData.category2,
      leader: timeTrackData.leader,  //Likely single person column
      team: timeTrackData.team,  //Likely multi person column
      leaderId: timeTrackData.leaderId,
      teamIds: timeTrackData.teamIds ? timeTrackData.teamIds : [] ,

      filterFlags: [], // what flags does this match?  yourRecent, allRecent etc...

      projectID1: timeTrackData.projectID1,  //Example Project # - look for strings starting with * and ?
      projectID2: timeTrackData.projectID2,  //Example Cost Center # - look for strings starting with * and ?

      timeTarget: timeTrackData.timeTarget,

      //This might be computed at the time page loads
      lastEntry: timeTrackData.lastEntry,  //Should be a time entry

      //Values that relate to project list item
      sourceProject: timeTrackData.sourceProject, //Link back to the source project list item.
      ccList: timeTrackData.ccList, //Link to CC List to copy item
      ccEmail: timeTrackData.ccEmail, //Email to CC List to copy item 

      created: timeTrackData.created,
      modified: timeTrackData.modified,
      createdBy: timeTrackData.createdBy,
      modifiedBy: timeTrackData.modifiedBy,

    };

    return thisProject;

  }

  private saveMyTime (trackTimeItem: ITimeEntry , masterOrRemote : string) {

    let teamId = { results: [] };
    if (trackTimeItem.teamIds) { teamId = { results: trackTimeItem.teamIds } }

    let category1 = { results: [] };
    if (trackTimeItem.category1) { category1 = { results: trackTimeItem.category1 } }

    let category2 = { results: [] };
    if (trackTimeItem.category2) { category2 = { results: trackTimeItem.category2 } }

    let saveThisItem = {
        //Values that would come from Project item
        //editLink : ILink, //Link to view/edit item link
        Title: trackTimeItem.titleProject,
        Comments: trackTimeItem.comments ? trackTimeItem.comments.value : null,
        Category1: category1,
        Category2: category2,
        LeaderId: trackTimeItem.leaderId,  //Likely single person column
        TeamId: teamId,  //Likely multi person column

        ProjectID1: trackTimeItem.projectID1 ? trackTimeItem.projectID1 : null,  //Example Project # - look for strings starting with * and ?
        ProjectID2: trackTimeItem.projectID2 ? trackTimeItem.projectID2 : null,  //Example Cost Center # - look for strings starting with * and ?

        //Values that relate to project list item
        //SourceProject: trackTimeItem.sourceProject, //Link back to the source project list item.
        Activity: trackTimeItem.activity, //Link to the activity you worked on
        CCList: trackTimeItem.ccList, //Link to CC List to copy item
        CCEmail: trackTimeItem.ccEmail, //Email to CC List to copy item 
        
        //Values specific to Time Entry
        UserId: trackTimeItem.userId,  //Single person column
        StartTime: trackTimeItem.startTime, //Time stamp
        EndTime: trackTimeItem.endTime, // Time stamp
        //Duration: trackTimeItem.duration, //Number  -- May not be needed based on current testing with start and end dates.

        //Saves what entry option was used... Since Last, Slider, Manual
        EntryType: trackTimeItem.entryType,
        DeltaT: trackTimeItem.deltaT, //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)
        //timeEntryTBD1: string,
        //timeEntryTBD2: string,
        //timeEntryTBD3: string,  

        //Other settings and information
        Location: trackTimeItem.location, // Location
        Settings: trackTimeItem.settings,

    }
/*
    const allKeys = Object.keys(saveThisItem);
    let saveThisItemNew = {}; 
    for (let key of allKeys){
      let thisElement = saveThisItem[key];
      if (saveThisItem[key]) { saveThisItemNew.push( {key : thisElement})}
    }
    */
     
    let useTrackMyTimeList: string = strings.DefaultTrackMyTimeListTitle;
    if ( this.props.timeTrackListTitle ) {
      useTrackMyTimeList = this.props.timeTrackListTitle;
    }
  
    let useTrackMyTimeWeb: string = this.props.pageContext.web.absoluteUrl;
    if ( this.props.timeTrackListWeb ) {
      useTrackMyTimeWeb = this.props.timeTrackListWeb;
    }
    //console.log('this.props',this.props);
    //console.log('this.state',this.state);
    console.log('trackTimeItem',trackTimeItem);
    console.log('saveThisItem',saveThisItem);

    
    let trackTimeWeb = new Web(useTrackMyTimeWeb);

    if (masterOrRemote === 'master'){
      trackTimeWeb.lists.getByTitle(useTrackMyTimeList).items.add( saveThisItem ).then((response) => {
        //Reload the page
        //location.reload();
          alert('save successful');
        }).catch((e) => {
        //Throw Error
          alert(e);
      });
    } else if (masterOrRemote === 'remote'){
      trackTimeWeb.getList("/sites/Templates/Tmt/Lists/TrackMyTime/").items.add( saveThisItem ).then((response) => {
        //Reload the page
        //location.reload();
          alert('save successful');
        }).catch((e) => {
        //Throw Error
          alert(e);
      });

    }

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
