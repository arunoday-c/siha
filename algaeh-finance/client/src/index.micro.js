import "react-sortable-tree/style.css";
import "./algaehTableComponentStyle.scss";
import "./styles/index.scss";
import "algaeh-react-components/dist/index.css";
import Accounts from "./Components/FinanceAccounts";
import JournalVoucher from "./Components/JournalVoucher";
import FinanceReports from "./Components/FinanceReports";
import Mapping from "./Components/Mapping";
import FinanceOptions from "./Components/FinanceOptions";
import CostCenter from "./Components/CostCenterPage";
import CostCenterMaster from "./Components/CostCenterMaster";
import JournalAuthorization from "./Components/JournalAuthorization";
import QuickSearchFinance from "./Components/QuickSearchFinance";
import CustomerListFinance from "./Components/CustomerListFinance";
import CustomerPayment from "./Components/CustomerListFinance/CustomerPayment";
import SupplierListFinance from "./Components/SupplierListFinance";
import SupplierPayment from "./Components/SupplierListFinance/SupplierPayment";
import ProcessAccountingEntry from "./Components/ProcessAccountingEntry";
import PrePayment from "./Components/PrePayment";
import AccountsReceivable from "./Components/AccountsReceivable";
import AccountsPayable from "./Components/AccountsPayable";
const Pages = {
  JournalAuthorization,
  QuickSearchFinance,
  CustomerListFinance,
  CustomerPayment,
  SupplierListFinance,
  SupplierPayment,
  PrePayment,
  Accounts,
  JournalVoucher,
  FinanceReports,
  Mapping,
  FinanceOptions,
  CostCenter,
  CostCenterMaster,
  ProcessAccountingEntry,
  AccountsReceivable,
  AccountsPayable,
};

window.FinanceComponent = Pages;
