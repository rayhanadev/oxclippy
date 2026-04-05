// clippy::explicit_counter_loop — manual counter variable with for-of
// Detects: let i = 0; for (const x of arr) { ...i...; i++; }
// Suggests: for (const [i, x] of arr.entries())

import type { Context, Node } from "../types";
import { getFunctionBody, getForOfVar } from "../types";

function checkBody(body: Node[], context: Context) {
  for (let i = 0; i < body.length - 1; i++) {
    const decl = body[i]!;
    const loop = body[i + 1]!;

    // decl: let counter = 0;
    if (decl.type !== "VariableDeclaration" || decl.declarations.length !== 1) continue;
    const d = decl.declarations[0]!;
    if (d.id?.type !== "Identifier" || d.init?.type !== "Literal" || d.init.value !== 0) continue;
    const counterName = d.id.name;

    // loop: for (const x of arr) { ... counter++; }
    if (loop.type !== "ForOfStatement") continue;
    if (loop.body?.type !== "BlockStatement" || loop.body.body.length === 0) continue;

    const stmts: Node[] = loop.body.body;
    const last = stmts[stmts.length - 1]!;

    // Check last statement is counter++ or counter += 1
    const isIncrement =
      (last.type === "ExpressionStatement" &&
        last.expression?.type === "UpdateExpression" &&
        last.expression.operator === "++" &&
        last.expression.argument?.type === "Identifier" &&
        last.expression.argument.name === counterName) ||
      (last.type === "ExpressionStatement" &&
        last.expression?.type === "AssignmentExpression" &&
        last.expression.operator === "+=" &&
        last.expression.left?.type === "Identifier" &&
        last.expression.left.name === counterName &&
        last.expression.right?.type === "Literal" &&
        last.expression.right.value === 1);

    if (isIncrement) {
      context.report({
        message: `Explicit counter loop: manual counter \`${counterName}\` can be replaced with \`for (const [${counterName}, item] of arr.entries())\`. (clippy::explicit_counter_loop)`,
        node: loop,
      });
    }
  }
}

export default {
  create(context: Context) {
    function checkFunction(node: Node) {
      const body = getFunctionBody(node);
      if (body) checkBody(body, context);
    }

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
      Program(node: Node) {
        if (node.body) checkBody(node.body, context);
      },
    };
  },
};
