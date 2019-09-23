import "../../src/index.scss";

export function printReport(data) {
  return `
    
    <table class="UCAF20_Report">
        <tr>
            <th colspan="6">
                <h4>UCAF 2.0</h4>
            </th>
        </tr>
         <tr>
            <td colspan="5">To be completed by the reception/nurse</td>
            <td rowspan="7"><img src="https://qph.fs.quoracdn.net/main-qimg-fa8ca55b5fc69716c7d86e4c2e00ad2f"
                   height="200" /></td>
         </tr>
        <tr>
            <td><label>Provider Name</label></td>
            <td colspan="5" data-parameter="hospital_name"></td>
        </tr>
        <tr>
            <td><label>Insurance Company Name</label></td>
            <td colspan="2" data-parameter="pri_insurance_company"></td>
            <td><label>TPA Company Name</label> </td>
            <td data-parameter="pri_TPA_company_name"></td>
        </tr>
        <tr>
            <td><label>Patient File No</label></td>
            <td colspan="2" data-parameter="patient_code"></td>
            <td><label>Department</label></td>
            <td data-parameter="sub_department_name"></td>
        </tr>
        <tr>
            <td>Single</td>
            <td colspan="2" >Married</td>
            <td>Plan Type</td>
            <td></td>
        </tr>
        <tr>
            <td>Date Of Visit</td>
            <td colspan="2" data-parameter="visit_date"> </td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td>New Visit (<span>&#10004;</span>)</td>
            <td>Follow Up ()</td>
            <td>Refill ()</td>
            <td>Walk In (<span>&#10004;</span>)</td>
            <td>Referal (<span></span>)</td>
            
        </tr>
        <tr>
            <td colspan="6" style="background:#f2f2f2;height:20px;"></td>
        </tr>
        <tr>
            <td colspan="6">To be completed by Attending PHYSICIAN: Please tick (&#10004;)</td>
        </tr>
        <tr>
            <td>Inpatient (<span></span>)</td>
            <td>Outpatient (<span></span>)</td>
            <td>Emergency Case (<span></span>)</td>
            <td colspan="3">Emergency Care Level 1(<span></span>) | 2(<span></span>) | 3(<span></span>)</td>
        </tr>
        <tr>
            <td>BP Sys: 108</td>
            <td>BP Dias: 83</td>
            <td>Pulse: 88</td>
            <td>Temp: 37</td>
            <td colspan="2">Duration Of Illness:</td>
        </tr>
        <tr>
            <td colspan="6">Chief Complaint and Main Symptoms: <span>patient complained of easy fatigability, low
                    energy
                    and weakness, cold intolerance and muscle cramps need to check again TSH and FT4 for dose of
                    medicine</span></td>
        </tr>
        <tr>
            <td colspan="6">Significant Signs: <span>patient complained of easy fatigability, low energy and weakness,
                    cold
                    intolerance and muscle cramps need to check again TSH and FT4 for dose of medicine</span></td>
        </tr>
        <tr>
            <td colspan="6">Other Conditions: <span>patient complained of easy fatigability, low energy and weakness,
                    cold
                    intolerance and muscle cramps need to check again TSH and FT4 for dose of medicine</span></td>
        </tr>
        <tr>
            <td colspan="6">Diagnosis: <span>E03.9 - Hypothyroidism, unspecified</span></td>
        </tr>
        <tr>
            <td>Principal Code: <span>E03.9 - Hypothyroidism, unspecified</span></td>

            <td>2nd Code: <span>E03.9 - Hypothyroidism, unspecified</span></td>

            <td>3rd Code:<span>E03.9 - Hypothyroidism, unspecified</span></td>

            <td>4th Code: <span>E03.9 - Hypothyroidism, unspecified</span></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="6">Please tick (&#10004;) where appropriate</td>
        </tr>
        <tr>
            <td>Chronic (&#10004;)</td>
            <td>Congenital (&#10004;)</td>
            <td>RTA (&#10004;)</td>
            <td>Work Related (&#10004;)</td>
            <td>Vaccination (&#10004;)</td>
            <td>Check-Up (&#10004;)</td>
        </tr>
        <tr>
            <td>Psychiatric (&#10004;)</td>
            <td>Infertility (&#10004;)</td>
            <td>Pregnancy (&#10004;)</td>
            <td>Indicate LMP (&#10004;)</td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td colspan="6">Suggestive line (s) of management: Kindly, enumerate the recommended investigation, and /
                orprocedures For outpatient approval only:</td>
        </tr>
        <tr>
            <td colspan="6">
                <table class="table">
                    <thead class="thead-light table-striped table-bordered">
                        <tr>
                            <th scope="col">Code</th>
                            <th scope="col">Description/Service</th>
                            <th scope="col">Type</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Cost</th>
                        </tr>
                    </thead>
                    <tbody data-list="servicesTable">

                    </tbody>
                </table>
                <script id="servicesTable" type="text/x-algaeh-template">
                    <tr>
                        <td scope="row" data-list-parameter="cpt_code">10014</td>
                        <td data-list-parameter="description">Internal Medicine Fee- Consultant -Dr. Waleed Al Baker</td>
                        <td data-list-parameter="service_type">Consultation</td>
                        <td data-list-parameter="cpt_qty">1</td>
                        <td data-list-parameter="cpt_amt">80.00</td>
                    </tr>
                  
                 </script>
            </td>
        </tr>
        <tr>
            <td colspan="6">Provider's Approval/Coding Staff must review/code the recommended service(s) and allocate
                cost and
                complete the following:</td>
        </tr>
        <tr>
            <td>Completed/Coded By</td>
            <td>.........................</td>
            <td>Signature</td>
            <td>.........................</td>
            <td>Date</td>
            <td>.........................</td>
        </tr>
        <tr>
            <td colspan="6">
                <table class="table">
                    <thead class="thead-light table-striped table-bordered">
                        <tr>
                            <th scope="col">Medication Name (Generic Name)</th>
                            <th scope="col">Type</th>
                            <th scope="col">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td scope="row">10014</td>
                            <td>Internal Medicine Fee- Consultant -Dr. Waleed Al Baker</td>
                            <td>Consultation</td>
                        </tr>
                        <tr>
                            <td scope="row">10014</td>
                            <td>Internal Medicine Fee- Consultant -Dr. Waleed Al Baker</td>
                            <td>Consultation</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td colspan="2">Is Case Management From ( CMFI.0 ) Included</td>
            <td colspan="4">Yes (&#10004;) | No ( )</td>
        </tr>
        <tr>
            <td colspan="2">Please Specify Possible line of Management When Applicable:</td>
            <td colspan="4">.................................................................................................................
                ...................................................................................</td>
        </tr>
        <tr>
            <td colspan="3">Estimated Length of Stay: <b>Days</b></td>
            <td colspan="3">Expected Date of Admission: <b>20th Nov 2018</b></td>
        </tr>

        <tr>
            <td colspan="6" style="background:#f2f2f2;height:20px;"></td>
        </tr>
        <tr>
            <td colspan="3">I hereby certify that ALL information mentioned are correct and that the medical services
                shown on
                this form were medically indicated and necessary for the management of this case.</td>
            <td colspan="3">I hereby certify that all statements and information provided concerning patient
                Identification and the
                present illness or injury are TRUE.
            </td>
        </tr>

        <tr>
            <td colspan="3">Dr. Waleed Al Baker</td>
            <td colspan="3">....................................................................</td>
        </tr>
        <tr>
            <td colspan="3">Signature and Stamp</td>
            <td colspan="3">Name and Relationship(if Guardian) Signature</td>
        </tr>
        <tr>
            <td colspan="3">29/10/2018</td>
            <td colspan="3">29/10/2018</td>
        </tr>
        <tr>
            <td colspan="6" style="background:#f2f2f2;height:20px;"></td>
        </tr>
        <tr>
            <td>For Insurance Company Use Only:</td>
            <td>Approved: (&#10004;)</td>
            <td>Not Approved: (&#10004;)</td>
            <td>Approval No: (&#10004;)</td>
            <td>Approval validity (&#10004;)</td>
            <td>............. Days</td>
        </tr>
        <tr>
            <td colspan="2">Comments (include approved days/services if different from the requested):</td>
            <td colspan="4">.................................................................................................................
                ...................................................................................</td>
        </tr>
        <tr>
            <td colspan="6"></td>
        </tr>
        <tr>
            <td>Approved/Disapproved By:</td>
            <td>..........................................................</td>
            <td>Signature: (&#10004;)</td>
            <td>..........................................................</td>
            <td>Date</td>
            <td>..../..../.....</td>
        </tr>
    </table>
    
    `;
}
