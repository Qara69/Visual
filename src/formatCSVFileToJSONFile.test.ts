import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatCSVFileToJSONFile } from './formatCSVFileToJSONFile.js';
import { csvToJSON } from './csvToJSON.js';

vi.mock('node:fs/promises', () => ({
    readFile: vi.fn(),
    writeFile: vi.fn()
}));

import { readFile, writeFile } from 'node:fs/promises';

describe('formatCSVFileToJSONFile', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('читает CSV и записывает JSON', async () => {
        const mockCSV = 'p1;p2\n1;A\n2;B';
        vi.mocked(readFile).mockResolvedValue(mockCSV);

        await formatCSVFileToJSONFile('in.csv', 'out.json', ';');

        expect(readFile).toHaveBeenCalledWith('in.csv', 'utf-8');
        
        const expectedJSON = JSON.stringify([
            { p1: 1, p2: 'A' },
            { p1: 2, p2: 'B' }
        ], null, 2);
        
        expect(writeFile).toHaveBeenCalledWith('out.json', expectedJSON, 'utf-8');
    });

    it('обрабатывает ошибку чтения', async () => {
        vi.mocked(readFile).mockRejectedValue(new Error('Ошибка'));

        await expect(formatCSVFileToJSONFile('bad.csv', 'out.json', ';'))
            .rejects.toThrow();
        
        expect(writeFile).not.toHaveBeenCalled();
    });
});