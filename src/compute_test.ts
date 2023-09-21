import { assertEquals } from "../dev_deps.ts";

import { compute } from "./compute.ts";

Deno.test("234 + 2 - 1 == 235", () => {
  const result = compute("234 + 2 - 1");
  assertEquals(result, 235);
});

Deno.test("234 - 2 + 1 == 233", () => {
  const result = compute("234 - 2 + 1");
  assertEquals(result, 233);
});

Deno.test("998786556 * PI / 6796 + E", () => {
  const result = compute("998786556 * PI / 6796 + E");
  assertEquals(result, 461712.6221714474);
});
