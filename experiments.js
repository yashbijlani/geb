// Prototype 1: one graph state translated into four substrates.
const transfer = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['A', 'D']],
  compressed: false
};
const $ = (id) => document.getElementById(id);

function graphText() {
  return transfer.edges.map(([from, to]) => `${from}->${to}`).join('  ');
}
function degrees() {
  const values = Object.fromEntries(transfer.nodes.map((node) => [node, 0]));
  transfer.edges.forEach(([from, to]) => { values[from] += 1; values[to] += 1; });
  return values;
}
function renderTransfer() {
  const degreeValues = degrees();
  const degreeSignature = Object.values(degreeValues).sort((a, b) => a - b).join(',');
  const renderedEdges = transfer.compressed
    ? transfer.edges.map(([from, to]) => [from < to ? 'A' : 'B', from === to ? 'B' : 'A'])
    : transfer.edges;
  $('transferState').textContent = graphText();
  $('transferInvariant').textContent = `degree multiset [${degreeSignature}], ${transfer.edges.length} edges`;
  $('transferSymbolic').textContent = renderedEdges.map(([from, to]) => `${from} -> ${to}`).join('\n');
  $('transferComputed').textContent = JSON.stringify({ nodes: transfer.nodes.length, edges: transfer.edges.length, degreeSignature }, null, 2);
  const spatial = $('transferSpatial');
  spatial.innerHTML = '';
  const positions = transfer.compressed ? { A: [28, 50], B: [72, 50] } : { A: [18, 25], B: [72, 18], C: [82, 80], D: [24, 84] };
  Object.keys(positions).forEach((node) => {
    const point = document.createElement('i'); point.style.left = `${positions[node][0]}%`; point.style.top = `${positions[node][1]}%`; point.title = node; spatial.append(point);
  });
  renderedEdges.forEach(([from, to]) => {
    const [x1, y1] = positions[from]; const [x2, y2] = positions[to]; const line = document.createElement('em');
    line.style.left = `${x1}%`; line.style.top = `${y1}%`; line.style.width = `${Math.hypot(x2 - x1, y2 - y1)}%`; line.style.transform = `rotate(${Math.atan2(y2 - y1, x2 - x1)}rad)`; spatial.append(line);
  });
  const values = renderedEdges.map(([from, to]) => (positions[to][1] - positions[from][1]) + 50);
  $('transferMusical').innerHTML = values.map((value) => `<i style="height:${Math.max(12, value)}px" title="${value}"></i>`).join('');
  if (!transfer.compressed) {
    $('transferLoss').textContent = 'none; all edge identities survive';
    $('transferResult').textContent = 'The graph has travelled without changing state. Degree structure is a candidate invariant, not yet a proven meaning.';
  } else {
    const labels = transfer.edges.map(([from, to]) => `${from < to ? 0 : 1}${from === to ? 1 : 0}`).join(' ');
    $('transferLoss').textContent = `labels collapsed to orientation bits: ${labels}`;
    $('transferResult').textContent = 'Compression preserved a coarse degree pattern but destroyed node identity. The musical and spatial views can no longer recover the original graph uniquely.';
  }
}
$('transferAdd').onclick = () => { const options = [['D', 'A'], ['B', 'D'], ['C', 'A']]; const next = options.find((edge) => !transfer.edges.some((item) => item.join('') === edge.join(''))); if (next) transfer.edges.push(next); renderTransfer(); };
$('transferReverse').onclick = () => { transfer.edges[0].reverse(); renderTransfer(); };
$('transferCompress').onclick = () => { transfer.compressed = !transfer.compressed; renderTransfer(); };
$('transferReset').onclick = () => { transfer.edges = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['A', 'D']]; transfer.compressed = false; renderTransfer(); };
$('transferPlay').onclick = () => playNotes(transfer.edges.map(([from, to]) => 180 + (to.charCodeAt(0) - from.charCodeAt(0) + 3) * 70));
renderTransfer();

function playNotes(frequencies) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext; if (!AudioContextClass) return;
  const context = new AudioContextClass(); const start = context.currentTime;
  frequencies.forEach((frequency, index) => { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = frequency; oscillator.type = 'sine'; gain.gain.setValueAtTime(.001, start + index * .16); gain.gain.exponentialRampToValueAtTime(.12, start + index * .16 + .02); gain.gain.exponentialRampToValueAtTime(.001, start + index * .16 + .14); oscillator.connect(gain).connect(context.destination); oscillator.start(start + index * .16); oscillator.stop(start + index * .16 + .15); });
}

