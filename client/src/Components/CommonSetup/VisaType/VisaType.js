// import React, { Component } from "react";
// import { Paper, TextField, LinearProgress } from "@material-ui/core";
// import "./visatype.css";
// import { Button } from "@material-ui/core";
// import moment from "moment";
// import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
// import { withStyles } from "@material-ui/core/styles";
// import { EditingState, DataTypeProvider } from "@devexpress/dx-react-grid";
// import { algaehApiCall } from "../../../utils/algaehApiCall";
// import DeleteDialog from "../../../utils/DeleteDialog";
// import { AlagehFormGroup, AlgaehOptions } from "../../Wrapper/algaehWrapper";
// import {
//   Grid,
//   Table,
//   Toolbar,
//   SearchPanel,
//   TableHeaderRow,
//   TableEditRow,
//   TableEditColumn,
//   VirtualTable
// } from "@devexpress/dx-react-grid-material-ui";

// import { getVisatypes } from "../../../actions/CommonSetup/Visatype.js";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import IconButton from "@material-ui/core/IconButton";
// import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";
// import Done from "@material-ui/icons/Done";
// import CancelIcon from "@material-ui/icons/Cancel";

// let sel_id = "";
// let openDialog = false;
// let startDate = "";

// const TableRow = ({ row, ...restProps }) => (
//   <Table.Row
//     {...restProps}
//     onClick={control => {
//       sel_id = JSON.stringify(row.hims_d_visa_type_id);
//     }}
//     style={{
//       cursor: "pointer"
//     }}
//   />
// );

// const styles = theme => ({
//   tableStriped: {
//     "& tbody tr:nth-of-type(odd)": {
//       backgroundColor: "#fbfbfb"
//     }
//   }
// });

// const TableComponentBase = ({ classes, ...restProps }) => (
//   <Table.Table {...restProps} className={classes.tableStriped} />
// );

// export const TableComponent = withStyles(styles, { name: "TableComponent" })(
//   TableComponentBase
// );

// const EditButton = ({ onExecute }) => (
//   <IconButton onClick={onExecute} algaeh-command="edit" title="Edit row">
//     <EditIcon />
//   </IconButton>
// );

// const DeleteButton = ({ onExecute }) => (
//   <IconButton onClick={onExecute} algaeh-command="delete" title="Delete row">
//     <DeleteIcon />
//   </IconButton>
// );

// const CommitButton = ({ onExecute }) => (
//   <IconButton onClick={onExecute} algaeh-command="submit" title="Save changes">
//     <Done />
//   </IconButton>
// );

// const CancelButton = ({ onExecute }) => (
//   <IconButton
//     color="secondary"
//     algaeh-command="cancel"
//     onClick={onExecute}
//     title="Cancel changes"
//   >
//     <CancelIcon />
//   </IconButton>
// );

// const commandComponents = {
//   edit: EditButton,
//   delete: DeleteButton,
//   commit: CommitButton,
//   cancel: CancelButton
// };

// const Command = ({ id, onExecute }) => {
//   const CommandButton = commandComponents[id];
//   return <CommandButton onExecute={onExecute} />;
// };

// const DateEditor = ({ value, onValueChange }) => (
//   <TextField
//     value={moment(value).format("YYYY-MM-DD")}
//     type="date"
//     onChange={e => onValueChange(...value)}
//   />
// );

// class VisaType extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       hims_d_visa_type_id: "",
//       visa_type: "",
//       visa_status: "A",
//       visa_type_code_error: false,
//       visa_type_code_error_txt: "",
//       visa_type_error: false,
//       visa_type_error_txt: "",
//       visa_type_code: "",
//       visa_desc: "",
//       record_Status: "",
//       row: [],
//       id: "",
//       openDialog: false,
//       buttonText: "ADD TO LIST"
//     };
//   }

//   getFullStatusText({ value }) {
//     if (value === "A") {
//       return "Active";
//     } else if (value === "I") {
//       return "Inactive";
//     } else {
//       return "";
//     }
//   }

//   addVisaType(e) {
//     e.preventDefault();
//     if (this.state.visa_type_code.length == 0) {
//       this.setState({
//         visa_type_code_error: true,
//         visa_type_code_error_txt: "Visa Type cannot be empty"
//       });
//     } else if (this.state.visa_type.length == 0) {
//       this.setState({
//         visa_type_error: true,
//         visa_type_error_txt: "Visa Type Code cannot be empty"
//       });
//     } else {
//       algaehApiCall({
//         uri: "/masters/set/add/visa",
//         data: this.state,
//         onSuccess: response => {
//           if (response.data.success === true) {
//             //Handle Successful Add here
//             this.setState({
//               visa_desc: "",
//               visa_type: "",
//               visa_type_code_error: false,
//               visa_type_code_error_txt: "",
//               visa_type_error: false,
//               visa_type_error_txt: ""
//             });
//             this.props.getVisatypes();
//           } else {
//             //Handle unsuccessful Add here.
//           }
//         },
//         onFailure: error => {
//           // Handle network error here.
//         }
//       });
//     }
//   }

//   changeTexts(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   componentDidMount() {
//     this.props.getVisatypes();
//   }

//   commitChanges({ added, changed, deleted }) {
//     if (added) {
//     }

//     if (changed) {
//     }

//     if (deleted) {
//       this.setState({ openDialog: true });
//     }
//   }

//   btnClick() {}

