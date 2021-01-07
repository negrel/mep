import { Lexer } from './lexer';
import { Operation, Operator } from './operation';
import { Parser } from './parser';

export class UnsupportedTypeForComputeError extends Error {
  constructor(op: any) {
    super(`can't compute "${op}" of type ${op.constructor.name}.`)
  }
}

function computeRPN(rpn: Array<Number|number|Operation>): number {
  const op = rpn.pop()
  if (op === undefined) {
    return 0;
  }

  if (op instanceof Operator) {
    const right = computeRPN(rpn)
    const left = computeRPN(rpn)

    return op.do(left, right)
  } else if (typeof op === 'number' || op.constructor.name == 'Number') {
    return op as number
  } else {
    throw new UnsupportedTypeForComputeError(op)
  }
}

function compute(calcul: string): number {
  const rpn = Parser.parse(calcul)
  return computeRPN(rpn)
}

export const mep = {
  Lexer: Lexer,
  Parser: Parser,
  compute: compute
}
export default mep;