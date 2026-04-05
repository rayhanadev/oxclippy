import { test, expect, describe } from "bun:test";
import { lint } from "../../test/helpers";

import unnecessaryReduceCollect from "./unnecessary-reduce-collect";

describe("unnecessary-reduce-collect", () => {
  test("flags .reduce() that pushes (map pattern)", () => {
    const d = lint(
      unnecessaryReduceCollect,
      `const y = arr.reduce((acc, x) => { acc.push(x * 2); return acc; }, []);`,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("map");
  });

  test("flags .reduce() that conditionally pushes (filter pattern)", () => {
    const d = lint(
      unnecessaryReduceCollect,
      `const y = arr.reduce((acc, x) => { if (x > 0) acc.push(x); return acc; }, []);`,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("filter");
  });

  test("flags filter pattern with block consequent", () => {
    const d = lint(
      unnecessaryReduceCollect,
      `const y = arr.reduce((acc, x) => { if (x > 0) { acc.push(x); } return acc; }, []);`,
    );
    expect(d.length).toBe(1);
  });

  test("ignores .reduce() with non-array init", () => {
    const d = lint(unnecessaryReduceCollect, `const y = arr.reduce((acc, x) => acc + x, 0);`);
    expect(d.length).toBe(0);
  });
});
