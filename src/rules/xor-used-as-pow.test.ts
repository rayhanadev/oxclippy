import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import xorUsedAsPow from "./xor-used-as-pow";

describe("xor-used-as-pow", () => {
  test("flags 2 ^ 8", () => {
    const d = lint(xorUsedAsPow, `const x = 2 ^ 8;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("2 ** 8");
    expect(d[0]!.message).toContain("256");
  });

  test("flags 10 ^ 3", () => {
    const d = lint(xorUsedAsPow, `const x = 10 ^ 3;`);
    expect(d.length).toBe(1);
  });

  test("ignores 1 ^ 0 (small numbers)", () => {
    const d = lint(xorUsedAsPow, `const x = 1 ^ 0;`);
    expect(d.length).toBe(0);
  });

  test("ignores variable ^ variable", () => {
    const d = lint(xorUsedAsPow, `const x = a ^ b;`);
    expect(d.length).toBe(0);
  });
});
