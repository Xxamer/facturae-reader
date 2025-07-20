# FacturaeReader

A JavaScript library for parsing Spanish electronic invoices in Facturae format (versions 3.1, 3.2.1, and 3.2.2).

## Installation

```bash
npm install facturaereader
```
### Example
You can check a live example of using this package in https://facturae-reader-example.vercel.app/

## Features

- Supports Facturae versions 3.1, 3.2.1, and 3.2.2
- Automatic version detection
- Type definitions included
- Browser compatible
- Zero dependencies

## Usage

### Basic Example

```javascript
import { readFacturae } from 'factureareader';

const input = document.getElementById('facturaeInput');

input.addEventListener('change', async (event) => {
  try {
    const file = event.target.files[0];
    const facturaData = await readFacturae(file);
    console.log(facturaData);
  } catch (error) {
    console.error('Error reading invoice:', error.message);
  }
});
```

### Return Type Structure

The `readFacturae` function returns a Promise that resolves to an object with the following structure:

```typescript
interface FacturaeResult {
  invoice: {
    number: string;
    date: string;
    total: string;
    taxPrice: string;
    taxRate: string;
    priceWithoutTax: string;
  };
  seller: {
    name: string;
    address: string;
    town: string;
    province: string;
    postal_code: string;
  };
  buyer: {
    name: string;
    address: string;
    town: string;
    province: string;
    postal_code: string;
  };
  products: Array<{
    product: string;
    quantity: string;
    price: string;
  }>;
  version: string; // "3.1" | "3.2.1" | "3.2.2"
}
```

### Error Handling

The library throws errors in the following cases:

```javascript
// Invalid or missing file
if (!file) {
  throw new Error('Invalid input: File is required');
}

// Invalid XML format
if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
  throw new Error('Invalid XML format');
}
```

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Facturae Reader Example</title>
</head>
<body>
  <input type="file" id="facturaeInput" accept=".xml" />
  <pre id="output"></pre>

  <script type="module">
    import { readFacturae } from 'factureareader';

    const input = document.getElementById('facturaeInput');
    const output = document.getElementById('output');

    input.addEventListener('change', async (event) => {
      try {
        const file = event.target.files[0];
        const facturaData = await readFacturae(file);
        output.textContent = JSON.stringify(facturaData, null, 2);
      } catch (error) {
        output.textContent = `Error: ${error.message}`;
      }
    });
  </script>
</body>
</html>
```

## Development

1. Clone the repository
2. Run `npm install`
3. Link the package locally:
```bash
npm link
```
4. In your project:
```bash
npm link factureareader
```

## Supported Formats

The library automatically detects and supports the following Facturae versions:

- Facturae 3.1
- Facturae 3.2.1 (namespace: http://www.facturae.es/Facturae/2009/v3.2.1/Facturae)
- Facturae 3.2.2 (namespace: http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2.xml)

## License

MIT
