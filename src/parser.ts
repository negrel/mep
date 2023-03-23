/* eslint-disable no-case-declarations */
import { Constant, CONSTANTS } from './constant'
import { Token, TokenType } from './tokens'
import { Operator } from './operator'
import { Func } from './func'
import { OPERATIONS, Operation, Parenthesis } from './operation'
import { Lexer } from './lexer'
import { Position } from './position'

class InvalidTokenError extends Error {
  constructor (token: Token) {
    super(`${token.start}|${token.end} - "${token.value}" is not a valid token.`)
  }
}

class UnkownIdentifierError extends Error {
  constructor (token: Token) {
    super(`${token.start}|${token.end} - "${token.value}" is not a known identifier.`)
  }
}

class UnkownOperatorError extends Error {
  constructor (token: Token) {
    super(`${token.start}|${token.end} - "${token.value}" is not a known operator.`)
  }
}

// Parser implements the Shunting-yard algorithm
// See https://en.wikipedia.org/wiki/Shunting-yard_algorithm
export class Parser {
  private readonly output: Array<Constant|number|Operation>
  private readonly operation: Operation[]
  private readonly src: Token[]
  private token: Token
  private pos: Position

  constructor (tokens: Token[]) {
    this.output = []
    this.operation = []
    this.src = tokens
    this.pos = 0
    this.parse()
  }

  get result (): Array<Constant|number|Operation> {
    return [...this.output]
  }

  private get nextToken (): Token {
    return this.src[this.pos]
  }

  private get previousToken (): Token {
    return this.src[this.pos - 2]
  }

  private readToken (): void {
    this.token = this.src[this.pos]
    this.pos++
  }

  static parse (expr: string): Array<Constant|number|Operation> {
    const tokens = Lexer.lex(expr)
    const parser = new Parser(tokens)

    return parser.result
  }

  private parse (): void {
    while (this.output.length !== this.src.length) {
      this.readToken()
      const token = this.token

      switch (token.type) {
        case TokenType.EOF:
          while (this.operation.length > 0) {
            const op = this.operation.pop() as Operation
            this.output.push(op)
          }
          return

        case TokenType.ILLEGAL:
          throw new InvalidTokenError(token)

        case TokenType.NUMBER:
          this.output.push(parseFloat(token.value))
          break

        case TokenType.IDENT:
          const constant = CONSTANTS.get(token.value)
          if (constant !== undefined) {
            this.output.push(constant)
            continue
          }

          const func = OPERATIONS.get(token.value)
          if (func !== undefined) {
            this.operation.push(func)
            continue
          }

          throw new UnkownIdentifierError(token)

        case TokenType.LPAREN:
          this.operation.push(OPERATIONS.get('(') as Parenthesis)
          break

        case TokenType.RPAREN:
          this.parseRightParenthesis(OPERATIONS.get(')') as Parenthesis)
          break

        case TokenType.OPERATOR:
          // Negative number
          if (token.value === '-' && this.nextToken.type === TokenType.NUMBER &&
          (this.previousToken === undefined || this.previousToken.type === TokenType.OPERATOR)) {
            this.output.push(parseFloat(this.nextToken.value) * -1)
            this.readToken()

            continue
          }

          const op = OPERATIONS.get(token.value)
          if (op !== undefined && op instanceof Operator) {
            this.parseOperator(op)
            continue
          }

          throw new UnkownOperatorError(token)
      }
    }
  }

  private get lastOperation (): Operation {
    return this.operation[this.operation.length - 1]
  }

  private parseOperator (op: Operator): void {
    while (
      // there is an operator on the stack
      this.operation.length !== 0 && this.lastOperation instanceof Operator && (
        // the operator at the top of the operator stack has greater precedence
        this.lastOperation.precedence > op.precedence || (
          // the operator at the top of the operator stack has equal precedence and token is left associative
          this.lastOperation.precedence === op.precedence && op.isLeftAssociative)) && (
      // the operator at the top of the operator stack is not a left parenthesis
        !(this.lastOperation instanceof Parenthesis) || !this.lastOperation.isLeft)) {
      this.output.push(this.operation.pop() as Operation)
    }
    this.operation.push(op)
  }

  private parseRightParenthesis (rp: Parenthesis): void {
    while (this.operation.length !== 0 &&
      // the operator on the top of the operator stack is not a left parenthesis
      !(this.lastOperation instanceof Parenthesis && this.lastOperation.isLeft)) {
      this.output.push(this.operation.pop() as Operation)
    }

    // Remove the left parenthesis
    if (this.lastOperation instanceof Parenthesis && this.lastOperation.isLeft) {
      this.operation.pop()
    }

    // Remove the function
    if (this.lastOperation instanceof Func) {
      this.output.push(this.operation.pop() as Func)
    }
  }
}
