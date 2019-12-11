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

export default class TrackMyTime extends React.Component<ITrackMyTimeProps, {ITrackMyTimeState}> {

  public constructor(props:ITrackMyTimeProps){
    super(props);
    this.state = { 
      allTiles:[],
      filteredTiles:[],
      lastFilteredTiles:[],
      heroTiles:[],
      pivtTitles:[],
      showAllTiles: false,
      filteredCategory: this.props.setTab,
      pivotDefSelKey:"",
      loadStatus:"Loading",
      showTips: "none",
      loadError: "",
      lookupColumns: [],
      showOtherTab: false,
      heroCategory: this.props.heroCategory,
      searchShow: true,
      shuffleShow: true,
      searchCount: 0,
      searchWhere: '',
      searchType: '',
      listStaticName: this.props.listTitle,
      heroCategoryError: false,
      listError: false,
      itemsError: false,
      heroError: false,
      setLayout: this.props.setSize,
      colCategory: this.props.colCategory,
      thisCatColumn: 'category',
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
    //Not using this function because it just did not want to work.
    //this._loadListItems();
    this._getListItems();
    //alert('this.props.heroCategory.length');
    //alert(this.props);
  }
  
  public componentDidUpdate(prevProps){

    //alert('componentDidUpdate 1');

    let rebuildTiles = false;
    /*
    if (this.props.setTab !== prevProps.setTab) {  rebuildTiles = true ; }
    if (this.props.setSize !== prevProps.setSize) {  rebuildTiles = true ; }
    if (this.props.showHero !== prevProps.showHero) {  rebuildTiles = true ; }
    if (this.props.heroType !== prevProps.heroType) {  rebuildTiles = true ; }
    if (this.props.setRatio !== prevProps.setRatio) {  rebuildTiles = true ; }
    if (this.props.setImgFit !== prevProps.setImgFit) {  rebuildTiles = true ; }
    if (this.props.setImgCover !== prevProps.setImgCover) {  rebuildTiles = true ; }
    if (this.props.heroCategory !== prevProps.heroCategory) {  rebuildTiles = true ; }
    if (this.props.heroRatio !== prevProps.heroRatio) {  rebuildTiles = true ; }    
    */
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

      let useProjectWeb: string = this.context.pageContext.web.absoluteUrl;
      if ( this.props.projectListWeb ) {
        useProjectWeb = this.props.projectListWeb;
      }

      let useTrackMyTimeList: string = strings.DefaultTrackMyTimeListTitle;
      if ( this.props.timeTrackListTitle ) {
        useTrackMyTimeList = this.props.timeTrackListTitle;
      }

      let useTrackMyTimeWeb: string = this.context.pageContext.web.absoluteUrl;
      if ( this.props.timeTrackListWeb ) {
        useTrackMyTimeWeb = this.props.timeTrackListWeb;
      }

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

      const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);


      if ( this.props.listWebURL.length > 0 ){
        let web = new Web(this.props.listWebURL);
  
        const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);
        // Getting large amount of items (over 100)
        //          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).get()
        //items.getAll().
        web.lists.getByTitle(useTileList).items
          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).getAll()
          .then((response) => {
              this.processResponse(response);
            }).catch((e) => {
              this.processCatch(e);
            });
  
      } else {
  
        /*
        console.log('useTileList',useTileList);
        console.log('selectCols',selectCols);
        console.log('expandThese',expandThese);
        console.log('restFilter',restFilter);
        console.log('restSort',restSort);        
        */
        sp.web.lists.getByTitle(useTileList).items
          .select(selectCols).expand(expandThese).filter(restFilter).orderBy(restSort,true).get()
          .then((response) => {
            console.log('response',response);      
            this.processResponse(response);
          }).catch((e) => {
            this.processCatch(e);
          });
  
      }
  
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
  
      const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);

      let listStaticName = this.props.listTitle;

      if (this.props.listDefinition.toLowerCase().indexOf('library') > -1) {
        listStaticName = response[0].File.ServerRelativeUrl.replace(this.props.pageContext.web.serverRelativeUrl,"");
        listStaticName = listStaticName.substring(1,listStaticName.indexOf('/',1));
      }

      
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
      
      const defaultSelectedIndex = tileCategories.indexOf(this.props.setTab);
      let defaultSelectedKey = defaultSelectedIndex.toString();
      defaultSelectedKey = this.props.setTab.toString();  // Added this because I think this needs to be the header text, not the index.
      defaultSelectedKey = Utils.convertCategoryToIndex(defaultSelectedKey);
      
      tileCollectionResults.categoryInfo.lastCategory = tileCategories[0];

      let heroTiles = this.getHeroTiles(pivotProps, pivotState, tileCollection, pivotProps.heroCategory);
  
      let heroIds = this.getHeroIds(heroTiles);
  
      let newFilteredTiles = this.getNewFilteredTiles(pivotProps, pivotState, tileCollection, heroIds, heroTiles, 'category');
      console.log('processResponse: tileCategories', tileCategories);
      console.log('processResponse: this.props.setTab', this.props.setTab);   
      console.log('processResponse: defaultSelectedIndex', defaultSelectedIndex);
      console.log('processResponse: defaultSelectedKey', defaultSelectedKey);

      this.setState({
        allTiles: tileCollection,
        pivtTitles: tileCategories,
        filteredTiles: newFilteredTiles,
        lastFilteredTiles: newFilteredTiles,
        pivotDefSelKey: defaultSelectedKey,
        loadStatus:"Ready",
        loadError: "",
        endTime: this.state.endTime ? this.state.endTime : getTheCurrentTime(),
        searchCount: newFilteredTiles.length,
        searchWhere: ' in ' + this.props.setTab,
        listStaticName: listStaticName,

        createdInfo: tileCollectionResults.createdInfo,
        modifiedInfo: tileCollectionResults.modifiedInfo,
        categoryInfo: tileCollectionResults.categoryInfo,
        modifiedByInfo: tileCollectionResults.modifiedByInfo,
        createdByInfo: tileCollectionResults.createdByInfo,

        modifiedByTitles: tileCollectionResults.modifiedByTitles,
        modifiedByIDs: tileCollectionResults.modifiedByIDs,
        createdByTitles: tileCollectionResults.createdByTitles,
        createdByIDs: tileCollectionResults.createdByIDs,

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
