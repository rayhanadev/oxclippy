// clippy::excessive_nesting — code nested beyond a threshold
// Default threshold: 5 levels

import type { Context, Node } from "../types";

const THRESHOLD = 5;

const NESTING_NODES = new Set([
  "IfStatement",
  "ForStatement",
  "ForInStatement",
  "ForOfStatement",
  "WhileStatement",
  "DoWhileStatement",
  "SwitchStatement",
  "TryStatement",
]);

export default {
  create(context: Context) {
    let reported = false;

    function walk(node: Node, depth: number) {
      if (!node || typeof node !== "object" || !node.type) return;
      if (reported) return;

      const isNesting = NESTING_NODES.has(node.type);
      const newDepth = isNesting ? depth + 1 : depth;

      if (newDepth > THRESHOLD && isNesting) {
        reported = true;
        context.report({
          message: `Excessive nesting: this code is nested ${newDepth} levels deep (max ${THRESHOLD}). Consider extracting into helper functions. (clippy::excessive_nesting)`,
          node,
        });
        return;
      }

      // Don't recurse into nested functions
      if (
        node.type === "FunctionDeclaration" ||
        node.type === "FunctionExpression" ||
        node.type === "ArrowFunctionExpression"
      ) {
        if (depth > 0) return; // only skip nested functions, not the top-level one
      }

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
            if (child && typeof child === "object" && child.type) walk(child, newDepth);
          }
        } else if (val && typeof val === "object" && val.type) {
          walk(val, newDepth);
        }
      }
    }

    return {
      FunctionDeclaration(node: Node) {
        reported = false;
        walk(node.body, 0);
      },
      FunctionExpression(node: Node) {
        reported = false;
        walk(node.body, 0);
      },
      ArrowFunctionExpression(node: Node) {
        reported = false;
        walk(node.body, 0);
      },
    };
  },
};
