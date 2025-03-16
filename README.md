# Zodified Config

Typesafe config validated by Zod 🎉

## Install

You can install `zodified-config` from NPM using your prefered package manage. 

For npm you can install as follows:

```
npm i zodified-config
```

## Usage

To use zodified-config, please follow the 3 steps explained below:

### 1. Defining your schema
```ts
// src/schema.ts
import z from 'zod';

export const configSchema = z.object({
  value: z.string()
});

export type Config = z.infer<typeof configSchema>;
```

### 2. Validating your config

```ts
// src/index.ts
import config from 'zodified-config'
import type { Config } from './schema'

declare module 'zodified-config' {
  interface ValidatedConfig extends Config {}
}

try {
  zodifiedConfig.validate(invalidSchema);
} catch (error: unknown) {
  // if you enter here, it means the config is invalid or something else went wrong
  // check the error.message
}
```

### 3. Accessing configuration values
```ts
// file other.ts
import config from 'zodified-config'

config.get('value'); 
```