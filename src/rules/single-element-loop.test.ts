import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import singleElementLoop from "./single-element-loop";

describe("single-element-loop", () => {
  test("flags for-of over [value]", () => {
    const d = lint(singleElementLoop, `for (const x of [42]) { console.log(x); }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("single_element_loop");
  });

  test("ignores for-of over multi-element array", () => {
    const d = lint(singleElementLoop, `for (const x of [1, 2, 3]) { console.log(x); }`);
    expect(d.length).toBe(0);
  });
});
