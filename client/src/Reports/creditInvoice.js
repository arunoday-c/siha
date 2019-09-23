import { header } from "./header";
import { signature_footer } from "./signature_footer";
import "../../src/index.scss";

export function printReport(data) {
  return `
    <div class="print-body">
    <header> ${header(data)} </header> 
        <section>
            <h2><span>Patient Details</span></h2>
            <table class="tableForLabel" cell-padding="0">
                <tr>
                    <td><label>رقم التسجيل الضريبي / TRN</label></td>
                    <td>: <span>301270966900003</span></td>
                    <td><label>النوع / Type</label></td>
                    <td>: <span>ائتمان/ Credit</span></td>
                </tr>
                <tr>
                    <td colspan="4" style="background:#f2f2f2;height:0px;"></td>
                </tr>
                <tr>
                    <td><label>رقم الملف الطبي / Reg. Number</label></td>
                    <td>: <span>PAT-1872346</span></td>
                    <td><label>رقم الفاتورة / Invoice No</label></td>
                    <td>: <span>005685</span></td>
                </tr>

                <tr>
                    <td><label>اسم المريض / Patient Name</label></td>
                    <td>: <span>NOWSHAD</span></td>
                    <td><label>اريخ الفاتورة / Invoice Date</label></td>
                    <td>: <span>04-11-2018</span></td>
                </tr>

                <tr>
                    <td><label>اسم الطبيب / Doctor</label></td>
                    <td>: <span>Dr. Samer Omar</span></td>
                    <td><label>Department / القسم</label></td>
                    <td>: <span>General Practioner(G.P)</span></td>
                </tr>

                <tr>
                    <td><label>شركة التأمين / InsuranceCompany</label></td>
                    <td>: <span>BUPA [Sub Insurer : ABBOTT SAUDI ARABIA TRADING LLC]</span></td>
                    <td colspan="2">BUPA ]شركة التأمين الفرعية : ABBOTT SAUDI ARABIA TRADING LLC[ ]رقم التسجيل الضريبي : </td>
                </tr>

                <tr>
                    <td><label>رقم البطاقة / رقم السياسة / Card No/ Policy No</label></td>
                    <td>: <span>123454323 / 427354001</span></td>
                    <td><label>حامل السياسة / PolicyHolder</label></td>
                    <td>: <span>ABBOTT SAUDIARABIA TRADING LLC</span></td>
                </tr>

                <tr>
                    <td><label>Class / Class</label></td>
                    <td colspan="3">: <span>Gold Class</span></td>
                </tr>
            </table>


        </section>
        <section>
            <h2><span>Bill Details</span></h2>
            <table class="tableForData" cell-padding="0">
                <thead>
                    <tr>
                        <th>SERVICE DESCRIPTION</th>
                        <th>QUANTITY</th>
                        <th>PRICE</th>
                        <th>DISCOUNT</th>
                        <th>NET AMOUNT</th>
                        <th>VAT AMOUNT</th>
                        <th>PATIENT SHARE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="7" class="tableSubHdg">Consultation</td>
                    </tr>
                    <tr>
                        <td>Norman-Consultation</td>
                        <td>1</td>
                        <td>300</td>
                        <td>0</td>
                        <td>300</td>
                        <td>3</td>
                        <td>60</td>
                    </tr>
                    <tr>
                        <td colspan="7" class="tableSubHdg">Lab</td>
                    </tr>
                    <tr>
                        <td>Norman-Consultation</td>
                        <td>1</td>
                        <td>300</td>
                        <td>0</td>
                        <td>300</td>
                        <td>3</td>
                        <td>60</td>
                    </tr>

                    <tr>
                        <td>Norman-Consultation</td>
                        <td>1</td>
                        <td>300</td>
                        <td>0</td>
                        <td>300</td>
                        <td>3</td>
                        <td>60</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <footer> ${signature_footer(data)}</footer>
    </div>`;
}
