// INVALIDS define any token that can't be registered as an Operator, a Constant and a Function.
export const INVALIDS = new Set<string>();

INVALIDS.add(" ");
INVALIDS.add("\n");
INVALIDS.add("\t");
