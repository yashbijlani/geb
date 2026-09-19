import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const sceneHost = $('#scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.8, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
sceneHost.appendChild(renderer.domElement);

const machine = new THREE.Group();
scene.add(machine);

const palette = {
  blue: 0x8cc9db,
  amber: 0xe8b866,
  red: 0xe36e62,
  violet: 0xbca8e8,
  white: 0xeef0e8,
};

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.32, 2),
  new THREE.MeshBasicMaterial({ color: palette.amber, wireframe: true, transparent: true, opacity: 0.9 })
);
machine.add(core);

const orbit = new THREE.Group();
machine.add(orbit);
const particles = [];
for (let i = 0; i < 110; i += 1) {
  const angle = i * 2.399;
  const radius = 1.4 + (i % 9) * 0.15;
  const particle = new THREE.Mesh(
    new THREE.SphereGeometry(0.018 + (i % 3) * 0.009, 6, 6),
    new THREE.MeshBasicMaterial({
      color: i % 4 ? palette.blue : palette.amber,
      transparent: true,
      opacity: 0.55,
    })
  );
  particle.position.set(
    Math.cos(angle) * radius,
    Math.sin(angle * 1.7) * 0.7,
    Math.sin(angle) * radius
  );
  orbit.add(particle);
  particles.push(particle);
}

const rails = new THREE.Group();
machine.add(rails);
for (let i = 0; i < 7; i += 1) {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.2, i * 0.65 - 2, 0),
      new THREE.Vector3(3.2, i * 0.65 - 2, 0),
    ]),
    new THREE.LineBasicMaterial({
      color: i === 3 ? palette.amber : palette.blue,
      transparent: true,
      opacity: 0.2,
    })
  );
  rails.add(line);
}

const selfLoop = new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.8, -1.5, 0.2),
    new THREE.Vector3(-0.8, -2.3, 0.2),
    new THREE.Vector3(1.5, -2.1, 0.2),
    new THREE.Vector3(2.1, -0.8, 0.2),
    new THREE.Vector3(1.2, 0.2, 0.2),
  ]),
  new THREE.LineBasicMaterial({ color: palette.red, transparent: true, opacity: 0 })
);
machine.add(selfLoop);

let targetStage = 0;
let sceneStage = 0;
const stageNames = [
  'symbols',
  'formal system',
  'proof',
  'theoremhood',
  'self-reference',
  'encoding',
  'diagonalization',
  'G constructed',
  'incompleteness',
  'truth / provability',
  'stronger system',
  'halting',
  'correspondence',
  'meta-system',
  'strange loop',
  'recap',
];

function setStage(next) {
  targetStage = next;
  const label = `${String(next + 1).padStart(2, '0')} / ${stageNames[next]}`;
  $('#stageReadout').textContent = label;
}

const chapterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setStage(Number(entry.target.dataset.stage));
    }
  });
}, { threshold: 0.35 });

$$('.chapter').forEach((section) => chapterObserver.observe(section));

