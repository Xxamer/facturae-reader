function getFacturae() {
  return "FacturaeTooling POC";
}

async function readFacturae(file) {
  const text = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, "text/xml");
  const number = xmlDoc.getElementsByTagName("BatchIdentifier")[0].textContent;
  const totalInvoiceAmount =
    xmlDoc.getElementsByTagName("TotalAmount")[0].textContent;
  const taxRate = xmlDoc.getElementsByTagName("TaxRate")[0].textContent;
  const date = xmlDoc.getElementsByTagName("IssueDate")[0].textContent;
  const totalWithoutTax = xmlDoc.getElementsByTagName(
    "TotalGrossAmountBeforeTaxes"
  )[0].textContent;
  const taxes = xmlDoc.getElementsByTagName("TotalTaxOutputs")[0].textContent;

  const seller = xmlDoc.getElementsByTagName("SellerParty")[0];
  const buyer = xmlDoc.getElementsByTagName("BuyerParty")[0];
  const invoiceLines = xmlDoc.getElementsByTagName("InvoiceLine");
  const sellerName =
    seller.getElementsByTagName("CorporateName")[0].textContent;
  const sellerAddress = seller.getElementsByTagName("Address")[0].textContent;
  const sellerTown = seller.getElementsByTagName("Town")[0].textContent;
  const sellerProvince = seller.getElementsByTagName("Province")[0].textContent;
  const sellerPostCode = seller.getElementsByTagName("PostCode")[0].textContent;
  const buyerName = buyer.getElementsByTagName("CorporateName")[0].textContent;
  const buyerAddress = buyer.getElementsByTagName("Address")[0].textContent;
  const buyerTown = buyer.getElementsByTagName("Town")[0].textContent;
  const buyerProvince = buyer.getElementsByTagName("Province")[0].textContent;
  const buyerPostCode = buyer.getElementsByTagName("PostCode")[0].textContent;
  let itemsFacturae = [];
  for (let i = 0; i < invoiceLines.length; i++) {
    const description =
      invoiceLines[i].getElementsByTagName("ItemDescription")[0].textContent;
    const quantity =
      invoiceLines[i].getElementsByTagName("Quantity")[0].textContent;
    const price = invoiceLines[i].getElementsByTagName("UnitPriceWithoutTax")[0]
      .textContent;

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
