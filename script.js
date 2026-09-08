import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $ = (query) => /^[A-Za-z][\w-]*$/.test(query) ? document.getElementById(query) : document.querySelector(query);
const sceneHost = $('scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 100);
camera.position.set(0, 1.8, 8);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight); renderer.outputColorSpace = THREE.SRGBColorSpace; sceneHost.append(renderer.domElement);
const machine = new THREE.Group(); scene.add(machine);
const palette = { blue: 0x8cc9db, amber: 0xe8b866, red: 0xe36e62, violet: 0xbca8e8, white: 0xeef0e8 };
const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.32, 2), new THREE.MeshBasicMaterial({ color: palette.amber, wireframe: true, transparent: true, opacity: .9 })); machine.add(core);
const orbit = new THREE.Group(); machine.add(orbit);
const particles = [];
for (let i = 0; i < 110; i += 1) { const angle = i * 2.399; const radius = 1.4 + (i % 9) * .15; const point = new THREE.Mesh(new THREE.SphereGeometry(.018 + (i % 3) * .009, 6, 6), new THREE.MeshBasicMaterial({ color: i % 4 ? palette.blue : palette.amber, transparent: true, opacity: .55 })); point.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.7) * .7, Math.sin(angle) * radius); orbit.add(point); particles.push(point); }
const rails = new THREE.Group(); machine.add(rails);
for (let i = 0; i < 7; i += 1) { const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.2, i * .65 - 2, 0), new THREE.Vector3(3.2, i * .65 - 2, 0)]), new THREE.LineBasicMaterial({ color: i === 3 ? palette.amber : palette.blue, transparent: true, opacity: .2 })); rails.add(line); }
const selfLoop = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-1.8, -1.5, .2), new THREE.Vector3(-.8, -2.3, .2), new THREE.Vector3(1.5, -2.1, .2), new THREE.Vector3(2.1, -.8, .2), new THREE.Vector3(1.2, .2, .2)]), new THREE.LineBasicMaterial({ color: palette.red, transparent: true, opacity: 0 })); machine.add(selfLoop);
let targetStage = 0; let sceneStage = 0;
const stageNames = ['symbols', 'formal system', 'proof', 'theoremhood', 'self-reference', 'encoding', 'diagonalization', 'G constructed', 'incompleteness', 'truth / provability', 'stronger system', 'halting', 'correspondence', 'meta-system', 'strange loop', 'recap'];
function setStage(next) { targetStage = next; $('stageReadout').textContent = `${String(next + 1).padStart(2, '0')} / ${stageNames[next]}`; }
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setStage(Number(entry.target.dataset.stage)); }), { threshold: .35 });
document.querySelectorAll('.chapter').forEach((section) => observer.observe(section));
function animate() { requestAnimationFrame(animate); sceneStage += (targetStage - sceneStage) * .035; const t = performance.now() * .00025; machine.rotation.y = t * .5 + sceneStage * .11; machine.rotation.x = Math.sin(t) * .12 + sceneStage * .025; core.rotation.x += .003; core.rotation.z -= .002; orbit.rotation.z -= .001 + sceneStage * .0004; particles.forEach((point, index) => { point.position.y += Math.sin(t * 4 + index) * .0008; point.material.opacity = .25 + Math.min(sceneStage / 15, 1) * .4; }); selfLoop.material.opacity = Math.max(0, (sceneStage - 3) / 10); camera.position.z += ((8 - sceneStage * .08) - camera.position.z) * .02; camera.position.y += ((1.8 + Math.sin(sceneStage * .25) * .6) - camera.position.y) * .02; renderer.render(scene, camera); }
animate();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

const formal = { string: 'A', trace: ['A  [axiom]'], step: 0 };
function renderFormal() { $('formalString').textContent = formal.string; $('formalStatus').textContent = formal.step ? 'derived theorem' : 'axiom'; $('formalTrace').textContent = formal.trace.join('\n'); }
$('[data-action="formal-step"]').onclick = () => { formal.string += formal.step % 2 === 0 ? 'B' : 'BA'; formal.step += 1; formal.trace.push(`${formal.string}  [rule ${formal.step % 2 ? 'A → AB' : 'B → BA'}]`); renderFormal(); setStage(1); };
$('[data-action="formal-invalid"]').onclick = () => { $('formalLog').textContent = 'rejected: no permitted rule produces that transformation'; };
$('[data-action="formal-reset"]').onclick = () => { formal.string = 'A'; formal.trace = ['A  [axiom]']; formal.step = 0; $('formalLog').textContent = ''; renderFormal(); };
renderFormal();