function animate() {
  requestAnimationFrame(animate);
  sceneStage += (targetStage - sceneStage) * 0.035;
  const t = performance.now() * 0.00025;

  machine.rotation.y = t * 0.5 + sceneStage * 0.11;
  machine.rotation.x = Math.sin(t) * 0.12 + sceneStage * 0.025;
  core.rotation.x += 0.003;
  core.rotation.z -= 0.002;
  orbit.rotation.z -= 0.001 + sceneStage * 0.0004;

  particles.forEach((point, index) => {
    point.position.y += Math.sin(t * 4 + index) * 0.0008;
    point.material.opacity = 0.25 + Math.min(sceneStage / 15, 1) * 0.4;
  });

  selfLoop.material.opacity = Math.max(0, (sceneStage - 3) / 10);
  camera.position.z += ((8 - sceneStage * 0.08) - camera.position.z) * 0.02;
  camera.position.y += ((1.8 + Math.sin(sceneStage * 0.25) * 0.6) - camera.position.y) * 0.02;

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const formalState = {
  string: 'A',
  trace: ['A  [axiom]'],
  step: 0,
};

function renderFormal() {
  $('#formalString').textContent = formalState.string;
  $('#formalStatus').textContent = formalState.step ? 'derived theorem' : 'axiom';
  $('#formalTrace').textContent = formalState.trace.join('\n');
}

$('[data-action="formal-step"]').addEventListener('click', () => {
  const isEven = formalState.step % 2 === 0;
  formalState.string += isEven ? 'B' : 'BA';
  formalState.step += 1;
  const rule = isEven ? 'A → AB' : 'B → BA';
  formalState.trace.push(`${formalState.string}  [rule ${rule}]`);
  $('#formalLog').textContent = `applied ${rule}: ${formalState.string}`;
  renderFormal();
  setStage(1);
});

$('[data-action="formal-invalid"]').addEventListener('click', () => {
  $('#formalLog').textContent = 'rejected: no permitted rule produces that transformation';
});

$('[data-action="formal-reset"]').addEventListener('click', () => {
  formalState.string = 'A';
  formalState.trace = ['A  [axiom]'];
  formalState.step = 0;
  $('#formalLog').textContent = 'reset to the original axiom';
  renderFormal();
});

renderFormal();

$$('.proof-step').forEach((step) => {
  step.addEventListener('click', () => {
    $$('.proof-step').forEach((item) => item.classList.remove('active'));
    step.classList.add('active');
    setStage(2);
  });
});

let searchCount = 0;
$('[data-action="decision-search"]').addEventListener('click', () => {
  searchCount += 1;
  $('#searchCount').textContent = String(searchCount);
  const output = searchCount > 5 ? 'proof found: YES' : 'searching; no decision yet';
  $('#decisionOutput').textContent = output;
  $('#decisionOutput').style.color = searchCount > 5 ? 'var(--blue)' : 'var(--ink)';
});

let refStep = 0;
$('[data-action="self-step"]').addEventListener('click', () => {
  refStep = (refStep + 1) % 3;
  const messages = ['another statement', 'its description', 'its own description'];
  $('#refTarget').textContent = messages[refStep];
  $('#refSource').textContent = refStep === 2 ? 'description of statement' : 'statement';
  $('#selfExplain').textContent = refStep === 2
    ? 'The description has become input. This is the operational hinge of the construction.'
    : 'A reference can point across levels without yet closing the loop.';
  setStage(4);
});

const codebook = { A: 11, '→': 17, B: 13, '(': 19, ')': 23 };
const symbolSequence = ['A', '→', 'B', '(', ')'];
let encodedValues = [];

function renderEncoding() {
  $('#numberStrip').textContent = encodedValues.length ? encodedValues.join(' · ') : '—';
  $('#decodeStrip').textContent = encodedValues.length
    ? encodedValues.map((n) => Object.keys(codebook).find((key) => codebook[key] === n)).join('')
    : '—';
}

$('[data-action="encode-step"]').addEventListener('click', () => {
  if (encodedValues.length < symbolSequence.length) {
    encodedValues.push(codebook[symbolSequence[encodedValues.length]]);
  }
  renderEncoding();
  setStage(5);
});

$('[data-action="encode-reset"]').addEventListener('click', () => {
  encodedValues = [];
  renderEncoding();
});

let diagStep = 0;
const diagText = [
  '1 / choose a property P(x)',
  '2 / assign a code ⌜P⌝ to the formula',
  '3 / substitute the code into its own free place',
  '4 / obtain the self-applied formula P(⌜P⌝)',
];

$('[data-action="diag-step"]').addEventListener('click', () => {
  diagStep = Math.min(3, diagStep + 1);
  $('#diagLog').textContent = diagText[diagStep];
  $$('.diag-node').forEach((node, index) => {
    node.classList.toggle('lit', index <= diagStep - 1);
  });
  setStage(6);
});

$('[data-action="diag-reset"]').addEventListener('click', () => {
  diagStep = 0;
  $('#diagLog').textContent = diagText[0];
  $$('.diag-node').forEach((node) => node.classList.remove('lit'));
});

let godelStep = 0;
$('[data-action="godel-step"]').addEventListener('click', () => {
  godelStep = Math.min(4, godelStep + 1);
  $$('#godelBuild div').forEach((node, index) => {
    node.classList.toggle('revealed', index < godelStep);
  });
  setStage(7);
});

$('[data-action="godel-reset"]').addEventListener('click', () => {
  godelStep = 0;
  $$('#godelBuild div').forEach((node) => node.classList.remove('revealed'));
});

function handleBranch(type) {
  const isG = type === 'g';
  $('#branchG').classList.toggle('selected', isG);
  $('#branchNotG').classList.toggle('selected', !isG);
  $('#branchResult').textContent = isG
    ? 'If S proved G, then G would assert that it has no S-proof. Under the soundness/consistency conditions used here, that would make S prove a false claim. Therefore S cannot prove G.'
    : 'The ¬G branch requires the relevant formal consistency qualification: a proof of ¬G would amount to a proof that G has a proof, and the standard incompleteness argument rules this out under the stated stronger conditions.';
  setStage(8);
}

$('[data-action="branch-g"]').addEventListener('click', () => handleBranch('g'));
$('[data-action="branch-notg"]').addEventListener('click', () => handleBranch('notg'));
$('[data-action="branch-reset"]').addEventListener('click', () => {
  $$('.branch-columns div').forEach((node) => node.classList.remove('selected'));
  $('#branchResult').textContent = 'Choose a branch to inspect the consequence.';
});

$('#truthSlider').addEventListener('input', (event) => {
  const value = Number(event.target.value);
  $('#truthReadout').textContent = value < 50
    ? 'Closer to the formal relation: no S-proof is available.'
    : 'Closer to the external relation: under the intended interpretation, G is true if S is sound here.';
});

let strengthened = false;
$('[data-action="add-axiom"]').addEventListener('click', () => {
  strengthened = !strengthened;
  $('#strongerSystem').textContent = strengthened ? 'S + G' : 'S';
  $('#systemGrowth').innerHTML = strengthened ? 'S <span>→</span> S + G' : 'S <span>→</span> S + ?';
  $('#newLimitText').textContent = strengthened
    ? 'Old G is now an axiom. A new diagonal sentence awaits the stronger system.'
    : 'Its own undecidable sentence has not been constructed yet.';
  setStage(10);
});

$('[data-action="oracle-normal"]').addEventListener('click', () => {
  $('#oracleAnswer').textContent = 'HALTS';
  $('#haltResult').textContent = 'For this ordinary toy program, the oracle returns a coherent answer. The trouble begins when the program receives its own code.';
  $('#executionTrace').classList.remove('alert');
  $('#executionTrace').innerHTML = '<span>program</span><i>→</i><span>oracle</span><i>→</i><span>behavior</span>';
});

$('[data-action="oracle-diagonal"]').addEventListener('click', () => {
  $('#oracleAnswer').textContent = 'HALTS and LOOPS';
  $('#haltResult').textContent = 'Contradiction: if the oracle says HALTS, D loops; if it says LOOPS, D halts. A total perfect oracle cannot exist.';
  $('#executionTrace').classList.add('alert');
  $('#executionTrace').innerHTML = '<strong>D(D)</strong><span>→</span><strong>oracle contradiction</strong>';
  setStage(11);
});

let metaLevel = 0;
$('[data-action="level-up"]').addEventListener('click', () => {
  metaLevel = Math.min(3, metaLevel + 1);
  const labels = [
    'object level / S',
    'meta-level / statements about S',
    'meta-meta-level / a stronger formal view',
    'the pattern returns / no final escape',
  ];
  $('#levelReadout').textContent = labels[metaLevel];
  $('#levelStack').style.transform = `translateY(-${metaLevel * 8}px) scale(${1 + metaLevel * 0.015})`;
  setStage(13);
});

$('[data-action="level-reset"]').addEventListener('click', () => {
  metaLevel = 0;
  $('#levelReadout').textContent = 'object level / S';
  $('#levelStack').style.transform = '';
});

const recapAnswers = {
  formal: 'A formal system separates syntax from meaning: rules can manipulate marks mechanically.',
  theorem: 'A theorem is not merely plausible. It is the endpoint of a finite sequence of accepted rules.',
  encode: 'Gödel numbering lets arithmetic represent strings, formulas, and proof sequences as numbers.',
  diagonal: 'A formula with a free place receives its own code. That is how self-reference is constructed.',
  incomplete: 'Under the relevant assumptions, neither G nor its negation is provable in S: S is incomplete.',
  truth: 'Truth is evaluated in an interpretation such as the intended natural numbers; provability is derivability inside S.',
  halting: 'Turing’s result concerns program behavior, but its diagonal shape echoes Gödel’s encoded self-reference.',
  axiom: 'Adding G makes a stronger system and settles old G, but the stronger system can have its own undecidable sentence.',
};

$$('[data-recap]').forEach((button) => {
  button.addEventListener('click', () => {
    $('#recapAnswer').textContent = recapAnswers[button.dataset.recap];
  });
});

const commandMap = {
  formal: () => document.getElementById('formal').scrollIntoView({ behavior: 'smooth', block: 'start' }),
  proof: () => document.getElementById('proof').scrollIntoView({ behavior: 'smooth', block: 'start' }),
  encoding: () => document.getElementById('encoding').scrollIntoView({ behavior: 'smooth', block: 'start' }),
  halting: () => document.getElementById('halting').scrollIntoView({ behavior: 'smooth', block: 'start' }),
  help: () => $('#helpOverlay').classList.remove('hidden'),
  reset: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage(0);
  },
};

