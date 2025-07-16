declare module 'facturaereader' {
    function getFacturae(): string;
    function readFacturae(file: File): Promise;

    export { getFacturae, readFacturae };
}
