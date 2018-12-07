export interface Validator {
  (...args: unknown[]): boolean;
}

export interface Method<Args extends Array<any> = [], Res = any> {
  (...args: Args): Res;
}

export abstract class MethodInstance<Args extends Array<any> = [], Res = any> {
  public abstract execute(...args: Args): Res;
  public abstract validateParameters(...args: unknown[]): boolean;
}
