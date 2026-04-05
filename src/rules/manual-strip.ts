// clippy::manual_strip — manual prefix/suffix stripping
// Detects: if (s.startsWith(prefix)) { s.slice(prefix.length, ...) }
// Detects: if (s.endsWith(suffix)) { s.slice(0, -suffix.length) }
// Suggests: extract the strip logic or use a helper

import type { Context, Node } from "../types";
import { isMethodCall } from "../types";

function getStringMethodTarget(
  testExpr: Node,
  methodName: string,
): { str: string; arg: string } | null {
  if (!isMethodCall(testExpr, methodName)) return null;

  const callee = testExpr.callee;
  if (callee.object?.type !== "Identifier") return null;
  if (!testExpr.arguments || testExpr.arguments.length !== 1) return null;

  const arg = testExpr.arguments[0];
  if (arg.type !== "Identifier" && arg.type !== "Literal") return null;

  return {
    str: callee.object.name,
    arg: arg.type === "Identifier" ? arg.name : JSON.stringify(arg.value),
  };
}

function bodyContainsSlice(node: Node, strName: string): boolean {
  // Walk the AST to find .slice() calls on the same variable
  if (!node || typeof node !== "object") return false;

  // Check if this node is a call to strName.slice(...)
  if (
    node.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    node.callee.object?.type === "Identifier" &&
    node.callee.object.name === strName &&
    node.callee.property?.type === "Identifier" &&
    node.callee.property.name === "slice"
  ) {
    return true;
  }

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
        if (child && typeof child === "object" && child.type && bodyContainsSlice(child, strName))
          return true;
      }
    } else if (val && typeof val === "object" && val.type && bodyContainsSlice(val, strName)) {
      return true;
    }
  }
  return false;
}

export default {
  create(context: Context) {
    return {
      IfStatement(node: Node) {
        const test = node.test;
        if (!test) return;

        // Check for str.startsWith(prefix)
        const startsInfo = getStringMethodTarget(test, "startsWith");
        if (startsInfo && bodyContainsSlice(node.consequent, startsInfo.str)) {
          context.report({
            message: `Manual strip: checking \`startsWith()\` then slicing is a manual prefix strip. Consider extracting a \`stripPrefix\` helper. (clippy::manual_strip)`,
            node,
          });
          return;
        }

        // Check for str.endsWith(suffix)
        const endsInfo = getStringMethodTarget(test, "endsWith");
        if (endsInfo && bodyContainsSlice(node.consequent, endsInfo.str)) {
          context.report({
            message: `Manual strip: checking \`endsWith()\` then slicing is a manual suffix strip. Consider extracting a \`stripSuffix\` helper. (clippy::manual_strip)`,
            node,
          });
        }
      },
    };
  },
};
