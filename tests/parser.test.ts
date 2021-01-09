import { Parser } from '../src/index'
import { OPERATIONS } from '../src/operation'

describe('Parser', () => {
  it('one operation', () => {
    const result = Parser.parse('1 + 1')

    expect(result).toEqual([1, 1, OPERATIONS.get('+')])
  })

  it('operation with negative number', () => {
    const result = Parser.parse('5 * -9')

    expect(result).toEqual([5, -9, OPERATIONS.get('*')])
  })

  it('multiple operation with parenthesis', () => {
    const result = Parser.parse('(1 + 3) * 5 + 2')

    expect(result).toEqual([1, 3, OPERATIONS.get('+'), 5, OPERATIONS.get('*'), 2, OPERATIONS.get('+')])
  })

  it('multiple operation with multiple parenthesis', () => {
    const result = Parser.parse('(1 + 3) * (5 + 2)')

    expect(result).toEqual([1, 3, OPERATIONS.get('+'), 5, 2, OPERATIONS.get('+'), OPERATIONS.get('*')])
  })

  it('multiple operation with nested parenthesis', () => {
    const result = Parser.parse('1 + 2 * (3 * (5 + 2)) + -9 * 3')

    expect(result).toEqual([
      1,
      2,
      3,
      5,
      2,
      OPERATIONS.get('+'),
      OPERATIONS.get('*'),
      OPERATIONS.get('*'),
      OPERATIONS.get('+'),
      -9,
      3,
      OPERATIONS.get('*'),
      OPERATIONS.get('+')
    ])
  })

  it('simple function call', () => {
    const result = Parser.parse('log2(8)')

    expect(result).toEqual([8, OPERATIONS.get('log2')])
  })

  it('simple function call with operation as argument', () => {
    const result = Parser.parse('log2(8 * 3)')

    expect(result).toEqual([8, 3, OPERATIONS.get('*'), OPERATIONS.get('log2')])
  })

  it('simple function call with operation with parenthesis as argument', () => {
    const result = Parser.parse('log2((8 + 3) * 4)')

    expect(result).toEqual([8, 3, OPERATIONS.get('+'), 4, OPERATIONS.get('*'), OPERATIONS.get('log2')])
  })

  it('nested function call', () => {
    const result = Parser.parse('log2((8 + 3) * sqrt(4))')

    expect(result).toEqual([8, 3, OPERATIONS.get('+'), 4, OPERATIONS.get('sqrt'), OPERATIONS.get('*'), OPERATIONS.get('log2')])
  })

  it('multiple function call', () => {
    const result = Parser.parse('log2(8 + 3) * sqrt(4)')

    console.log(result)

    expect(result).toEqual([8, 3, OPERATIONS.get('+'), OPERATIONS.get('log2'), 4, OPERATIONS.get('sqrt'), OPERATIONS.get('*')])
  })
})
