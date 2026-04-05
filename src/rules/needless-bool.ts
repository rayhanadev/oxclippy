// clippy::needless_bool — if/else returning boolean literals
// Detects: if (c) { return true } else { return false } → return c
// Detects: if (c) { x = true } else { x = false } → x = c
// NOT covered by eslint/no-unneeded-ternary (which only catches ternaries)

import type { Context, Node } from "../types";
import { isBoolLiteral, unwrapBlock } from "../types";

export default {
  create(context: Context) {
    return {
      IfStatement(node: Node) {
        if (!node.alternate) return;

        const consequent = unwrapBlock(node.consequent);
        const alternate = unwrapBlock(node.alternate);
        if (!consequent || !alternate) return;

        // Case 1: if (c) return true; else return false;
        if (consequent.type === "ReturnStatement" && alternate.type === "ReturnStatement") {
          const cArg = consequent.argument;
          const aArg = alternate.argument;
          if (isBoolLiteral(cArg) && isBoolLiteral(aArg) && cArg.value !== aArg.value) {
            const suggestion = cArg.value ? "return <condition>" : "return !<condition>";
            context.report({
              message: `Needless bool: this if/else returns opposing booleans. Simplify to \`${suggestion}\`. (clippy::needless_bool)`,
              node,
            });
          }
          return;
        }

        // Case 2: if (c) { x = true } else { x = false }
        if (
          consequent.type === "ExpressionStatement" &&
          alternate.type === "ExpressionStatement" &&
          consequent.expression.type === "AssignmentExpression" &&
          alternate.expression.type === "AssignmentExpression" &&
          consequent.expression.operator === "=" &&
          alternate.expression.operator === "="
        ) {
          const cExpr = consequent.expression;
          const aExpr = alternate.expression;

          // Check both assign to the same variable
          if (
            cExpr.left.type === "Identifier" &&
            aExpr.left.type === "Identifier" &&
            cExpr.left.name === aExpr.left.name &&
            isBoolLiteral(cExpr.right) &&
            isBoolLiteral(aExpr.right) &&
            cExpr.right.value !== aExpr.right.value
          ) {
            const varName = cExpr.left.name;
            const suggestion = cExpr.right.value
              ? `${varName} = <condition>`
              : `${varName} = !<condition>`;
            context.report({
              message: `Needless bool: this if/else assigns opposing booleans. Simplify to \`${suggestion}\`. (clippy::needless_bool)`,
              node,
            });
          }
        }
      },
    };
  },
};
