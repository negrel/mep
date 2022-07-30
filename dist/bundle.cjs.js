'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const OPERATIONS = new Map();
class Operation {
}
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
const OperatorRegex = /[^A-Za-z0-9\s]/;
class InvalidOperatorError extends Error {
    constructor(opSign, err) {
        super(`"${opSign}" is not a valid operator: ${err}"`);
    }
}
const registerOperator = (char, precedence, fn, leftAssociative = true) => {
    if (char.length !== 1) {
        throw new InvalidOperatorError(char, 'must be 1 char long');
    }
    if (!OperatorRegex.test(char)) {
        throw new InvalidOperatorError(char, `must match ${String(OperatorRegex)}`);
    }
    OPERATIONS.set(char, new Operator(precedence, fn));
};
registerOperator('+', 1, (a, b) => a + b);
registerOperator('-', 1, (b, a = 0) => a - b);
registerOperator('/', 10, (a, b) => a / b);
registerOperator('*', 10, (a, b) => a * b);
registerOperator('^', 100, (a, b) => a ** b, false);

const CONSTANTS = new Map();
const IdentifierRegex = /[a-zA-Z]/;
const ConstantRegex = IdentifierRegex;
class InvalidConstantNameError extends Error {
    constructor(constName, err) {
        super(`"${constName}" is not a valid constant name: ${err}"`);
    }
}
const registerConstant = (name, value) => {
    if (!ConstantRegex.test(name.charAt(0))) {
        throw new InvalidConstantNameError(name, 'must start with an alphabetic character');
    }
    CONSTANTS.set(name, value);
};
CONSTANTS.set('PI', Math.PI);
CONSTANTS.set('e', Math.E);

const FuncRegex = IdentifierRegex;
class Func extends Operation {
    constructor(fn) {
        super();
        this.fn = fn;
    }
    do(...args) {
        return this.fn(...args);
    }
}
class InvalidFuncNameError extends Error {
    constructor(funcName, err) {
        super(`"${funcName}" is not a valid function name: ${err}"`);
    }
}
const registerFunc = (name, fn) => {
    if (!FuncRegex.test(name.charAt(0))) {
        throw new InvalidFuncNameError(name, 'must start with an alphabetic character');
    }
    OPERATIONS.set(name, new Func(fn));
};
registerFunc('log2', (...args) => Math.log2(args[0]));
registerFunc('log', (...args) => Math.log(args[0]));
registerFunc('log10', (...args) => Math.log(args[0]));
registerFunc('pow10', (...args) => 10 ** args[0]);
registerFunc('ln', (...args) => Math.log(args[0]));
registerFunc('exp', (...args) => Math.exp(args[0]));
registerFunc('sin', (...args) => Math.sin(args[0]));
registerFunc('arcsin', (...args) => Math.asin(args[0]));
registerFunc('cos', (...args) => Math.cos(args[0]));
registerFunc('arccos', (...args) => Math.acos(args[0]));
registerFunc('tan', (...args) => Math.tan(args[0]));
registerFunc('arctan', (...args) => Math.atan(args[0]));
registerFunc('pow2', (...args) => args[0] ** 2);
registerFunc('sqrt', (...args) => Math.sqrt(args[0]));
function factorial(a) {
    return a <= 0 ? 1 : a * factorial(a - 1);
}
registerFunc('fac', (...args) => factorial(args[0]));
registerFunc('max', (...args) => Math.max(...args));
registerFunc('min', (...args) => Math.min(...args));

exports.TokenType = void 0;
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

const number = /(\d|\.)/;
class Lexer {
    constructor(src) {
        this.pos = 0;
        this.src = src;
    }
    get nextChar() {
        let i = this.pos;
        let c;
        do {
            c = this.src.charAt(i);
            i++;
        } while (INVALIDS.has(c));
        return c;
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
                case FuncRegex.test(this.char):
                    return this.lexIdent();
                case number.test(this.char) ||
                    (this.char === '.' && number.test(this.nextChar)):
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
                case OperatorRegex.test(this.char):
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
        while (FuncRegex.test(this.nextChar) || /\d/.test(this.nextChar)) {
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
        while (number.test(this.nextChar) || this.nextChar === '.') {
            if (this.nextChar === '.' && result.value.includes('.')) {
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
    constructor(tokens) {
        this.output = [];
        this.operation = [];
        this.src = tokens;
        this.pos = 0;
        this.parse();
    }
    get result() {
        return [...this.output];
    }
    get nextToken() {
        return this.src[this.pos];
    }
    get previousToken() {
        return this.readToken[this.pos - 1];
    }
    readToken() {
        this.token = this.src[this.pos];
        this.pos++;
    }
    static parse(expr) {
        const tokens = Lexer.lex(expr);
        const parser = new Parser(tokens);
        return parser.result;
    }
    parse() {
        while (this.output.length !== this.src.length) {
            this.readToken();
            const token = this.token;
            switch (token.type) {
                case exports.TokenType.EOF:
                    while (this.operation.length > 0) {
                        const op = this.operation.pop();
                        this.output.push(op);
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
                        continue;
                    }
                    const func = OPERATIONS.get(token.value);
                    if (func !== undefined) {
                        this.operation.push(func);
                        continue;
                    }
                    throw new UnkownIdentifierError(token);
                case exports.TokenType.LPAREN:
                    this.operation.push(OPERATIONS.get('('));
                    break;
                case exports.TokenType.RPAREN:
                    this.parseRightParenthesis(OPERATIONS.get(')'));
                    break;
                case exports.TokenType.OPERATOR:
                    if (token.value === '-' && this.nextToken.type === exports.TokenType.NUMBER &&
                        (this.previousToken === undefined || this.previousToken.type === exports.TokenType.OPERATOR)) {
                        this.output.push(parseFloat(this.nextToken.value) * -1);
                        this.readToken();
                        continue;
                    }
                    const op = OPERATIONS.get(token.value);
                    if (op !== undefined && op instanceof Operator) {
                        this.parseOperator(op);
                        continue;
                    }
                    throw new UnkownOperatorError(token);
            }
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
        if (this.lastOperation instanceof Func) {
            this.output.push(this.operation.pop());
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
    else if (op instanceof Func) {
        return op.do(computeRPN(rpn));
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
exports.compute = compute;
exports.registerConstant = registerConstant;
exports.registerFunc = registerFunc;
exports.registerOperator = registerOperator;
