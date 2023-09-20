import { Operation, OPERATIONS } from './operation'

export class Operator extends Operation {
  readonly precedence: number
  readonly isLeftAssociative: boolean
  readonly op: (a: number, b: number) => number

  constructor (precedence: number, op: (a: number, b: number) => number, leftAssociative = true) {
    super()
    this.precedence = precedence
    this.op = op

    this.isLeftAssociative = leftAssociative
  }

  do (...args: number[]): number {
    return this.op(args[0], args[1])
  }
}

export const OperatorRegex = /[^A-Za-z0-9\s]/

class InvalidOperatorError extends Error {
  constructor (opSign: string, err: string) {
    super(`"${opSign}" is not a valid operator: ${err}"`)
  }
}

export const registerOperator = (char: string, precedence: number, fn: (a: number, b: number) => number, leftAssociative = true): void => {
  if (char.length !== 1) {
    throw new InvalidOperatorError(char, 'must be 1 char long')
  }
  if (!OperatorRegex.test(char)) {
    throw new InvalidOperatorError(char, `must match ${String(OperatorRegex)}`)
  }

  OPERATIONS.set(char, new Operator(precedence, fn))
}

registerOperator('+', 1, (a: number, b: number) => a + b)
registerOperator('-', 1, (b: number, a = 0) => b - a)
registerOperator('/', 10, (a: number, b: number) => a / b)
registerOperator('*', 10, (a: number, b: number) => a * b)
registerOperator('^', 100, (a: number, b: number) => a ** b, false)
