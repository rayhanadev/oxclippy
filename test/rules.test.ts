import { test, expect, describe } from "bun:test";
import { lint } from "./helpers";

import needlessBool from "../src/rules/needless-bool";
import collapsibleIf from "../src/rules/collapsible-if";
import negMultiply from "../src/rules/neg-multiply";
import boolComparison from "../src/rules/bool-comparison";
import identityOp from "../src/rules/identity-op";
import singleCaseSwitch from "../src/rules/single-case-switch";
import tooManyArguments from "../src/rules/too-many-arguments";
import tooManyLines from "../src/rules/too-many-lines";
import filterThenFirst from "../src/rules/filter-then-first";
import mapVoidReturn from "../src/rules/map-void-return";
import uselessConversion from "../src/rules/useless-conversion";
import manualClamp from "../src/rules/manual-clamp";
import manualStrip from "../src/rules/manual-strip";
import manualFind from "../src/rules/manual-find";
import manualSome from "../src/rules/manual-some";
import manualEvery from "../src/rules/manual-every";
import manualIncludes from "../src/rules/manual-includes";
import cognitiveComplexity from "../src/rules/cognitive-complexity";
import floatComparison from "../src/rules/float-comparison";
import needlessRangeLoop from "../src/rules/needless-range-loop";
import manualSwap from "../src/rules/manual-swap";
import searchIsSome from "../src/rules/search-is-some";
import letAndReturn from "../src/rules/let-and-return";
import xorUsedAsPow from "../src/rules/xor-used-as-pow";
import mapIdentity from "../src/rules/map-identity";
import redundantClosureCall from "../src/rules/redundant-closure-call";
import almostSwapped from "../src/rules/almost-swapped";
import ifSameThenElse from "../src/rules/if-same-then-else";
import neverLoop from "../src/rules/never-loop";
import explicitCounterLoop from "../src/rules/explicit-counter-loop";
import excessiveNesting from "../src/rules/excessive-nesting";
import fnParamsExcessiveBools from "../src/rules/fn-params-excessive-bools";
import floatEqualityWithoutAbs from "../src/rules/float-equality-without-abs";
import manualIsFinite from "../src/rules/manual-is-finite";
import unnecessaryFold from "../src/rules/unnecessary-fold";
import needlessLateInit from "../src/rules/needless-late-init";
import singleElementLoop from "../src/rules/single-element-loop";
import intPlusOne from "../src/rules/int-plus-one";
import zeroDividedByZero from "../src/rules/zero-divided-by-zero";
import redundantClosure from "../src/rules/redundant-closure";
import unnecessaryReduceCollect from "../src/rules/unnecessary-reduce-collect";
import preferStructuredClone from "../src/rules/prefer-structured-clone";
import objectKeysValues from "../src/rules/object-keys-values";
import promiseNewResolve from "../src/rules/promise-new-resolve";
import similarNames from "../src/rules/similar-names";
import matchSameArms from "../src/rules/match-same-arms";
import usedUnderscoreBinding from "../src/rules/used-underscore-binding";
import needlessContinue from "../src/rules/needless-continue";
import enumVariantNames from "../src/rules/enum-variant-names";
import structFieldNames from "../src/rules/struct-field-names";
import unreadableLiteral from "../src/rules/unreadable-literal";
import boolToIntWithIf from "../src/rules/bool-to-int-with-if";

// ── needless-bool ─────────────────────────────────────────────

