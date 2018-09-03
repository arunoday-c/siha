to create reports in html proper tag names are mandatory.

Parameter:
"data-parameter" this is for assigning parameter name to access value to report,
which is used for normal tags.
eg:
<p data-parameter="full_name"></p>
-------------End Parameter-----------------
Tags:
"data-list" attribute which is use for list type showing.
"data-list-parameter" attribute which is use to represent details.
eg:
<table>
    <tr>
        <th>Patient Code</th>
        <th>Patient Name</th>
    </tr>
    <tbody data-list="patient_details">
        <tr>
            <td data-list-parameter="patient_code"> </td>
            <td data-list-parameter="full_name"> </td>
        </tr>
    </tbody>
</table>
-------------End Tags-----------------
BarCode :
"data-barcode-parameter" selector to assign barcode,
" <img data-barcode-parameter="" />"
eg:
<img data-barcode-parameter="patient_code" />
-------------End BarCode-----------------