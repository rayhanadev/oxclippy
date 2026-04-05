import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import singleCaseSwitch from "./single-case-switch";

describe("single-case-switch", () => {
  test("flags switch with single case", () => {
    const d = lint(
      singleCaseSwitch,
      `
      switch (x) {
        case "a": doThing(); break;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("single_match");
  });

  test("flags switch with single case + default", () => {
    const d = lint(
      singleCaseSwitch,
      `
      switch (x) {
        case "a": doThing(); break;
        default: doOther(); break;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("if/else");
  });

  test("ignores switch with multiple cases", () => {
    const d = lint(
      singleCaseSwitch,
      `
      switch (x) {
        case "a": doA(); break;
        case "b": doB(); break;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
