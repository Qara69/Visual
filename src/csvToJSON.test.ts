import { describe, it, expect } from 'vitest';
import { csvToJSON } from './csvToJSON';

describe('csvToJSON', () => {
    it('проверка результата', () => {
        const input = ["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"];
        const result = csvToJSON(input, ';');
        
        expect(result).toEqual([
            { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
            { p1: 2, p2: 'B', p3: 'v', p4: 'd' }
        ]);
    });

    it('пропускает пустые строки', () => {
        const input = ["id;name", "1;Анна", "", "2;Иван"];
        const result = csvToJSON(input, ';');
        
        expect(result).toEqual([
            { id: 1, name: 'Анна' },
            { id: 2, name: 'Иван' }
        ]);
    });
    it('выбрасывает ошибку при несовпадении колонок', () => {
        const input = ["p1;p2", "1;A;b"];
        expect(() => csvToJSON(input, ';')).toThrow();
    });

    it('выбрасывает ошибку при отсутствии данных', () => {
        const input = ["p1;p2"];
        expect(() => csvToJSON(input, ';')).toThrow();
    });
});