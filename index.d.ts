declare module 'facturaereader' {
    export interface FacturaeInvoice {
      number: string;
      date: string;
      total: string;
      taxPrice: string;
      taxRate: string;
      priceWithoutTax: string;
    }
    
    export interface FacturaeParty {
      name: string;
      address: string;
      town: string;
      province: string;
      postal_code: string;
    }
    
    export interface FacturaeProduct {
      product: string;
      quantity: string;
      price: string;
    }
    
    export interface FacturaeResult {
      invoice: FacturaeInvoice;
      seller: FacturaeParty;
      buyer: FacturaeParty;
      products: FacturaeProduct[];
      version: string;
    }
    
    export function getFacturae(): string;
    export function readFacturae(file: File): Promise<FacturaeResult>;
}
