function getFacturae() {
  return "FacturaeTooling POC";
}

async function readFacturae(file) {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid input: File is required");
  }
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Invalid XML format");
  }
  // Detect version
  const root = xmlDoc.documentElement;
  const NS_322 =
    "http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml";
  const NS_321 = "http://www.facturae.es/Facturae/2009/v3.2.1/Facturae";

  // Primero, detecta la versión base por namespace
  let baseVersion =
    root.namespaceURI === NS_322
      ? "3.2.2"
      : root.namespaceURI === NS_321
      ? "3.2.1"
      : "3.1";

  let useNS = baseVersion === "3.2.2" || baseVersion === "3.2.1";
  let ns = baseVersion === "3.2.2" ? NS_322 : NS_321;

  // Ahora puedes declarar getText
  const getText = (parent, tag) => {
    if (!parent) return "";
    if (useNS) {
      const el = parent.getElementsByTagNameNS(ns, tag)[0];
      return el?.textContent ?? "";
    }
    const el = parent.getElementsByTagName(tag)[0];
    return el?.textContent ?? "";
  };

  // Ahora puedes obtener SchemaVersion y la versión final
  const schemaVersion = getText(xmlDoc, "SchemaVersion");
  const version = schemaVersion || baseVersion;

  const number = getText(xmlDoc, "BatchIdentifier");
  const totalInvoiceAmount = getText(xmlDoc, "TotalAmount");
  const taxRate = getText(xmlDoc, "TaxRate");
  const date = getText(xmlDoc, "IssueDate");
  const totalWithoutTax = getText(xmlDoc, "TotalGrossAmountBeforeTaxes");
  const taxes = getText(xmlDoc, "TotalTaxOutputs");

  const seller = useNS
    ? xmlDoc.getElementsByTagNameNS(ns, "SellerParty")[0]
    : xmlDoc.getElementsByTagName("SellerParty")[0];

  const buyer = useNS
    ? xmlDoc.getElementsByTagNameNS(ns, "BuyerParty")[0]
    : xmlDoc.getElementsByTagName("BuyerParty")[0];

  const invoiceLines = useNS
    ? xmlDoc.getElementsByTagNameNS(ns, "InvoiceLine")
    : xmlDoc.getElementsByTagName("InvoiceLine");

  // Get seller details
  const sellerName = getText(seller, "CorporateName");
  const sellerAddress = getText(seller, "Address");
  const sellerTown = getText(seller, "Town");
  const sellerProvince = getText(seller, "Province");
  const sellerPostCode = getText(seller, "PostCode");

  // Get buyer details
  const buyerName = getText(buyer, "CorporateName");
  const buyerAddress = getText(buyer, "Address");
  const buyerTown = getText(buyer, "Town");
  const buyerProvince = getText(buyer, "Province");
  const buyerPostCode = getText(buyer, "PostCode");
  let itemsFacturae = [];
  for (let i = 0; i < invoiceLines.length; i++) {
    itemsFacturae.push({
      product: getText(invoiceLines[i], "ItemDescription"),
      quantity: getText(invoiceLines[i], "Quantity"),
      price: getText(invoiceLines[i], "UnitPriceWithoutTax"),
    });
  }

  return {
    invoice: {
      number,
      date,
      total: totalInvoiceAmount,
      taxPrice: taxes,
      taxRate,
      priceWithoutTax: totalWithoutTax,
    },
    seller: {
      name: sellerName,
      address: sellerAddress,
      town: sellerTown,
      province: sellerProvince,
      postal_code: sellerPostCode,
    },
    buyer: {
      name: buyerName,
      address: buyerAddress,
      town: buyerTown,
      province: buyerProvince,
      postal_code: buyerPostCode,
    },
    products: itemsFacturae,
    version,
  };
}

export { getFacturae, readFacturae };
