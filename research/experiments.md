# Experiments

## Experiment 1: initial web prototype

The first implementation treated GEB as a set of illustrative concepts: hero section, cards, sliders, visual sections. This style is useful as a quick scaffold but it is structurally wrong for the book.

What it did well:
- it made the project feel atmospheric
- it created a usable shell
- it allowed quick exploration of some concepts

What it failed to do:
- the user did not encounter the structure itself
- most interactions were decorative accounts of ideas rather than mechanisms
- the site explained the book instead of instantiating the logic of the book

## Experiment 2: formal-system sandbox

The MU-puzzle laboratory was a better step because it made the user manipulate actual rules. The key insight is that a formal system is more legible when it is interactive than when it is described in prose.

What worked:
- the user can apply rules and see state changes
- the rule system appears constrained and non-obvious
- it teaches the feeling of a world governed by a tiny grammar

What still needs improvement:
- the user should be able to branch heavily and compare derivations
- the system should show reachability and impossible states more clearly
- the explanation should be two-way: the user observes behavior and then the system explains the structural reason

## Experiment 3: proof/self-reference mockup

The Gödel engine prototype introduces the crucial idea: a system can produce statements about itself. This is an essential part of the book’s intellectual core.

What worked:
- it creates the feeling that the system is examining itself
- it makes the self-reference dynamic instead of static

What needs to be stronger:
- proof search should be more explicit
- the user should be able to build statements and watch how the derivation changes
- the representation needs a stronger notion of “system applied to itself”

## Experiment 4: recursion explorer

This attempted to show that one pattern survives across representations: same structure, different surface.

What worked:
- different modes (tree, wave, glyph) made the same underlying process look different
- the user can see that representation affects perception without changing the underlying mechanism

What needs work:
- actual recursive functions should be more visibly tied to the same underlying rule
- the user should be able to compare two equivalent structures side by side
- better visual state transitions would strengthen the discovery effect

## Experiment 5: loop chamber

This prototype aims to make level folding visible.

What worked:
- the hierarchy becomes physically legible as nested discs
- users can see the system “close back on itself”

What needs work:
- the chamber should make causality explicit: higher level affects lower level and vice versa
- the user should be able to reconfigure the hierarchy in a more literal way
- stronger visual temporal behavior is needed for surprise

## Experiment 6: Bach machine

The motif engine produces a transformation environment rather than a simple static display.

What worked:
- musical transformation is a good domain for making identity-through-change visible
- transposition and inversion are structurally rich

What needs work:
- more direct visual mapping between motif and transformed motif
- the user should hear multi-voice canon and recursive transformation
- this should be explicitly tied to the musical idea of variation and return

## Most promising direction

The best future structure is not a website of chapters. It is a computational observatory whose central experiments are:

1. rule system explorer
2. self-reference engine
3. recursive transform lab
4. level-folding chamber
5. musical transformation instrument

These should be unified by a single hidden mechanism: the system can be represented in multiple modes while preserving a shared structural state.
