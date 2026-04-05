// clippy::redundant_closure — wrapper closures around known single-arg functions
// Detects: .map(x => String(x)) → .map(String)
// Detects: .filter(x => Boolean(x)) → .filter(Boolean)
//
// SAFETY: Only flags known-safe builtins that ignore extra arguments from .map(val, idx, arr).
// Does NOT flag arbitrary functions (e.g. parseInt takes a radix arg, so .map(parseInt) breaks).

import type { Context, Node } from "../types";
import { isIdentifier } from "../types";

// Builtins that only use their first argument, safe to pass directly to .map/.filter/etc.
const SAFE_SINGLE_ARG = new Set([
  "String",
  "Number",
  "Boolean",
  "BigInt",
  "parseFloat",
  "isNaN",
  "isFinite",
  "encodeURIComponent",
  "decodeURIComponent",
  "encodeURI",
  "decodeURI",
]);

export default {
  create(context: Context) {
    return {
      CallExpression(node: Node) {
        // Look for .method(x => fn(x)) or .method(function(x) { return fn(x); })
        const callee = node.callee;
        if (callee.type !== "MemberExpression") return;

        const args = node.arguments;
        if (!args || args.length !== 1) return;

        const callback = args[0]!;
        let paramName: string | null = null;
        let bodyExpr: Node | null = null;

        if (callback.type === "ArrowFunctionExpression" && callback.params.length === 1) {
          const param = callback.params[0]!;
          if (param.type !== "Identifier") return;
          paramName = param.name;

          if (callback.body.type === "BlockStatement" && callback.body.body.length === 1) {
            const stmt = callback.body.body[0]!;
            if (stmt.type === "ReturnStatement") bodyExpr = stmt.argument;
          } else if (callback.body.type !== "BlockStatement") {
            bodyExpr = callback.body;
          }
        } else if (callback.type === "FunctionExpression" && callback.params.length === 1) {
          const param = callback.params[0]!;
          if (param.type !== "Identifier") return;
          paramName = param.name;

          if (callback.body.type === "BlockStatement" && callback.body.body.length === 1) {
            const stmt = callback.body.body[0]!;
            if (stmt.type === "ReturnStatement") bodyExpr = stmt.argument;
          }
        }

        if (!paramName || !bodyExpr) return;
        if (bodyExpr.type !== "CallExpression") return;
        if (bodyExpr.arguments.length !== 1) return;

        const innerArg = bodyExpr.arguments[0]!;
        if (!isIdentifier(innerArg, paramName)) return;

        // Check if the called function is a safe single-arg builtin
        const fnCallee = bodyExpr.callee;
        if (isIdentifier(fnCallee) && SAFE_SINGLE_ARG.has(fnCallee.name)) {
          context.report({
            message: `Redundant closure: \`x => ${fnCallee.name}(x)\` can be simplified to \`${fnCallee.name}\`. (clippy::redundant_closure)`,
            node: callback,
          });
        }
      },
    };
  },
};
