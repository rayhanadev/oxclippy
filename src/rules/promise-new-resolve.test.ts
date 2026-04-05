import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import promiseNewResolve from "./promise-new-resolve";

describe("promise-new-resolve", () => {
  test("flags new Promise(resolve => resolve(x))", () => {
    const d = lint(promiseNewResolve, `const p = new Promise(resolve => resolve(42));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Promise.resolve");
  });

  test("flags new Promise((resolve) => { resolve(x); })", () => {
    const d = lint(promiseNewResolve, `const p = new Promise((resolve) => { resolve(42); });`);
    expect(d.length).toBe(1);
  });

  test("flags new Promise((_, reject) => reject(err))", () => {
    const d = lint(promiseNewResolve, `const p = new Promise((_, reject) => reject(new Error()));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Promise.reject");
  });

  test("ignores new Promise with async work", () => {
    const d = lint(
      promiseNewResolve,
      `const p = new Promise((resolve) => { setTimeout(() => resolve(42), 100); });`,
    );
    expect(d.length).toBe(0);
  });
});