//   shouldComponentUpdate(nextProps, nextState) {
//     if (this.props.visatypes !== nextProps.visatypes) {
//       return true;
//     }
//     return true;
//   }

//   changeStatus(e) {
//     this.setState({ visa_status: e.target.value });
//     console.log("Status:", this.state.visa_status);
//     if (e.target.value == "A")
//       this.setState({ effective_end_date: "9999-12-31" });
//     else if (e.target.value == "I") {
//       this.setState({
//         effective_end_date: moment(String(new Date())).format("YYYY-MM-DD")
//       });
//     }
//   }

//   dateFormater({ value }) {
//     return String(moment(value).format("DD-MM-YYYY"));
//   }

//   handleConfirmDelete() {
//     const data = { hims_d_visa_type_id: sel_id, updated_by: 1 };
//     this.setState({ openDialog: false });
//     algaehApiCall({
//       uri: "/masters/set/delete/visa",
//       data: data,
//       method: "DELETE",
//       onSuccess: response => {
//         this.setState({ open: false });

//         if (response.data.success === true) this.props.getVisatypes();
//       },
//       onFailure: error => {
//         this.setState({ open: false });
//       }
//     });
//   }

//   handleDialogClose() {
//     this.setState({ openDialog: false });
//   }

//   render() {
//     return (
//       <div className="visa_type">
//         <DeleteDialog
//           handleConfirmDelete={this.handleConfirmDelete.bind(this)}
//           handleDialogClose={this.handleDialogClose.bind(this)}
//           openDialog={this.state.openDialog}
//         />

//         <LinearProgress id="myProg" style={{ display: "none" }} />
//         <Paper className="container-fluid">
//           <form>
//             <div
//               className="row"
//               style={{
//                 padding: 20,
//                 marginLeft: "auto",
//                 marginRight: "auto"
//               }}
//             >
//               <AlgaehOptions
//                 div={{ className: "col-lg-3" }}
//                 label={{
//                   fieldName: "status",
//                   isImp: true
//                 }}
//                 optionsType="radio"
//                 group={{
//                   name: "Status",
//                   value: this.state.visa_status,
//                   controls: [
//                     { label: "Active", value: "A" },
//                     { label: "Inactive", value: "I" }
//                   ],
//                   events: { onChange: this.changeStatus.bind(this) }
//                 }}
//               />

//               <AlagehFormGroup
//                 div={{ className: "col-lg-3" }}
//                 label={{
//                   fieldName: "visa_type_code",
//                   isImp: true
//                 }}
//                 textBox={{
//                   className: "txt-fld",
//                   name: "visa_type_code",
//                   value: this.state.visa_type_code,
//                   events: {
//                     onChange: this.changeTexts.bind(this)
//                   },
//                   error: this.state.visa_type_code_error,
//                   helperText: this.state.visa_type_code_error_txt
//                 }}
//               />

//               <AlagehFormGroup
//                 div={{ className: "col-lg-3" }}
//                 label={{
//                   fieldName: "visa_type",
//                   isImp: true
//                 }}
//                 textBox={{
//                   className: "txt-fld",
//                   name: "visa_type",
//                   value: this.state.visa_type,
//                   events: {
//                     onChange: this.changeTexts.bind(this)
//                   },
//                   error: this.state.visa_type_error,
//                   helperText: this.state.visa_type_error_txt
//                 }}
//               />

//               <div className="col-lg-3 align-middle">
//                 <br />
//                 <Button
//                   onClick={this.addVisaType.bind(this)}
//                   variant="raised"
//                   color="primary"
//                 >
//                   {this.state.buttonText}
//                 </Button>
//               </div>
//             </div>
//           </form>

//           <div className="row form-details">
//             <div className="col">
//               <Paper>
//                 <Grid
//                   rows={this.props.visatypes}
//                   key={["{name : hims_d_visa_type_id}"]}
//                   columns={[
//                     { name: "visa_type_code", title: "Visa Type Code" },
//                     { name: "visa_type", title: "Visa Type" },
//                     { name: "created_date", title: "Added Date" },
//                     { name: "visa_status", title: "Status" }
//                   ]}
//                 >
//                   <DataTypeProvider
//                     formatterComponent={this.dateFormater}
//                     editorComponent={({ value }) => (
//                       <DateEditor value={value} />
//                     )}
//                     for={["created_date"]}
//                   />
//                   <DataTypeProvider
//                     formatterComponent={this.getFullStatusText}
//                     // editorComponent={StatusEditor}
//                     for={["visa_status"]}
//                   />

//                   <SearchState />
//                   <IntegratedFiltering />
//                   <VirtualTable
//                     tableComponent={TableComponent}
//                     rowComponent={TableRow}
//                     height={400}
//                   />
//                   <TableHeaderRow />
//                   <Toolbar />
//                   <SearchPanel />
//                   <EditingState
//                     onCommitChanges={this.commitChanges.bind(this)}
//                   />
//                   <TableEditRow />
//                   <TableEditColumn
//                     width={120}
//                     showEditCommand
//                     showDeleteCommand
//                     commandComponent={Command}
//                   />
//                 </Grid>
//               </Paper>
//             </div>
//           </div>
//         </Paper>
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     visatypes: state.visatypes.visatypes
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getVisatypes: getVisatypes
//     },
//     dispatch
//   );
// }

// export default withRouter(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(VisaType)
// );
