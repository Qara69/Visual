type Transform<T> = (data: T[]) => T[];

type Where<T> = <K extends keyof T>(key: K, value: T[K]) => Transform<T>;

type Sort<T> = <K extends keyof T>(key: K) => Transform<T>;

type Group<T, K extends keyof T> = {
  key: T[K];
  items: T[];
};

type GroupBy<T> = <K extends keyof T>(key: K) => Transform<Group<T, K>>;

type GroupTransform<T, K extends keyof T> = (groups: Group<T, K>[]) => Group<T, K>[];

type Having<T> = <K extends keyof T>(predicate: (group: Group<T, K>) => boolean) => GroupTransform<T, K>;

function query<T>(...steps: any[]): Transform<T> {
  return (data: T[]) => {
    let result: any = data;
    for (const step of steps) {
      if (typeof step === 'function') {
        result = step(result);
      }
    }
    return result;
  };
}

function createWhere<T>(): Where<T> {
  return <K extends keyof T>(key: K, value: T[K]): Transform<T> => {
    return (data: T[]): T[] => {
      return data.filter(item => {
        if (item && item[key] === value) {
          return true;
        }
        return false;
      });
    };
  };
}

function createSort<T>(): Sort<T> {
  return <K extends keyof T>(key: K): Transform<T> => {
    return (data: T[]): T[] => {
      const copy = [...data];
      copy.sort((a, b) => {
        if (!a || !b) return 0;
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      });
      return copy;
    };
  };
}

function createGroupBy<T>(): GroupBy<T> {
  return <K extends keyof T>(key: K): Transform<Group<T, K>> => {
    return ((data: any): Group<T, K>[] => {
      if (data && data.length > 0 && data[0] && 'key' in data[0]) {
        return data;
      }
      const items = data as T[];
      const groups: Record<string, Group<T, K>> = {};
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;
        
        const keyValue = item[key];
        const groupId = String(keyValue);
        
        if (!groups[groupId]) {
          groups[groupId] = {
            key: keyValue,
            items: []
          };
        }
        
        groups[groupId].items.push(item);
      }
      
      return Object.values(groups);
    }) as Transform<Group<T, K>>;
  };
}

function createHaving<T>(): Having<T> {
  return <K extends keyof T>(predicate: (group: Group<T, K>) => boolean): GroupTransform<T, K> => {
    return (groups: Group<T, K>[]): Group<T, K>[] => {
      return groups.filter(group => {
        if (group && predicate(group)) {
          return true;
        }
        return false;
      });
    };
  };
}

type User = {
  id: number;
  name: string;
  surname: string;
  age: number;
  city: string;
};

const users: User[] = [
  { id: 1, name: "John", surname: "Doe", age: 34, city: "NY" },
  { id: 2, name: "John", surname: "Doe", age: 33, city: "NY" },
  { id: 3, name: "John", surname: "Doe", age: 35, city: "LA" },
  { id: 4, name: "Mike", surname: "Doe", age: 35, city: "LA" },
];

const where = (key: any, value: any) => (data: any) =>
  data.filter((item: any) => item[key] === value);

const sort = (key: any) => (data: any) =>
  [...data].sort((a: any, b: any) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });

const search = query(
  where("name", "John"),
  where("surname", "Doe"),
  sort("age")
);

const result = search(users);

const groupBy = (key: any) => (data: any) =>
  Object.values(
    data.reduce((acc: any, item: any) => {
      const k = String(item[key]);
      if (!acc[k]) {
        acc[k] = { key: item[key], items: [] };
      }
      acc[k].items.push(item);
      return acc;
    }, {})
  );

const having = (predicate: any) => (groups: any) =>
  groups.filter(predicate);

const groupAndFilter = query(
  groupBy("city"),
  having((group: any) => group.items.length > 1)
);

const grouped = groupAndFilter(users);

const pipeline = query(
  where("surname", "Doe"),
  groupBy("city"),
  having((group: any) => group.items.some((u: any) => u.age > 34))
);

const res = pipeline(users);

console.log("result:", result);
console.log("grouped:", grouped);
console.log("res:", res);