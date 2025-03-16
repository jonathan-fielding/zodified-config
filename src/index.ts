import config from 'config';
import type z from 'zod';

export interface ValidatedConfig {}

const fullConfig = config.util.toObject();

const validate = <T extends z.ZodType>(schema: T) => {
  try {
    const result = schema.safeParse(config);
    if (result.success === false) {
      return new Error("INVALID_CONFIG");
    }
    return true;
  } catch {
    return new Error('UNEXPECTED_ERROR');
  }
};

type DotNotation<T, Prefix extends string = ''> = T extends object
  ? { [K in keyof T & string]: `${Prefix}${K}` | DotNotation<T[K], `${Prefix}${K}.`> }[keyof T &
      string]
  : '';

type TypeFromPath<T, Path extends string> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? TypeFromPath<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never;

const get = <T extends ValidatedConfig, Path extends DotNotation<T>>(
  path?: Path,
): TypeFromPath<T, Path> => {
  let result = fullConfig;

  if (!path) {
    return result as TypeFromPath<T, Path>;
  }

  (path as string).split('.').forEach((key) => {
    if (result[key] !== undefined) {
      result = result[key];
    }
  });

  return result;
};

export default {
  validate,
  get,
};
