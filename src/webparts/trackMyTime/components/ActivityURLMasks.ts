import { ITrackMyTimeState } from './ITrackMyTimeState';
import { ITrackMyTimeProps } from './ITrackMyTimeProps';
import { resultContent } from 'office-ui-fabric-react/lib/components/FloatingPicker/PeoplePicker/PeoplePicker.scss';

export interface ILinkRuleReturn {
    /**
     *  These are the properties that define how to build up the designated fields
     */

    // These are the fields that can be auto-populated based on SmartLink mapping
    commentText?: string, // This will go into the Comments field
    activityDesc?: string, // This will be the description or visible text in the Activity URL field
    category1?: string,  // This is the value for this column
    category2?: string,  // This is the value for this column
    projectID1?: string,  // This is the value for this column
    projectID2?: string,  // This is the value for this column

}

export interface ILinkRule extends ILinkRuleReturn {

    order: number,  // To be used for sorting priority of rule
    title: string,  // Rule title

    /**  These are the parts of the URL that can turned into strings.
     *      Examples of different syntax options
     *       
     *      1)  use ' Any text to be the prefix of the folder name value' to insert folder value in middle of string
                childFolderTitle: ' in \'...x...\' Branch,',
                comment fragment:  " in 'master' Branch,"

    *      2)  use ...x... to insert folder value in middle of string
                childFolderTitle: ' in \'...x...\' Branch,',
                comment fragment:  " in 'master' Branch,"

    *      3)  insert ^^^ in string to make the folder name all UPPERCASE
                childFolderTitle: '^^^ in \'...x...\' Branch,',
                comment fragment:  " in 'MASTER' Branch,"

    *      4)  insert vvv in string to make the folder name all lowercase
                childFolderTitle: ' in \'...x...\' Branch,',
                comment fragment:  " in 'master' Branch,"

     */
    
    keyFolder: string, // Key folder in URL to apply rule too ( like /issues/ )
    childFolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    child2FolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    parentFolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    parent2FolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer

    /**
     *  These are the properties that define how to build up the designated fields
     */
    // These are the fields that can be auto-populated based on SmartLink mapping
    commentTextMapping?: string, // This will go into the Comments field
    activityDescMapping?: string, // This will be the description or visible text in the Activity URL field
    category1Mapping?: string,  // This is the value for this column
    category2Mapping?: string,  // This is the value for this column
    projectID1Mapping?: string,  // This is the value for this column
    projectID2Mapping?: string,  // This is the value for this column

}

export interface ISmartLinkDef {

    host: string;
    rules: ILinkRule[];

}

export function buildSmartLinkRules(parentProps: ITrackMyTimeProps) {
  
    let smartLinkRules: ISmartLinkDef[]=[];
    
    smartLinkRules.push(github);
    smartLinkRules.push(sharePoint(parentProps));

    return smartLinkRules;
    
}


export function convertSmartLink(link : string, smartLinkRules: ISmartLinkDef[]){

    //let host = getHostRules(link,rules);
    let result : ILinkRuleReturn = null;
    if (link.length === 0 ) { return result; }

    let host: ISmartLinkDef = getHost(link,smartLinkRules);
    if (host === null) { return result; }

    let rule: ILinkRule = getHostRule(link,host.rules);
    if (rule === null) { return result; }

    if (rule) { 
        result = applyHostRule(link,rule);
    }

    return result;

}

function applyHostRule(link : string, rule: ILinkRule) {

    link = link;
    let result : ILinkRuleReturn = null;

    let split = link.split(rule.keyFolder);
    let parents = split[0].split('/');
    let children = split[1].split('/');
    let commentText = getTextFromLink(rule.commentTextMapping, rule, parents, children);
    console.table('getHostRuleApplication: commentText', commentText);

    let activityDesc = getTextFromLink(rule.activityDescMapping, rule, parents, children);
    console.table('getHostRuleApplication: activityDesc', activityDesc);

    let category1 = getTextFromLink(rule.category1Mapping, rule, parents, children);
    let category2 = getTextFromLink(rule.category2Mapping, rule, parents, children);
    let projectID1 = getTextFromLink(rule.projectID1Mapping, rule, parents, children);
    let projectID2 = getTextFromLink(rule.projectID2Mapping, rule, parents, children);

    result = {
        commentText: commentText,
        activityDesc: activityDesc,
        category1: category1,
        category2: category2,
        projectID1: projectID1,
        projectID2: projectID2,
    }

    console.log('result: ', result);
    return result;
}


