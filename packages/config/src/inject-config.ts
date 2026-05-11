import { Inject } from '@nestjs/common';

export const CONFIG_TOKEN = Symbol('NEST_CONFIG_MVP');

export function InjectConfig(): ReturnType<typeof Inject> {
  return Inject(CONFIG_TOKEN);
}
