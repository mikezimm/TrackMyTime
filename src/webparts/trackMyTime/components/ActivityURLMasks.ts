
export interface ILinkRule {

    order: number,  // To be used for sorting priority of rule
    title: string,  // Rule title
    keyFolder: string, // Key folder in URL to apply rule too ( like /issues/ )
    childFolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    child2FolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    parentFolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    parent2FolderTitle?: string, // use 'na' to skip this rule.  '' to have no Title.  Last character is spacer
    commentMapping?: string, // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
    linkDescription?: string, // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up

}

export interface ISmartLinkDef {

    host: string;
    rules: ILinkRule[];

}

export function buildSmartLinkRules() {
  
    let smartLinkRules: ISmartLinkDef[]=[];
    
    smartLinkRules.push(github);
    console.table('smartLinkRules:', smartLinkRules);
    convertSmartLink('https://github.com/mikezimm/TrackMyTime/blob/master/README.md', smartLinkRules);

    return smartLinkRules;
    
}


export function convertSmartLink(link : string, smartLinkRules: ISmartLinkDef[]){

    //let host = getHostRules(link,rules);
  
    let host: ISmartLinkDef = getHost(link,smartLinkRules);
    let rule: ILinkRule = getHostRule(link,host.rules);
    if (rule) { 
        let result = applyHostRule(link,rule);
    }

}

function applyHostRule(link : string, rule: ILinkRule) {

    link = link.toLowerCase();
    let result : any = null;

    let split = link.split(rule.keyFolder);
    console.table('getHostRuleApplication: split', split);
    let parents = split[0].split('/');
    let children = split[1].split('/');
    console.table('getHostRuleApplication:', parents,children);

    let commentMapping = rule.commentMapping.replace(/, /g,',').split(',');
    let linkDescription = rule.linkDescription.replace(/, /g,',').split(',');

    let commentText = '';
    for (let member of linkDescription) {

        if ( rule[member] && rule[member] !== 'na' ) {//This is a valid mapping
            let index = getFolderIndex(member);
            console.table('getHostRuleApplication: index', index);
            let thisText: string = '';

            if ( member === 'title') {
                thisText = rule[member];

            } else if ( member === 'keyFolder') {
                thisText = rule[member];

            } else if (index < 0 ) { //This is a parent
                if (parents.length < index) { // folder does not exist in URL
                } else {
                    thisText = rule[member].substring(0,rule[member].length-1);
                    console.table('getHostRuleApplication: thisText1', thisText);
                    console.log('parents index' + (parents.length - index), parents);
                    thisText += parents[parents.length + index];
                    console.table('getHostRuleApplication: thisText2', thisText);
                    thisText = thisText + rule[member].substring(rule[member].length - 1, rule[member].length);
                }
            } else if (index > 0 ) { //This is a child
                if (children.length < index) { // folder does not exist in URL
                } else {
                    console.log('children index' + (index - 1), children);
                    thisText = rule[member].substring(0,rule[member].length-1) + children[index - 1];
                    thisText = thisText + rule[member].substring(rule[member].length - 1, rule[member].length);
                }
            }
            console.table('getHostRuleApplication: thisText', thisText);
            commentText += thisText;

        }
        console.table('getHostRuleApplication: commentText', commentText);
    }



    console.log('getHostRuleApplication: commentMapping', linkDescription);   



    console.table('getHostRuleApplication:', result);
    return result;
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
            title: "Github Issue",  // Rule title
            keyFolder: '/issues/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '#', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: 'Repo: ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            linkDescription: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
        },        {
            order: 100,
            title: "Github Pull Request",  // Rule title
            keyFolder: '/pull/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '#', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: 'Repo: ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            linkDescription: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
        },        {
            order: 100,
            title: "Github Project",  // Rule title
            keyFolder: '/projects/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: 'Repo: ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            linkDescription: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
        },        {
            order: 100,
            title: "Github Wiki",  // Rule title
            keyFolder: '/wiki', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: 'Page: ', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: 'Repo: ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            linkDescription: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
        },        {
            order: 100,
            title: "Github Commit",  // Rule title
            keyFolder: '/commit/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: '#', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: 'na', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: 'Repo: ', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: 'User: ', // use 'na' to skip this rule.  '' to have no Title
            commentMapping: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            linkDescription: '', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
        },        {
            order: 100,
            title: "",  // Rule title
            keyFolder: '/blob/', // Key folder in URL to apply rule too ( like /issues/ )
            childFolderTitle: ' in Branch: ,', // use 'na' to skip this rule.  '' to have no Title
            child2FolderTitle: ' File: ', // use 'na' to skip this rule.  '' to have no Title
            parentFolderTitle: ' Repo: ,', // use 'na' to skip this rule.  '' to have no Title
            parent2FolderTitle: ' User: ,', // use 'na' to skip this rule.  '' to have no Title
            commentMapping: 'title, parentFolderTitle, childFolderTitle, keyFolder', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
            linkDescription: 'title, parentFolderTitle, child2FolderTitle, childFolderTitle', // "title, parentFolderTitle, keyFolder, childFolderTitle" - properties from this interface to build up
        },

    ]

  }


