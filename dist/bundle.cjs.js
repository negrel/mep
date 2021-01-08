'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const OPERATIONS = new Map();
class Operation {
}
class Func extends Operation {
    constructor(fn) {
        super();
        this.fn = fn;
    }
    do(...args) {
        return this.fn(...args);
    }
}
OPERATIONS.set('log', new Func((...args) => Math.log10(args[0])));
OPERATIONS.set('pow10', new Func((...args) => 10 ** args[0]));
OPERATIONS.set('ln', new Func((...args) => Math.log(args[0])));
OPERATIONS.set('exp', new Func((...args) => Math.exp(args[0])));
OPERATIONS.set('sin', new Func((...args) => Math.sin(args[0])));
OPERATIONS.set('arcsin', new Func((...args) => Math.asin(args[0])));
OPERATIONS.set('cos', new Func((...args) => Math.cos(args[0])));
OPERATIONS.set('arccos', new Func((...args) => Math.acos(args[0])));
OPERATIONS.set('tan', new Func((...args) => Math.tan(args[0])));
OPERATIONS.set('arctan', new Func((...args) => Math.atan(args[0])));
OPERATIONS.set('pow2', new Func((...args) => args[0] ** 2));
OPERATIONS.set('sqrt', new Func((...args) => Math.sqrt(args[0])));
function factorial(a) {
    return a <= 0 ? 1 : a * factorial(a - 1);
}
OPERATIONS.set('fac', new Func((...args) => factorial(args[0])));
OPERATIONS.set('max', new Func((...args) => Math.max(...args)));
OPERATIONS.set('min', new Func((...args) => Math.min(...args)));
class Operator extends Operation {
    constructor(precedence, op, leftAssociative = true) {
        super();
        this.precedence = precedence;
        this.op = op;
        this.isLeftAssociative = leftAssociative;
    }
    do(...args) {
        return this.op(args[0], args[1]);
    }
}
OPERATIONS.set('+', new Operator(1, (a, b) => a + b));
OPERATIONS.set('-', new Operator(1, (a, b) => a - b));
OPERATIONS.set('/', new Operator(10, (a, b) => a / b));
OPERATIONS.set('*', new Operator(10, (a, b) => a * b));
OPERATIONS.set('^', new Operator(100, (a, b) => a ** b, false));
class InvalidOperationCallError extends Error {
    constructor(operation) {
        super(`operation "${operation}" is not valid`);
    }
}
class Parenthesis extends Operation {
    constructor(left) {
        super();
        this.isLeft = left;
    }
    do(...args) {
        throw new InvalidOperationCallError(this.isLeft ? '(' : ')');
    }
}
OPERATIONS.set('(', new Parenthesis(true));
OPERATIONS.set(')', new Parenthesis(false));

const CONSTANTS = new Map();
CONSTANTS.set('PI', Math.PI);
CONSTANTS.set('e', Math.E);

(function (TokenType) {
    TokenType[TokenType["EOF"] = 0] = "EOF";
    TokenType[TokenType["ILLEGAL"] = 1] = "ILLEGAL";
    TokenType[TokenType["NUMBER"] = 2] = "NUMBER";
    TokenType[TokenType["IDENT"] = 3] = "IDENT";
    TokenType[TokenType["OPERATOR"] = 4] = "OPERATOR";
    TokenType[TokenType["LPAREN"] = 5] = "LPAREN";
    TokenType[TokenType["RPAREN"] = 6] = "RPAREN";
})(exports.TokenType || (exports.TokenType = {}));

const INVALIDS = new Set();
INVALIDS.add(' ');
INVALIDS.add('\n');
INVALIDS.add('\t');

const alphabetic = /[a-zA-Z]/;
const number = /(\d|\.)/;
const specialChar = /[^A-Za-z0-9\s]/;
class Lexer {
    constructor(src) {
        this.pos = 0;
        this.src = src;
    }
    get peek() {
        return this.src.charAt(this.pos);
    }
    readChar() {
        this.char = this.src.charAt(this.pos);
        this.pos++;
    }
    static lex(src) {
        const lexer = new Lexer(src);
        const tokens = [];
        let token;
        do {
            token = lexer.lex();
            tokens.push(token);
        } while (token.type !== exports.TokenType.EOF);
        return tokens;
    }
    lex() {
        while (true) {
            this.readChar();
            switch (true) {
                case this.char === '':
                    return {
                        type: exports.TokenType.EOF,
                        start: this.pos,
                        end: this.pos,
                        value: ''
                    };
                case INVALIDS.has(this.char):
                    continue;
                case alphabetic.test(this.char):
                    return this.lexIdent();
                case number.test(this.char) || (this.char === '.' && number.test(this.peek)):
                    return this.lexNumber();
                case this.char === '(':
                    return {
                        type: exports.TokenType.LPAREN,
                        start: this.pos - 1,
                        end: this.pos,
                        value: this.char
                    };
                case this.char === ')':
                    return {
                        type: exports.TokenType.RPAREN,
                        start: this.pos - 1,
                        end: this.pos,
                        value: this.char
                    };
                case specialChar.test(this.char):
                    return {
                        type: exports.TokenType.OPERATOR,
                        start: this.pos - 1,
                        end: this.pos,
                        value: this.char
                    };
                default:
                    return {
                        type: exports.TokenType.ILLEGAL,
                        start: this.pos,
                        end: this.pos,
                        value: this.char
                    };
            }
        }
    }
    lexIdent() {
        const result = {
            type: exports.TokenType.IDENT,
            start: this.pos - 1,
            end: 0,
            value: this.char
        };
        while (alphabetic.test(this.peek) || /\d/.test(this.peek)) {
            this.readChar();
            result.value += this.char;
        }
        result.end = this.pos;
        return result;
    }
    lexNumber() {
        const result = {
            type: exports.TokenType.NUMBER,
            start: this.pos - 1,
            end: 0,
            value: this.char
        };
        while (number.test(this.peek) || this.peek === '.') {
            if (this.peek === '.' && result.value.includes('.')) {
                break;
            }
            this.readChar();
            result.value += this.char;
        }
        result.end = this.pos;
        return result;
    }
}

