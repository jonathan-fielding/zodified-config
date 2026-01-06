import zodifiedConfig, { ZodValidationError } from '../src/index';
import z from 'zod';

const configSchema = z.object({ value: z.string(), env: z.literal('test'), nested: z.object({ value: z.string() }) });

export type Config = z.infer<typeof configSchema>;

declare module '../src/index' {
  interface ValidatedConfig extends Config { }
}

describe('validate', () => {
  it('should return true if schema is valid', () => {
    const result = zodifiedConfig.validate(configSchema);
    expect(result).toBe(true);
  });

  it('should return false if schema is invalid', () => {
    const invalidSchema = z.object({ value: z.number(), env: z.literal('test') });
    try {
      zodifiedConfig.validate(invalidSchema);
    } catch (error: unknown) {
      if (error instanceof ZodValidationError) {
        expect(error.message).toBe('INVALID_CONFIG');
        expect(error.failures).toBeDefined();
        expect(error.failures).toHaveLength(1);
        expect(error.failures[0].path).toEqual(['value']);
        expect(error.failures[0].code).toBe('invalid_type');
        if (error.failures[0].code === 'invalid_type') {
          expect(error.failures[0].expected).toBe('number');
          expect(error.failures[0].path[0]).toBe('value');
          expect(error.failures[0].message).toBe('Invalid input: expected number, received string');
        }
      }
    }
  });
});

describe('get', () => {
  it('should return the full config', () => {
    const result = zodifiedConfig.get();
    expect(result).toEqual({
      value: 'test value',
      env: 'test',
      nested: {
        value: 'nested value'
      }
    });
  });

  it('should return the value from the config', () => {
    const result = zodifiedConfig.get('value');
    expect(result).toBe('test value');
  });

  it('should return the nested object from the config', () => {
    const result = zodifiedConfig.get('nested');
    expect(result).toEqual({ value: 'nested value' });
  }); 

  it('should return the nested value from the config', () => {
    const result = zodifiedConfig.get('nested.value');
    expect(result).toBe('nested value');
  });
});