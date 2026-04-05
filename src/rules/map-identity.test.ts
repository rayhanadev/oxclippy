import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import mapIdentity from "./map-identity";

describe("map-identity", () => {
  test("flags .map(x => x)", () => {
    const d = lint(mapIdentity, `const y = arr.map(x => x);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("map_identity");
  });

  test("flags .map(x => { return x; })", () => {
    const d = lint(mapIdentity, `const y = arr.map(x => { return x; });`);
    expect(d.length).toBe(1);
  });

  test("flags .map(function(x) { return x; })", () => {
    const d = lint(mapIdentity, `const y = arr.map(function(x) { return x; });`);
    expect(d.length).toBe(1);
  });

  test("flags .map(x => { return x; }) with block body arrow", () => {
    // This specifically covers the block-body arrow path
    const d = lint(mapIdentity, `const y = arr.map((item) => { return item; });`);
    expect(d.length).toBe(1);
  });

  test("ignores .map(x => x + 1)", () => {
    const d = lint(mapIdentity, `const y = arr.map(x => x + 1);`);
    expect(d.length).toBe(0);
  });
});
