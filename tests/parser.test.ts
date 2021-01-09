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
    const result = Parser.parse('(1 + 3) * (5 + 2)')

    expect(result).toEqual([1, 3, OPERATIONS.get('+'), 5, 2, OPERATIONS.get('+'), OPERATIONS.get('*')])
  })
})
