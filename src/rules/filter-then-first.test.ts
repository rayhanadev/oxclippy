import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import filterThenFirst from "./filter-then-first";

describe("filter-then-first", () => {
  test("flags .filter(fn)[0]", () => {
    const d = lint(
      filterThenFirst,
      `
      const x = arr.filter(x => x > 1)[0];
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("filter_next");
  });

  test("ignores .filter(fn)[1]", () => {
    const d = lint(
      filterThenFirst,
      `
      const x = arr.filter(x => x > 1)[1];
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores .find(fn)", () => {
    const d = lint(
      filterThenFirst,
      `
      const x = arr.find(x => x > 1);
    `,
    );
    expect(d.length).toBe(0);
  });
});
