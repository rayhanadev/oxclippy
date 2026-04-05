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

  // Walk the AST and dispatch to visitors
  function walk(node: any, parent: any) {
    if (!node || typeof node !== "object") return;
    if (!node.type) return;

    node.parent = parent;

    // Call enter visitor
    const visitor = visitors[node.type];
    if (visitor) visitor(node);

    // Recurse into children
    for (const key of Object.keys(node)) {
      if (
        key === "type" ||
        key === "loc" ||
        key === "range" ||
        key === "parent" ||
        key === "start" ||
        key === "end"
      )
        continue;
      const val = node[key];
      if (Array.isArray(val)) {
        for (const child of val) {
          if (child && typeof child === "object" && child.type) {
            walk(child, node);
          }
        }
      } else if (val && typeof val === "object" && val.type) {
        walk(val, node);
      }
    }

    // Call exit visitor
    const exitVisitor = visitors[node.type + ":exit"];
    if (exitVisitor) exitVisitor(node);
  }

  walk(ast, null);

  return diagnostics;
}
