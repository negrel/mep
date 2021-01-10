import { INVALIDS } from './invalid'
import { FuncRegex } from './func'
import { OperatorRegex } from './operator'
import { Position } from './position'
import { Token, TokenType } from './tokens'

const number = /(\d|\.)/
export class Lexer {
  private pos: Position
  private readonly src: string
  private char: string
  result: Token[]

  constructor (src: string) {
    this.pos = 0
    this.src = src
  }

  private get nextChar (): string {
    let i = this.pos
    let c
    do {
      c = this.src.charAt(i)
      i++
    } while (INVALIDS.has(c))

    return c
  }

  private readChar (): void {
    this.char = this.src.charAt(this.pos)
    this.pos++
  }

  static lex (src: string): Token[] {
    const lexer = new Lexer(src)
    const tokens: Token[] = []

    let token
    do {
      token = lexer.lex()
      tokens.push(token)
    } while (token.type !== TokenType.EOF)

    return tokens
  }

  lex (): Token {
    while (true) {
      this.readChar()

      switch (true) {
        case this.char === '':
          return {
            type: TokenType.EOF,
            start: this.pos,
            end: this.pos,
            value: ''
          }

        case INVALIDS.has(this.char):
          continue

        case FuncRegex.test(this.char):
          return this.lexIdent()

        case number.test(this.char) ||
            (this.char === '.' && number.test(this.nextChar)):
          return this.lexNumber()

        case this.char === '(':
          return {
            type: TokenType.LPAREN,
            start: this.pos - 1,
            end: this.pos,
            value: this.char
          }

        case this.char === ')':
          return {
            type: TokenType.RPAREN,
            start: this.pos - 1,
            end: this.pos,
            value: this.char
          }

        case OperatorRegex.test(this.char):
          return {
            type: TokenType.OPERATOR,
            start: this.pos - 1,
            end: this.pos,
            value: this.char
          }

        default:
          return {
            type: TokenType.ILLEGAL,
            start: this.pos,
            end: this.pos,
            value: this.char
          }
      }
    }
  }

  private lexIdent (): Token {
    const result: Token = {
      type: TokenType.IDENT,
      start: this.pos - 1,
      end: 0,
      value: this.char
    }

    while (FuncRegex.test(this.nextChar) || /\d/.test(this.nextChar)) {
      this.readChar()
      result.value += this.char
    }
    result.end = this.pos

    return result
  }

  private lexNumber (): Token {
    const result: Token = {
      type: TokenType.NUMBER,
      start: this.pos - 1,
      end: 0,
      value: this.char
    }

    while (number.test(this.nextChar) || this.nextChar === '.') {
      // Break on 'digit..another_digit'
      if (this.nextChar === '.' && result.value.includes('.')) {
        break
      }

      this.readChar()
      result.value += this.char
    }
    result.end = this.pos

    return result
  }
}
