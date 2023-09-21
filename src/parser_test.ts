import { assertEquals } from "../dev_deps.ts";

import { Parser } from "./parser.ts";
import { OPERATIONS } from "./operation.ts";

Deno.test("one operation", () => {
  const result = Parser.parse("1 + 1");

  assertEquals(result, [1, 1, OPERATIONS.get("+")]);
});

Deno.test("one substraction", () => {
  const result = Parser.parse("3 - 25");

  assertEquals(result, [3, 25, OPERATIONS.get("-")]);
});

Deno.test("operation with negative number", () => {
  const result = Parser.parse("5 * -9");

  assertEquals(result, [5, -9, OPERATIONS.get("*")]);
});

Deno.test("substraction with negative number", () => {
  const result = Parser.parse("5 - -9");

  assertEquals(result, [5, -9, OPERATIONS.get("-")]);
});

Deno.test("multiple operation with parenthesis", () => {
  const result = Parser.parse("(1 + 3) * 5 + 2");

  assertEquals(result, [
    1,
    3,
    OPERATIONS.get("+"),
    5,
    OPERATIONS.get("*"),
    2,
    OPERATIONS.get("+"),
  ]);
});

Deno.test("multiple operation with multiple parenthesis", () => {
  const result = Parser.parse("(1 + 3) * (5 + 2)");

  assertEquals(result, [
    1,
    3,
    OPERATIONS.get("+"),
    5,
    2,
    OPERATIONS.get("+"),
    OPERATIONS.get("*"),
  ]);
});

Deno.test("multiple operation with nested parenthesis", () => {
  const result = Parser.parse("1 + 2 * (3 * (5 + 2)) + -9 * 3");

  assertEquals(result, [
    1,
    2,
    3,
    5,
    2,
    OPERATIONS.get("+"),
    OPERATIONS.get("*"),
    OPERATIONS.get("*"),
    OPERATIONS.get("+"),
    -9,
    3,
    OPERATIONS.get("*"),
    OPERATIONS.get("+"),
  ]);
});

Deno.test("simple function call", () => {
  const result = Parser.parse("log2(8)");

  assertEquals(result, [8, OPERATIONS.get("log2")]);
});

Deno.test("simple function call with operation as argument", () => {
  const result = Parser.parse("log2(8 * 3)");

  assertEquals(result, [8, 3, OPERATIONS.get("*"), OPERATIONS.get("log2")]);
});

Deno.test("simple function call with operation with parenthesis as argument", () => {
  const result = Parser.parse("log2((8 + 3) * 4)");

  assertEquals(result, [
    8,
    3,
    OPERATIONS.get("+"),
    4,
    OPERATIONS.get("*"),
    OPERATIONS.get("log2"),
  ]);
});

Deno.test("nested function call", () => {
  const result = Parser.parse("log2((8 + 3) * sqrt(4))");

  assertEquals(result, [
    8,
    3,
    OPERATIONS.get("+"),
    4,
    OPERATIONS.get("sqrt"),
    OPERATIONS.get("*"),
    OPERATIONS.get("log2"),
  ]);
});

Deno.test("multiple function call", () => {
  const result = Parser.parse("log2(8 + 3) * sqrt(4)");

  assertEquals(result, [
    8,
    3,
    OPERATIONS.get("+"),
    OPERATIONS.get("log2"),
    4,
    OPERATIONS.get("sqrt"),
    OPERATIONS.get("*"),
  ]);
});
