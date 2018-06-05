// This file is shared across the demos.

import React from 'react';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui';

// import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import MailIcon from '@material-ui/icons/Mail';
import DeleteIcon from '@material-ui/icons/Delete';
import ReportIcon from '@material-ui/icons/Report';
import jsonMenu from "./SideMenuList.json" 
import ExpandMore from "@material-ui/icons/ExpandMore";
import IconButton from "material-ui/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

export const mailFolderListItems = (
  jsonMenu.map((data,idx)=>{
   return(
    <div key={"side_menu_index" + idx}>
    <div className="container-fluid">
      <div className="row clearfix">
        <div className="col-xs-3 col-sm-3 col-md-3 text-right">
          <span className="fas fa-th-large side-menu-title" />
        </div>
        <div
          className="col-xs-5 col-sm-5 col-md-5 side-menu-title"
         // onClick={this.openSubMenuSelection.bind(this, data)}
        >
          {data.label}
        </div>

        <div className="col-xs-4 col-sm-4 col-md-4 side-menu-arrow text-right">
          {this.state.menuSelected === data.name &&
          this.state.toggleSubMenu === false ? (
            <span
              className="side-menu-downIcon"
              onClick={this.openSubMenuSelection.bind(this, data)}
            >
              <IconButton
               onClick={this.openSubMenuSelection.bind(this, data)}
              >
                <div className="close-menu">
                  <ExpandMore />
                </div>
              </IconButton>
            </span>
          ) : (
            <IconButton
             // onClick={this.openSubMenuSelection.bind(this, data)}
            >
              <div className="close-menu">
                <ChevronLeftIcon />
              </div>
            </IconButton>
          )}
        </div>
      </div>
      {this.state.menuSelected === data.name &&
      this.state.toggleSubMenu === false ? (
        <div
          className="row sub-menu-option"
          style={{ paddingTop: "10px" }}
        >
          <div className="tree-structure-menu">
            {data.subMenu.map((title, idx) => {
              return (
                <div key={"sub_title" + idx}>
                  <ul style={{ marginBottom: "0px" }}>
                    <li
                     // onClick={this.TriggerPath.bind(this)}
                      path={title.path}
                    >
                      {title.label}{" "}
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  </div>
   )
  })  
);

export const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <MailIcon />
      </ListItemIcon>
      <ListItemText primary="All mail" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <DeleteIcon />
      </ListItemIcon>
      <ListItemText primary="Trash" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Spam" />
    </ListItem>
  </div>
);