import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import preferStructuredClone from "./prefer-structured-clone";

describe("prefer-structured-clone", () => {
  test("flags JSON.parse(JSON.stringify(x))", () => {
    const d = lint(preferStructuredClone, `const copy = JSON.parse(JSON.stringify(obj));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("structuredClone");
  });

  test("ignores JSON.parse(str)", () => {
    const d = lint(preferStructuredClone, `const data = JSON.parse(str);`);
    expect(d.length).toBe(0);
  });

  test("ignores JSON.stringify alone", () => {
    const d = lint(preferStructuredClone, `const str = JSON.stringify(obj);`);
    expect(d.length).toBe(0);
  });
});
