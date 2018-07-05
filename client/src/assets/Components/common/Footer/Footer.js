import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styles from "./Footer.css";
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Paper from 'material-ui/Paper';
import classNames from "classnames";


function Footer({ children }) {
    return (
        <div>
            <div style={phantom} />
            <div style={style}>
                { children }
            </div>
        </div>

        // <div className="hptl-phase1-footer">
        //     <div className="phantom" />
        //     <div className="main">
        //         { children }
        //     </div>
        // </div>
    )
}

export default Footer