function getTextFromLink(definition: string, rule: ILinkRule, parents: string[], children: string[]){

    let structure = definition.replace(/, /g,',').split(',');

    let result = '';
    for (let member of structure) {

        if ( rule[member] && rule[member] !== 'na' ) {//This is a valid mapping
            let index = getFolderIndex(member);
            
            let toUpperCase = rule[member].indexOf('^^^') > -1 ? true : false;
            let toLowerCase = rule[member].indexOf('vvv') > -1 ? true : false;
            let toProperCase = rule[member].indexOf('^v') > -1 ? true : false;

            let prefix = rule[member].split('...x...')[0];
            prefix = prefix ? prefix.replace('...x...','') : prefix;

            let suffix = rule[member].split('...x...')[1];
            suffix = suffix ? suffix.replace('...x...','') : suffix;

            let thisText: string = '';

            if ( member === 'title') {
                thisText = rule[member];

            } else if ( member === 'keyFolder') {
                thisText = rule[member];

            } else if (index < 0 ) { //This is a parent
                if (parents.length < index) { // folder does not exist in URL
                } else {

                    thisText = parents[parents.length + index];

                    if (toUpperCase) { thisText = thisText.toLocaleUpperCase() }
                    else if (toLowerCase) { thisText = thisText.toLocaleLowerCase() }
                    //else if (toProperCase) { thisText = thisText.toProperCase() }

                    thisText = prefix ? prefix + thisText : thisText;
                    thisText = suffix ? thisText + suffix : thisText;
                }
            } else if (index > 0 ) { //This is a child
                if (children.length < index) { // folder does not exist in URL
                } else {

                    thisText = children[index - 1];

                    if (toUpperCase) { thisText = thisText.toLocaleUpperCase() }
                    else if (toLowerCase) { thisText = thisText.toLocaleLowerCase() }
                    //else if (toProperCase) { thisText = thisText.toProperCase() }

                    thisText = prefix ? prefix + thisText : thisText;
                    thisText = suffix ? thisText + suffix : thisText;
                }
            }
            thisText = thisText.replace('^^^','').replace('vvv','').replace('^v','');

            //This will trim the length of the total value (including label) to the length between 2 sets of << like <<8<<
            let shorten = thisText.split('<<');
            if (shorten.length === 3) {
                thisText = shorten[0] + shorten[2];
                if (thisText.length > parseInt(shorten[1])) {
                    thisText = thisText.substr(0, parseInt(shorten[1]) ) + '...';
                }
            }

            result += thisText;
        }
    }
    // Remove any last commas, spaces, colons and semi colons
    //https://stackoverflow.com/a/17720342/4210807
    result = result.replace(/\s*$/, "").replace(/,*$/, "").replace(/;*$/, "").replace(/:*$/, "");

    return result;
}


function makeProperCaseString(str: string) {
// Unable to get this to work :()
//https://stackoverflow.com/a/51181225/4210807
    /*
    str = "hEllo billie-ray o'mALLEY-o'rouke.Please come on in.";
    String.prototype.initCap = function () {
    return this.toLowerCase().replace(/(?:^|\b)[a-z]/g, function (m) {
        return m.toUpperCase();
    });
    };
    alert(str.initCap());
    */

}

function getFolderIndex(member) {

    if ( member === 'parent2FolderTitle' ) { return -2 };
    if ( member === 'parentFolderTitle' ) { return -1 };
    if ( member === 'childFolderTitle' ) { return 1 };
    if ( member === 'child2FolderTitle' ) { return 2 };
    if ( member === 'title' ) { return null };
    if ( member === 'keyFolder' ) { return null };
    

    console.table('getFolderIndex error, member not recognized:', member);

    return 0
    
}
function getHostRule(link : string, rules: ILinkRule[]) {

    link = link.toLowerCase();
    let result : ILinkRule = null;

    for (let rule of rules) {

        let keyFolder = rule.keyFolder.toLowerCase();
        let indexOf = link.indexOf(keyFolder);
        if ( indexOf > 0 ) {
            result = rule;
            console.table('getHostRule:', result);
            return result;
        }
    }
    console.table('getHostRule:', result);
    return result;
}

function getHost(link : string, hosts: ISmartLinkDef[]) {

    link = link.toLowerCase();
    let result : ISmartLinkDef = null;

    for (let host of hosts) {
        let hostName = host.host.toLowerCase();
        if ( link.indexOf(hostName) === 0 ) {
            result = host;
            return result;
        }
    }
    console.table('getHost:', result);
    return result;
}



export const github : ISmartLinkDef = {
    host: 'https://github.com/',
    rules: [
        {
            order: 100,
            title: "Github Issue ",  // Rule title
            keyFolder: '/issues/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '#...x..., ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: 'title, childFolderTitle, parentFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'title',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'childFolderTitle',
        },        {
            order: 100,
            title: "Github Pull Request",  // Rule title
            keyFolder: '/pull/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '#...x..., ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: 'title, childFolderTitle, parentFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'title',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'childFolderTitle',
        },        {
            order: 100,
            title: "Github Project",  // Rule title
            keyFolder: '/projects/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'title',
            projectID1Mapping: '',
            projectID2Mapping: '',
        },        {
            order: 100,
            title: "Github Wiki",  // Rule title
            keyFolder: '/wiki', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: 'Page: ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'title',
            projectID1Mapping: '',
            projectID2Mapping: '',
        },        {
            order: 100,
            title: "Github Commit",  // Rule title
            keyFolder: '/commit/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: ' #...x...,<<8<< ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'title, childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'parentFolderTitle',
            category2Mapping: 'title',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'childFolderTitle',
        },        {
            order: 100,
            title: "",  // Rule title
            keyFolder: '/blob/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: ' in \'...x...\' Branch,', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: ' File: ', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' ^^^Repo: ...x...,', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: ' from User: ...x...:', // use 'na' to skip this rule.  '' to have no Title
            commentTextMapping: 'title, parentFolderTitle, childFolderTitle, keyFolder', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            activityDescMapping: 'title, parentFolderTitle, child2FolderTitle, childFolderTitle, parent2FolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            category1Mapping: 'child2FolderTitle',
            category2Mapping: 'childFolderTitle',
            projectID1Mapping: 'parentFolderTitle',
            projectID2Mapping: 'parent2FolderTitle',

        },
    ]

  }

  export function sharePoint(parentProps: ITrackMyTimeProps)  {

    let sharePoint : ISmartLinkDef = {
        host: parentProps.tenant,
        rules: [
    
        ]
    }
    return sharePoint;

}

