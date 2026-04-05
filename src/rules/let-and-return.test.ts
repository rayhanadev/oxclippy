import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import letAndReturn from "./let-and-return";

describe("let-and-return", () => {
  test("flags const x = expr; return x;", () => {
    const d = lint(
      letAndReturn,
      `
      function f() {
        const x = compute();
        return x;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("let_and_return");
  });

  test("ignores when variable is used before return", () => {
    const d = lint(
      letAndReturn,
      `
      function f() {
        const x = compute();
        console.log(x);
        return x;
      }
    `,
    );
    // The second-to-last statement is console.log, not the variable decl
    expect(d.length).toBe(0);
  });

  test("ignores single-statement function", () => {
    const d = lint(
      letAndReturn,
      `
      function f() {
        return compute();
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
