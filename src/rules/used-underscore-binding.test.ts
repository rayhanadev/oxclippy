import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import usedUnderscoreBinding from "./used-underscore-binding";

describe("used-underscore-binding", () => {
  test("flags _temp that is actually used", () => {
    const d = lint(usedUnderscoreBinding, `const _temp = 5; console.log(_temp);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("used_underscore_binding");
  });

  test("ignores bare _", () => {
    const d = lint(usedUnderscoreBinding, `const _ = 5; console.log(_);`);
    expect(d.length).toBe(0);
  });

  test("ignores _temp that is never used", () => {
    const d = lint(usedUnderscoreBinding, `const _temp = 5;`);
    expect(d.length).toBe(0);
  });
});
