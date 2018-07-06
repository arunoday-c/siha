import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SideMenuBar from "./../SideMenuBar/SideMenuBar.js";
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {deepOrange500} from 'material-ui/styles/colors';
import {green500} from 'material-ui/styles/colors';
import styles from "./header.css";
import IconButton from 'material-ui/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Paper from 'material-ui/Paper';
import classNames from "classnames";

const muiTheme = getMuiTheme({
	palette: {
	    primary1Color: '#00bdb7',
	    accent1Color:  deepOrange500,
	    green : green500
	}
});


const appColor = {
	background: '#292929'	
};


const paper_style = {
	height: 1350,
	width: 300,
	position: 'absolute',
	top: 0,
	display: 'inline-block',
	zIndex: 10000
};

const titleStyles = {
	title: {
		color: '#fff',
		paddingRight: 10
	},
	organisation: {
	  	color: green500
	}
};



export default class Header extends Component{
		constructor(props){
		super(props);
		this.state = {
			open: false
		};
	}

	sideMenuBarToggle(){
		this.setState({
			open: !this.state.open
		})
	}

	closeMenuBar(){
		this.setState({
			open: false
		})
	}

	render (props) {
		const { classes, theme } = this.props;
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div className="hptl-phase1-registeration">
					  <AppBar
						onLeftIconButtonClick = {this.sideMenuBarToggle.bind(this)}
					    showMenuIconButton={true} />
					    {(this.state.open === true) ?
					    <div>
						    <Paper style={paper_style} 
					         	className="paper"
					         	component={(open) => this.setState({open})}
					         	elevation={4}>
							    <AppBar showMenuIconButton={false} 
							    title={
							    	<div className="menuBar-title">
								    	<span style={titleStyles.title}>ALGAEH</span>
										<span style={titleStyles.organisation}>ERH</span>
									</div>
								} style={appColor}>
							    <IconButton onClick={this.closeMenuBar.bind(this)}>
							    	<div className="close-menu text-right">  
						             <ChevronLeftIcon color={'#fff'} hoverColor={green500}   />
						       		</div>
						        </IconButton>
							    </AppBar>
							    <SideMenuBar />
							</Paper>
						</div> : 
						null
						}
				</div>
			</MuiThemeProvider>
		);
	}
}
