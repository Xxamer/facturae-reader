function getFacturae() {}

async function readFacturae(file) {
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "application/xml");

  // Namespace de Facturae 3.2.2
  const NS = "http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml";

  const getText = (parent, tag) => {
    const el = parent.getElementsByTagNameNS(NS, tag)[0];
    return el ? el.textContent : "";
  };

  const number = getText(xmlDoc, "BatchIdentifier");
  const totalInvoiceAmount = getText(xmlDoc, "TotalAmount");
  const taxRate = getText(xmlDoc, "TaxRate");
  const date = getText(xmlDoc, "IssueDate");
  const totalWithoutTax = getText(xmlDoc, "TotalGrossAmountBeforeTaxes");
  const taxes = getText(xmlDoc, "TotalTaxOutputs");

  const seller = xmlDoc.getElementsByTagNameNS(NS, "SellerParty")[0];
  const buyer = xmlDoc.getElementsByTagNameNS(NS, "BuyerParty")[0];
  const invoiceLines = xmlDoc.getElementsByTagNameNS(NS, "InvoiceLine");

  // ---- Seller Data ----
  let sellerName = "", sellerAddress = "", sellerTown = "", sellerProvince = "", sellerPostCode = "";
  if (seller) {
    if (seller.getElementsByTagNameNS(NS, "LegalEntity").length > 0) {
      // Empresa
      sellerName = getText(seller, "CorporateName");
    } else if (seller.getElementsByTagNameNS(NS, "Individual").length > 0) {
      // Persona física
      const individual = seller.getElementsByTagNameNS(NS, "Individual")[0];
      sellerName = [
        getText(individual, "Name"),
        getText(individual, "FirstSurname"),
        getText(individual, "SecondSurname")
      ].filter(Boolean).join(" ");
    }
    sellerAddress = getText(seller, "Address");
    sellerTown = getText(seller, "Town");
    sellerProvince = getText(seller, "Province");
    sellerPostCode = getText(seller, "PostCode");
  }

  // ---- Buyer Data ----
  let buyerName = "", buyerAddress = "", buyerTown = "", buyerProvince = "", buyerPostCode = "";
  if (buyer) {
    if (buyer.getElementsByTagNameNS(NS, "LegalEntity").length > 0) {
      buyerName = getText(buyer, "CorporateName");
    } else if (buyer.getElementsByTagNameNS(NS, "Individual").length > 0) {
      const individual = buyer.getElementsByTagNameNS(NS, "Individual")[0];
      buyerName = [
        getText(individual, "Name"),
        getText(individual, "FirstSurname"),
        getText(individual, "SecondSurname")
      ].filter(Boolean).join(" ");
    }
    buyerAddress = getText(buyer, "Address");
    buyerTown = getText(buyer, "Town");
    buyerProvince = getText(buyer, "Province");
    buyerPostCode = getText(buyer, "PostCode");
  }

  // ---- Items ----
  let itemsFacturae = [];
  for (let i = 0; i < invoiceLines.length; i++) {
    const description = getText(invoiceLines[i], "ItemDescription");
    const quantity = getText(invoiceLines[i], "Quantity");
    const price = getText(invoiceLines[i], "UnitPriceWithoutTax");

    itemsFacturae.push({
      product: description,
      quantity: quantity,
      price: price,
    });
  }

  return {
    invoice: {
      number: number,
      date: date,
      total: totalInvoiceAmount,
      taxPrice: taxes,
      taxRate: taxRate,
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
  };
}

export { getFacturae, readFacturae };
