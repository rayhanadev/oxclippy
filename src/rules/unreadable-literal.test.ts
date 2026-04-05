import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import unreadableLiteral from "./unreadable-literal";

describe("unreadable-literal", () => {
  test("flags 1000000", () => {
    const d = lint(unreadableLiteral, `const x = 1000000;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("1_000_000");
  });

  test("flags 10000", () => {
    const d = lint(unreadableLiteral, `const x = 10000;`);
    expect(d.length).toBe(1);
  });

  test("ignores 9999", () => {
    const d = lint(unreadableLiteral, `const x = 9999;`);
    expect(d.length).toBe(0);
  });

  test("ignores already-separated", () => {
    const d = lint(unreadableLiteral, `const x = 1_000_000;`);
    expect(d.length).toBe(0);
  });

  test("ignores floats", () => {
    const d = lint(unreadableLiteral, `const x = 3.14159;`);
    expect(d.length).toBe(0);
  });

  test("ignores hex", () => {
    const d = lint(unreadableLiteral, `const x = 0xFF00FF;`);
    expect(d.length).toBe(0);
  });
});
