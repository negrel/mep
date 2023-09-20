import { compute } from '../src/index'

describe('Compute', () => {
  it('234 + 2 - 1 == 235', () => {
    const result = compute('234 + 2 - 1')
    expect(result).toEqual(235)
  })

  it('234 - 2 + 1 == 233', () => {
    const result = compute('234 - 2 + 1')
    expect(result).toEqual(233)
  })

  it('998786556 * PI / 6796 + E', () => {
    const result = compute('998786556 * PI / 6796 + E')
    expect(result).toEqual(461712.6221714474)
  })
})
