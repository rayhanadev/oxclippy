import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import matchSameArms from "./match-same-arms";

describe("match-same-arms", () => {
  test("flags switch with identical case bodies", () => {
    const d = lint(
      matchSameArms,
      `
      switch (x) {
        case 1: doA(); break;
        case 2: doA(); break;
        case 3: doB(); break;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("match_same_arms");
  });

  test("ignores switch with different case bodies", () => {
    const d = lint(
      matchSameArms,
      `
      switch (x) {
        case 1: doA(); break;
        case 2: doB(); break;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
