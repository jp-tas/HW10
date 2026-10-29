function parseCsv(text) {
    const records = [];
    let record = [];
    let field = "";
    let quoted = false;
    let quoteClosed = false;
    text = text.replace(/^\uFEFF/, "");

    for (let index = 0; index < text.length; index += 1) {
        const character = text[index];
        if (quoted) {
            if (character === '"' && text[index + 1] === '"') {
                field += '"';
                index += 1;
            } else if (character === '"') {
                quoted = false;
                quoteClosed = true;
            } else {
                field += character;
            }
        } else if (character === ",") {
            record.push(field);
            field = "";
            quoteClosed = false;
        } else if (character === "\r" || character === "\n") {
            record.push(field);
            records.push(record);
            record = [];
            field = "";
            quoteClosed = false;
            if (character === "\r" && text[index + 1] === "\n") index += 1;
        } else if (character === '"' && field === "" && !quoteClosed) {
            quoted = true;
        } else if (quoteClosed) {
            if (!/\s/.test(character)) throw new Error("Invalid text after a quoted CSV field.");
        } else {
            // The tutorial's unquoted inch marks, such as 3" by 3", are literal text.
            field += character;
        }
    }
    if (quoted) throw new Error("Unclosed quoted CSV field.");
    record.push(field);
    records.push(record);
    return records.filter(row => row.some(value => value.trim() !== ""));
}

function csvField(value) {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function productsToCsv(products) {
    return products.map(product => [
        product.prod_id, product.prod_name, product.prod_desc, product.prod_price
    ].map(csvField).join(",") + "\r\n").join("");
}

module.exports = { parseCsv, productsToCsv };
