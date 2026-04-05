import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import mapVoidReturn from "./map-void-return";

describe("map-void-return", () => {
  test("flags .map() as statement", () => {
    const d = lint(
      mapVoidReturn,
      `
      arr.map(x => console.log(x));
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("map_unit_fn");
  });

  test("ignores .map() assigned to variable", () => {
    const d = lint(
      mapVoidReturn,
      `
      const y = arr.map(x => x + 1);
    `,
    );
    expect(d.length).toBe(0);
  });
});
