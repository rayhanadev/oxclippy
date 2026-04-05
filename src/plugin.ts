// oxclippy: An oxlint JS plugin that mirrors Rust Clippy rules for TypeScript/JavaScript
//
// Each rule is named after its Clippy counterpart. Rules that already exist in
// oxlint's built-in plugins (eslint, typescript, unicorn, oxc) are intentionally
// omitted to avoid duplication.

import needlessBool from "./rules/needless-bool";
import collapsibleIf from "./rules/collapsible-if";
import negMultiply from "./rules/neg-multiply";
import boolComparison from "./rules/bool-comparison";
import identityOp from "./rules/identity-op";
import singleCaseSwitch from "./rules/single-case-switch";
import tooManyArguments from "./rules/too-many-arguments";
import tooManyLines from "./rules/too-many-lines";
import filterThenFirst from "./rules/filter-then-first";
import mapVoidReturn from "./rules/map-void-return";
import uselessConversion from "./rules/useless-conversion";
import manualClamp from "./rules/manual-clamp";
import manualStrip from "./rules/manual-strip";
import manualFind from "./rules/manual-find";
import manualSome from "./rules/manual-some";
import manualEvery from "./rules/manual-every";
import manualIncludes from "./rules/manual-includes";
import cognitiveComplexity from "./rules/cognitive-complexity";
import floatComparison from "./rules/float-comparison";
import needlessRangeLoop from "./rules/needless-range-loop";
import manualSwap from "./rules/manual-swap";
import searchIsSome from "./rules/search-is-some";
import letAndReturn from "./rules/let-and-return";
import xorUsedAsPow from "./rules/xor-used-as-pow";
import mapIdentity from "./rules/map-identity";
import redundantClosureCall from "./rules/redundant-closure-call";
import almostSwapped from "./rules/almost-swapped";
import ifSameThenElse from "./rules/if-same-then-else";
import neverLoop from "./rules/never-loop";
import explicitCounterLoop from "./rules/explicit-counter-loop";
import excessiveNesting from "./rules/excessive-nesting";
import fnParamsExcessiveBools from "./rules/fn-params-excessive-bools";
import floatEqualityWithoutAbs from "./rules/float-equality-without-abs";
import manualIsFinite from "./rules/manual-is-finite";
import unnecessaryFold from "./rules/unnecessary-fold";
import needlessLateInit from "./rules/needless-late-init";
import singleElementLoop from "./rules/single-element-loop";
import intPlusOne from "./rules/int-plus-one";
import zeroDividedByZero from "./rules/zero-divided-by-zero";
import redundantClosure from "./rules/redundant-closure";
import unnecessaryReduceCollect from "./rules/unnecessary-reduce-collect";
import preferStructuredClone from "./rules/prefer-structured-clone";
import objectKeysValues from "./rules/object-keys-values";
import promiseNewResolve from "./rules/promise-new-resolve";
import similarNames from "./rules/similar-names";
import matchSameArms from "./rules/match-same-arms";
import usedUnderscoreBinding from "./rules/used-underscore-binding";
import needlessContinue from "./rules/needless-continue";
import enumVariantNames from "./rules/enum-variant-names";
import structFieldNames from "./rules/struct-field-names";
import unreadableLiteral from "./rules/unreadable-literal";
import boolToIntWithIf from "./rules/bool-to-int-with-if";

import { name, version } from "../package.json";

const plugin = {
  meta: {
    name,
    version,
  },
  rules: {
    // Style — code clarity and readability
    "needless-bool": needlessBool,
    "collapsible-if": collapsibleIf,
    "neg-multiply": negMultiply,
    "bool-comparison": boolComparison,
    "single-case-switch": singleCaseSwitch,
    "let-and-return": letAndReturn,
    "int-plus-one": intPlusOne,
    "needless-late-init": needlessLateInit,

    // Complexity — simplifiable patterns
    "identity-op": identityOp,
    "manual-clamp": manualClamp,
    "manual-strip": manualStrip,
    "useless-conversion": uselessConversion,
    "manual-swap": manualSwap,
    "manual-is-finite": manualIsFinite,

    // Correctness — likely bugs
    "float-comparison": floatComparison,
    "xor-used-as-pow": xorUsedAsPow,
    "almost-swapped": almostSwapped,
    "if-same-then-else": ifSameThenElse,
    "never-loop": neverLoop,
    "float-equality-without-abs": floatEqualityWithoutAbs,
    "zero-divided-by-zero": zeroDividedByZero,

    // Iterator — loops replaceable with array methods
    "filter-then-first": filterThenFirst,
    "map-void-return": mapVoidReturn,
    "map-identity": mapIdentity,
    "manual-find": manualFind,
    "manual-some": manualSome,
    "manual-every": manualEvery,
    "manual-includes": manualIncludes,
    "search-is-some": searchIsSome,
    "needless-range-loop": needlessRangeLoop,
    "redundant-closure-call": redundantClosureCall,
    "explicit-counter-loop": explicitCounterLoop,
    "unnecessary-fold": unnecessaryFold,
    "single-element-loop": singleElementLoop,

    // Functions — function-level quality
    "too-many-arguments": tooManyArguments,
    "too-many-lines": tooManyLines,
    "cognitive-complexity": cognitiveComplexity,
    "excessive-nesting": excessiveNesting,
    "fn-params-excessive-bools": fnParamsExcessiveBools,

    // Principles — idiomatic JS/TS from Clippy philosophy
    "redundant-closure": redundantClosure,
    "unnecessary-reduce-collect": unnecessaryReduceCollect,
    "prefer-structured-clone": preferStructuredClone,
    "object-keys-values": objectKeysValues,
    "promise-new-resolve": promiseNewResolve,

    // Pedantic — naming, style, readability
    "similar-names": similarNames,
    "match-same-arms": matchSameArms,
    "used-underscore-binding": usedUnderscoreBinding,
    "needless-continue": needlessContinue,
    "enum-variant-names": enumVariantNames,
    "struct-field-names": structFieldNames,
    "unreadable-literal": unreadableLiteral,
    "bool-to-int-with-if": boolToIntWithIf,
  },
};

export default plugin;
