// import React, { Component } from "react";
// import { Paper, TextField } from "@material-ui/core";
// import "./patient_type.css";
// import { Button } from "@material-ui/core";
// import moment from "moment";
// import { SearchState, IntegratedFiltering } from "@devexpress/dx-react-grid";
// import { withStyles } from "@material-ui/core/styles";
// import { EditingState, DataTypeProvider } from "@devexpress/dx-react-grid";
// import { algaehApiCall } from "../../../utils/algaehApiCall";
// import { AlagehFormGroup, AlgaehOptions } from "../../Wrapper/algaehWrapper";
// import DeleteDialog from "../../../utils/DeleteDialog";

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

// // const TableRow = ({ row, ...restProps }) => (
// //   <Table.Row
// //     {...restProps}
// //     onClick={control => {
// //       sel_id = JSON.stringify(row.hims_d_visa_type_id);
// //     }}
// //     style={{
// //       cursor: "pointer"
// //     }}
// //   />
// // );

// // const styles = theme => ({
// //   tableStriped: {
// //     "& tbody tr:nth-of-type(odd)": {
// //       backgroundColor: "#fbfbfb"
// //     }
// //   }
// // });

// // const TableComponentBase = ({ classes, ...restProps }) => (
// //   <Table.Table {...restProps} className={classes.tableStriped} />
// // );

// // export const TableComponent = withStyles(styles, { name: "TableComponent" })(
// //   TableComponentBase
// // );

// // const EditButton = ({ onExecute }) => (
// //   <IconButton onClick={onExecute} algaeh-command="edit" title="Edit row">
// //     <EditIcon />
// //   </IconButton>
// // );

// // const DeleteButton = ({ onExecute }) => (
// //   <IconButton onClick={onExecute} algaeh-command="delete" title="Delete row">
// //     <DeleteIcon />
// //   </IconButton>
// // );

// // const CommitButton = ({ onExecute }) => (
// //   <IconButton onClick={onExecute} algaeh-command="submit" title="Save changes">
// //     <Done />
// //   </IconButton>
// // );

// // const CancelButton = ({ onExecute }) => (
// //   <IconButton
// //     color="secondary"
// //     algaeh-command="cancel"
// //     onClick={onExecute}
// //     title="Cancel changes"
// //   >
// //     <CancelIcon />
// //   </IconButton>
// // );

// // const commandComponents = {
// //   edit: EditButton,
// //   delete: DeleteButton,
// //   commit: CommitButton,
// //   cancel: CancelButton
// // };

// // const Command = ({ id, onExecute }) => {
// //   const CommandButton = commandComponents[id];
// //   return <CommandButton onExecute={onExecute} />;
// // };

// // const DateEditor = ({ value, onValueChange }) => (
// //   <TextField
// //     value={moment(value).format("YYYY-MM-DD")}
// //     type="date"
// //     onChange={e => onValueChange(e.target.value === value)}
// //   />
// // );

// // class Date extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.setState = {
// //       startDate: moment(this.props.value).format("YYYY-MM-DD")
// //     };
// //   }
// //   handleChange(event) {
// //     this.setState({
// //       startDate: moment(event.target.value).format("YYYY-MM-DD")
// //     });

// //     startDate = this.state.startDate;
// //   }
// //   render() {
// //     return (
// //       <div>
// //         <TextField
// //           onChange={this.handleChange.bind(this)}
// //           //onChange={e => onValueChange(e.target.value)}
// //           value={this.state.startDate}
// //           type="date"
// //         />
// //       </div>
// //     );
// //   }
// // }

// class PatientType extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       hims_d_visa_type_id: "",
//       visa_type: "",
//       visa_type_code: "",
//       visa_desc: "",
//       record_Status: "",
//       row: [],
//       id: "",
//       openDialog: false
//     };
//   }

//   componentDidMount() {
//     this.props.getVisatypes();
//   }

//   commitChanges({ added, changed, deleted }) {
//     if (added) {
//     }

//     if (changed) {
//       //Get all the details here and hit the api for changes.
//       // Isuse 1 : changed details are getting in the form of an array
//       // Solution : Disable multiple editing, and get the data of changed items.
//       //  /api/v1/masters/set/update/visa
//     }

//     if (deleted) {
//       this.setState({ openDialog: true });
//     }
//   }

