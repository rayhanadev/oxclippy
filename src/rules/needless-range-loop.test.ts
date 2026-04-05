import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import needlessRangeLoop from "./needless-range-loop";

describe("needless-range-loop", () => {
  test("flags for (let i = 0; i < arr.length; i++) using only arr[i]", () => {
    const d = lint(
      needlessRangeLoop,
      `
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("needless_range_loop");
  });

  test("ignores when i is used for other purposes", () => {
    const d = lint(
      needlessRangeLoop,
      `
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i], i);
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores non-zero start", () => {
    const d = lint(
      needlessRangeLoop,
      `
      for (let i = 1; i < arr.length; i++) {
        console.log(arr[i]);
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("flags i += 1 increment form", () => {
    const d = lint(
      needlessRangeLoop,
      `
      for (let i = 0; i < arr.length; i += 1) {
        console.log(arr[i]);
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores non-length test", () => {
    const d = lint(
      needlessRangeLoop,
      `
      for (let i = 0; i < 10; i++) {
        console.log(arr[i]);
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores non-increment update", () => {
    const d = lint(
      needlessRangeLoop,
      `
      for (let i = 0; i < arr.length; i += 2) {
        console.log(arr[i]);
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});