// Prototype 2: a deterministic bit machine whose own description can become input.
const observer = { bits: [1, 0, 1, 1, 0, 0, 1, 0], step: 0, selfFeed: false, trace: [] };
function descriptionBits() { return observer.bits.map((bit, index) => (bit ^ ((index + observer.step) % 2))); }
function renderObserver() {
  const binary = observer.bits.join(''); const description = descriptionBits().join('');
  $('observerState').textContent = `state      ${binary}\ndescription ${description}\nstep       ${observer.step}`;
  const mode = $('observerMode').value;
  const readings = { symbols: observer.bits.map((bit) => bit ? 'I' : 'O').join(''), number: parseInt(binary, 2), sound: `${observer.bits.filter(Boolean).length} pulses`, rule: observer.selfFeed ? 'description -> next state' : 'fixed rule -> next state' };
  $('observerReading').textContent = String(readings[mode]);
  $('observerTrace').textContent = observer.trace.slice(-6).join('\n') || 'no causal steps yet';
  $('observerResult').textContent = observer.selfFeed ? 'The description is now an input. The observer is no longer outside the machine; its reading changes the next state.' : 'Changing observer changes the account, not the bits. The object is stable while interpretation moves.';
}
function stepObserver() {
  const old = observer.bits.join(''); const desc = descriptionBits();
  observer.bits = observer.bits.map((bit, index) => observer.selfFeed ? bit ^ desc[(index + 1) % desc.length] : bit ^ ((index + 1) % 2)); observer.step += 1;
  observer.trace.push(`${old} + ${observer.selfFeed ? desc.join('') : '01010101'} -> ${observer.bits.join('')}`); renderObserver();
}
$('observerStep').onclick = stepObserver;
$('observerSelf').onclick = () => { observer.selfFeed = !observer.selfFeed; renderObserver(); };
$('observerReset').onclick = () => { observer.bits = [1, 0, 1, 1, 0, 0, 1, 0]; observer.step = 0; observer.selfFeed = false; observer.trace = []; renderObserver(); };
$('observerMode').onchange = renderObserver;
renderObserver();

// Prototype 3: a compact graph of the book's movements, not a chapter index.
const bookNodes = {
  rules: { label: 'rules', next: ['meaning', 'rules'], description: 'A finite grammar begins to generate a world.' },
  meaning: { label: 'meaning', next: ['figure', 'self-reference'], description: 'Form acquires significance through an interpretation.' },
  figure: { label: 'figure/ground', next: ['recursion', 'meaning'], description: 'The observer changes what counts as object and background.' },
  recursion: { label: 'recursion', next: ['levels', 'self-reference'], description: 'A process repeats while carrying structure forward.' },
  levels: { label: 'levels', next: ['self-reference', 'rules'], description: 'Descriptions are stacked, then one level starts to describe another.' },
  'self-reference': { label: 'self-reference', next: ['AI', 'strange-loop'], description: 'The system generates a statement about its own operation.' },
  AI: { label: 'AI / mind', next: ['strange-loop', 'meaning'], description: 'Representation and interpretation become questions about thought.' },
  'strange-loop': { label: 'strange loop', next: ['rules', 'meaning'], description: 'The hierarchy returns to its starting conditions at a changed level.' }
};
const book = { current: 'rules', path: ['rules'] };
function renderBook() {
  const lines = Object.entries(bookNodes).map(([key, node]) => `${key === book.current ? '>' : ' '} ${node.label} -> ${node.next.join(', ')}`); $('bookGraph').textContent = lines.join('\n');
  const node = bookNodes[book.current]; $('bookContext').textContent = node.label; $('bookDescription').textContent = node.description; $('bookPath').textContent = book.path.join(' -> ');
  const visits = book.path.filter((item, index) => book.path.indexOf(item) !== index); const repeated = visits.length ? `Repeated context: ${visits[visits.length - 1]}. The path is beginning to act like an attractor.` : 'No repeated context yet. The machine is still exploring.'; $('bookResult').textContent = repeated;
}
$('bookAdvance').onclick = () => { const options = bookNodes[book.current].next; book.current = options[book.path.length % options.length]; book.path.push(book.current); renderBook(); };
$('bookJump').onclick = () => { book.current = 'self-reference'; book.path.push(book.current); renderBook(); };
$('bookReset').onclick = () => { book.current = 'rules'; book.path = ['rules']; renderBook(); };
renderBook();
