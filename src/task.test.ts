import { expectTypeOf, describe, it } from 'vitest';
import { DeepReadonly} from './task';

describe('Тесты', () => {
  it('Проверка DeepReadonly', () => {
    type Obj = { a: number; b: { c: string } };
    expectTypeOf<DeepReadonly<Obj>>().toEqualTypeOf<{
      readonly a: number;
      readonly b: { readonly c: string };
    }>();
  });
});