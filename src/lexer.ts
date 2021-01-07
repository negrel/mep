import { Func } from './operation'
import { Position } from './position'
import { Token, TokenType } from './tokens'

const alphabetic = /[a-zA-Z]/
const number = /(\d|\.)/
const specialChar = /[^A-Za-z0-9]/

export class Lexer {
  private pos: Position
  private readonly src: string
  private char: string

  constructor (src: string) {
    this.pos = 0
    this.src = src
  }

  private get peek (): string {
    return this.src.charAt(this.pos)
  }

  private readChar (): void {
    this.char = this.src.charAt(this.pos)
    this.pos++
  }

  lex (): Token {
    while (true) {
      this.readChar()

      switch (true) {
        case this.char == '':
          return {
            type: TokenType.EOF,
            start: this.pos,
            end: this.pos,
            value: ''
          }

        case INVALIDS.has(this.char):
          continue

        case specialChar.test(this.char):
          return this.lexIdent()

        case number.test(this.char) || (this.char === '.' && number.test(this.peek)):
          return this.lexNumber()

        case this.char === '(':
          return {
            type: TokenType.LPAREN,
            start: this.pos,
            end: this.pos + 1,
            value: this.char
          }

        case this.char === ')':
          return {
            type: TokenType.RPAREN,
            start: this.pos,
            end: this.pos + 1,
            value: this.char
          }

        case specialChar.test(this.char):
          return {
            type: TokenType.OPERATOR,
            start: this.pos,
            end: this.pos + 1,
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
      start: this.pos,
      end: this.pos + 1,
      value: this.char
    }

    while (alphabetic.test(this.peek) || /\d/.test(this.peek)) {
      this.readChar()
      result.value += this.char
      result.end++
    }

    return result
  }

  private lexNumber (): Token {
    const result: Token = {
      type: TokenType.NUMBER,
      start: this.pos,
      end: 0,
      value: this.char
    }

    while (number.test(this.peek) || this.peek === '.') {
      // Break on 'digit..another_digit'
      if (this.peek === '.' && result.value.includes('.')) {
        break
      }

      this.readChar()
      result.value += this.char
    }
    result.end = this.pos + 1

    return result
  }
}
