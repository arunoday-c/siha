# Patient Registration & Visit Creation

### Functionalities Exists

1. Can create new Patient & Visit (Consultation/Non-Consultation).
2. For existing patient can create Visit (Consultation/Non-Consultation).
3. Collecting Advance and Refunding the Advance Amount.
4. Utilizing the multi visit package for visit (Consultation/Non-Consultation).
5. Collection of package Advance.

### APIs Used in te screen

1. Patient Finder (Global Search => spotlightSearch.json frontDesk/patients => Search Name "patients").
2. Select the patient from finder, fetching Demographic Details from API (uri: "/frontDesk/get",) in module: "frontDesk".
3. Insurance Add button (Global Search => Insurance.json => Search Name "insurance").
4. Selecting the Doctor/Insurance billing calculation from API (Detail calculation uri: "/billing/getBillDetails",
   Header calculation uri: "/billing/billingCalculations") in module: "billing".
5. Save Button
   a. If new patient API (uri: "/frontDesk/add") in module: "frontDesk".
   b. If existing patient API (uri: "/frontDesk/update") in module: "frontDesk".
6. Advance / Refund API (uri: "/billing/patientAdvanceRefund") in module: "billing".
7. Package Advance / Refund API (uri: "/billing/patientPackageAdvanceRefund") in module: "billing".
8. Package Utilization API (Detail calculation uri: "/billing/getBillDetails",
   Header calculation uri: "/billing/billingCalculations") in module: "billing".
9. Clear button - clears the data.
