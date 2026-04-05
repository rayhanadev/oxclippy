// clippy::struct_field_names — interface/type with redundantly prefixed or suffixed fields
// Detects: interface User { userName, userEmail, userAge } — "user" prefix is redundant

import type { Context, Node } from "../types";

function getFieldNames(node: Node): string[] {
  const body = node.body?.body ?? node.body?.members ?? node.members;
  if (!Array.isArray(body)) return [];
  return body
    .map((m: Node) => {
      if (m.type === "TSPropertySignature" || m.type === "PropertyDefinition") {
        return m.key?.type === "Identifier" ? m.key.name : null;
      }
      return null;
    })
    .filter((n: string | null): n is string => n !== null);
}

function commonPrefix(names: string[]): string {
  if (names.length < 2) return "";
  let prefix = names[0]!;
  for (let i = 1; i < names.length; i++) {
    const name = names[i]!;
    let j = 0;
    while (
      j < prefix.length &&
      j < name.length &&
      prefix[j]!.toLowerCase() === name[j]!.toLowerCase()
    )
      j++;
    prefix = prefix.slice(0, j);
  }
  if (!prefix) return "";
  // Check that prefix ends at a word boundary in the original names
  // For camelCase: the next char after prefix in any name should be uppercase or absent
  // For snake_case: prefix should end with _
  if (prefix.endsWith("_")) return prefix;
  // Check camelCase boundary: char at prefix.length in first name that's longer should be uppercase
  for (const name of names) {
    if (name.length > prefix.length) {
      const nextChar = name[prefix.length]!;
      if (nextChar >= "A" && nextChar <= "Z") return prefix;
      // Not a word boundary
      return "";
    }
  }
  return prefix;
}

function commonSuffix(names: string[]): string {
  if (names.length < 2) return "";
  // Find raw common suffix
  let suffix = names[0]!;
  for (let i = 1; i < names.length; i++) {
    const name = names[i]!;
    let j = 0;
    while (
      j < suffix.length &&
      j < name.length &&
      suffix[suffix.length - 1 - j] === name[name.length - 1 - j]
    )
      j++;
    suffix = suffix.slice(suffix.length - j);
  }
  if (!suffix) return "";
  // Check word boundary: suffix should start with uppercase (camelCase) or _
  if (suffix[0]! >= "A" && suffix[0]! <= "Z") return suffix;
  if (suffix.startsWith("_")) return suffix;
  return "";
}

export default {
  create(context: Context) {
    function check(node: Node, typeName: string | undefined) {
      if (!typeName) return;
      const names = getFieldNames(node);
      if (names.length < 2) return;

      const prefix = commonPrefix(names);
      if (prefix.length >= 3) {
        context.report({
          message: `Struct field names: all fields of \`${typeName}\` share the prefix \`${prefix}\`. Remove it — the type name provides context. (clippy::struct_field_names)`,
          node,
        });
        return;
      }

      const suffix = commonSuffix(names);
      if (suffix.length >= 3) {
        context.report({
          message: `Struct field names: all fields of \`${typeName}\` share the suffix \`${suffix}\`. Consider removing it. (clippy::struct_field_names)`,
          node,
        });
      }
    }

    return {
      TSInterfaceDeclaration(node: Node) {
        check(node, node.id?.name);
      },
      TSTypeAliasDeclaration(node: Node) {
        if (node.typeAnnotation?.type === "TSTypeLiteral") {
          check(node.typeAnnotation, node.id?.name);
        }
      },
    };
  },
};
