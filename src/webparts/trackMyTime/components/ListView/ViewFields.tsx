import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

export const  initials : IViewField = {
    name: "userInitials",
    displayName: "User",
    isResizable: true,
    sorting: true,
    minWidth: 10,
    maxWidth: 30
}

export const  timeSpan : IViewField = {
  name: "listTimeSpan",
  displayName: "Timespan",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 30,
  maxWidth: 150
}

export const  project : IViewField = {
  name: "titleProject",
  displayName: "Project",
  isResizable: true,
  sorting: true,
  minWidth: 50,
  maxWidth: 100
}

export const  description : IViewField = {
  name: "description",
  displayName: "Description",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 20,
  maxWidth: 100
}

export const  comments : IViewField = {
  name: "comments",
  displayName: "Comments",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 20,
  maxWidth: 100
}

export const  category : IViewField = {
  name: "listCategory",
  displayName: "Category",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 20,
  maxWidth: 100
}

export function viewFieldsFull() {

    let viewFields: IViewField[]=[];

    viewFields.push(initials);
    viewFields.push(timeSpan);
    viewFields.push(project);
    viewFields.push(description);
    viewFields.push(comments);
    viewFields.push(category);

    return viewFields;
    
}

export function viewFieldsMin() {

    let viewFields: IViewField[]=[];

    viewFields.push(initials);
    viewFields.push(timeSpan);
    viewFields.push(project);

    return viewFields;
    
}