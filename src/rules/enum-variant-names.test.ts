import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import enumVariantNames from "./enum-variant-names";

describe("enum-variant-names", () => {
  test("flags enum with all members prefixed by enum name", () => {
    const d = lint(enumVariantNames, `enum Color { ColorRed, ColorGreen, ColorBlue }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("enum_variant_names");
    expect(d[0]!.message).toContain("prefix");
  });

  test("flags enum with all members suffixed by enum name", () => {
    const d = lint(enumVariantNames, `enum Type { ReadType, WriteType, DeleteType }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("suffix");
  });

  test("ignores enum with distinct member names", () => {
    const d = lint(enumVariantNames, `enum Color { Red, Green, Blue }`);
    expect(d.length).toBe(0);
  });
});
