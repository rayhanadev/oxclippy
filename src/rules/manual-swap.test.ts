import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualSwap from "./manual-swap";

describe("manual-swap", () => {
  test("flags three-statement swap", () => {
    const d = lint(
      manualSwap,
      `
      {
        const tmp = a;
        a = b;
        b = tmp;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_swap");
  });

  test("flags swap of member expressions", () => {
    const d = lint(
      manualSwap,
      `
      {
        const tmp = obj.x;
        obj.x = obj.y;
        obj.y = tmp;
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores non-swap pattern", () => {
    const d = lint(
      manualSwap,
      `
      {
        const tmp = a;
        a = b;
        c = tmp;
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores at program level", () => {
    const d = lint(manualSwap, `const tmp = a; a = b; b = tmp;`);
    expect(d.length).toBe(1);
  });
});
