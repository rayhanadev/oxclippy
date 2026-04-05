import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import unnecessaryFold from "./unnecessary-fold";

describe("unnecessary-fold", () => {
  test("flags .reduce() with || and false init → .some()", () => {
    const d = lint(unnecessaryFold, `const x = arr.reduce((acc, x) => acc || x > 0, false);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("some");
  });

  test("flags .reduce() with && and true init → .every()", () => {
    const d = lint(unnecessaryFold, `const x = arr.reduce((acc, x) => acc && x > 0, true);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("every");
  });

  test("ignores .reduce() with + and 0 init (sum)", () => {
    const d = lint(unnecessaryFold, `const x = arr.reduce((acc, x) => acc + x, 0);`);
    expect(d.length).toBe(0);
  });
});

describe("unnecessary-fold (extra coverage)", () => {
  test("flags block-body .reduce() with || → .some()", () => {
    const d = lint(
      unnecessaryFold,
      `const x = arr.reduce((acc, x) => { return acc || x > 0; }, false);`,
    );
    expect(d.length).toBe(1);
  });

  test("flags block-body .reduce() with && → .every()", () => {
    const d = lint(
      unnecessaryFold,
      `const x = arr.reduce((acc, x) => { return acc && isValid(x); }, true);`,
    );
    expect(d.length).toBe(1);
  });
});
