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
OPERATIONS.set('log2', new Func((...args) => Math.log2(args[0])));
OPERATIONS.set('log', new Func((...args) => Math.log(args[0])));
OPERATIONS.set('log10', new Func((...args) => Math.log(args[0])));
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
OPERATIONS.set('-', new Operator(1, (b, a = 0) => a - b));
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

var TokenType;
(function (TokenType) {
    TokenType[TokenType["EOF"] = 0] = "EOF";
    TokenType[TokenType["ILLEGAL"] = 1] = "ILLEGAL";
    TokenType[TokenType["NUMBER"] = 2] = "NUMBER";
    TokenType[TokenType["IDENT"] = 3] = "IDENT";
    TokenType[TokenType["OPERATOR"] = 4] = "OPERATOR";
    TokenType[TokenType["LPAREN"] = 5] = "LPAREN";
    TokenType[TokenType["RPAREN"] = 6] = "RPAREN";
})(TokenType || (TokenType = {}));

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
        } while (token.type !== TokenType.EOF);
        return tokens;
    }
    lex() {
        while (true) {
            this.readChar();
            switch (true) {
                case this.char === '':
                    return {
                        type: TokenType.EOF,
                        start: this.pos,
                        end: this.pos,
                        value: ''
                    };
                case INVALIDS.has(this.char):
                    continue;
                case alphabetic.test(this.char):
                    return this.lexIdent();
                case number.test(this.char) ||
                    (this.char === '.' && number.test(this.nextChar)):
                    return this.lexNumber();
                case this.char === '(':
                    return {
                        type: TokenType.LPAREN,
                        start: this.pos - 1,
                        end: this.pos,
                        value: this.char
                    };
                case this.char === ')':
                    return {
                        type: TokenType.RPAREN,
                        start: this.pos - 1,
                        end: this.pos,
                        value: this.char
                    };
                case specialChar.test(this.char):
                    return {
                        type: TokenType.OPERATOR,
                        start: this.pos - 1,
                        end: this.pos,
                        value: this.char
                    };
                default:
                    return {
                        type: TokenType.ILLEGAL,
                        start: this.pos,
                        end: this.pos,
                        value: this.char
                    };
            }
        }
    }
    lexIdent() {
        const result = {
            type: TokenType.IDENT,
            start: this.pos - 1,
            end: 0,
            value: this.char
        };
        while (alphabetic.test(this.nextChar) || /\d/.test(this.nextChar)) {
            this.readChar();
            result.value += this.char;
        }
        result.end = this.pos;
        return result;
    }
    lexNumber() {
        const result = {
            type: TokenType.NUMBER,
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
                case TokenType.EOF:
                    while (this.operation.length > 0) {
                        const op = this.operation.pop();
                        this.output.push(op);
                    }
                    return;
                case TokenType.ILLEGAL:
                    throw new InvalidTokenError(token);
                case TokenType.NUMBER:
                    this.output.push(parseFloat(token.value));
                    break;
                case TokenType.IDENT:
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
                case TokenType.LPAREN:
                    this.operation.push(OPERATIONS.get('('));
                    break;
                case TokenType.RPAREN:
                    this.parseRightParenthesis(OPERATIONS.get(')'));
                    break;
                case TokenType.OPERATOR:
                    if (token.value === '-' && this.nextToken.type === TokenType.NUMBER &&
                        (this.previousToken === undefined || this.previousToken.type === TokenType.OPERATOR)) {
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
    else {
        throw new UnsupportedTypeForComputeError(JSON.stringify(op), op.constructor.name);
    }
}
function compute(calcul) {
    const rpn = Parser.parse(calcul);
    return computeRPN(rpn);
}

export default compute;
export { Lexer, Parser, TokenType, UnsupportedTypeForComputeError };
