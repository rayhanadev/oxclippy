import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import searchIsSome from "./search-is-some";

describe("search-is-some", () => {
  test("flags .find(fn) !== undefined", () => {
    const d = lint(searchIsSome, `if (arr.find(x => x > 1) !== undefined) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("search_is_some");
  });

  test("flags .find(fn) != null", () => {
    const d = lint(searchIsSome, `if (arr.find(x => x > 1) != null) {}`);
    expect(d.length).toBe(1);
  });

  test("flags .find(fn) === undefined", () => {
    const d = lint(searchIsSome, `if (arr.find(x => x > 1) === undefined) {}`);
    expect(d.length).toBe(1);
  });

  test("flags undefined === .find(fn)", () => {
    const d = lint(searchIsSome, `if (undefined === arr.find(x => x > 1)) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores .find(fn) used as value", () => {
    const d = lint(searchIsSome, `const x = arr.find(fn);`);
    expect(d.length).toBe(0);
  });
});
