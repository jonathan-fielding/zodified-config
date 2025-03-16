import zodifiedConfig from '../src/index';
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
    const result = zodifiedConfig.validate(invalidSchema);
    if (result instanceof Error) {
      expect(result.message).toBe("INVALID_CONFIG");
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