const commandSuggestions = $('#commandSuggestions');
const commandInput = $('#commandInput');
const commandPalette = $('#commandPalette');

function openPalette() {
  commandPalette.classList.remove('hidden');
  commandInput.value = '';
  commandInput.focus();
  renderCommandSuggestions('');
}

function closePalette() {
  commandPalette.classList.add('hidden');
}

function renderCommandSuggestions(query) {
  const entries = [
    'formal',
    'proof',
    'encoding',
    'halting',
    'help',
    'reset',
  ].filter((item) => item.includes(query.toLowerCase()));

  commandSuggestions.innerHTML = entries.map((item) => `<div class="command-suggestion" data-command="${item}">${item}</div>`).join('');
  commandSuggestions.querySelectorAll('.command-suggestion').forEach((el) => {
    el.addEventListener('click', () => {
      const value = el.dataset.command;
      commandInput.value = value;
      runCommand(value);
    });
  });
}

function runCommand(value) {
  const key = value.toLowerCase().trim();
  const action = commandMap[key];
  if (action) {
    action();
  }
  closePalette();
}

commandInput.addEventListener('input', (event) => {
  renderCommandSuggestions(event.target.value);
});

commandInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const value = commandInput.value.trim();
    if (value) {
      runCommand(value);
    }
  }
  if (event.key === 'Escape') {
    closePalette();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === '/' || (event.metaKey && event.key.toLowerCase() === 'k')) {
    event.preventDefault();
    openPalette();
  }

  if (event.key === 'Escape') {
    $('#helpOverlay').classList.add('hidden');
    closePalette();
  }

  if (event.key === ' ') {
    event.preventDefault();
    setStage(targetStage);
  }

  if (event.key.toLowerCase() === 'h') {
    $('#helpOverlay').classList.toggle('hidden');
  }

  if (event.key.toLowerCase() === 'r') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage(0);
  }

  if (event.key === 'ArrowRight' || event.key === 'PageDown') {
    const next = Math.min(stageNames.length - 1, targetStage + 1);
    const section = $(`.chapter[data-stage="${next}"]`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
    const prev = Math.max(0, targetStage - 1);
    const section = $(`.chapter[data-stage="${prev}"]`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

$('[data-action="close-help"]').addEventListener('click', () => {
  $('#helpOverlay').classList.add('hidden');
});

renderCommandSuggestions('');
