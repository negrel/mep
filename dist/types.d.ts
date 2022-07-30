declare function compute(calcul: string): number;

declare type Position = number;

declare enum TokenType {
    EOF = 0,
    ILLEGAL = 1,
    NUMBER = 2,
    IDENT = 3,
    OPERATOR = 4,
    LPAREN = 5,
    RPAREN = 6
}
interface Token {
    type: TokenType;
    start: Position;
    end: Position;
    value: string;
}

declare class Lexer {
    private pos;
    private readonly src;
    private char;
    result: Token[];
    constructor(src: string);
    private get nextChar();
    private readChar;
    static lex(src: string): Token[];
    lex(): Token;
    private lexIdent;
    private lexNumber;
}

declare type Constant = number | number;
declare const registerConstant: (name: string, value: number) => void;

declare abstract class Operation {
    abstract do(...args: number[]): number;
}

declare class Parser {
    private readonly output;
    private readonly operation;
    private readonly src;
    private token;
    private pos;
    constructor(tokens: Token[]);
    get result(): Array<Constant | number | Operation>;
    private get nextToken();
    private get previousToken();
    private readToken;
    static parse(expr: string): Array<Constant | number | Operation>;
    private parse;
    private get lastOperation();
    private parseOperator;
    private parseRightParenthesis;
}

declare const registerOperator: (char: string, precedence: number, fn: (a: number, b: number) => number, leftAssociative?: boolean) => void;

declare const registerFunc: (name: string, fn: (...args: number[]) => number) => void;

export { Lexer, Parser, Token, TokenType, compute, registerConstant, registerFunc, registerOperator };
