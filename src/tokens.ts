import { Position } from "./position.ts";

export enum TokenType {
  EOF,
  ILLEGAL,

  NUMBER,
  IDENT, // Alphabetic string

  OPERATOR, // Special characters

  LPAREN, // (
  RPAREN, // )
}

export interface Token {
  type: TokenType;
  start: Position;
  end: Position;
  value: string;
}
