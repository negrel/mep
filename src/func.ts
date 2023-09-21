import { Operation, OPERATIONS } from "./operation.ts";
import { IdentifierRegex } from "./constant.ts";

export const FuncRegex = IdentifierRegex;

export class Func extends Operation {
  private readonly fn: (...args: number[]) => number;

  constructor(fn: (...args: number[]) => number) {
    super();
    this.fn = fn;
  }

  do(...args: number[]): number {
    return this.fn(...args);
  }
}

class InvalidFuncNameError extends Error {
  constructor(funcName: string, err: string) {
    super(`"${funcName}" is not a valid function name: ${err}"`);
  }
}

export const registerFunc = (
  name: string,
  fn: (...args: number[]) => number,
): void => {
  if (!FuncRegex.test(name.charAt(0))) {
    throw new InvalidFuncNameError(
      name,
      "must start with an alphabetic character",
    );
  }

  OPERATIONS.set(name, new Func(fn));
};

// Basic functions
registerFunc("log2", (...args: number[]) => Math.log2(args[0]));
registerFunc("log", (...args: number[]) => Math.log(args[0]));

registerFunc("log10", (...args: number[]) => Math.log(args[0]));
registerFunc("pow10", (...args: number[]) => 10 ** args[0]);

registerFunc("ln", (...args: number[]) => Math.log(args[0]));
registerFunc("exp", (...args: number[]) => Math.exp(args[0]));

registerFunc("sin", (...args: number[]) => Math.sin(args[0]));
registerFunc("arcsin", (...args: number[]) => Math.asin(args[0]));

registerFunc("cos", (...args: number[]) => Math.cos(args[0]));
registerFunc("arccos", (...args: number[]) => Math.acos(args[0]));

registerFunc("tan", (...args: number[]) => Math.tan(args[0]));
registerFunc("arctan", (...args: number[]) => Math.atan(args[0]));

registerFunc("pow2", (...args: number[]) => args[0] ** 2);
registerFunc("sqrt", (...args: number[]) => Math.sqrt(args[0]));

function factorial(a: number): number {
  return a <= 0 ? 1 : a * factorial(a - 1);
}
registerFunc("fac", (...args: number[]) => factorial(args[0]));

registerFunc("max", (...args: number[]) => Math.max(...args));
registerFunc("min", (...args: number[]) => Math.min(...args));
