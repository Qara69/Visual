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

export function query<T>(...steps: any[]): Transform<T> {
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

export function createWhere<T>(): Where<T> {
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

export function createSort<T>(): Sort<T> {
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

export function createGroupBy<T>(): GroupBy<T> {
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

export function createHaving<T>(): Having<T> {
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