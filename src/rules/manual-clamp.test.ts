import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import manualClamp from "./manual-clamp";

describe("manual-clamp", () => {
  test("flags Math.min(max, Math.max(val, min))", () => {
    const d = lint(manualClamp, `const x = Math.min(100, Math.max(val, 0));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_clamp");
  });

  test("flags Math.max(min, Math.min(val, max))", () => {
    const d = lint(manualClamp, `const x = Math.max(0, Math.min(val, 100));`);
    expect(d.length).toBe(1);
  });

  test("ignores standalone Math.min", () => {
    const d = lint(manualClamp, `const x = Math.min(a, b);`);
    expect(d.length).toBe(0);
  });
});

describe("manual-clamp (extra coverage)", () => {
  test("flags Math.max(min, Math.min(val, max))", () => {
    const d = lint(manualClamp, `const x = Math.max(0, Math.min(val, 100));`);
    expect(d.length).toBe(1);
  });

  test("flags Math.max(Math.min(val, max), min)", () => {
    const d = lint(manualClamp, `const x = Math.max(Math.min(val, 100), 0);`);
    expect(d.length).toBe(1);
  });

  test("flags Math.min(max, Math.max(val, min))", () => {
    const d = lint(manualClamp, `const x = Math.min(100, Math.max(val, 0));`);
    expect(d.length).toBe(1);
  });

  test("flags Math.min(Math.max(val, min), max)", () => {
    const d = lint(manualClamp, `const x = Math.min(Math.max(val, 0), 100);`);
    expect(d.length).toBe(1);
  });
});
