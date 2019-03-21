import React, { Component } from "react";
import { payrollHeader } from "./payrollHeader";
import {
  AlgaehDataGrid,
  AlgaehLabel
} from "../../Components/Wrapper/algaehWrapper";
export default class PrintReport extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data } = this.props;
    return (
      <div class="print-body">
        <header dangerouslySetInnerHTML={{ __html: payrollHeader(data) }}>
          {" "}
        </header>
        <h2>
          <span>Salary Details</span>
        </h2>
        <AlgaehDataGrid
          id="salary_statement"
          columns={[
            {
              fieldName: "employee_code",
              label: <AlgaehLabel label={{ forceLabel: "Employee Code" }} />
            },
            {
              fieldName: "employee_name",
              label: <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
            },
            {
              fieldName: "total_earnings",
              label: <AlgaehLabel label={{ forceLabel: "Total Earnings" }} />
            },
            {
              fieldName: "total_deductions",
              label: <AlgaehLabel label={{ forceLabel: "Total Deductions" }} />
            },
            {
              fieldName: "total_contributions",
              label: (
                <AlgaehLabel label={{ forceLabel: "Total Contributions" }} />
              )
            },
            {
              fieldName: "net_salary",
              label: <AlgaehLabel label={{ forceLabel: "Net Salary" }} />
            },
            {
              fieldName: "advance_due",
              label: <AlgaehLabel label={{ forceLabel: "Advance Due" }} />
            },
            {
              fieldName: "loan_due_amount",
              label: <AlgaehLabel label={{ forceLabel: "Loan Due Amount" }} />
            }
          ]}
          keyId="salary_statement"
          dataSource={{
            data: data
          }}
        />
      </div>
    );
  }
}
