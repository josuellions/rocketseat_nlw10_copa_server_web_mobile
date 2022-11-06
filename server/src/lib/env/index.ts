import AppError from '@lib/appError';
import EnvKeys from './keys';

export { EnvKeys };

export default {
  str(key: EnvKeys): string {
    const value = process.env[key];
    if (!value) {
      throw new AppError(`Env key not found: "${key}".`);
    }
    return value;
  },

  optStr(key: EnvKeys): string | undefined {
    return process.env[key];
  },

  strList(key: EnvKeys): string[] {
    const value = process.env[key];
    if (!value) {
      throw new AppError(`Env key not found: "${key}".`);
    }
    return value.split(',').map(v => v.trim());
  },

  optStrList(key: EnvKeys): string[] | undefined {
    const value = process.env[key];
    if (!value) {
      return value as undefined;
    }
    return value.split(',').map(v => v.trim());
  },

  int(key: EnvKeys): number {
    const value = process.env[key];
    if (!value) {
      throw new AppError(`Env key not found: "${key}".`);
    }
    const numberValue = parseInt(value, 10);
    if (Number.isNaN(numberValue)) {
      throw new AppError(`Env key s not a valid integer: "${key}".`);
    }
    return numberValue;
  },

  optInt(key: EnvKeys): number | undefined {
    const value = process.env[key];
    if (!value) {
      return value as undefined;
    }
    const numberValue = parseInt(value, 10);
    if (Number.isNaN(numberValue)) {
      throw new AppError(`Env key s not a valid integer: "${key}".`);
    }
    return numberValue;
  },

  bool(key: EnvKeys): boolean {
    const value = process.env[key];
    if (!value) {
      throw new AppError(`Env key not found: "${key}".`);
    }
    if (value !== 'true' && value !== 'false') {
      throw new AppError(`Env key s not a valid boolean: "${key}".`);
    }
    return value === 'true';
  },

  optBool(key: EnvKeys): boolean | undefined {
    const value = process.env[key];
    if (!value) {
      return value as undefined;
    }
    if (value !== 'true' && value !== 'false') {
      throw new AppError(`Env key s not a valid boolean: "${key}".`);
    }
    return value === 'true';
  },
};