document.querySelectorAll('.proof-step').forEach((step) => step.onclick = () => { document.querySelectorAll('.proof-step').forEach((item) => item.classList.remove('active')); step.classList.add('active'); setStage(2); });
let searchCount = 0;
$('[data-action="decision-search"]').onclick = () => { searchCount += 1; $('searchCount').textContent = searchCount; $('decisionOutput').textContent = searchCount > 5 ? 'proof found: YES' : 'searching; no decision yet'; if (searchCount > 5) $('decisionOutput').style.color = 'var(--blue)'; };
let refStep = 0;
$('[data-action="self-step"]').onclick = () => { refStep = (refStep + 1) % 3; $('refTarget').textContent = ['another statement', 'its description', 'its own description'][refStep]; $('refSource').textContent = refStep === 2 ? 'description of statement' : 'statement'; $('selfExplain').textContent = refStep === 2 ? 'The description has become input. This is the operational hinge of the construction.' : 'A reference can point across levels without yet closing the loop.'; setStage(4); };
const codebook = { A: 11, '→': 17, B: 13, '(': 19, ')': 23 }; const symbols = ['A', '→', 'B', '(', ')']; let encoded = [];
function renderEncoding() { $('numberStrip').textContent = encoded.length ? encoded.join(' · ') : '—'; $('decodeStrip').textContent = encoded.length ? encoded.map((n) => Object.keys(codebook).find((key) => codebook[key] === n)).join('') : '—'; }
$('[data-action="encode-step"]').onclick = () => { if (encoded.length < symbols.length) encoded.push(codebook[symbols[encoded.length]]); renderEncoding(); setStage(5); };
$('[data-action="encode-reset"]').onclick = () => { encoded = []; renderEncoding(); };
let diagStep = 0;
const diagText = ['1 / choose a property P(x)', '2 / assign a code ⌜P⌝ to the formula', '3 / substitute the code into its own free place', '4 / obtain the self-applied formula P(⌜P⌝)'];
$('[data-action="diag-step"]').onclick = () => { diagStep = Math.min(3, diagStep + 1); $('diagLog').textContent = diagText[diagStep]; document.querySelectorAll('.diag-node').forEach((node, index) => node.classList.toggle('lit', index <= diagStep - 1)); setStage(6); };
$('[data-action="diag-reset"]').onclick = () => { diagStep = 0; $('diagLog').textContent = diagText[0]; document.querySelectorAll('.diag-node').forEach((node) => node.classList.remove('lit')); };
let godelStep = 0;
$('[data-action="godel-step"]').onclick = () => { godelStep = Math.min(4, godelStep + 1); document.querySelectorAll('#godelBuild div').forEach((node, index) => node.classList.toggle('revealed', index < godelStep)); setStage(7); };
$('[data-action="godel-reset"]').onclick = () => { godelStep = 0; document.querySelectorAll('#godelBuild div').forEach((node) => node.classList.remove('revealed')); };
function branch(type) { const isG = type === 'g'; $('branchG').classList.toggle('selected', isG); $('branchNotG').classList.toggle('selected', !isG); $('branchResult').textContent = isG ? 'If S proved G, then G would assert that it has no S-proof. Under the soundness/consistency conditions used here, that would make S prove a false claim. Therefore S cannot prove G.' : 'The ¬G branch requires the relevant formal consistency qualification: a proof of ¬G would amount to a proof that G has a proof, and the standard incompleteness argument rules this out under the stated stronger conditions.'; setStage(8); }
$('[data-action="branch-g"]').onclick = () => branch('g'); $('[data-action="branch-notg"]').onclick = () => branch('notg'); $('[data-action="branch-reset"]').onclick = () => { document.querySelectorAll('.branch-columns div').forEach((node) => node.classList.remove('selected')); $('branchResult').textContent = 'Choose a branch to inspect the consequence.'; };
$('truthSlider').oninput = (event) => { const value = Number(event.target.value); $('truthReadout').textContent = value < 50 ? 'Closer to the formal relation: no S-proof is available.' : 'Closer to the external relation: under the intended interpretation, G is true if S is sound here.'; };
let strengthened = false;
$('[data-action="add-axiom"]').onclick = () => { strengthened = !strengthened; $('strongerSystem').textContent = strengthened ? 'S + G' : 'S'; $('systemGrowth').innerHTML = strengthened ? 'S <span>→</span> S + G' : 'S <span>→</span> S + ?'; $('newLimitText').textContent = strengthened ? 'Old G is now an axiom. A new diagonal sentence awaits the stronger system.' : 'Its own undecidable sentence has not been constructed yet.'; setStage(10); };
$('[data-action="oracle-normal"]').onclick = () => { $('oracleAnswer').textContent = 'HALTS'; $('haltResult').textContent = 'For this ordinary toy program, the oracle returns a coherent answer. The trouble begins when the program receives its own code.'; $('executionTrace').classList.remove('alert'); };
$('[data-action="oracle-diagonal"]').onclick = () => { $('oracleAnswer').textContent = 'HALTS and LOOPS'; $('haltResult').textContent = 'Contradiction: if the oracle says HALTS, D loops; if it says LOOPS, D halts. A total perfect oracle cannot exist.'; $('executionTrace').classList.add('alert'); $('executionTrace').innerHTML = '<strong>D(D)</strong><span>→</span><strong>oracle contradiction</strong>'; setStage(11); };
let level = 0;
$('[data-action="level-up"]').onclick = () => { level = Math.min(3, level + 1); $('levelReadout').textContent = ['object level / S', 'meta-level / statements about S', 'meta-meta-level / a stronger formal view', 'the pattern returns / no final escape'][level]; $('levelStack').style.transform = `translateY(-${level * 8}px) scale(${1 + level * .015})`; setStage(13); };
$('[data-action="level-reset"]').onclick = () => { level = 0; $('levelReadout').textContent = 'object level / S'; $('levelStack').style.transform = ''; };
const recapAnswers = { formal: 'A formal system separates syntax from meaning: rules can manipulate marks mechanically.', theorem: 'A theorem is not merely plausible. It is the endpoint of a finite sequence of accepted rules.', encode: 'Gödel numbering lets arithmetic represent strings, formulas, and proof sequences as numbers.', diagonal: 'A formula with a free place receives its own code. That is how self-reference is constructed.', incomplete: 'Under the relevant assumptions, neither G nor its negation is provable in S: S is incomplete.', truth: 'Truth is evaluated in an interpretation such as the intended natural numbers; provability is derivability inside S.', halting: 'Turing’s result concerns program behavior, but its diagonal shape echoes Gödel’s encoded self-reference.', axiom: 'Adding G makes a stronger system and settles old G, but the stronger system can have its own undecidable sentence.' };
document.querySelectorAll('[data-recap]').forEach((button) => button.onclick = () => { $('recapAnswer').textContent = recapAnswers[button.dataset.recap]; });
