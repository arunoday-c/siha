import React, { Component } from "react";
import TextField from 'material-ui/TextField';

const styles = {
    error: {
        color: 'brown',
    }
}

export default class TextFieldData extends Component {
    render() {
        return (
            <div className="htpl1-textField">
                <TextField
                    style={{width: "100%", fontSize: "12px", backgroundColor:"#FBFBFB"}}                    
                    type={this.props.type}                    
                />
            </div>
        );
    }
}
