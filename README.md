<div>
	<a src="https://standardjs.com">
		<img src="https://cdn.rawgit.com/standard/standard/master/badge.svg" alt="standardjs badge">
	</a>
	<a href="https://github.com/negrel/ringo/raw/master/LICENSE">
		<img src="https://img.shields.io/badge/license-MIT-green">
	</a>
</div>

# :heavy_division_sign: - MEP is a dependency free mathematical expression parser written in TypeScript.

## Why ?

I needed an **extensible** mathematical expression parser for
[1Calc](https://github.com/OG-Suite/1calc)

This package does the following:

- Lex mathematical expressions with **custom** operations, constants and
  functions into tokens
- Parse tokens and return an
  [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) array of
  `numbers` / `Operation`.
- Compute an [RPN](https://en.wikipedia.org/wiki/Reverse_Polish_notation) array
  and return the result

## Installation

Using ES modules:

```js
import * mep from "https://deno.land/x/http_ece@v0.1.0/mod.ts";
```

Using npm:

```shell
$ npm install @negrel/mep
```

You can now import `mep` as an ES modules or a CommonJS module.

## Exemple

```js
import { compute, registerConstant } from "@negrel/mep";
// or
// const { compute, registerConstant } = require('@negrel/mep')

console.log("Result:", compute("log2(5 * 65 + cos(PI ^ 2))"));
// Result: 8.340283256791498

registerConstant("PI2", Math.PI ** 2);
console.log("Result:", compute("log2(5 * 65 + cos(PI2))"));
// Result: 8.340283256791498
```

### Contributing

If you want to contribute to MEP to add a feature or improve the code contact me
at [negrel.dev@protonmail.com](mailto:negrel.dev@protonmail.com), open an
[issue](https://github.com/negrel/MEP/issues) or make a
[pull request](https://github.com/negrel/MEP/pulls).

## :stars: Show your support

Please give a :star: if this project helped you!

[![buy me a coffee](.github/images/bmc-button.png)](https://www.buymeacoffee.com/negrel)

#### :scroll: License

MIT © [Alexandre Negrel](https://www.negrel.dev)
