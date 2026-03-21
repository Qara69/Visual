import { it, describe, expect } from 'vitest';
import { query, where, groupBy, having, sort } from './task2';

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
  
  it('where + sort', () => {
    const result = query<User>(
      where('name', 'John'),
      sort('age')
    )(users);
    
    expect(result.length).toBe(2);
    expect(result[0]?.age).toBe(33);
  });

  it('groupBy + having', () => {
    const result = query(
      groupBy('city'),
      having((g: any) => g.items.length > 1)
    )(users);
    
    expect(result.length).toBe(1);
    expect(result[0]?.key).toBe('NY');
  });

  it('full pipeline', () => {
    const result = query(
      where('city', 'NY'),
      groupBy('city'),
      having((g: any) => g.items.length > 0),
      sort('age')
    )(users);
    
    expect(result.length).toBe(1);
  });
});