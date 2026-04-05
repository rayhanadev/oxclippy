import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import almostSwapped from "./almost-swapped";

describe("almost-swapped", () => {
  test("flags a = b; b = a;", () => {
    const d = lint(almostSwapped, `{ a = b; b = a; }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("almost_swapped");
  });

  test("ignores proper assignment sequence", () => {
    const d = lint(almostSwapped, `{ a = b; c = d; }`);
    expect(d.length).toBe(0);
  });
});
