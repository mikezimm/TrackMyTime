
import {sp} from "@pnp/sp";
import { find, indexOf, includes } from "lodash";
import { ITrackMyTimeProps } from './ITrackMyTimeProps';


export class TrackMyProjectsLoad {
    public siteUsers: SPSiteUser[];
    public siteGroups: SPSiteGroup[];
    public roleDefinitions: SPRoleDefinition[];
    public lists: (SPList | SPListItem)[];
    public constructor() {
  
      this.siteUsers = new Array<SPSiteUser>();
      this.siteGroups = new Array<SPSiteGroup>();
      this.roleDefinitions = new Array<SPRoleDefinition>();
      this.siteUsers = new Array<SPSiteUser>();
      this.lists = new Array<SPList>();
  
    }
  }


export class Helpers {

  public loadData(): Promise<TrackMyProjectsLoad> {
        let trackMyProjects: TrackMyProjectsLoad = new TrackMyProjectsLoad();
        let batch: any = sp.createBatch();


        sp.web.siteUsers
        .inBatch(batch).get().then((response) => {
            console.table(response);
            securityInfo.siteUsers = response.map((u) => {
                let user: SPSiteUser = new SPSiteUser();
                return user;
            });
            return securityInfo.siteUsers;
        });

        sp.web.siteGroups.expand("Users").select("Title", "Id", "IsHiddenInUI", "IsShareByEmailGuestUse", "IsSiteAdmin", "IsSiteAdmin")
            .inBatch(batch).get().then((response) => {
            let AdGroupPromises: Array<Promise<any>> = [];
            // if group contains an ad group(PrincipalType=4) expand it
            securityInfo.siteGroups = response.map((grp) => {
                let siteGroup: SPSiteGroup = new SPSiteGroup();
                return siteGroup;
            });
            return Promise.all(AdGroupPromises).then(() => {
                return securityInfo.siteGroups;
            });

        });

        return batch.execute().then(() => {
            return securityInfo;
        });


    }    //LoadData 
}