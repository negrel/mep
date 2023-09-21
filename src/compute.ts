import { Operator } from "./operator.ts";
import { Func } from "./func.ts";
import { Operation } from "./operation.ts";
import { Parser } from "./parser.ts";

export class UnsupportedTypeForComputeError extends Error {
  constructor(op: string, type: string) {
    super(`can't compute "${op}" of type ${type}.`);
  }
}

function computeRPN(rpn: Array<number | number | Operation>): number {
  const op = rpn.pop();
  if (op === undefined) {
    return 0;
  }

  if (op instanceof Operator) {
    const right = computeRPN(rpn);
    const left = computeRPN(rpn);

    return op.do(left, right);
  } else if (typeof op === "number" || op.constructor.name === "Number") {
    return op as number;
  } else if (op instanceof Func) {
    return op.do(computeRPN(rpn));
  } else {
    throw new UnsupportedTypeForComputeError(
      JSON.stringify(op),
      op.constructor.name,
    );
  }
}

export function compute(calcul: string): number {
  const rpn = Parser.parse(calcul);
  return computeRPN(rpn);
}
