# Interaction map

## Global controls

- `Play`: runs the current mechanism at a readable pace.
- `Pause`: freezes the mechanism.
- `Step`: performs one actual transition.
- `Reset`: restores the local state.
- Scroll: advances the single argument; the proof machine persists between sections.

## Journey map

### Formal system
User selects or edits a toy axiom and applies valid rewrite rules. Invalid rewrites are rejected. The display separates `string`, `valid derivation`, and `theorem`.

Misconception prevented: symbols do not need intrinsic meaning for mechanical rules to operate.

### Proof
User steps through a derivation. Clicking a step highlights the rule and its source string.

Misconception prevented: a theorem is not a statement that “looks true”; it is derivable under the system’s rules.

### Decision procedure
User starts proof enumeration and tries a candidate theorem. The interface shows that finding a proof is semi-decidable, while waiting forever for a missing proof is not a terminating NO answer.

Misconception prevented: proof generation, proof checking, and theoremhood decision are different tasks.

### Self-reference
User connects a formula to its description, then activates self-application. The scene closes the graph only when a real code substitution occurs.

Misconception prevented: “self-reference” is not merely a sentence containing the word “self.”

### Encoding
User toggles symbol-code pairs and watches a string become a number and decode back. The same code is reused for a proof sequence.

Misconception prevented: Gödel numbering is not mystical; it is a mechanical coding that makes syntax available to arithmetic.

### Diagonalization and G
User advances through a constructed template. The page displays the template, its own code, the substitution, and the resulting G. A switch changes the target property to show that diagonalization is a general construction, not a magic phrase.

Misconception prevented: the sentence is built; it is not simply announced.

### Incompleteness branches
User activates “assume S proves G” and “assume S proves not-G.” Each branch displays the exact assumption and its consequence. The qualification badge changes depending on consistency/soundness setting.

Misconception prevented: the theorem is not “because G says so”; the contradiction uses the relation between theoremhood and interpretation.

### Truth / provability
User moves a slider between internal and external viewpoints. G remains one sentence while the visible relation changes from `has an S-proof` to `true in intended N`.

Misconception prevented: unprovability and truth are distinct predicates.

### Strengthening
User adds G as an axiom. S becomes S+G, the old G gets a proof, and a new diagonal placeholder appears for the stronger system.

Misconception prevented: adding an axiom helps locally but does not create a final complete system.

### Halting
User runs the hypothetical oracle on ordinary programs, then enables D and runs D on itself. The oracle output becomes self-contradictory and is marked impossible.

Misconception prevented: the Halting Problem is related to Gödel by diagonal structure, not identical vocabulary.

### Outside view / strange loop
User elevates the camera to the meta-system. Earlier G appears as an object inside a larger shell. The final loop folds only after the proof distinctions have been established.

Misconception prevented: “jumping out” is a change of formal level, not a magical escape from all limits.

## Transition rule

Every transition must answer three questions in the copy and the scene:

1. What object existed before?
2. What operation changed it?
3. What new question became expressible afterward?