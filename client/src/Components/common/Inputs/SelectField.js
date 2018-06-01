import React, { Component, PureComponent } from "react";
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

export default class SelectFieldDrop extends PureComponent {

    constructor(args) {
        super(args);
        this.state = {
            values: [],
            age: '',            
            SelectVal:''
        };
    }

    handleChange(event) {
      debugger;      
      this.props.selected(event.target.value);
      this.setState({ SelectVal: event.target.value});
    }


	  menuItems(data) {
      //debugger;
	    return data.map((dataValue) => (
        
	      <MenuItem          
          value={dataValue.value}   
          key={dataValue.key}       
	      >
        {dataValue.name}
        </MenuItem>
	    ));
	  }

    componentWillReceiveProps(nextProps, nextState) {
      // debugger;
      if(this.props.displayValue != nextProps.displayValue)
      {
        this.setState({SelectVal:nextProps.displayValue});
      }
      
    }

    render() {        
        return (
            <div className="htpl1-select-dropdown">                    
                <Select 
                    style={{width: "100%", backgroundColor:"#FBFBFB"}}
                    value={this.state.SelectVal}
                    inputProps={{
                      name: 'SelectVal'                      
                    }}
                    onChange={this.handleChange.bind(this)}
                    >
                    {this.menuItems(this.props.children)}   
                </Select>
            </div>
        );
    }
}
