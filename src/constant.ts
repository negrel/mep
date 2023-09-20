export const CONSTANTS = new Map<string, Constant>()
export type Constant = number | number

export const IdentifierRegex = /[a-zA-Z]/

export const ConstantRegex = IdentifierRegex

class InvalidConstantNameError extends Error {
  constructor (constName: string, err: string) {
    super(`"${constName}" is not a valid constant name: ${err}"`)
  }
}

export const registerConstant = (name: string, value: number): void => {
  if (!ConstantRegex.test(name.charAt(0))) {
    throw new InvalidConstantNameError(name, 'must start with an alphabetic character')
  }

  CONSTANTS.set(name, value)
}

CONSTANTS.set('PI', Math.PI)
CONSTANTS.set('E', Math.E)
CONSTANTS.set('e', Math.E)
