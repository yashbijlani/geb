# Three computational probes

These are deliberately small and unpolished. They are experiments designed to falsify the current theory, not a proposed final interface.

Run them by opening [experiments.html](../experiments.html) or serving the repository locally.

## Prototype 1: One object, many worlds

### 1. Underlying system
A directed graph with four named nodes and mutable edges.

### 2. User manipulation
Add an edge, reverse an edge, or compress the node labels.

### 3. Representations
The exact same graph is rendered as an edge list, spatial points and lines, a sequence of pitch intervals, and a computational degree signature.

### 4. Preserved
With exact translation, the edge relation and degree multiset survive. The musical sequence preserves only the walk-derived intervals, not node names.

### 5. Lost
Compression destroys node identity. The resulting orientation bits cannot uniquely reconstruct the original graph.

### 6. Can it represent itself?
Not yet. The computational view describes the graph but does not feed that description back into it.

### 7. Surprise
The spatial and musical forms can feel like different objects even though they are generated from the same four edges. The first explicit loss makes clear that “same structure” depends on which relations were retained.

### 8. Reveals
Transfer is not all-or-nothing. Invariants are selected by the translation function. The graph’s connectivity is a stronger candidate for identity than its labels or surface appearance.

### 9. Fails to reveal
A graph has no semantics by itself. It cannot reproduce the felt ambiguity of interpreting a symbol system, and it does not capture Bach’s temporal development or Escher’s perceptual reversal.

### 10. Better than a conventional visualization
It makes the translation causal and reversible until a deliberate lossy step. The user can identify the precise moment at which recoverability fails.

## Prototype 2: The observer enters the machine

### 1. Underlying system
An eight-bit deterministic state machine. Each step applies a fixed XOR pattern.

### 2. User manipulation
Step the machine, change the observer, and toggle whether the machine’s generated description is fed back as input.

### 3. Representations
The same bits are read as symbols, a number, pulses, or a rule description.

### 4. Preserved
The bit state remains fixed when only the observer changes. The state transition remains deterministic under either update rule.

### 5. Lost
Each observer discards detail: the number hides position, the symbol string hides binary arithmetic, and the pulse count hides ordering.

### 6. Can it represent itself?
Yes. `descriptionBits()` is computed from the current state and step, and with self-feed enabled those bits directly alter the next state.

### 7. Surprise
The observer switch is initially harmless. The self-feed switch changes the trajectory itself, so “interpretation” becomes a causal intervention rather than a neutral viewpoint.

### 8. Reveals
The observer/system distinction is operational, not metaphysical. It holds while the description is read-only and breaks when the description becomes input.

### 9. Fails to reveal
This is not Gödel’s theorem. It has no proof predicate, arithmetization, or genuine undecidability. Its value is experimental: it lets the user feel the boundary condition before formalizing it.

### 10. Better than a conventional visualization
The representation is not an animation layered over the system. The self-description is part of the update equation, so the loop has actual causal force.

## Prototype 3: A book-shaped machine

### 1. Underlying system
A directed transition graph whose nodes are recurring conceptual contexts rather than chapters. Edges encode the book’s repeated moves: rules to meaning, meaning to self-reference, levels to loops, and loops back to rules.

### 2. User manipulation
Advance along transitions or jump directly to self-reference.

### 3. Representations
The graph, the current context, the textual description of that context, and the visited path.

### 4. Preserved
The transition topology and repeated visits survive every view.

### 5. Lost
The actual prose, dialogue texture, historical detail, and domain-specific differences between Bach, Escher, and Gödel are discarded.

### 6. Can it represent itself?
Partially. The path records repeated states, and repeated contexts are reported as attractors. The graph does not yet rewrite its own edges.

### 7. Surprise
A small graph quickly returns to earlier contexts. The book’s “progress” is not a straight line; it is a return with altered context.

### 8. Reveals
The book may be better understood as a transition system than a sequence. Its recurring motifs behave like attractors, but this model also exposes how much domain-specific meaning gets lost when the structure is abstracted.

### 9. Fails to reveal
It cannot prove that the book’s structure is computationally equivalent to its content. It also risks imposing cycles because the modeler chose the edges.

### 10. Better than a conventional visualization
It turns interpretation into an inspectable object. The user can see a path accumulate, encounter recurrence, and distinguish an observed attractor from a static thematic diagram.

## Comparison

Prototype 1 is the safest and most useful base. It demonstrates exact translation and deliberate information loss. Prototype 2 is the strongest mechanism: a read-only description becomes an input and changes the trajectory. Prototype 3 is the most uncertain: it may reveal a real structural recurrence, or merely reflect the modeler’s editorial choices.

The first hypothesis was too broad. “Recursion and self-reference unify everything” does not survive unchanged. Prototype 1 shows that translation preserves selected relations, not meaning in general. Prototype 2 shows that self-reference is interesting only when it has causal consequences. Prototype 3 shows that a book-level abstraction can reveal recurrence while simultaneously erasing the differences that made the recurrence meaningful.

## One idea to keep

Keep the exact mechanism from Prototype 2, strengthened by Prototype 1:

> A system emits a lossy description of its current state; that description is translated into another substrate and fed back as the next update rule. The experiment tracks which relations survive the translation and how the resulting feedback changes the trajectory.

That is the smallest idea worth keeping. It is not a GEB explorer, a self-reference engine, or a visualization. It is a state machine whose interpretation can become part of its causality, with explicit evidence of what the interpretation preserved and destroyed.
