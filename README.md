### Para empezar a desarrollar
 - Pull the code (duh).
 - ``` npm link factureareader ```
 - Let's work

### How to use

---

## Usage in a web page

You can use the `readFacturae` function to read and extract data from an electronic invoice in Facturae format from an XML file uploaded by the user.

### Basic example

1. **Import the function**  
   If you use a bundler (like Vite, Webpack, etc.), import the function in your JS file:

   ```javascript
   import { readFacturae } from 'factureareader';
   ```

2. **Add a file input in your HTML**:

   ```html
   <input type="file" id="facturaeInput" accept=".xml" />
   <pre id="output"></pre>
   ```

3. **Read the file and display the data**:

   ```javascript
   const input = document.getElementById('facturaeInput');
   const output = document.getElementById('output');

   input.addEventListener('change', async (event) => {
     const file = event.target.files[0];
     if (file) {
       const facturaData = await readFacturae(file);
       output.textContent = JSON.stringify(facturaData, null, 2);
     }
   });
   ```

### Notes

- The file must be a valid XML in Facturae version 3.2.2 format.
- The `readFacturae` function returns an object with the main invoice data, seller, buyer, and products.

---