//   componentWillReceiveProps() {}

//   btnClick() {}

//   changeStatus(e) {
//     this.setState({ patient_type_status: e.target.value });

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
//         window.location.reload();
//       },
//       onFailure: error => {
//         this.setState({ open: false });
//       }
//     });
//   }

//   handleDialogClose() {
//     this.setState({ openDialog: false });
//   }

//   changeTexts(e) {
//     this.setState({ [e.target.name]: e.target.value });
//   }

//   render() {
//     return (
//       <div>
//         <DeleteDialog
//           handleConfirmDelete={this.handleConfirmDelete.bind(this)}
//           handleDialogClose={this.handleDialogClose.bind(this)}
//           openDialog={this.state.openDialog}
//         />
//         <div className="patient_type">
//           <Paper className="container-fluid">
//             <form>
//               <div
//                 className="row"
//                 style={{
//                   padding: 20,
//                   marginLeft: "auto",
//                   marginRight: "auto"
//                 }}
//               >
//                 <AlgaehOptions
//                   div={{ className: "col-lg-3" }}
//                   label={{
//                     fieldName: "status",
//                     isImp: true
//                   }}
//                   optionsType="radio"
//                   group={{
//                     name: "Status",

//                     controls: [
//                       { label: "Active", value: "A" },
//                       { label: "Inactive", value: "I" }
//                     ]
//                   }}
//                 />

//                 {/* <div className="col-lg-3">
//                   <label>
//                     PATIENT TYPE CODE <span className="imp">*</span>
//                   </label>
//                   <br />
//                   <TextField className="txt-fld" />
//                 </div> */}
//                 <AlagehFormGroup
//                   div={{ className: "col-lg-3" }}
//                   label={{
//                     fieldName: "patient_type_code",
//                     isImp: true
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "patient_type_code",
//                     value: this.state.module_desc,
//                     events: {
//                       onChange: this.changeTexts.bind(this)
//                     }
//                   }}
//                 />

//                 {/* <div className="col-lg-3">
//                   <label>
//                     PATIENT TYPE NAME <span className="imp">*</span>
//                   </label>
//                   <br />
//                   <TextField className="txt-fld" />
//                 </div> */}

//                 <AlagehFormGroup
//                   div={{ className: "col-lg-3" }}
//                   label={{
//                     fieldName: "patient_type_name",
//                     isImp: true
//                   }}
//                   textBox={{
//                     className: "txt-fld",
//                     name: "patient_type_name",
//                     value: this.state.patien_type_name,
//                     events: {
//                       onChange: this.changeTexts.bind(this)
//                     }
//                   }}
//                 />

//                 <div className="col-lg-3 align-middle">
//                   <br />
//                   <Button
//                     onClick={this.btnClick.bind(this)}
//                     variant="raised"
//                     color="primary"
//                   >
//                     ADD TO LIST
//                   </Button>
//                 </div>
//               </div>
//             </form>

//             <div className="row form-details">
//               <div className="col">
//                 <Paper>
//                   {/* <Grid
//                     rows={this.props.visatypes}
//                     key={["{name : hims_d_visa_type_id}"]}
//                     columns={[
//                       { name: "visa_type_code", title: "Visa Type Code" },
//                       { name: "visa_type", title: "Visa Type" },
//                       { name: "created_date", title: "Added Date" }
//                     ]}
//                   >
//                     <DataTypeProvider
//                       formatterComponent={this.dateFormater}
//                       editorComponent={({ value }) => (
//                         <DateEditor value={value} />
//                       )}
//                       for={["created_date"]}
//                     />
//                     <SearchState />
//                     <IntegratedFiltering />
//                     <VirtualTable
//                       tableComponent={TableComponent}
//                       rowComponent={TableRow}
//                       height={400}
//                     />
//                     <TableHeaderRow />
//                     <Toolbar />
//                     <SearchPanel />
//                     <EditingState
//                       onCommitChanges={this.commitChanges.bind(this)}
//                     />
//                     <TableEditRow />
//                     <TableEditColumn
//                       width={120}
//                       showEditCommand
//                       showDeleteCommand
//                       commandComponent={Command}
//                     />
//                   </Grid> */}
//                 </Paper>
//               </div>
//             </div>
//           </Paper>
//         </div>
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
//   )(PatientType)
// );
