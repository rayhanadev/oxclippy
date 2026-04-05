import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import collapsibleIf from "./collapsible-if";

describe("collapsible-if", () => {
  test("flags nested ifs without else", () => {
    const d = lint(
      collapsibleIf,
      `
      function f(a, b) {
        if (a) {
          if (b) {
            console.log("hi");
          }
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("collapsible_if");
  });

  test("ignores if outer has else", () => {
    const d = lint(
      collapsibleIf,
      `
      function f(a, b) {
        if (a) {
          if (b) { console.log("hi"); }
        } else {
          console.log("no");
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores if inner has else", () => {
    const d = lint(
      collapsibleIf,
      `
      function f(a, b) {
        if (a) {
          if (b) { console.log("hi"); } else { console.log("no"); }
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores if outer body has multiple statements", () => {
    const d = lint(
      collapsibleIf,
      `
      function f(a, b) {
        if (a) {
          doSomething();
          if (b) { console.log("hi"); }
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
