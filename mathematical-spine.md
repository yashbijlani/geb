# Mathematical spine

## Definitions

### Formal system
A formal system has a finite or effectively specified alphabet, rules for well-formed strings, axioms, and rules of inference. A proof is a finite sequence whose first entries are axioms and whose later entries follow by permitted rules. A theorem is a string with such a proof.

### Effective axiomatization
There is a mechanical way to recognize axioms and check whether a proposed proof is valid. This supports proof enumeration.

### Consistency
A system is consistent if it does not prove a contradiction. In a system with negation, this is commonly expressed as not both a sentence and its negation being theorems.

### Completeness
For the relevant class of sentences, every sentence or its negation is provable. Gödel's first incompleteness theorem says that suitable systems are incomplete in this sense.

## The proof route

1. Encode each symbol by a number.
2. Encode a finite string by a number, using a uniquely decodable scheme such as prime powers or the toy positional code used on the page.
3. Encode finite sequences of formulas and therefore proofs.
4. Because proof checking is mechanical, the relation `Proof_S(p, q)` meaning “p codes a valid S-proof of the formula coded by q” can be represented arithmetically in a sufficiently strong system.
5. Define `Prov_S(q)` as “there exists p such that Proof_S(p, q).”
6. A diagonal lemma supplies a sentence G whose code refers to the result of substituting its own code into a formula. Choose the target formula so that G is equivalent to `not Prov_S(code(G))`.
7. If S is consistent and meets the usual effectiveness/expressiveness conditions, S does not prove G. With the standard stronger soundness or omega-consistency qualification in the original style of argument, S does not prove not-G either. Modern formulations separate the exact assumptions carefully.
8. Thus there is an undecidable sentence for S. If S is sound for the relevant arithmetic, G is true in the intended natural-number interpretation while unprovable in S.

## What the page must not claim

- Not every formal system is incomplete.
- Not every unprovable sentence is true.
- Consistency alone is not a universal substitute for every soundness qualification in every formulation.
- The toy proof search is not a complete implementation of TNT.
- Gödel's theorem is not the Halting Problem, though both use effective encoding and diagonal self-reference.
- Adding an axiom can settle a previous sentence; the strengthened system remains subject to the phenomenon if it remains suitable.

## Halting connection

For a hypothetical total halting decider H(P, x), define D(P): if H(P, P) says HALTS, loop; otherwise halt. Feeding D its own code yields contradiction. This proves no such total decider exists for all programs in the chosen computational model.

The connection is structural:

- Gödel: proof syntax -> arithmetic encoding -> self-reference -> undecidable sentence.
- Turing: program behavior -> code -> self-reference -> undecidable behavior.

The mechanisms and conclusions are related but not identical.

## Visual vs mathematical claims

The moving particles, camera elevation, and nested geometry are metaphors for levels, encoding, and derivation. The actual mathematical content is in the explicit strings, predicates, proof branches, code transformations, and stated assumptions.