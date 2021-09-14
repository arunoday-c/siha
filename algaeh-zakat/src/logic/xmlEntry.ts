// import { Invoice } from "ubl-builder2";
import { create } from "xmlbuilder2";
export async function generateXml() {
  try {
    // //@ts-ignore
    // const invoice = new Invoice("BT-106", {});

    // invoice.addProperty(
    //   "xmlns:qdt",
    //   "urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2"
    // );
    // invoice.addProperty(
    //   "xmlns:ccts",
    //   "urn:oasis:names:specification:ubl:schema:xsd:CoreComponentParameters-2"
    // );
    // invoice.addProperty(
    //   "xmlns:stat",
    //   "urn:oasis:names:specification:ubl:schema:xsd:DocumentStatusCode-1.0"
    // );
    // invoice.addProperty(
    //   "xmlns:cbc",
    //   "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
    // );
    // invoice.addProperty(
    //   "xmlns:cac",
    //   "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
    // );
    // invoice.addProperty(
    //   "xmlns:udt",
    //   "urn:un:unece:uncefact:data:draft:UnqualifiedDataTypesSchemaModule:2"
    // );
    // invoice.addProperty(
    //   "xmlns",
    //   "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
    // );
    // invoice.setIssueDate("2021-09-08");
    // invoice.addInvoicePeriod({
    //   startDate: "2021-09-01",
    //   endDate: "2021-09-09",
    // });
    // /**
    //  * Sum of invoice line net amount = cac:LegalMonetaryTotal /cbc:LineExtensionAmount
    //  * Sum of allowances on document level = cac:LegalMonetaryTotal/cbc:A llowanceTotalAmount
    //  * Invoice total amount with VAT = cac:LegalMonetaryTotal /cbc:TaxInclusiveAmount
    //  * Paid amount = cac:LegalMonetaryTotal /cbc:PrepaidAmount
    //  * Amount due for payment = cac:LegalMonetaryTotal /cbc:PayableAmount
    //  */
    // //@ts-ignore
    // invoice.setLegalMonetaryTotal({
    //   lineExtensionAmount: "300",
    //   allowanceTotalAmount: "200",
    //   taxInclusiveAmount: "10",
    //   prepaidAmount: "500",
    //   payableAmount: "450",
    // });
    // /**
    //  * Invoice total VAT amount = cac:TaxTotal/cbc:TaxAmount
    //  * Invoice total VAT amount in accounting currency = cac:TaxTotal/cbc:TaxAmount
    //  */
    // //@ts-ignore
    // invoice.addTaxTotal({
    //   taxAmount: "10",
    // });

    // //todo:Price not yet found.<cac:Price>

    // /**
    //  * <cac:AllowanceCharge>
    //  */
    // // invoice.addAllowanceCharge({
    // //   ChargeIndicator: false,
    // //   AllowanceChargeReasonCode: 95,
    // //   AllowanceChargeReason: "Discount",
    // //   Amount: "102",
    // // });

    // /**
    //  * <cac:AllowanceCharge>
    //  */

    // invoice.addAllowanceCharge({
    //   ChargeIndicator: false,
    //   MultiplierFactorNumeric: 10,
    //   Amount: 200,
    //   BaseAmount: 2000,
    // });
    // console.log(invoice.getXml());
    const root = create({ version: "1.0" })
      .ele("Invoice", {
        "xmlns:qdt":
          "urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2",
        "xmlns:ccts":
          "urn:oasis:names:specification:ubl:schema:xsd:CoreComponentParameters-2",
        "xmlns:stat":
          "urn:oasis:names:specification:ubl:schema:xsd:DocumentStatusCode-1.0",
        "xmlns:cbc":
          "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
        "xmlns:cac":
          "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        "xmlns:udt":
          "urn:un:unece:uncefact:data:draft:UnqualifiedDataTypesSchemaModule:2",
        xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
      })
      .ele("cbc:UBLVersionID")
      .txt("UBL 2.1")
      .up()
      .ele("cbc:ID")
      .txt("BT-106")
      .up()
      .ele("cbc:IssueDate")
      .txt("2021-09-08")
      .up()
      .ele("cbc:IssueTime")
      .txt("21:48:05-05:00")
      .up()
      .ele("cac:InvoicePeriod")
      .ele("cbc:StartDate")
      .txt("2021-09-01")
      .up()
      .ele("cbc:EndDate")
      .txt("2021-09-09")
      .up()
      .up()
      .ele("cac:TaxTotal")
      .ele("cbc:TaxAmount")
      .txt("10")
      .up()
      .ele("cac:LegalMonetaryTotal")
      .ele("cbc:LineExtensionAmount")
      .txt("300")
      .up()
      .ele("cbc:TaxInclusiveAmount")
      .txt("10")
      .up()
      .ele("cbc:AllowanceTotalAmount")
      .txt("20")
      .up()
      .ele("cbc:PrepaidAmount")
      .txt("500")
      .up()
      .ele("cbc:PayableAmount")
      .txt("450")
      .up()
      .up();
    // convert the XML tree to string
    const xml = root.end({ prettyPrint: true });
    console.log(xml);
  } catch (e) {
    console.error("Error===>", e);
  }
}
