import { build, emptyDir } from "https://deno.land/x/dnt@0.38.0/mod.ts";

const version = Deno.args[0];
if (!version) throw new Error("Missing version");

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  compilerOptions: {
    lib: ["ES2021", "DOM"],
  },
  test: false,
  shims: {},
  package: {
    name: "@negrel/mep",
    version,
    description:
      "MEP is a mathematical expression parser written in TypeScript.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/negrel/mep.git",
    },
    bugs: {
      url: "https://github.com/negrel/mep/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
