// clippy::almost_swapped — broken swap: a = b; b = a; (original a is lost)
// Detects: consecutive assignments that look like a swap but forgot the temp variable.

import type { Context, Node } from "../types";

function assignTarget(node: Node): string | null {
  if (node.type !== "ExpressionStatement") return null;
  const expr = node.expression;
  if (expr.type !== "AssignmentExpression" || expr.operator !== "=") return null;
  if (expr.left.type === "Identifier") return expr.left.name;
  return null;
}

function assignSource(node: Node): string | null {
  if (node.type !== "ExpressionStatement") return null;
  const expr = node.expression;
  if (expr.type !== "AssignmentExpression" || expr.operator !== "=") return null;
  if (expr.right.type === "Identifier") return expr.right.name;
  return null;
}

function checkBody(body: Node[], context: Context) {
  for (let i = 0; i < body.length - 1; i++) {
    const s1 = body[i]!;
    const s2 = body[i + 1]!;

    const t1 = assignTarget(s1);
    const src1 = assignSource(s1);
    const t2 = assignTarget(s2);
    const src2 = assignSource(s2);

    if (t1 && src1 && t2 && src2 && t1 === src2 && t2 === src1 && t1 !== t2) {
      context.report({
        message: `Almost swapped: \`${t1} = ${src1}; ${t2} = ${src2};\` overwrites \`${t1}\` before saving it. Use \`[${t1}, ${t2}] = [${t2}, ${t1}]\`. (clippy::almost_swapped)`,
        node: s1,
      });
    }
  }
}

export default {
  create(context: Context) {
    return {
      BlockStatement(node: Node) {
        if (node.body) checkBody(node.body, context);
      },
      Program(node: Node) {
        if (node.body) checkBody(node.body, context);
      },
    };
  },
};
