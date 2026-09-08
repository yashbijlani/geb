# GEB / Gödel journey

A long-form interactive mathematical documentary that constructs Gödel's First Incompleteness Theorem from formal systems through encoding, diagonalization, truth, and the Halting Problem.

## Run locally

From this folder:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

The entry page is the single coherent journey in `index.html`. It uses Three.js from a browser CDN for the persistent proof-machine scene.

The earlier exploratory probes remain available at `experiments.html` as research artifacts, not as the main experience.

## Notes
The page distinguishes source framing, standard mathematics, toy models, and visual metaphors. It is intentionally explicit about the assumptions behind the incompleteness argument.
