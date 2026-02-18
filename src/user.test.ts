import { it, describe, expect } from 'vitest';
import { 
    createUser,
    createBook,
    calculateArea,
    getStatusColor,
    capitalizeFirst,
    trimAndUppercase,
    getFirstElement,
    findById
} from './user.js';

// 1
describe('createUser', () => {
    it('создает пользователя с обязательными полями', () => {
        const user = createUser(1, 'Анна');
        
        expect(user.id).toBe(1);
        expect(user.name).toBe('Анна');
        expect(user.isActive).toBe(true);
    });

    it('создает пользователя со всеми полями', () => {
        const user = createUser(2, 'Иван', 'Daniyar@mail.ru', false);
        
        expect(user.id).toBe(2);
        expect(user.name).toBe('Иван');
        expect(user.email).toBe('Daniyar@mail.ru');
        expect(user.isActive).toBe(false);
    });
});

// 2
describe('createBook', () => {
    it('создает книгу с годом издания', () => {
        const book = createBook({
            title: 'Война и мир',
            author: 'Лев Толстой',
            year: 1869,
            genre: 'fiction'
        });
        
        expect(book.title).toBe('Война и мир');
        expect(book.author).toBe('Лев Толстой');
        expect(book.year).toBe(1869);
        expect(book.genre).toBe('fiction');
    });

    it('создает книгу без года издания', () => {
        const book = createBook({
            title: 'Капитал',
            author: 'Карл Маркс',
            genre: 'non-fiction'
        });
        
        expect(book.title).toBe('Капитал');
        expect(book.author).toBe('Карл Маркс');
        expect(book.year).toBeUndefined();
        expect(book.genre).toBe('non-fiction');
    });
});

// 3
describe('calculateArea', () => {
    it('считает площадь круга', () => {
        const result = calculateArea('circle', 5);
        expect(result).toBe(78.5);
    });

    it('считает площадь квадрата', () => {
        const result = calculateArea('square', 4);
        expect(result).toBe(16);
    });
});

// 4
describe('getStatusColor', () => {
    it('возвращает green для active', () => {
        const color = getStatusColor('active');
        expect(color).toBe('green');
    });

    it('возвращает red для inactive', () => {
        const color = getStatusColor('inactive');
        expect(color).toBe('red');
    });

    it('возвращает yellow для new', () => {
        const color = getStatusColor('new');
        expect(color).toBe('yellow');
    });
});

// 5 capitalizeFirst
describe('capitalizeFirst', () => {
    it('делает первую букву заглавной, остальные маленькими', () => {
        const result = capitalizeFirst('hello WORLD');
        expect(result).toBe('Hello world');
    });

    it('возвращает пустую строку, если входная строка пустая', () => {
        const result = capitalizeFirst('');
        expect(result).toBe('');
    });
});

// 5 trimAndUppercase
describe('trimAndUppercase', () => {
    it('удаляет пробелы в начале и конце', () => {
        const result = trimAndUppercase('  hello  ');
        expect(result).toBe('hello');
    });

    it('удаляет пробелы и переводит в верхний регистр', () => {
        const result = trimAndUppercase('  hello  ', true);
        expect(result).toBe('HELLO');
    });
});

// 6
describe('getFirstElement', () => {
    it('возвращает первый элемент массива чисел', () => {
        const numbers = [1, 2, 3];
        const result = getFirstElement(numbers);
        expect(result).toBe(1);
    });

    it('возвращает первый элемент массива строк', () => {
        const fruits = ['яблоко', 'банан', 'апельсин'];
        const result = getFirstElement(fruits);
        expect(result).toBe('яблоко');
    });

    it('возвращает undefined для пустого массива', () => {
        const empty: number[] = [];
        const result = getFirstElement(empty);
        expect(result).toBeUndefined();
    });
});

// 7
describe('findById', () => {
    const users = [
        { id: 1, name: 'Анна' },
        { id: 2, name: 'Иван' },
        { id: 3, name: 'Мария' }
    ];

    it('находит пользователя по существующему id', () => {
        const user = findById(users, 2);
        expect(user).toEqual({ id: 2, name: 'Иван' });
    });

    it('возвращает undefined для несуществующего id', () => {
        const user = findById(users, 5);
        expect(user).toBeUndefined();
    });

    it('возвращает undefined для пустого массива', () => {
        const user = findById([], 1);
        expect(user).toBeUndefined();
    });
});