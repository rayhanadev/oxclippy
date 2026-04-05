// clippy::cognitive_complexity — function exceeds complexity threshold
// Uses a simplified cognitive complexity model:
// - +1 for each: if, else if, else, for, for-in, for-of, while, do-while, catch, ternary (?:)
// - +1 for each: &&, || (logical operators)
// - +1 nesting bonus per level of nesting for control flow
// Default threshold: 25 (matches Clippy)

import type { Context, Node } from "../types";

const THRESHOLD = 25;

function calculateComplexity(node: Node): number {
  let complexity = 0;

  function walk(n: Node, nesting: number) {
    if (!n || typeof n !== "object") return;

    switch (n.type) {
      case "IfStatement":
        complexity += 1 + nesting;
        walk(n.test, nesting);
        walk(n.consequent, nesting + 1);
        if (n.alternate) {
          if (n.alternate.type === "IfStatement") {
            // else if: +1 but no nesting increase
            complexity += 1;
            walk(n.alternate.test, nesting);
            walk(n.alternate.consequent, nesting + 1);
            if (n.alternate.alternate) {
              walk(n.alternate.alternate, nesting);
            }
          } else {
            // else: +1
            complexity += 1;
            walk(n.alternate, nesting + 1);
          }
        }
        return; // handled children manually

      case "ForStatement":
      case "ForInStatement":
      case "ForOfStatement":
      case "WhileStatement":
      case "DoWhileStatement":
        complexity += 1 + nesting;
        walkChildren(n, nesting + 1);
        return;

      case "CatchClause":
        complexity += 1 + nesting;
        walkChildren(n, nesting + 1);
        return;

      case "SwitchStatement":
        complexity += 1 + nesting;
        walkChildren(n, nesting + 1);
        return;

      case "ConditionalExpression":
        complexity += 1 + nesting;
        walk(n.test, nesting);
        walk(n.consequent, nesting + 1);
        walk(n.alternate, nesting + 1);
        return;

      case "LogicalExpression":
        // Each && or || adds 1 (no nesting bonus for these)
        complexity += 1;
        walk(n.left, nesting);
        walk(n.right, nesting);
        return;

      // Don't recurse into nested function declarations/expressions
      case "FunctionDeclaration":
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        return;
    }

    walkChildren(n, nesting);
  }

  function walkChildren(n: Node, nesting: number) {
    for (const key of Object.keys(n)) {
      if (key === "type" || key === "loc" || key === "range" || key === "parent") continue;
      const val = n[key];
      if (Array.isArray(val)) {
        for (const child of val) {
          if (child && typeof child === "object" && child.type) {
            walk(child, nesting);
          }
        }
      } else if (val && typeof val === "object" && val.type) {
        walk(val, nesting);
      }
    }
  }

  // Start walking from the function body
  if (node.body) {
    if (node.body.type === "BlockStatement") {
      for (const stmt of node.body.body) {
        walk(stmt, 0);
      }
    } else {
      // Arrow function with expression body
      walk(node.body, 0);
    }
  }

  return complexity;
}

export default {
  create(context: Context) {
    function checkFunction(node: Node) {
      const complexity = calculateComplexity(node);
      if (complexity <= THRESHOLD) return;

      const name =
        node.id?.name ??
        (node.parent?.type === "VariableDeclarator" ? node.parent.id?.name : null) ??
        "<anonymous>";

      context.report({
        message: `Cognitive complexity: \`${name}\` has a complexity of ${complexity} (max ${THRESHOLD}). Consider refactoring into smaller functions. (clippy::cognitive_complexity)`,
        node,
      });
    }

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
    };
  },
};
