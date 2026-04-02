import { expectTypeOf, describe, it } from 'vitest';
import { DeepReadonly, PickedByType} from './task';

describe('Тесты', () => {
  it('Проверка DeepReadonly', () => {
    type Obj = { a: number; b: { c: string } };
    expectTypeOf<DeepReadonly<Obj>>().toEqualTypeOf<{
      readonly a: number;
      readonly b: { readonly c: string };
    }>();
  });

  it('Проверка PickedByType', () => {
    type Mixed = { a: number; b: string; c: number };
    expectTypeOf<PickedByType<Mixed, number>>().toEqualTypeOf<{
      a: number;
      c: number;
    }>();
  });
});