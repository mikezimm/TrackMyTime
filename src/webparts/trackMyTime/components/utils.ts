//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class

import { getTheCurrentTime,} from '../../../services/createAnalytics';
import { getLocalMonths } from '../../../services/dateServices';

export interface IDateCategoryArrays {
  yr: number[];
  mo: number[];
  day: number[];
  date: number[];
  hr: number[];

  age: number[];

  yrMo: string[];
  moDay: string[];

  locDate: string[];
  locTime: string[];

  time: Date[];

  bestFormat: string[];

}

export interface IDateInfo {
    range?: number;
    note?: string;
    latest?: Date;
    earliest?: Date;
    bestAgeBucket?: string;
    bestFormat?: string;
    cats : IDateCategoryArrays;
    lastCategory?: string;
    name: string;

}

export interface IPersonCategoryArrays {

  fullName: string[];
  initials: string[];
  firstName: string[];
  lastName: string[];
  bestFormat: string[];
  IDs: number[];

}

export interface IPersonInfo {

    note?: string; // Copied from IDateInfo, keeping for consistancy
    bestFormat?: string; // Copied from IDateInfo, keeping for consistancy
    cats : IPersonCategoryArrays; // Copied from IDateInfo, keeping for consistancy
    lastCategory?: string;  // Copied from IDateInfo, keeping for consistancy
    name: string;  // Copied from IDateInfo, not sure if it is needed

}

type IInfo = IDateInfo | IPersonInfo;

function createIPersonCategoryArrays(col) {
  let result = {} as IPersonInfo;
  let cats = {} as IPersonCategoryArrays;

  cats.fullName = [];
  cats.initials = [];
  cats.IDs = [];
  cats.firstName = [];
  cats.lastName = [];
  cats.bestFormat = [];

  result = {
    note: null,
    bestFormat: null,
    cats: cats,
    lastCategory: null,
    name: col,

  }
  
  return result;


}

function createIDateCategoryArrays(col) {
  let result = {} as IDateInfo;
  let cats = {} as IDateCategoryArrays;
  cats.yr = [];
  cats.mo = [];
  cats.day = [];  
  cats.date = [];
  cats.hr = [];

  cats.age = [];

  cats.yrMo = [];
  cats.moDay = [];

  cats.locDate = [];
  cats.locTime = [];

  cats.time = [];

  cats.bestFormat = [];

  result = {
    range: null,
    note: null,
    latest: null,
    earliest: null,
    bestAgeBucket: null,
    bestFormat: null,
    cats: cats,
    lastCategory: null,
    name: col,

  }
  
  return result;


}

export default class Utils {

    
  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    //console.log('convertCategoryToIndex', cat);
    if (!cat) { return "";}

    const thisCat = cat.toString();
    if (thisCat == null) { return ""; }
    if (thisCat){
      return (thisCat.replace(" ",'_').replace(/[&]/,'And').replace(/[*]/,'aamp').replace(/[\/\\#,+()$~%.'":*?<>{}]/g,''));
    } else {
      return ("");
    }
  }

  public static fixURLs(oldURL,pageContext) {
    let newURL = oldURL;
    if (!oldURL || newURL.length === 0) {
      newURL = pageContext.web.absoluteUrl;
    }
    newURL += newURL.endsWith("/") ? "" : "/";
    return newURL;
  }


  public static parseMe(str, parser, leftOrRight) {
    // Usage:
    // parseMe(theseProps[getProp],"/",'left')
    // parseMe(theseProps[getProp],"/",'right');

    let splitCol = str.split(parser);
    if (leftOrRight.toLowerCase() === 'left') {
      return splitCol[0];
    } else if (leftOrRight.toLowerCase() === 'right') {
      return splitCol[1] ? splitCol[1] : "";
    }
  }

  /**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 * https://github.com/lodash/lodash/issues/1743#issue-125967660
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
public static arrayContainsArray (superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

}

