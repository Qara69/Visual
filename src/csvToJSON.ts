export function csvToJSON(input: string[], delimiter: string): object[] {
    if (!input || input.length === 0) {
        throw new Error('Input array is empty');
    }

    const firstLine = input[0];
    if (!firstLine) {
        throw new Error('First line is empty');
    }

    const headers = firstLine.split(delimiter);
    
    if (headers.length === 0 || headers[0] === '') {
        throw new Error('Headers are empty');
    }

    const result: object[] = [];

    for (let i = 1; i < input.length; i++) {
        const currentLine = input[i];
        if (!currentLine || currentLine.trim() === '') {
            continue;
        }

        const values = currentLine.split(delimiter);
        
        if (values.length !== headers.length) {
            throw new Error(`Row ${i}: Column count mismatch`);
        }

        const row: Record<string, string | number> = {};
        
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            const value = values[j];
            
            if (header === undefined || value === undefined) {
                throw new Error(`Missing data at row ${i}, column ${j}`);
            }

            const num = Number(value);
            if (!isNaN(num) && value !== '') {
                row[header] = num;
            } else {
                row[header] = value;
            }
        }
        result.push(row);
    }

    if (result.length === 0) {
        throw new Error('No data rows found');
    }

    return result;
}