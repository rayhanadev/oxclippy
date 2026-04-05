import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import cognitiveComplexity from "./cognitive-complexity";

describe("cognitive-complexity", () => {
  test("flags highly complex function", () => {
    // Build a function with high cognitive complexity
    const d = lint(
      cognitiveComplexity,
      `
      function complex(a, b, c, d, e) {
        if (a) {
          if (b) {
            if (c) {
              if (d) {
                if (e) {
                  for (var i = 0; i < 10; i++) {
                    if (i > 5) {
                      while (true) {
                        if (a && b || c) {
                          try { foo(); } catch(e) { bar(); }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("cognitive_complexity");
  });

  test("ignores simple function", () => {
    const d = lint(
      cognitiveComplexity,
      `
      function simple(x) {
        if (x > 0) return x;
        return -x;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("cognitive-complexity (extra coverage)", () => {
  test("counts switch, catch, do-while, for-in, ternary", () => {
    // Each construct at nesting level adds 1 + nesting. This function needs to exceed 25.
    const d = lint(
      cognitiveComplexity,
      `
      function complex(x) {
        if (x) {
          switch (x) { case 1: break; case 2: break; }
          try { foo(); } catch(e) {
            if (e) {
              do { x++; } while (x < 10);
              for (var k in obj) {
                if (k) {
                  while (x > 0) {
                    var y = x ? 1 : 0;
                    if (x > 0) {
                      if (x && y || !x) { foo(); }
                    } else if (x < 0) {
                      bar();
                    } else {
                      baz();
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("does not recurse into nested functions", () => {
    const d = lint(
      cognitiveComplexity,
      `
      function outer(x) {
        const inner = function() {
          if (true) { if (true) { if (true) { if (true) { if (true) {} } } } }
        };
        return x;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
