import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import boolToIntWithIf from "./bool-to-int-with-if";

describe("bool-to-int-with-if", () => {
  test("flags cond ? 1 : 0", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? 1 : 0;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("bool_to_int_with_if");
  });

  test("flags cond ? 0 : 1", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? 0 : 1;`);
    expect(d.length).toBe(1);
  });

  test("ignores cond ? 2 : 0", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? 2 : 0;`);
    expect(d.length).toBe(0);
  });

  test("ignores cond ? 'yes' : 'no'", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? "yes" : "no";`);
    expect(d.length).toBe(0);
  });
});
