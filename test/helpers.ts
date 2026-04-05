// Test harness that simulates the oxlint/ESLint plugin runner.
// Uses oxc-parser for parsing (same parser oxlint uses), which supports
// TypeScript natively — enabling tests for TS-specific rules.

import { parseSync } from "oxc-parser";

interface Diagnostic {
  message: string;
  node: any;
}

interface Rule {
  create(context: any): Record<string, (node: any) => void>;
}

/**
 * Run a rule against source code and return all reported diagnostics.
 * Parses as TypeScript by default (supports both JS and TS).
 */
export function lint(rule: Rule, source: string, filename = "test.ts"): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  const result = parseSync(filename, source, {
    sourceType: "module",
    preserveParens: false,
  });

  if (result.errors.length > 0) {
    throw new Error(`Parse error: ${result.errors[0]!.message}`);
  }

  const ast = result.program;

  const context = {
    report(descriptor: Diagnostic) {
      diagnostics.push(descriptor);
    },
    sourceCode: { text: source },
    filename,
  };

  const visitors = rule.create(context);

  const SKIP_KEYS = new Set(["type", "loc", "range", "parent", "start", "end"]);

  function walkChildren(node: any, walk: (n: any, p: any) => void) {
    for (const key of Object.keys(node)) {
      if (SKIP_KEYS.has(key)) continue;
      const val = node[key];
      if (Array.isArray(val)) {
        for (const child of val) {
          if (child && typeof child === "object" && child.type) walk(child, node);
        }
      } else if (val && typeof val === "object" && val.type) {
        walk(val, node);
      }
    }
  }

  function walk(node: any, parent: any) {
    if (!node || typeof node !== "object" || !node.type) return;
    node.parent = parent;

    const visitor = visitors[node.type];
    if (visitor) visitor(node);

    walkChildren(node, walk);

    const exitVisitor = visitors[node.type + ":exit"];
    if (exitVisitor) exitVisitor(node);
  }

  walk(ast, null);

  return diagnostics;
}
