import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import tooManyLines from "./too-many-lines";

describe("too-many-lines", () => {
  test("flags function with over 100 lines", () => {
    const lines = Array.from({ length: 102 }, (_, i) => `    const x${i} = ${i};`).join("\n");
    const d = lint(tooManyLines, `function big() {\n${lines}\n}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("too_many_lines");
  });

  test("ignores short function", () => {
    const d = lint(tooManyLines, `function small() { return 1; }`);
    expect(d.length).toBe(0);
  });

  test("flags function expression with over 100 lines", () => {
    const lines = Array.from({ length: 102 }, (_, i) => `    const x${i} = ${i};`).join("\n");
    const d = lint(tooManyLines, `const big = function() {\n${lines}\n}`);
    expect(d.length).toBe(1);
  });

  test("flags arrow function with over 100 lines", () => {
    const lines = Array.from({ length: 102 }, (_, i) => `    const x${i} = ${i};`).join("\n");
    const d = lint(tooManyLines, `const big = () => {\n${lines}\n}`);
    expect(d.length).toBe(1);
  });
});
