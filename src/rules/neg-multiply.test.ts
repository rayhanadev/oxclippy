import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import negMultiply from "./neg-multiply";

describe("neg-multiply", () => {
  test("flags x * -1", () => {
    const d = lint(negMultiply, `const y = x * -1;`);
    expect(d.length).toBe(1);
  });

  test("flags -1 * x", () => {
    const d = lint(negMultiply, `const y = -1 * x;`);
    expect(d.length).toBe(1);
  });

  test("ignores x * -2", () => {
    const d = lint(negMultiply, `const y = x * -2;`);
    expect(d.length).toBe(0);
  });

  test("ignores x * 1", () => {
    const d = lint(negMultiply, `const y = x * 1;`);
    expect(d.length).toBe(0);
  });
});
