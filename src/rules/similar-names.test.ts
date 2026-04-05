import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import similarNames from "./similar-names";

describe("similar-names", () => {
  test("flags item vs items", () => {
    const d = lint(similarNames, `function f(item, items) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("similar_names");
  });

  test("flags data vs date", () => {
    const d = lint(similarNames, `function f() { const data = 1; const date = 2; }`);
    expect(d.length).toBe(1);
  });

  test("flags form vs from", () => {
    const d = lint(similarNames, `function f() { const form = 1; const from = 2; }`);
    expect(d.length).toBe(1);
  });

  test("ignores short names like i/j", () => {
    const d = lint(similarNames, `function f(i, j) {}`);
    expect(d.length).toBe(0);
  });

  test("ignores clearly different names", () => {
    const d = lint(similarNames, `function f(name, email) {}`);
    expect(d.length).toBe(0);
  });

  test("collects from assignment pattern params", () => {
    const d = lint(similarNames, `function f(data = 1, date = 2) {}`);
    expect(d.length).toBe(1);
  });
});
