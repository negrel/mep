import { TokenType, Lexer } from '../src/index'

describe('Lexer', () => {
  it('empty source', () => {
    const result = Lexer.lex('')

    expect(result)
      .toEqual([{
        type: TokenType.EOF,
        start: 1,
        end: 1,
        value: ''
      }])
  })

  it('one operation', () => {
    const result = Lexer.lex('1 + 1')

    expect(result)
      .toEqual([
        {
          type: TokenType.NUMBER,
          start: 0,
          end: 1,
          value: '1'
        },
        {
          type: TokenType.OPERATOR,
          start: 2,
          end: 3,
          value: '+'
        },
        {
          type: TokenType.NUMBER,
          start: 4,
          end: 5,
          value: '1'
        },
        {
          type: TokenType.EOF,
          start: 6,
          end: 6,
          value: ''
        }
      ])
  })

  it('one substraction', () => {
    const result = Lexer.lex('1 - 25')

    expect(result)
      .toEqual([
        {
          type: TokenType.NUMBER,
          start: 0,
          end: 1,
          value: '1'
        },
        {
          type: TokenType.OPERATOR,
          start: 2,
          end: 3,
          value: '-'
        },
        {
          type: TokenType.NUMBER,
          start: 4,
          end: 6,
          value: '25'
        },
        {
          type: TokenType.EOF,
          start: 7,
          end: 7,
          value: ''
        }
      ])
  })

  it('muliple operation with no space', () => {
    const result = Lexer.lex('9*7+10')

    expect(result)
      .toEqual([
        {
          type: TokenType.NUMBER,
          start: 0,
          end: 1,
          value: '9'
        },
        {
          type: TokenType.OPERATOR,
          start: 1,
          end: 2,
          value: '*'
        },
        {
          type: TokenType.NUMBER,
          start: 2,
          end: 3,
          value: '7'
        },
        {
          type: TokenType.OPERATOR,
          start: 3,
          end: 4,
          value: '+'
        },
        {
          type: TokenType.NUMBER,
          start: 4,
          end: 6,
          value: '10'
        },
        {
          type: TokenType.EOF,
          start: 7,
          end: 7,
          value: ''
        }
      ])
  })

  it('multiple operation with big numbers and constants', () => {
    const result = Lexer.lex('998786556*PI/ 6796+ E')

    expect(result)
      .toEqual([
        {
          type: TokenType.NUMBER,
          start: 0,
          end: 9,
          value: '998786556'
        },
        {
          type: TokenType.OPERATOR,
          start: 9,
          end: 10,
          value: '*'
        },
        {
          type: TokenType.IDENT,
          start: 10,
          end: 12,
          value: 'PI'
        },
        {
          type: TokenType.OPERATOR,
          start: 12,
          end: 13,
          value: '/'
        },
        {
          type: TokenType.NUMBER,
          start: 14,
          end: 18,
          value: '6796'
        },
        {
          type: TokenType.OPERATOR,
          start: 18,
          end: 19,
          value: '+'
        },
        {
          type: TokenType.IDENT,
          start: 20,
          end: 21,
          value: 'E'
        },
        {
          type: TokenType.EOF,
          start: 22,
          end: 22,
          value: ''
        }
      ])
  })

  it('multiple operation and negative numbers with consecutive operator', () => {
    const result = Lexer.lex('-1 -1 * -3')

    expect(result)
      .toEqual(
        [
          {
            start: 0,
            end: 1,
            type: TokenType.OPERATOR,
            value: '-'
          },
          {
            start: 1,
            end: 2,
            type: TokenType.NUMBER,
            value: '1'
          },
          {
            start: 3,
            end: 4,
            type: TokenType.OPERATOR,
            value: '-'
          },
          {
            start: 4,
            end: 5,
            type: TokenType.NUMBER,
            value: '1'
          },
          {
            start: 6,
            end: 7,
            type: TokenType.OPERATOR,
            value: '*'
          },
          {
            start: 8,
            end: 9,
            type: TokenType.OPERATOR,
            value: '-'
          },
          {
            start: 9,
            end: 10,
            type: TokenType.NUMBER,
            value: '3'
          },
          {
            start: 11,
            end: 11,
            type: TokenType.EOF,
            value: ''
          }
        ]
      )
  })

  it('multiple operations with parenthesis', () => {
    const result = Lexer.lex('2 * (-1 + 4)')

    expect(result)
      .toEqual([
        {
          start: 0,
          end: 1,
          type: TokenType.NUMBER,
          value: '2'
        },
        {
          start: 2,
          end: 3,
          type: TokenType.OPERATOR,
          value: '*'
        },
        {
          start: 4,
          end: 5,
          type: TokenType.LPAREN,
          value: '('
        },
        {
          start: 5,
          end: 6,
          type: TokenType.OPERATOR,
          value: '-'
        },
        {
          start: 6,
          end: 7,
          type: TokenType.NUMBER,
          value: '1'
        },
        {
          start: 8,
          end: 9,
          type: TokenType.OPERATOR,
          value: '+'
        },
        {
          start: 10,
          end: 11,
          type: TokenType.NUMBER,
          value: '4'
        },
        {
          start: 11,
          end: 12,
          type: TokenType.RPAREN,
          value: ')'
        },
        {
          start: 13,
          end: 13,
          type: TokenType.EOF,
          value: ''
        }
      ])
  })

  it('one function call with one constant', () => {
    const result = Lexer.lex('1 + log(PI)')

    expect(result).toEqual([
      {
        start: 0,
        end: 1,
        type: TokenType.NUMBER,
        value: '1'
      },
      {
        start: 2,
        end: 3,
        type: TokenType.OPERATOR,
        value: '+'
      },
      {
        start: 4,
        end: 7,
        type: TokenType.IDENT,
        value: 'log'
      },
      {
        start: 7,
        end: 8,
        type: TokenType.LPAREN,
        value: '('
      },
      {
        start: 8,
        end: 10,
        type: TokenType.IDENT,
        value: 'PI'
      },
      {
        start: 10,
        end: 11,
        type: TokenType.RPAREN,
        value: ')'
      },
      {
        start: 12,
        end: 12,
        type: TokenType.EOF,
        value: ''
      }
    ])
  })

  it('nested function call with multiple operation', () => {
    const result = Lexer.lex('2 * log(cos(PI / -4) + 3) ^ 56')

    expect(result).toEqual([
      {
        start: 0,
        end: 1,
        type: TokenType.NUMBER,
        value: '2'
      },
      {
        start: 2,
        end: 3,
        type: TokenType.OPERATOR,
        value: '*'
      },
      {
        start: 4,
        end: 7,
        type: TokenType.IDENT,
        value: 'log'
      },
      {
        start: 7,
        end: 8,
        type: TokenType.LPAREN,
        value: '('
      },
      {
        start: 8,
        end: 11,
        type: TokenType.IDENT,
        value: 'cos'
      },
      {
        start: 11,
        end: 12,
        type: TokenType.LPAREN,
        value: '('
      },
      {
        start: 12,
        end: 14,
        type: TokenType.IDENT,
        value: 'PI'
      },
      {
        start: 15,
        end: 16,
        type: TokenType.OPERATOR,
        value: '/'
      },
      {
        start: 17,
        end: 18,
        type: TokenType.OPERATOR,
        value: '-'
      },
      {
        start: 18,
        end: 19,
        type: TokenType.NUMBER,
        value: '4'
      },
      {
        start: 19,
        end: 20,
        type: TokenType.RPAREN,
        value: ')'
      },
      {
        start: 21,
        end: 22,
        type: TokenType.OPERATOR,
        value: '+'
      },
      {
        start: 23,
        end: 24,
        type: TokenType.NUMBER,
        value: '3'
      },
      {
        start: 24,
        end: 25,
        type: TokenType.RPAREN,
        value: ')'
      },
      {
        start: 26,
        end: 27,
        type: TokenType.OPERATOR,
        value: '^'
      },
      {
        start: 28,
        end: 30,
        type: TokenType.NUMBER,
        value: '56'
      },
      {
        start: 31,
        end: 31,
        type: TokenType.EOF,
        value: ''
      }
    ])
  })
})
