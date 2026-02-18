// Задача 1
export interface User {
    id: number;
    name: string;
    email?: string | undefined;
    isActive: boolean;
}

export function createUser(id: number, name: string, email?: string, isActive: boolean = true): User {
    return {
        id: id,
        name: name,
        email: email,
        isActive: isActive
    };
}

// Задача 2
export type Genre = 'fiction' | 'non-fiction';

export interface Book {
    title: string;
    author: string;
    year?: number;
    genre: Genre;
}

export function createBook(book: Book): Book {
    return book;
}

// Задача 3
export type Shape = 'circle' | 'square';

export function calculateArea(shape: 'circle', radius: number): number;
export function calculateArea(shape: 'square', side: number): number;
export function calculateArea(shape: Shape, param: number): number {
    if (shape === 'circle') {
        return 3.14 * param * param;
    } else {
        return param * param;
    }
}

// Задача 4
export type Status = 'active' | 'inactive' | 'new';

export function getStatusColor(status: Status): string {
    if (status === 'active') {
        return 'green';
    } else if (status === 'inactive') {
        return 'red';
    } else {
        return 'yellow';
    }
}

// Задача 5
export type StringFormatter = (str: string, uppercase?: boolean) => string;

export const capitalizeFirst: StringFormatter = (str: string): string => {
    if (!str || str.length === 0) {
        return "";
    }
    const firstChar = str.charAt(0).toUpperCase();
    const restOfString = str.slice(1).toLowerCase();
    return firstChar + restOfString;
};

export const trimAndUppercase: StringFormatter = (str: string, uppercase: boolean = false): string => {
    if (!str) {
        return "";
    }
    const trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};

// Задача 6
export function getFirstElement<T>(arr: T[]): T | undefined {
    if (!arr || arr.length === 0) {
        return undefined;
    }
    return arr[0];
}

// Задача 7 
export interface HasId {
    id: number;
}

export function findById<T extends HasId>(items: T[], id: number): T | undefined {
    if (!items || items.length === 0) {
        return undefined;
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.id === id) {
            return item;
        }
    }
    return undefined;
}

export interface Person extends HasId {
    name: string;
}
