# oxclippy

An [oxlint JS plugin](https://oxc.rs/docs/guide/usage/linter/writing-js-plugins.html) that mirrors [Rust Clippy](https://doc.rust-lang.org/clippy/) rules for TypeScript/JavaScript.

Every rule is named after its Clippy counterpart and intentionally avoids duplicating anything already built into oxlint's eslint, typescript, unicorn, or oxc plugins.

## Setup

```bash
bun install
bun run build
```

Then configure `.oxlintrc.json` (already included) and run:

```bash
oxlint
```

## Rules (52)

### Style

| Rule                 | Clippy               | What it catches                                                    |
| -------------------- | -------------------- | ------------------------------------------------------------------ |
| `needless-bool`      | `needless_bool`      | `if (c) return true; else return false;` -- simplify to `return c` |
| `collapsible-if`     | `collapsible_if`     | `if (a) { if (b) { } }` -- merge to `if (a && b)`                  |
| `neg-multiply`       | `neg_multiply`       | `x * -1` -- use `-x`                                               |
| `bool-comparison`    | `bool_comparison`    | `x === true` -- use `x` directly                                   |
| `single-case-switch` | `single_match`       | `switch` with one case -- use `if`                                 |
| `let-and-return`     | `let_and_return`     | `const x = f(); return x;` -- return directly                      |
| `int-plus-one`       | `int_plus_one`       | `x >= y + 1` -- simplify to `x > y`                                |
| `needless-late-init` | `needless_late_init` | `let x; x = 5;` -- use `const x = 5;`                              |

### Complexity

| Rule                 | Clippy               | What it catches                                                |
| -------------------- | -------------------- | -------------------------------------------------------------- |
| `identity-op`        | `identity_op`        | `x + 0`, `x * 1` -- no-op arithmetic                           |
| `manual-clamp`       | `manual_clamp`       | `Math.min(max, Math.max(val, min))` -- extract `clamp`         |
| `manual-strip`       | `manual_strip`       | `if (s.startsWith(p)) s.slice(p.length)` -- extract helper     |
| `useless-conversion` | `useless_conversion` | `String("str")`, `Number(42)` on matching types                |
| `manual-swap`        | `manual_swap`        | `tmp = a; a = b; b = tmp;` -- use `[a, b] = [b, a]`            |
| `manual-is-finite`   | `manual_is_finite`   | `x !== Infinity && x !== -Infinity` -- use `Number.isFinite()` |

### Correctness

| Rule                         | Clippy                       | What it catches                                   |
| ---------------------------- | ---------------------------- | ------------------------------------------------- |
| `float-comparison`           | `float_cmp`                  | `x === 0.1 + 0.2` -- use epsilon comparison       |
| `xor-used-as-pow`            | `suspicious_xor_used_as_pow` | `2 ^ 8` is XOR (10), not power (256)              |
| `almost-swapped`             | `almost_swapped`             | `a = b; b = a;` -- broken swap, original `a` lost |
| `if-same-then-else`          | `if_same_then_else`          | Identical if/else bodies -- dead code or bug      |
| `never-loop`                 | `never_loop`                 | Loop always exits on first iteration              |
| `float-equality-without-abs` | `float_equality_without_abs` | `(a - b) < eps` missing `Math.abs()`              |
| `zero-divided-by-zero`       | `zero_divided_by_zero`       | `0 / 0` is `NaN` -- use `NaN` directly            |

### Iterator

| Rule                     | Clippy                   | What it catches                                          |
| ------------------------ | ------------------------ | -------------------------------------------------------- |
| `filter-then-first`      | `filter_next`            | `.filter(fn)[0]` -- use `.find(fn)`                      |
| `map-void-return`        | `map_unit_fn`            | `.map()` result unused -- use `.forEach()`               |
| `map-identity`           | `map_identity`           | `.map(x => x)` -- remove or use `.slice()`               |
| `manual-find`            | `manual_find`            | `for..of` + `if` + `return` -- use `.find()`             |
| `manual-some`            | `manual_find`            | `for..of` returning `true`/`false` -- use `.some()`      |
| `manual-every`           | `manual_find`            | `for..of` returning `false`/`true` -- use `.every()`     |
| `manual-includes`        | `manual_find`            | `for..of` with equality check -- use `.includes()`       |
| `search-is-some`         | `search_is_some`         | `.find(fn) !== undefined` -- use `.some(fn)`             |
| `needless-range-loop`    | `needless_range_loop`    | `for (let i = 0; i < arr.length; i++)` -- use `for..of`  |
| `redundant-closure-call` | `redundant_closure_call` | `(() => expr)()` -- use `expr` directly                  |
| `explicit-counter-loop`  | `explicit_counter_loop`  | Manual counter with `for..of` -- use `.entries()`        |
| `unnecessary-fold`       | `unnecessary_fold`       | `.reduce()` with `\|\|`/`&&` -- use `.some()`/`.every()` |
| `single-element-loop`    | `single_element_loop`    | `for (x of [val])` -- use `val` directly                 |

### Functions

| Rule                        | Clippy                      | What it catches                               |
| --------------------------- | --------------------------- | --------------------------------------------- |
| `too-many-arguments`        | `too_many_arguments`        | Functions with > 5 parameters                 |
| `too-many-lines`            | `too_many_lines`            | Functions with > 100 lines                    |
| `cognitive-complexity`      | `cognitive_complexity`      | Functions exceeding complexity threshold (25) |
| `excessive-nesting`         | `excessive_nesting`         | Code nested > 5 levels deep                   |
| `fn-params-excessive-bools` | `fn_params_excessive_bools` | Functions with > 3 boolean params             |

### Principles

| Rule                         | Clippy              | What it catches                                                  |
| ---------------------------- | ------------------- | ---------------------------------------------------------------- |
| `redundant-closure`          | `redundant_closure` | `.map(x => f(x))` -- simplify to `.map(f)`                       |
| `unnecessary-reduce-collect` | `unnecessary_fold`  | `.reduce()` building array/object -- use `.map()`/`.filter()`    |
| `prefer-structured-clone`    | `manual_memcpy`     | `JSON.parse(JSON.stringify(x))` -- use `structuredClone()`       |
| `object-keys-values`         | `iter_kv_map`       | `Object.keys(o).map(k => o[k])` -- use `Object.values()`         |
| `promise-new-resolve`        | `unnecessary_wraps` | `new Promise(resolve => resolve(x))` -- use `Promise.resolve(x)` |

### Pedantic

| Rule                      | Clippy                    | What it catches                                          |
| ------------------------- | ------------------------- | -------------------------------------------------------- |
| `similar-names`           | `similar_names`           | Variables with names that differ by one character        |
| `match-same-arms`         | `match_same_arms`         | Switch cases with identical bodies -- merge them         |
| `used-underscore-binding` | `used_underscore_binding` | `_foo` variables that are actually used                  |
| `needless-continue`       | `needless_continue`       | `continue` as last statement in loop body                |
| `enum-variant-names`      | `enum_variant_names`      | Enum members that all share a common prefix/suffix       |
| `struct-field-names`      | `struct_field_names`      | Object type fields that all share a common prefix/suffix |
| `unreadable-literal`      | `unreadable_literal`      | Large numbers without underscores -- use `1_000_000`     |
| `bool-to-int-with-if`     | `bool_to_int_with_if`     | `if (b) 1 else 0` -- use `Number(b)` or `+b`             |

## Intentionally omitted (already in oxlint)

These Clippy rules already have equivalents in oxlint's built-in plugins:

- `approx_constant` -- `oxc/approx-constant`
- `erasing_op` -- `oxc/erasing-op`
- `eq_op` -- `eslint/no-self-compare`
- `self_assignment` -- `eslint/no-self-assign`
- `double_comparisons` -- `oxc/double-comparisons`
- `impossible_comparisons` -- `oxc/const-comparisons`
- `misrefactored_assign_op` -- `oxc/misrefactored-assign-op`
- `only_used_in_recursion` -- `oxc/only-used-in-recursion`
- `min_max` -- `oxc/bad-min-max-func`
- `needless_return` -- `eslint/no-useless-return`
- `redundant_else` -- `eslint/no-else-return`
- `if_not_else` -- `eslint/no-negated-condition`
- `ifs_same_cond` -- `eslint/no-dupe-else-if`
- `needless_bitwise_bool` -- `oxc/bad-bitwise-operator`
- `map_flatten` -- `unicorn/prefer-array-flat-map`
- `flat_map_identity` -- `unicorn/prefer-array-flat`
- `assign_op_pattern` -- `eslint/operator-assignment`
- `redundant_field_names` -- `eslint/object-shorthand`
- `get_last_with_len` -- `unicorn/prefer-at`

## Development

```bash
bun test              # run unit tests (215 tests)
bun test --coverage   # run with coverage
bun run build         # bundle plugin
oxlint test/fixture.js  # test against sample file
```
