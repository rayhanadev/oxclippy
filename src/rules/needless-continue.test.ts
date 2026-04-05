import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import needlessContinue from "./needless-continue";

describe("needless-continue", () => {
  test("flags continue at end of loop", () => {
    const d = lint(needlessContinue, `for (const x of arr) { doStuff(); continue; }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("needless_continue");
  });

  test("flags else { continue } at end of loop", () => {
    const d = lint(
      needlessContinue,
      `for (const x of arr) { if (x > 0) { doStuff(); } else { continue; } }`,
    );
    expect(d.length).toBe(1);
  });

  test("ignores continue in middle of loop", () => {
    const d = lint(needlessContinue, `for (const x of arr) { if (x < 0) continue; doStuff(); }`);
    expect(d.length).toBe(0);
  });

  test("flags continue in while loop", () => {
    const d = lint(needlessContinue, `while (true) { doStuff(); continue; }`);
    expect(d.length).toBe(1);
  });

  test("flags continue in for-in loop", () => {
    const d = lint(needlessContinue, `for (var k in obj) { doStuff(); continue; }`);
    expect(d.length).toBe(1);
  });

  test("flags continue in do-while loop", () => {
    const d = lint(needlessContinue, `do { doStuff(); continue; } while (true);`);
    expect(d.length).toBe(1);
  });

  test("flags continue in for loop", () => {
    const d = lint(needlessContinue, `for (var i = 0; i < 10; i++) { doStuff(); continue; }`);
    expect(d.length).toBe(1);
  });
});
