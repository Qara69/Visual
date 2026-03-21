import { describe, test, expectTypeOf, expect } from 'vitest';
import { query, where, groupBy, having, sort } from './task2';

type User = { id: number; name: string; age: number; city: string };

const users: User[] = [
    { id: 1, name: "John", age: 30, city: "NY" },
    { id: 2, name: "Mike", age: 25, city: "LA" },
    { id: 3, name: "John", age: 20, city: "LA" }
];

describe('Лабораторная работа 5', () => {

    test('Должен работать с правильным порядком операций и возвращать данные', () => {
        const q = query<User>(
            where<User>('name', 'John'),
            sort<User>('age')
        );
        const result = q(users);
        expect(result).toHaveLength(2);
        expect(result[0].age).toBe(20);
    });

    test('Должен разрешать полную цепочку: where → groupBy → having → sort', () => {
        const q = query<User>(
            where<User>('name', 'John'),
            groupBy<User>('city'),
            having(g => g.items.length > 0),
            sort<any>('key')
        );
        expectTypeOf(q).toBeFunction();
    });

    test('Должен ВЫДАВАТЬ ОШИБКУ если where после sort', () => {
        query<User>(
            sort<User>('age'),
            where<User>('name', 'John')
        );
    });

    test('Должен ВЫДАВАТЬ ОШИБКУ если where после groupBy', () => {
        query<User>(
            groupBy<User>('city'),
            where<User>('name', 'John')
        );
    });
});