describe("needless-bool", () => {
  test("flags if/else returning opposing booleans", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        if (x > 0) { return true; } else { return false; }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("needless_bool");
  });

  test("flags if/else assigning opposing booleans", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        let ok;
        if (x > 0) { ok = true; } else { ok = false; }
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores non-boolean returns", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        if (x > 0) { return 1; } else { return 0; }
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores same-side booleans", () => {
    const d = lint(
      needlessBool,
      `
      function f(x) {
        if (x > 0) { return true; } else { return true; }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── collapsible-if ────────────────────────────────────────────

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

// ── neg-multiply ──────────────────────────────────────────────

describe("neg-multiply", () => {
  test("flags x * -1", () => {
    const d = lint(negMultiply, `const y = x * -1;`);
    expect(d.length).toBe(1);
  });

  test("flags -1 * x", () => {
    const d = lint(negMultiply, `const y = -1 * x;`);
    expect(d.length).toBe(1);
  });

  test("ignores x * -2", () => {
    const d = lint(negMultiply, `const y = x * -2;`);
    expect(d.length).toBe(0);
  });

  test("ignores x * 1", () => {
    const d = lint(negMultiply, `const y = x * 1;`);
    expect(d.length).toBe(0);
  });
});

// ── bool-comparison ───────────────────────────────────────────

describe("bool-comparison", () => {
  test("flags x === true", () => {
    const d = lint(boolComparison, `if (x === true) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("use the expression directly");
  });

  test("flags x === false", () => {
    const d = lint(boolComparison, `if (x === false) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("negate");
  });

  test("flags x !== true", () => {
    const d = lint(boolComparison, `if (x !== true) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("negate");
  });

  test("flags x !== false", () => {
    const d = lint(boolComparison, `if (x !== false) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("use the expression directly");
  });

  test("ignores x === 1", () => {
    const d = lint(boolComparison, `if (x === 1) {}`);
    expect(d.length).toBe(0);
  });
});

// ── identity-op ───────────────────────────────────────────────

describe("identity-op", () => {
  test("flags x + 0", () => {
    const d = lint(identityOp, `const y = x + 0;`);
    expect(d.length).toBe(1);
  });

  test("flags 0 + x", () => {
    const d = lint(identityOp, `const y = 0 + x;`);
    expect(d.length).toBe(1);
  });

  test("flags x * 1", () => {
    const d = lint(identityOp, `const y = x * 1;`);
    expect(d.length).toBe(1);
  });

  test("flags x - 0", () => {
    const d = lint(identityOp, `const y = x - 0;`);
    expect(d.length).toBe(1);
  });

  test("flags x / 1", () => {
    const d = lint(identityOp, `const y = x / 1;`);
    expect(d.length).toBe(1);
  });

  test("flags x ** 1", () => {
    const d = lint(identityOp, `const y = x ** 1;`);
    expect(d.length).toBe(1);
  });

  test("ignores string + 0 (concatenation)", () => {
    const d = lint(identityOp, `const y = "hello" + 0;`);
    expect(d.length).toBe(0);
  });

  test("ignores x + 1", () => {
    const d = lint(identityOp, `const y = x + 1;`);
    expect(d.length).toBe(0);
  });

  test("ignores x * 2", () => {
    const d = lint(identityOp, `const y = x * 2;`);
    expect(d.length).toBe(0);
  });
});

// ── single-case-switch ────────────────────────────────────────

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

// ── too-many-arguments ────────────────────────────────────────

describe("too-many-arguments", () => {
  test("flags function with 6 params", () => {
    const d = lint(
      tooManyArguments,
      `
      function f(a, b, c, d, e, f) {}
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("too_many_arguments");
  });

  test("ignores function with 5 params", () => {
    const d = lint(
      tooManyArguments,
      `
      function f(a, b, c, d, e) {}
    `,
    );
    expect(d.length).toBe(0);
  });

  test("flags arrow with 6 params", () => {
    const d = lint(
      tooManyArguments,
      `
      const f = (a, b, c, d, e, f) => {};
    `,
    );
    expect(d.length).toBe(1);
  });
});

// ── filter-then-first ─────────────────────────────────────────

describe("filter-then-first", () => {
  test("flags .filter(fn)[0]", () => {
    const d = lint(
      filterThenFirst,
      `
      const x = arr.filter(x => x > 1)[0];
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("filter_next");
  });

  test("ignores .filter(fn)[1]", () => {
    const d = lint(
      filterThenFirst,
      `
      const x = arr.filter(x => x > 1)[1];
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores .find(fn)", () => {
    const d = lint(
      filterThenFirst,
      `
      const x = arr.find(x => x > 1);
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── map-void-return ───────────────────────────────────────────

describe("map-void-return", () => {
  test("flags .map() as statement", () => {
    const d = lint(
      mapVoidReturn,
      `
      arr.map(x => console.log(x));
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("map_unit_fn");
  });

  test("ignores .map() assigned to variable", () => {
    const d = lint(
      mapVoidReturn,
      `
      const y = arr.map(x => x + 1);
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── useless-conversion ────────────────────────────────────────

describe("useless-conversion", () => {
  test('flags String("hello")', () => {
    const d = lint(uselessConversion, `const x = String("hello");`);
    expect(d.length).toBe(1);
  });

  test("flags Number(42)", () => {
    const d = lint(uselessConversion, `const x = Number(42);`);
    expect(d.length).toBe(1);
  });

  test("flags Boolean(true)", () => {
    const d = lint(uselessConversion, `const x = Boolean(true);`);
    expect(d.length).toBe(1);
  });

  test("flags Array.from([1,2,3])", () => {
    const d = lint(uselessConversion, `const x = Array.from([1, 2, 3]);`);
    expect(d.length).toBe(1);
  });

  test("ignores Number('42')", () => {
    const d = lint(uselessConversion, `const x = Number("42");`);
    expect(d.length).toBe(0);
  });

  test("ignores String(42)", () => {
    const d = lint(uselessConversion, `const x = String(42);`);
    expect(d.length).toBe(0);
  });
});

// ── manual-clamp ──────────────────────────────────────────────

describe("manual-clamp", () => {
  test("flags Math.min(max, Math.max(val, min))", () => {
    const d = lint(manualClamp, `const x = Math.min(100, Math.max(val, 0));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_clamp");
  });

  test("flags Math.max(min, Math.min(val, max))", () => {
    const d = lint(manualClamp, `const x = Math.max(0, Math.min(val, 100));`);
    expect(d.length).toBe(1);
  });

  test("ignores standalone Math.min", () => {
    const d = lint(manualClamp, `const x = Math.min(a, b);`);
    expect(d.length).toBe(0);
  });
});

// ── manual-strip ──────────────────────────────────────────────

describe("manual-strip", () => {
  test("flags startsWith + slice pattern", () => {
    const d = lint(
      manualStrip,
      `
      function f(s) {
        if (s.startsWith("prefix")) {
          return s.slice("prefix".length);
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_strip");
  });

  test("flags endsWith + slice pattern", () => {
    const d = lint(
      manualStrip,
      `
      function f(s) {
        if (s.endsWith("suffix")) {
          return s.slice(0, -"suffix".length);
        }
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores startsWith without slice", () => {
    const d = lint(
      manualStrip,
      `
      function f(s) {
        if (s.startsWith("prefix")) {
          console.log("has prefix");
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── manual-find ───────────────────────────────────────────────

describe("manual-find", () => {
  test("flags for-of with if-return pattern", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
        return undefined;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_find");
  });

  test("ignores when no default return", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── manual-some ───────────────────────────────────────────────

describe("manual-some", () => {
  test("flags for-of returning true/false pattern", () => {
    const d = lint(
      manualSome,
      `
      function hasPositive(arr) {
        for (const x of arr) {
          if (x > 0) return true;
        }
        return false;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("some");
  });
});

// ── manual-every ──────────────────────────────────────────────

describe("manual-every", () => {
  test("flags for-of returning false/true pattern", () => {
    const d = lint(
      manualEvery,
      `
      function allPositive(arr) {
        for (const x of arr) {
          if (x <= 0) return false;
        }
        return true;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("every");
  });
});

// ── manual-includes ───────────────────────────────────────────

describe("manual-includes", () => {
  test("flags for-of with equality check", () => {
    const d = lint(
      manualIncludes,
      `
      function contains(arr, val) {
        for (const x of arr) {
          if (x === val) return true;
        }
        return false;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("includes");
  });
});

// ── cognitive-complexity ──────────────────────────────────────

describe("cognitive-complexity", () => {
  test("flags highly complex function", () => {
    // Build a function with high cognitive complexity
    const d = lint(
      cognitiveComplexity,
      `
      function complex(a, b, c, d, e) {
        if (a) {
          if (b) {
            if (c) {
              if (d) {
                if (e) {
                  for (var i = 0; i < 10; i++) {
                    if (i > 5) {
                      while (true) {
                        if (a && b || c) {
                          try { foo(); } catch(e) { bar(); }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("cognitive_complexity");
  });

  test("ignores simple function", () => {
    const d = lint(
      cognitiveComplexity,
      `
      function simple(x) {
        if (x > 0) return x;
        return -x;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── too-many-lines (basic) ────────────────────────────────────

describe("too-many-lines", () => {
  test("flags function with over 100 lines", () => {
    const lines = Array.from({ length: 102 }, (_, i) => `    const x${i} = ${i};`).join("\n");
    const d = lint(tooManyLines, `function big() {\n${lines}\n}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("too_many_lines");
  });

  test("ignores short function", () => {
    const d = lint(tooManyLines, `function small() { return 1; }`);
    expect(d.length).toBe(0);
  });

  test("flags function expression with over 100 lines", () => {
    const lines = Array.from({ length: 102 }, (_, i) => `    const x${i} = ${i};`).join("\n");
    const d = lint(tooManyLines, `const big = function() {\n${lines}\n}`);
    expect(d.length).toBe(1);
  });

  test("flags arrow function with over 100 lines", () => {
    const lines = Array.from({ length: 102 }, (_, i) => `    const x${i} = ${i};`).join("\n");
    const d = lint(tooManyLines, `const big = () => {\n${lines}\n}`);
    expect(d.length).toBe(1);
  });
});

// ── Coverage: too-many-arguments (FunctionExpression) ─────────

describe("too-many-arguments (extra coverage)", () => {
  test("flags function expression with 6 params", () => {
    const d = lint(tooManyArguments, `const f = function(a, b, c, d, e, f) {};`);
    expect(d.length).toBe(1);
  });
});

// ── Coverage: useless-conversion (toString, valueOf) ──────────

describe("useless-conversion (extra coverage)", () => {
  test('flags "str".toString()', () => {
    const d = lint(uselessConversion, `const x = "hello".toString();`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("toString");
  });

  test("flags (42).valueOf()", () => {
    const d = lint(uselessConversion, `const x = (42).valueOf();`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("valueOf");
  });

  test("ignores (42).toString()", () => {
    // Number to string IS a useful conversion
    const d = lint(uselessConversion, `const x = (42).toString();`);
    expect(d.length).toBe(0);
  });
});

// ── Coverage: manual-clamp (all 4 arg orderings) ─────────────

describe("manual-clamp (extra coverage)", () => {
  test("flags Math.max(min, Math.min(val, max))", () => {
    const d = lint(manualClamp, `const x = Math.max(0, Math.min(val, 100));`);
    expect(d.length).toBe(1);
  });

  test("flags Math.max(Math.min(val, max), min)", () => {
    const d = lint(manualClamp, `const x = Math.max(Math.min(val, 100), 0);`);
    expect(d.length).toBe(1);
  });

  test("flags Math.min(max, Math.max(val, min))", () => {
    const d = lint(manualClamp, `const x = Math.min(100, Math.max(val, 0));`);
    expect(d.length).toBe(1);
  });

  test("flags Math.min(Math.max(val, min), max)", () => {
    const d = lint(manualClamp, `const x = Math.min(Math.max(val, 0), 100);`);
    expect(d.length).toBe(1);
  });
});

// ── Coverage: manual-find (return null after loop) ────────────

describe("manual-find (extra coverage)", () => {
  test("flags for-of with return null after loop", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
        return null;
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("flags for-of with bare return after loop", () => {
    const d = lint(
      manualFind,
      `
      function f(arr) {
        for (const x of arr) {
          if (x > 5) return x;
        }
        return;
      }
    `,
    );
    expect(d.length).toBe(1);
  });
});

// ── Coverage: cognitive-complexity (more branch types) ────────

describe("cognitive-complexity (extra coverage)", () => {
  test("counts switch, catch, do-while, for-in, ternary", () => {
    // Each construct at nesting level adds 1 + nesting. This function needs to exceed 25.
    const d = lint(
      cognitiveComplexity,
      `
      function complex(x) {
        if (x) {
          switch (x) { case 1: break; case 2: break; }
          try { foo(); } catch(e) {
            if (e) {
              do { x++; } while (x < 10);
              for (var k in obj) {
                if (k) {
                  while (x > 0) {
                    var y = x ? 1 : 0;
                    if (x > 0) {
                      if (x && y || !x) { foo(); }
                    } else if (x < 0) {
                      bar();
                    } else {
                      baz();
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("does not recurse into nested functions", () => {
    const d = lint(
      cognitiveComplexity,
      `
      function outer(x) {
        const inner = function() {
          if (true) { if (true) { if (true) { if (true) { if (true) {} } } } }
        };
        return x;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// NEW RULES
// ═══════════════════════════════════════════════════════════════

// ── float-comparison ──────────────────────────────────────────

describe("float-comparison", () => {
  test("flags x === 0.1", () => {
    const d = lint(floatComparison, `if (x === 0.1) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("float_cmp");
  });

  test("flags 0.1 + 0.2 === 0.3", () => {
    const d = lint(floatComparison, `if (0.1 + 0.2 === 0.3) {}`);
    expect(d.length).toBe(1);
  });

  test("flags != with floats", () => {
    const d = lint(floatComparison, `if (x !== 1.5) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores integer comparison", () => {
    const d = lint(floatComparison, `if (x === 1) {}`);
    expect(d.length).toBe(0);
  });

  test("ignores string comparison", () => {
    const d = lint(floatComparison, `if (x === "hello") {}`);
    expect(d.length).toBe(0);
  });
});

// ── needless-range-loop ───────────────────────────────────────

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

// ── manual-swap ───────────────────────────────────────────────

describe("manual-swap", () => {
  test("flags three-statement swap", () => {
    const d = lint(
      manualSwap,
      `
      {
        const tmp = a;
        a = b;
        b = tmp;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("manual_swap");
  });

  test("flags swap of member expressions", () => {
    const d = lint(
      manualSwap,
      `
      {
        const tmp = obj.x;
        obj.x = obj.y;
        obj.y = tmp;
      }
    `,
    );
    expect(d.length).toBe(1);
  });

  test("ignores non-swap pattern", () => {
    const d = lint(
      manualSwap,
      `
      {
        const tmp = a;
        a = b;
        c = tmp;
      }
    `,
    );
    expect(d.length).toBe(0);
  });

  test("ignores at program level", () => {
    const d = lint(manualSwap, `const tmp = a; a = b; b = tmp;`);
    expect(d.length).toBe(1);
  });
});

// ── search-is-some ────────────────────────────────────────────

describe("search-is-some", () => {
  test("flags .find(fn) !== undefined", () => {
    const d = lint(searchIsSome, `if (arr.find(x => x > 1) !== undefined) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("search_is_some");
  });

  test("flags .find(fn) != null", () => {
    const d = lint(searchIsSome, `if (arr.find(x => x > 1) != null) {}`);
    expect(d.length).toBe(1);
  });

  test("flags .find(fn) === undefined", () => {
    const d = lint(searchIsSome, `if (arr.find(x => x > 1) === undefined) {}`);
    expect(d.length).toBe(1);
  });

  test("flags undefined === .find(fn)", () => {
    const d = lint(searchIsSome, `if (undefined === arr.find(x => x > 1)) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores .find(fn) used as value", () => {
    const d = lint(searchIsSome, `const x = arr.find(fn);`);
    expect(d.length).toBe(0);
  });
});

// ── let-and-return ────────────────────────────────────────────

describe("let-and-return", () => {
  test("flags const x = expr; return x;", () => {
    const d = lint(
      letAndReturn,
      `
      function f() {
        const x = compute();
        return x;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("let_and_return");
  });

  test("ignores when variable is used before return", () => {
    const d = lint(
      letAndReturn,
      `
      function f() {
        const x = compute();
        console.log(x);
        return x;
      }
    `,
    );
    // The second-to-last statement is console.log, not the variable decl
    expect(d.length).toBe(0);
  });

  test("ignores single-statement function", () => {
    const d = lint(
      letAndReturn,
      `
      function f() {
        return compute();
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

// ── xor-used-as-pow ───────────────────────────────────────────

describe("xor-used-as-pow", () => {
  test("flags 2 ^ 8", () => {
    const d = lint(xorUsedAsPow, `const x = 2 ^ 8;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("2 ** 8");
    expect(d[0]!.message).toContain("256");
  });

  test("flags 10 ^ 3", () => {
    const d = lint(xorUsedAsPow, `const x = 10 ^ 3;`);
    expect(d.length).toBe(1);
  });

  test("ignores 1 ^ 0 (small numbers)", () => {
    const d = lint(xorUsedAsPow, `const x = 1 ^ 0;`);
    expect(d.length).toBe(0);
  });

  test("ignores variable ^ variable", () => {
    const d = lint(xorUsedAsPow, `const x = a ^ b;`);
    expect(d.length).toBe(0);
  });
});

// ── map-identity ──────────────────────────────────────────────

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

// ── redundant-closure-call ────────────────────────────────────

describe("redundant-closure-call", () => {
  test("flags (() => expr)()", () => {
    const d = lint(redundantClosureCall, `const x = (() => 42)();`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("redundant_closure_call");
  });

  test("flags (() => { return expr; })()", () => {
    const d = lint(redundantClosureCall, `const x = (() => { return 42; })();`);
    expect(d.length).toBe(1);
  });

  test("flags (function() { return expr; })()", () => {
    const d = lint(redundantClosureCall, `const x = (function() { return 42; })();`);
    expect(d.length).toBe(1);
  });

  test("ignores multi-statement IIFE", () => {
    const d = lint(redundantClosureCall, `const x = (() => { setup(); return 42; })();`);
    expect(d.length).toBe(0);
  });

  test("ignores IIFE with arguments", () => {
    const d = lint(redundantClosureCall, `const x = ((a) => a + 1)(5);`);
    expect(d.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// ROUND 3 RULES
// ═══════════════════════════════════════════════════════════════

describe("almost-swapped", () => {
  test("flags a = b; b = a;", () => {
    const d = lint(almostSwapped, `{ a = b; b = a; }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("almost_swapped");
  });

  test("ignores proper assignment sequence", () => {
    const d = lint(almostSwapped, `{ a = b; c = d; }`);
    expect(d.length).toBe(0);
  });
});

describe("if-same-then-else", () => {
  test("flags identical if/else bodies", () => {
    const d = lint(ifSameThenElse, `if (x) { doA(); } else { doA(); }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("if_same_then_else");
  });

  test("ignores different bodies", () => {
    const d = lint(ifSameThenElse, `if (x) { doA(); } else { doB(); }`);
    expect(d.length).toBe(0);
  });

  test("ignores else-if chains", () => {
    const d = lint(ifSameThenElse, `if (x) { doA(); } else if (y) { doA(); }`);
    expect(d.length).toBe(0);
  });
});

describe("never-loop", () => {
  test("flags for loop that always returns", () => {
    const d = lint(neverLoop, `function f() { for (const x of arr) { return x; } }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("never_loop");
  });

  test("flags while loop that always breaks", () => {
    const d = lint(neverLoop, `while (true) { break; }`);
    expect(d.length).toBe(1);
  });

  test("flags if/else that both exit", () => {
    const d = lint(
      neverLoop,
      `function f() { for (const x of arr) { if (x) { return x; } else { throw new Error(); } } }`,
    );
    expect(d.length).toBe(1);
  });

  test("ignores loop with conditional break", () => {
    const d = lint(neverLoop, `for (const x of arr) { if (x > 5) break; console.log(x); }`);
    expect(d.length).toBe(0);
  });
});

describe("explicit-counter-loop", () => {
  test("flags manual counter with for-of", () => {
    const d = lint(
      explicitCounterLoop,
      `
      function f(arr) {
        let i = 0;
        for (const x of arr) {
          console.log(i, x);
          i++;
        }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("explicit_counter_loop");
  });

  test("ignores for-of without counter", () => {
    const d = lint(
      explicitCounterLoop,
      `
      function f(arr) {
        for (const x of arr) { console.log(x); }
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("excessive-nesting", () => {
  test("flags deeply nested code", () => {
    const d = lint(
      excessiveNesting,
      `
      function f(a, b, c, d, e, f) {
        if (a) { if (b) { for (var x of c) { if (d) { while (e) { if (f) { } } } } } }
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("excessive_nesting");
  });

  test("ignores shallow code", () => {
    const d = lint(
      excessiveNesting,
      `
      function f(x) { if (x) { for (var i of [1]) { console.log(i); } } }
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("fn-params-excessive-bools", () => {
  test("flags function with 4 boolean default params", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `
      function create(a = true, b = false, c = true, d = false) {}
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("excessive_bools");
  });

  test("ignores function with 2 boolean params", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `
      function create(a = true, b = false) {}
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("float-equality-without-abs", () => {
  test("flags (a - b) < epsilon", () => {
    const d = lint(floatEqualityWithoutAbs, `if (a - b < 0.001) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("float_equality_without_abs");
  });

  test("flags (a - b) < Number.EPSILON", () => {
    const d = lint(floatEqualityWithoutAbs, `if (a - b < Number.EPSILON) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores Math.abs(a - b) < epsilon", () => {
    const d = lint(floatEqualityWithoutAbs, `if (Math.abs(a - b) < 0.001) {}`);
    expect(d.length).toBe(0);
  });
});

describe("manual-is-finite", () => {
  test("flags x !== Infinity && x !== -Infinity", () => {
    const d = lint(manualIsFinite, `if (x !== Infinity && x !== -Infinity) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Number.isFinite");
  });

  test("flags x === Infinity || x === -Infinity", () => {
    const d = lint(manualIsFinite, `if (x === Infinity || x === -Infinity) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("isInfinite");
  });

  test("ignores unrelated logic", () => {
    const d = lint(manualIsFinite, `if (x > 0 && x < 100) {}`);
    expect(d.length).toBe(0);
  });
});

describe("unnecessary-fold", () => {
  test("flags .reduce() with || and false init → .some()", () => {
    const d = lint(unnecessaryFold, `const x = arr.reduce((acc, x) => acc || x > 0, false);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("some");
  });

  test("flags .reduce() with && and true init → .every()", () => {
    const d = lint(unnecessaryFold, `const x = arr.reduce((acc, x) => acc && x > 0, true);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("every");
  });

  test("ignores .reduce() with + and 0 init (sum)", () => {
    const d = lint(unnecessaryFold, `const x = arr.reduce((acc, x) => acc + x, 0);`);
    expect(d.length).toBe(0);
  });
});

describe("needless-late-init", () => {
  test("flags let x; x = expr;", () => {
    const d = lint(needlessLateInit, `{ let x; x = 5; }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("needless_late_init");
  });

  test("ignores initialized declaration", () => {
    const d = lint(needlessLateInit, `{ let x = 5; }`);
    expect(d.length).toBe(0);
  });
});

describe("single-element-loop", () => {
  test("flags for-of over [value]", () => {
    const d = lint(singleElementLoop, `for (const x of [42]) { console.log(x); }`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("single_element_loop");
  });

  test("ignores for-of over multi-element array", () => {
    const d = lint(singleElementLoop, `for (const x of [1, 2, 3]) { console.log(x); }`);
    expect(d.length).toBe(0);
  });
});

describe("int-plus-one", () => {
  test("flags x >= y + 1", () => {
    const d = lint(intPlusOne, `if (x >= y + 1) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("int_plus_one");
  });

  test("flags x + 1 <= y", () => {
    const d = lint(intPlusOne, `if (x + 1 <= y) {}`);
    expect(d.length).toBe(1);
  });

  test("flags x - 1 >= y", () => {
    const d = lint(intPlusOne, `if (x - 1 >= y) {}`);
    expect(d.length).toBe(1);
  });

  test("flags y <= x - 1", () => {
    const d = lint(intPlusOne, `if (y <= x - 1) {}`);
    expect(d.length).toBe(1);
  });

  test("ignores x >= y + 2", () => {
    const d = lint(intPlusOne, `if (x >= y + 2) {}`);
    expect(d.length).toBe(0);
  });
});

describe("zero-divided-by-zero", () => {
  test("flags 0 / 0", () => {
    const d = lint(zeroDividedByZero, `const x = 0 / 0;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("zero_divided_by_zero");
  });

  test("ignores 1 / 0", () => {
    const d = lint(zeroDividedByZero, `const x = 1 / 0;`);
    expect(d.length).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════
// PRINCIPLES-BASED RULES
// ═══════════════════════════════════════════════════════════════

describe("redundant-closure", () => {
  test("flags .map(x => String(x))", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => String(x));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("redundant_closure");
  });

  test("flags .filter(x => Boolean(x))", () => {
    const d = lint(redundantClosure, `const y = arr.filter(x => Boolean(x));`);
    expect(d.length).toBe(1);
  });

  test("flags .map(x => Number(x))", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => Number(x));`);
    expect(d.length).toBe(1);
  });

  test("flags function expression form", () => {
    const d = lint(redundantClosure, `const y = arr.map(function(x) { return String(x); });`);
    expect(d.length).toBe(1);
  });

  test("ignores .map(x => parseInt(x)) (unsafe — parseInt takes radix)", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => parseInt(x));`);
    expect(d.length).toBe(0);
  });

  test("ignores .map(x => x + 1) (not a single function call)", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => x + 1);`);
    expect(d.length).toBe(0);
  });

  test("ignores .map(x => custom(x)) (unknown function)", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => custom(x));`);
    expect(d.length).toBe(0);
  });
});

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

describe("prefer-structured-clone", () => {
  test("flags JSON.parse(JSON.stringify(x))", () => {
    const d = lint(preferStructuredClone, `const copy = JSON.parse(JSON.stringify(obj));`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("structuredClone");
  });

  test("ignores JSON.parse(str)", () => {
    const d = lint(preferStructuredClone, `const data = JSON.parse(str);`);
    expect(d.length).toBe(0);
  });

  test("ignores JSON.stringify alone", () => {
    const d = lint(preferStructuredClone, `const str = JSON.stringify(obj);`);
    expect(d.length).toBe(0);
  });
});

describe("object-keys-values", () => {
  test("flags Object.keys(obj).map(k => obj[k])", () => {
    const d = lint(objectKeysValues, `const vals = Object.keys(obj).map(k => obj[k]);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Object.values");
  });

  test("flags Object.keys(obj).forEach(k => use(obj[k]))", () => {
    const d = lint(objectKeysValues, `Object.keys(obj).forEach(k => use(obj[k]));`);
    expect(d.length).toBe(1);
  });

  test("suggests entries when key is also used", () => {
    const d = lint(objectKeysValues, `const pairs = Object.keys(obj).map(k => k + obj[k]);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("Object.entries");
  });

  test("ignores Object.keys without indexing", () => {
    const d = lint(objectKeysValues, `const keys = Object.keys(obj).map(k => k.toUpperCase());`);
    expect(d.length).toBe(0);
  });
});

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

// ═══════════════════════════════════════════════════════════════
// EXTRA COVERAGE
// ═══════════════════════════════════════════════════════════════

describe("excessive-nesting (extra coverage)", () => {
  test("flags deeply nested arrow function", () => {
    const d = lint(
      excessiveNesting,
      `
      const f = () => {
        if (a) { if (b) { for (var x of c) { if (d) { while (e) { if (f) {} } } } } }
      };
    `,
    );
    expect(d.length).toBe(1);
  });

  test("flags deeply nested function expression", () => {
    const d = lint(
      excessiveNesting,
      `
      const f = function() {
        if (a) { if (b) { for (var x of c) { if (d) { while (e) { if (f) {} } } } } }
      };
    `,
    );
    expect(d.length).toBe(1);
  });

  test("skips nested function bodies", () => {
    const d = lint(
      excessiveNesting,
      `
      function outer() {
        if (a) { if (b) { if (c) { if (d) {
          const inner = () => { if (e) { if (f) {} } };
        } } } }
      }
    `,
    );
    // outer is 4 deep (under threshold), inner is separate
    expect(d.length).toBe(0);
  });
});

describe("never-loop (extra coverage)", () => {
  test("flags for-in loop that always returns", () => {
    const d = lint(neverLoop, `function f() { for (var k in obj) { return k; } }`);
    expect(d.length).toBe(1);
  });

  test("flags do-while that always breaks", () => {
    const d = lint(neverLoop, `do { break; } while (true);`);
    expect(d.length).toBe(1);
  });

  test("flags for-statement that always throws", () => {
    const d = lint(neverLoop, `for (var i = 0; i < 10; i++) { throw new Error(); }`);
    expect(d.length).toBe(1);
  });
});

describe("unnecessary-fold (extra coverage)", () => {
  test("flags block-body .reduce() with || → .some()", () => {
    const d = lint(
      unnecessaryFold,
      `const x = arr.reduce((acc, x) => { return acc || x > 0; }, false);`,
    );
    expect(d.length).toBe(1);
  });

  test("flags block-body .reduce() with && → .every()", () => {
    const d = lint(
      unnecessaryFold,
      `const x = arr.reduce((acc, x) => { return acc && isValid(x); }, true);`,
    );
    expect(d.length).toBe(1);
  });
});

describe("fn-params-excessive-bools (extra coverage)", () => {
  test("flags arrow function with excessive bool defaults", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `const f = (a = true, b = false, c = true, d = false) => {};`,
    );
    expect(d.length).toBe(1);
  });

  test("flags function expression with excessive bool defaults", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `const f = function(a = true, b = false, c = true, d = false) {};`,
    );
    expect(d.length).toBe(1);
  });

  test("flags TypeScript boolean type annotations", () => {
    const d = lint(
      fnParamsExcessiveBools,
      `function create(admin: boolean, active: boolean, verified: boolean, notify: boolean) {}`,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("excessive_bools");
  });

  test("ignores function with 2 TS boolean params", () => {
    const d = lint(fnParamsExcessiveBools, `function create(admin: boolean, active: boolean) {}`);
    expect(d.length).toBe(0);
  });
});

describe("redundant-closure (extra coverage)", () => {
  test("flags block-body arrow: x => { return Number(x); }", () => {
    const d = lint(redundantClosure, `const y = arr.map(x => { return Number(x); });`);
    expect(d.length).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════
// PEDANTIC RULES
// ═══════════════════════════════════════════════════════════════

describe("similar-names", () => {
  test("flags item vs items", () => {
    const d = lint(similarNames, `function f(item, items) {}`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("similar_names");
  });

  test("flags data vs date", () => {
    const d = lint(similarNames, `function f() { const data = 1; const date = 2; }`);
    expect(d.length).toBe(1);
  });

  test("flags form vs from", () => {
    const d = lint(similarNames, `function f() { const form = 1; const from = 2; }`);
    expect(d.length).toBe(1);
  });

  test("ignores short names like i/j", () => {
    const d = lint(similarNames, `function f(i, j) {}`);
    expect(d.length).toBe(0);
  });

  test("ignores clearly different names", () => {
    const d = lint(similarNames, `function f(name, email) {}`);
    expect(d.length).toBe(0);
  });

  test("collects from assignment pattern params", () => {
    const d = lint(similarNames, `function f(data = 1, date = 2) {}`);
    expect(d.length).toBe(1);
  });
});

describe("match-same-arms", () => {
  test("flags switch with identical case bodies", () => {
    const d = lint(
      matchSameArms,
      `
      switch (x) {
        case 1: doA(); break;
        case 2: doA(); break;
        case 3: doB(); break;
      }
    `,
    );
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("match_same_arms");
  });

  test("ignores switch with different case bodies", () => {
    const d = lint(
      matchSameArms,
      `
      switch (x) {
        case 1: doA(); break;
        case 2: doB(); break;
      }
    `,
    );
    expect(d.length).toBe(0);
  });
});

describe("used-underscore-binding", () => {
  test("flags _temp that is actually used", () => {
    const d = lint(usedUnderscoreBinding, `const _temp = 5; console.log(_temp);`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("used_underscore_binding");
  });

  test("ignores bare _", () => {
    const d = lint(usedUnderscoreBinding, `const _ = 5; console.log(_);`);
    expect(d.length).toBe(0);
  });

  test("ignores _temp that is never used", () => {
    const d = lint(usedUnderscoreBinding, `const _temp = 5;`);
    expect(d.length).toBe(0);
  });
});

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

describe("bool-to-int-with-if", () => {
  test("flags cond ? 1 : 0", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? 1 : 0;`);
    expect(d.length).toBe(1);
    expect(d[0]!.message).toContain("bool_to_int_with_if");
  });

  test("flags cond ? 0 : 1", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? 0 : 1;`);
    expect(d.length).toBe(1);
  });

  test("ignores cond ? 2 : 0", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? 2 : 0;`);
    expect(d.length).toBe(0);
  });

  test("ignores cond ? 'yes' : 'no'", () => {
    const d = lint(boolToIntWithIf, `const x = isActive ? "yes" : "no";`);
    expect(d.length).toBe(0);
  });
});
