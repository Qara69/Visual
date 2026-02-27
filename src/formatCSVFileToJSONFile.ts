import { readFile, writeFile } from 'node:fs/promises';
import { csvToJSON } from './csvToJSON.js';

export async function formatCSVFileToJSONFile(
    input: string, 
    output: string, 
    delimiter: string
): Promise<void> {
    const content = await readFile(input, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const json = csvToJSON(lines, delimiter);
    await writeFile(output, JSON.stringify(json, null, 2), 'utf-8');
}