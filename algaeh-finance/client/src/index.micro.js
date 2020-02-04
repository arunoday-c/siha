import Accounts from "./Components/FinanceAccounts";
import Transactions from "./Components/Transactions";
import JournalVoucher from "./Components/JournalVoucher";
import FinanceReports from "./Components/FinanceReports";
import Mapping from "./Components/Mapping";
import FinanceOptions from "./Components/FinanceOptions";
import CostCenter from "./Components/CostCenterPage";
import CostCenterMaster from "./Components/CostCenterMaster";
import JournalAuthorization from "./Components/JournalAuthorization";
import "react-sortable-tree/style.css";
const Pages = {
  Accounts,
  Transactions,
  JournalVoucher,
  FinanceReports,
  Mapping,
  FinanceOptions,
  CostCenter,
  CostCenterMaster,
  JournalAuthorization
};

window.FinanceComponent = Pages;
