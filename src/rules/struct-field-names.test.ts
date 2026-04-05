import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import structFieldNames from "./struct-field-names";

describe("struct-field-names", () => {
  test("flags interface with all fields sharing prefix", () => {
    const d = lint(
      structFieldNames,
      `interface User { userName: string; userEmail: string; userAge: number; }`,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("struct_field_names");
    expect(d[0]!.message).toContain("prefix");
  });

  test("flags interface with all fields sharing suffix", () => {
    const d = lint(
      structFieldNames,
      `interface Config { timeoutValue: number; retryValue: number; limitValue: number; }`,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("suffix");
  });

  test("flags type alias with redundantly prefixed fields", () => {
    const d = lint(
      structFieldNames,
      `type Config = { configTimeout: number; configRetry: number; configLimit: number; }`,
    );
    expect(d.length).toBe(1);
  });

  test("flags snake_case prefix", () => {
    const d = lint(
      structFieldNames,
      `interface Opts { opts_timeout: number; opts_retry: number; opts_limit: number; }`,
    );
    expect(d.length).toBe(1);
  });

  test("ignores interface with distinct field names", () => {
    const d = lint(
      structFieldNames,
      `interface User { name: string; email: string; age: number; }`,
    );
    expect(d.length).toBe(0);
  });
});
