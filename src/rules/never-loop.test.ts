import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import neverLoop from "./never-loop";

describe("never-loop", () => {
  test("flags for loop that always returns", () => {
    const d = lint(neverLoop, `function f() { for (const x of arr) { return x; } }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("never_loop");
  });

  test("flags while loop that always breaks", () => {
    const d = lint(neverLoop, `while (true) { break; }`);
    expect(d.length).toBe(1);
  });

  test("flags if/else that both exit", () => {
    const d = lint(
      neverLoop,
      `function f() { for (const x of arr) { if (x) { return x; } else { throw new Error(); } } }`,
    );
    expect(d.length).toBe(1);
  });

  test("ignores loop with conditional break", () => {
    const d = lint(neverLoop, `for (const x of arr) { if (x > 5) break; console.log(x); }`);
    expect(d.length).toBe(0);
  });
});

describe("never-loop (extra coverage)", () => {
  test("flags for-in loop that always returns", () => {
    const d = lint(neverLoop, `function f() { for (var k in obj) { return k; } }`);
    expect(d.length).toBe(1);
  });

  test("flags do-while that always breaks", () => {
    const d = lint(neverLoop, `do { break; } while (true);`);
    expect(d.length).toBe(1);
  });

  test("flags for-statement that always throws", () => {
    const d = lint(neverLoop, `for (var i = 0; i < 10; i++) { throw new Error(); }`);
    expect(d.length).toBe(1);
  });
});
