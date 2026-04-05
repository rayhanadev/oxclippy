// clippy::similar_names — variables with confusingly similar names
// Detects: names differing by one character (item/items, data/date, form/from)
// Minimum length: 3 characters. Excludes common pairs like i/j/k, x/y/z.

import type { Context, Node } from "../types";

const ALLOWED_PAIRS = new Set([
  "i,j",
  "j,k",
  "i,k",
  "x,y",
  "y,z",
  "x,z",
  "a,b",
  "b,c",
  "a,c",
  "n,m",
  "r,s",
]);

/** Returns true if names are confusingly similar (edit distance 1 or single transposition) */
function areSimilar(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    let diffs = 0;
    let firstDiff = -1;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        if (diffs === 0) firstDiff = i;
        diffs++;
        if (diffs > 2) return false;
      }
    }
    if (diffs <= 1) return diffs === 1;
    // Check for transposition: ab→ba
    if (diffs === 2 && a[firstDiff] === b[firstDiff + 1] && a[firstDiff + 1] === b[firstDiff])
      return true;
    return false;
  }
  // Length differs by 1 — check for single insertion/deletion
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let diffs = 0;
  let si = 0;
  for (let li = 0; li < longer.length; li++) {
    if (shorter[si] === longer[li]) {
      si++;
    } else {
      diffs++;
      if (diffs > 1) return false;
    }
  }
  return true;
}

function collectNames(node: Node, names: Map<string, Node>) {
  if (!node || typeof node !== "object" || !node.type) return;

  if (node.type === "VariableDeclarator" && node.id?.type === "Identifier") {
    names.set(node.id.name, node.id);
  }
  if (node.type === "FunctionDeclaration" && node.id?.type === "Identifier") {
    names.set(node.id.name, node.id);
  }

  // Collect parameters
  if (node.params) {
    for (const p of node.params) {
      if (p.type === "Identifier") names.set(p.name, p);
      if (p.type === "AssignmentPattern" && p.left?.type === "Identifier")
        names.set(p.left.name, p.left);
    }
  }

  // Don't recurse into nested functions (separate scope)
  if (
    node.type === "FunctionDeclaration" ||
    node.type === "FunctionExpression" ||
    node.type === "ArrowFunctionExpression"
  )
    return;

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
        if (child && typeof child === "object" && child.type) collectNames(child, names);
      }
    } else if (val && typeof val === "object" && val.type) {
      collectNames(val, names);
    }
  }
}

export default {
  create(context: Context) {
    function checkScope(node: Node) {
      const names = new Map<string, Node>();

      // Collect params
      if (node.params) {
        for (const p of node.params) {
          if (p.type === "Identifier") names.set(p.name, p);
          if (p.type === "AssignmentPattern" && p.left?.type === "Identifier")
            names.set(p.left.name, p.left);
        }
      }

      // Collect from body
      if (node.body?.type === "BlockStatement") {
        for (const stmt of node.body.body) {
          collectNames(stmt, names);
        }
      }

      const nameList = [...names.entries()];
      const reported = new Set<string>();

      for (let i = 0; i < nameList.length; i++) {
        for (let j = i + 1; j < nameList.length; j++) {
          const [nameA] = nameList[i]!;
          const [nameB, nodeB] = nameList[j]!;

          if (nameA.length < 3 || nameB.length < 3) continue;

          const pair = [nameA, nameB].sort().join(",");
          if (ALLOWED_PAIRS.has(pair)) continue;
          if (reported.has(pair)) continue;

          if (areSimilar(nameA.toLowerCase(), nameB.toLowerCase())) {
            reported.add(pair);
            context.report({
              message: `Similar names: \`${nameA}\` and \`${nameB}\` differ by only one character, which is easy to confuse. (clippy::similar_names)`,
              node: nodeB,
            });
          }
        }
      }
    }

    return {
      FunctionDeclaration: checkScope,
      FunctionExpression: checkScope,
      ArrowFunctionExpression: checkScope,
    };
  },
};
