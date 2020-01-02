import { ILinkRuleReturn, ISmartLinkDef, ILinkRule } from './ActivityURLMasks';
import { ITrackMyTimeProps } from '../ITrackMyTimeProps';

/**
 * Example from github 
 * {
    order: 100,
    title: "Github Issue ",  // Rule title

    keyFolder: '/issues/', // Key folder in URL to apply rule too ( like /issues/ )
    childFolderTitle: '#...x..., ', // use 'na' to skip this rule.  '' to have no Title
    child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
    parentFolderTitle: ' really long word ', // use 'na' to skip this rule.  '' to have no Title
    parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title

    commentTextMapping: 'title, childFolderTitle, parentFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
    activityDescMapping: 'childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
    category1Mapping: 'parentFolderTitle',
    category2Mapping: 'title',
    projectID1Mapping: 'parentFolderTitle',
    projectID2Mapping: 'childFolderTitle',
 * }

 */

  export function sharePointOnline(parentProps: ITrackMyTimeProps)  {

    let sharePointOnline : ISmartLinkDef = {
        host: parentProps.tenant,
        rules: [
    
        ]
    }
    return sharePointOnline;

}

