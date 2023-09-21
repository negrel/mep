import { compute } from "./src/compute.ts";
import { Lexer } from "./src/lexer.ts";
import { Parser } from "./src/parser.ts";
import { registerOperator } from "./src/operator.ts";
import { registerFunc } from "./src/func.ts";
import { registerConstant } from "./src/constant.ts";
import { TokenType } from "./src/tokens.ts";
export type { Token } from "./src/tokens.ts";

export default {
  compute,
  Lexer,
  Parser,
  registerOperator,
  registerFunc,
  registerConstant,
  TokenType,
};
