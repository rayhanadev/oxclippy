import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import explicitCounterLoop from "./explicit-counter-loop";

describe("explicit-counter-loop", () => {
  test("flags manual counter with for-of", () => {
    const d = lint(
      explicitCounterLoop,
      `
      function f(arr) {
        let i = 0;
        for (const x of arr) {
          console.log(i, x);
          i++;
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("explicit_counter_loop");
  });

  test("ignores for-of without counter", () => {
    const d = lint(
      explicitCounterLoop,
      `
      function f(arr) {
        for (const x of arr) { console.log(x); }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
