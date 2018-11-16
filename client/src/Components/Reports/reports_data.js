import React from "react";
import Appointment from "./Components/Appointment/Appointment";
import Asset from "./Components/Asset/Asset";
import RevenueCollection from "./Components/RevenueCollection/RevenueCollection";
import Finance from "./Components/Finanace/Finance";
import General from "./Components/General/General";
import Inventory from "./Components/Inventory/Inventory";
import Pharmacy from "./Components/Pharmacy/Pharmacy";
import Referral from "./Components/Referral/Referral";
import Insurance from "./Components/Insurance/Insurance";
import Laboratory from "./Components/Laboratory/Laboratory";
import Package from "./Components/Package/Package";
import VatReports from "./Components/VatReports/VatReports";
import FrontDesk from "../../Search/FrontDesk.json";
export default [
  {
    name: "APPOINTMENTS",
    submenu: [
      {
        subitem: "Appointment Availability Report",
        template_name: "appt_availability",
        reportParameters: [
          {
            type: "date",
            name: "from_date",
            label: "From Date",
            isImp: true,
            others: {
              maxDate: new Date(),
              minDate: null
            }
          },
          {
            type: "dropdown",
            name: "provider_id",
            label: "Doctor",
            initialLoad: true,
            link: {
              uri: "/department/get/get_All_Doctors_DepartmentWise",
              schema: [{ name: "provider_id", response: "doctors" }]
            },
            events: {
              onChange: (reportState, currentValue) => {
                debugger;
              }
            },
            dataSource: {
              textField: "full_name",
              valueField: "employee_id",
              data: undefined
            }
          },
          {
            type: "search",
            name: "patient_code",
            label: "Patient Code",
            search: {
              searchName: "patients",
              columns: FrontDesk,
              schema: [
                { name: "patient_code", response: "patient_code" },
                { name: "hims_d_patient_id", response: "hims_d_patient_id" }
              ]
            }
          },
          {
            type: "checkbox",
            name: "employee_type",
            label: "Not able",
            default: true
          }
        ] //() => <Appointment ui="availability" />
      },
      {
        subitem: "Appointment Details Patient Wise",
        template_name: "appt_availability",
        reportParameters: () => <Appointment ui="appt_details_pat_wise" />
      },
      {
        subitem: "Appointment List",
        template_name: "appt_availability",
        reportParameters: () => <Appointment ui="appt_list" />
      },
      {
        subitem: "Appointment List - Cancellations",
        template_name: "appt_availability",
        reportParameters: () => <Appointment ui="appt_cancellations" />
      },
      {
        subitem: "Appointment List - Detailed",
        template_name: "appt_availability",
        reportParameters: () => <Appointment ui="appt_list_detailed" />
      },
      // {
      //   subitem: "Appointment List - Resources",
      //   reportParameters: () => <Appointment ui="appt_list_resources" />
      // },
      {
        subitem: "Patient Recall Report",
        template_name: "appt_availability",
        reportParameters: () => <Appointment ui="pat_recall_report" />
      }
      // {
      //   subitem: "Rescheduled Resource Appointments",
      //   reportParameters: () => <Appointment ui="rescheduled_resources_appts" />
      // }
    ]
  },

  {
    name: "ASSET",
    submenu: [
      {
        subitem: "Asset Warranty Expiry Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Asset ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "COLLECTION/REVENUE",
    submenu: [
      {
        subitem: "Adjusted Advance Details",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Daily Billing Summary",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Daily Transaction Register - Consolidated",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctorwise Revenue Report",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "DSR Report",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Advance Payments",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Bills",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Credit Notes/ Refunds",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Credit Notes/ Refunds - Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Discount Given",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Discount Given - Invoice Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Invoices - Cash/Credit",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Reciepts",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Sponsor Bills",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Outstanding Report - Patientwise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Outstanding",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Outstanding Ageing Report",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Outstanding Ageing Report - Department Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Analysis - Accumulated Summary",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Analysis - Category Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Analysis - Day Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Analysis - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Analysis - Doctor Wise - Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Service Wise Income",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Service Wise Income - Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Service Wise Revenue - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Total Collection - Month - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      },
      {
        subitem: "WriteOff Details Report",
        template_name: "asset_war_exp",
        reportParameters: () => <RevenueCollection ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "FINANCE",
    submenu: [
      {
        subitem: "Accounts Statement Report - PatientWise",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ageing Report-Direct Sale",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Balance Sheet Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cash Flow Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cost Analysis - Monthly Summary",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cost Analysis Consumables - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Cost Analysis Summary - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Day Book",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger - Bank Reconciliation",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger Consolidated",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Ledger Consolidated",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Payment Received Invoices",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Payment Received Invoices - Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "PDC Issued",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "PDC Received",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Profit and Loss",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Profit And Loss MonthWise Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Reconciliation Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Revenue Ledger Report - Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Trial Balance",
        template_name: "asset_war_exp",
        reportParameters: () => <Finance ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "GENERAL",
    submenu: [
      {
        subitem: " Count Of Medications - By Trade Name",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctor Wise Patient Statistics",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "File Tracking Report ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Growth Chart - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Investigations Doing Outside",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Discharged Patients - Day Care",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " List of Discharged Patients - Day Care ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " List Of Encounter Reopen",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Insurance Providers ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Invoices - Specific Patient",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Patients",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " List Of Patients - Demography Details",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Surgery Patients - Day Care",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Marketing - Sources Report Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Purchase Order Report - Supplier Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Medical Service Illustrative Report ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "No of Consultations - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Patient Encounter Status Report ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Encounter Type Report",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Per Day Analysis - Doctor Wise ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Wise Payment History",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Patient Wise Vital Signs Report",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Period Wise Consultations",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Period Wise Investigations",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Period Wise Treatments",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Preapproval Report",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Price List - Investigations",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Price List - Treatments ",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Salary Calculation - Doctors",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sick Leave Report",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT - Nurse Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      },
      {
        subitem: " TestResult Report",
        template_name: "asset_war_exp",
        reportParameters: () => <General ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "INVENTORY REPORTS",
    submenu: [
      {
        subitem: " Inventory of Retail Products",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Item Opening Stock Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Consumption Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Expiry Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Issued Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Items Received Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Material Request Report ",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Material Request Report - Item Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Material Request Report - Office Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Pending Purchase Order Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Pending Purchase Order Report - Item Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Product List",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Order Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Order Report - Item Wise  ",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Order Report - Supplier Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Register Itemwise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Purchase Report - Item Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Adjustments Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Register",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Register Report - Category Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Register Report - Department Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Remaining - Category Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Remaining - Department Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Transaction",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Supplier Discount Received - Invoice Wise ",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Supplier List",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Supplier Overdue - Ageing Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Supplier Wise Invoices",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Supplier Wise Invoices - Pending",
        template_name: "asset_war_exp",
        reportParameters: () => <Inventory ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "PHARMACY",
    submenu: [
      {
        subitem: "Daily Collection - Consolidated",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Bill Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statement - Date Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "GP Statment Item wise Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Item Sales Report - Category Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Item Sales Report - Customer Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Item Sales Report - User Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Claims Generated",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Receipts",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List Of Sales Invoice",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Outstanding Invoices",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Prescribed/Dispensed Medicines Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Product Movement Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sale Register - Date Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Collection Summary Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Bill Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Credit Customer",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Date Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Detailed",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Doctor Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Product/Supplier Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report - Summary",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report Detailed - Item Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Report Yearly - Month Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Sales Return Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Register - Item Stock Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Stock Summary - MRP/Purchase Rate",
        template_name: "asset_war_exp",
        reportParameters: () => <Pharmacy ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "REFERRAL",
    submenu: [
      {
        subitem: "Clinic - Doctor Invoices Summary",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Clinic / Doctor Invoices",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctor's Incentives",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Incentives",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Monthly Summary - Referred Cases",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Outside Referrals",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referral Clinics - Overdue Payments",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referral Clinics - Overdue Receipts",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referrals External",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Referrals Internal",
        template_name: "asset_war_exp",
        reportParameters: () => <Referral ui="asset_warty_exp_rep" />
      }
    ]
  },
  {
    name: "INSURANCE",
    submenu: [
      {
        subitem: "Claim Rejection Reports",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Outstanding",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Outstanding - Remittence Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Received",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Received - Remittence Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Rejected - Reason Count",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Claims Summary - Monthly",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Company wise Claim Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Consolidated",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Overdue",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Revenue Received - Ageing Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Revenue Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Revenue Report - Consolidated",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Insurance Status Report - Invoice Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Claims Generated",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Claims Write Off",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Services Report -Undelivered",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary Of Claims Generated - Formats",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary of Insurance Consolidated - Company Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary of Insurance Consolidated - Year Wise",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Summary of Insurance Overdue and Outstanding",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Write Off Claims List-Servicewise",
        template_name: "asset_war_exp",
        reportParameters: () => <Insurance ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "LABORATORY",
    submenu: [
      {
        subitem: " Accession TAT",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "  Antimicrobial Resistence Surveillance Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Clinic wise Net Sale Report  ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Collection Summary - Investigations",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Delete Bill Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Doctor wise Test Register",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Email Delivery Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Email Log",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Equipment Wise Test Details  ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Equipment Wise Test Param Details",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Incentive Payable Report ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Incentive Receivable Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Lab Result Statistics Report     ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "List of Credit Bills ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Office Wise Clinic Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Pending Reports  ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Price List - Lab Test",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Print TRF   ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Problem Samples Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Revenue Summary ",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Reverse Authentication Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "SMS Log",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "TAT- Analytical Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Test Wise Income",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " TRF List",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Unpaid Bill Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      },
      {
        subitem: " Workload Register",
        template_name: "asset_war_exp",
        reportParameters: () => <Laboratory ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "PACKAGE",
    submenu: [
      {
        subitem: "Package Advance-List of Receipts",
        template_name: "asset_war_exp",
        reportParameters: () => <Package ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Package History of a Patient",
        template_name: "asset_war_exp",
        reportParameters: () => <Package ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Package Outstanding",
        template_name: "asset_war_exp",
        reportParameters: () => <Package ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Wellness Package Report",
        template_name: "asset_war_exp",
        reportParameters: () => <Package ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Package Item List of Reports",
        template_name: "asset_war_exp",
        reportParameters: () => <Package ui="asset_warty_exp_rep" />
      },
      {
        subitem: "Wellness Package Report-Biannually Statistics",
        template_name: "asset_war_exp",
        reportParameters: () => <Package ui="asset_warty_exp_rep" />
      }
    ]
  },

  {
    name: "VAT REPORTS",
    submenu: [
      {
        subitem: "VAT Report Detailed : Period Wise / Nationality Wise",
        template_name: "vat_report_detailed",
        reportParameters: () => <VatReports ui="vat_report_detailed" />
      }
    ]
  }
];
