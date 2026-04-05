import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import ifSameThenElse from "./if-same-then-else";

describe("if-same-then-else", () => {
  test("flags identical if/else bodies", () => {
    const d = lint(ifSameThenElse, `if (x) { doA(); } else { doA(); }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("if_same_then_else");
  });

  test("ignores different bodies", () => {
    const d = lint(ifSameThenElse, `if (x) { doA(); } else { doB(); }`);
    expect(d.length).toBe(0);
  });

  test("ignores else-if chains", () => {
    const d = lint(ifSameThenElse, `if (x) { doA(); } else if (y) { doA(); }`);
    expect(d.length).toBe(0);
  });
});
