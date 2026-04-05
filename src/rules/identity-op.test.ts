import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import identityOp from "./identity-op";

describe("identity-op", () => {
  test("flags x + 0", () => {
    const d = lint(identityOp, `const y = x + 0;`);
    expect(d.length).toBe(1);
  });

  test("flags 0 + x", () => {
    const d = lint(identityOp, `const y = 0 + x;`);
    expect(d.length).toBe(1);
  });

  test("flags x * 1", () => {
    const d = lint(identityOp, `const y = x * 1;`);
    expect(d.length).toBe(1);
  });

  test("flags x - 0", () => {
    const d = lint(identityOp, `const y = x - 0;`);
    expect(d.length).toBe(1);
  });

  test("flags x / 1", () => {
    const d = lint(identityOp, `const y = x / 1;`);
    expect(d.length).toBe(1);
  });

  test("flags x ** 1", () => {
    const d = lint(identityOp, `const y = x ** 1;`);
    expect(d.length).toBe(1);
  });

  test("ignores string + 0 (concatenation)", () => {
    const d = lint(identityOp, `const y = "hello" + 0;`);
    expect(d.length).toBe(0);
  });

  test("ignores x + 1", () => {
    const d = lint(identityOp, `const y = x + 1;`);
    expect(d.length).toBe(0);
  });

  test("ignores x * 2", () => {
    const d = lint(identityOp, `const y = x * 2;`);
    expect(d.length).toBe(0);
  });
});
