import { it, describe, expect } from 'vitest';
import { 
  query,
  createWhere,
  createSort,
  createGroupBy,
  createHaving
} from './task';

type User = {
  id: number;
  name: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: "John", age: 34, city: "NY" },
  { id: 2, name: "John", age: 33, city: "NY" },
  { id: 3, name: "Mike", age: 25, city: "LA" },
];

describe('query builder', () => {
  
  it('where фильтрует', () => {
    const where = createWhere<User>();
    const result = where('name', 'John')(users);
    expect(result.length).toBe(2);
    expect(result[0]?.name).toBe('John');
  });

  it('sort сортирует', () => {
    const sort = createSort<User>();
    const result = sort('age')(users);
    expect(result[0]?.age).toBe(25);
    expect(result[2]?.age).toBe(34);
  });

it('groupBy группирует', () => {
    const groupBy = createGroupBy<User>();
    const result = groupBy('city')(users as any);
    expect(result.length).toBe(2);
    expect(result[0]?.key).toBe('NY');
    expect(result[0]?.items.length).toBe(2);
    expect(result[1]?.key).toBe('LA');
    expect(result[1]?.items.length).toBe(1);
});

  it('having фильтрует группы', () => {
    const groupBy = createGroupBy<User>();
    const having = createHaving<User>();
    
    const groups = groupBy('city')(users as any);
    const result = having((g: any) => g.items.length > 1)(groups);
    
    expect(result.length).toBe(1);
    expect(result[0]?.key).toBe('NY');
  });

  it('query объединяет where и sort', () => {
    const where = createWhere<User>();
    const sort = createSort<User>();
    
    const pipeline = query<User>(
      where('name', 'John'),
      sort('age')
    );
    
    const result = pipeline(users);
    expect(result.length).toBe(2);
    expect(result[0]?.age).toBe(33);
    expect(result[1]?.age).toBe(34);
  });

  it('query объединяет groupBy и having', () => {
    const groupBy = createGroupBy<User>();
    const having = createHaving<User>();
    
    const pipeline = query<any>(
      groupBy('city'),
      having((g: any) => g.items.length > 1)
    );
    
    const result = pipeline(users);
    expect(result.length).toBe(1);
    expect(result[0]?.key).toBe('NY');
  });

});