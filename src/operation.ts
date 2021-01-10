export const OPERATIONS = new Map<string, Operation>()

export abstract class Operation {
  abstract do (...args: number[]): number
}

class InvalidOperationCallError extends Error {
  constructor (operation: string) {
    super(`operation "${operation}" is not valid`)
  }
}

// Parenthesis are stored on the stack operator
export class Parenthesis extends Operation {
  readonly isLeft: boolean

  constructor (left: boolean) {
    super()
    this.isLeft = left
  }

  do (...args: number[]): number {
    throw new InvalidOperationCallError(this.isLeft ? '(' : ')')
  }
}

OPERATIONS.set('(', new Parenthesis(true))
OPERATIONS.set(')', new Parenthesis(false))
