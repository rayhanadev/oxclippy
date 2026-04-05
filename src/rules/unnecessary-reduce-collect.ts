// clippy principle: "prefer combinators" — .reduce() that builds an array is really .map() or .filter()
//
// Detects: arr.reduce((acc, x) => { acc.push(f(x)); return acc; }, []) → arr.map(f)
// Detects: arr.reduce((acc, x) => { if (c(x)) acc.push(x); return acc; }, []) → arr.filter(c)
// Detects: arr.reduce((acc, x) => { acc.push(...f(x)); return acc; }, []) → arr.flatMap(f)

import type { Context, Node } from "../types";
import { isMethodCall } from "../types";

function isEmptyArray(node: Node): boolean {
  return node.type === "ArrayExpression" && (!node.elements || node.elements.length === 0);
}

export default {
  create(context: Context) {
    return {
      CallExpression(node: Node) {
        if (!isMethodCall(node, "reduce")) return;
        const args = node.arguments;
        if (!args || args.length !== 2) return;

        const callback = args[0]!;
        const init = args[1]!;

        if (!isEmptyArray(init)) return;
        if (callback.type !== "ArrowFunctionExpression" && callback.type !== "FunctionExpression")
          return;
        if (callback.params.length !== 2) return;

        const accParam = callback.params[0]!;
        if (accParam.type !== "Identifier") return;
        const accName = accParam.name;

        // Get the body statements
        let bodyStmts: Node[] | null = null;
        if (callback.body.type === "BlockStatement") {
          bodyStmts = callback.body.body;
        }
        if (!bodyStmts) return;

        // Pattern: { acc.push(...); return acc; }
        if (bodyStmts.length === 2) {
          const pushStmt = bodyStmts[0]!;
          const returnStmt = bodyStmts[1]!;

          if (returnStmt.type !== "ReturnStatement") return;
          if (returnStmt.argument?.type !== "Identifier" || returnStmt.argument.name !== accName)
            return;

          // Check for acc.push(expr)
          if (
            pushStmt.type === "ExpressionStatement" &&
            pushStmt.expression?.type === "CallExpression" &&
            pushStmt.expression.callee?.type === "MemberExpression" &&
            pushStmt.expression.callee.object?.type === "Identifier" &&
            pushStmt.expression.callee.object.name === accName &&
            pushStmt.expression.callee.property?.type === "Identifier" &&
            pushStmt.expression.callee.property.name === "push" &&
            pushStmt.expression.arguments?.length === 1
          ) {
            context.report({
              message:
                "Unnecessary reduce: this `.reduce()` builds an array with `.push()`. Use `.map()` instead. (clippy: prefer combinators)",
              node,
            });
            return;
          }
        }

        // Pattern: { if (cond) acc.push(x); return acc; }
        if (bodyStmts.length === 2) {
          const ifStmt = bodyStmts[0]!;
          const returnStmt = bodyStmts[1]!;

          if (returnStmt.type !== "ReturnStatement") return;
          if (returnStmt.argument?.type !== "Identifier" || returnStmt.argument.name !== accName)
            return;

          if (ifStmt.type === "IfStatement" && !ifStmt.alternate) {
            const consequent = ifStmt.consequent;
            let pushExpr: Node | null = null;

            if (consequent.type === "BlockStatement" && consequent.body.length === 1) {
              pushExpr = consequent.body[0]!;
            } else if (consequent.type === "ExpressionStatement") {
              pushExpr = consequent;
            }

            if (
              pushExpr?.type === "ExpressionStatement" &&
              pushExpr.expression?.type === "CallExpression" &&
              pushExpr.expression.callee?.type === "MemberExpression" &&
              pushExpr.expression.callee.object?.type === "Identifier" &&
              pushExpr.expression.callee.object.name === accName &&
              pushExpr.expression.callee.property?.type === "Identifier" &&
              pushExpr.expression.callee.property.name === "push"
            ) {
              context.report({
                message:
                  "Unnecessary reduce: this `.reduce()` conditionally pushes items. Use `.filter()` instead. (clippy: prefer combinators)",
                node,
              });
            }
          }
        }
      },
    };
  },
};