class InvalidTokenError extends Error {
    constructor(token) {
        super(`${token.start}|${token.end} - "${token.value}" is not a valid token.`);
    }
}
class UnkownIdentifierError extends Error {
    constructor(token) {
        super(`${token.start}|${token.end} - "${token.value}" is not a known identifier.`);
    }
}
class UnkownOperatorError extends Error {
    constructor(token) {
        super(`${token.start}|${token.end} - "${token.value}" is not a known operator.`);
    }
}
class Parser {
    constructor() {
        this.output = [];
        this.operation = [];
    }
    get result() {
        return [...this.output];
    }
    static parse(expr) {
        const tokens = Lexer.lex(expr);
        const parser = new Parser();
        console.log(tokens);
        while (tokens.length > 0) {
            parser.parse(tokens.pop());
        }
        console.log(parser.result);
        return parser.result;
    }
    parse(token) {
        console.log('TOKEN', token, this);
        switch (token.type) {
            case exports.TokenType.EOF:
                while (this.operation.length > 0) {
                    this.output.push(this.operation.pop());
                }
                return;
            case exports.TokenType.ILLEGAL:
                throw new InvalidTokenError(token);
            case exports.TokenType.NUMBER:
                this.output.push(parseFloat(token.value));
                break;
            case exports.TokenType.IDENT:
                const constant = CONSTANTS.get(token.value);
                if (constant !== undefined) {
                    this.output.push(constant);
                    return;
                }
                const func = OPERATIONS.get(token.value);
                if (func !== undefined) {
                    this.output.push(func);
                    return;
                }
                throw new UnkownIdentifierError(token);
            case exports.TokenType.LPAREN:
                this.operation.push(OPERATIONS.get('('));
                break;
            case exports.TokenType.RPAREN:
                this.parseRightParenthesis(OPERATIONS.get(')'));
                break;
            case exports.TokenType.OPERATOR:
                const op = OPERATIONS.get(token.value);
                if (op !== undefined && op instanceof Operator) {
                    this.parseOperator(op);
                    return;
                }
                throw new UnkownOperatorError(token);
        }
    }
    get lastOperation() {
        return this.operation[this.operation.length - 1];
    }
    parseOperator(op) {
        while (this.operation.length !== 0 && this.lastOperation instanceof Operator && (this.lastOperation.precedence > op.precedence || (this.lastOperation.precedence === op.precedence && op.isLeftAssociative)) && (!(this.lastOperation instanceof Parenthesis) || !this.lastOperation.isLeft)) {
            this.output.push(this.operation.pop());
        }
        this.operation.push(op);
    }
    parseRightParenthesis(rp) {
        while (this.operation.length !== 0 &&
            !(this.lastOperation instanceof Parenthesis && this.lastOperation.isLeft)) {
            this.output.push(this.operation.pop());
        }
        if (this.lastOperation instanceof Parenthesis && this.lastOperation.isLeft) {
            this.operation.pop();
        }
    }
}

class UnsupportedTypeForComputeError extends Error {
    constructor(op, type) {
        super(`can't compute "${op}" of type ${type}.`);
    }
}
function computeRPN(rpn) {
    const op = rpn.pop();
    if (op === undefined) {
        return 0;
    }
    if (op instanceof Operator) {
        const right = computeRPN(rpn);
        const left = computeRPN(rpn);
        return op.do(left, right);
    }
    else if (typeof op === 'number' || op.constructor.name === 'Number') {
        return op;
    }
    else {
        throw new UnsupportedTypeForComputeError(JSON.stringify(op), op.constructor.name);
    }
}
function compute(calcul) {
    const rpn = Parser.parse(calcul);
    return computeRPN(rpn);
}

exports.Lexer = Lexer;
exports.Parser = Parser;
exports.UnsupportedTypeForComputeError = UnsupportedTypeForComputeError;
exports.default = compute;
