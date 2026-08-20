(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const card = document.getElementById('gameCard');
  const startScreen = document.getElementById('startScreen');
  const gameoverScreen = document.getElementById('gameoverScreen');
  const startButton = document.getElementById('startButton');
  const retryButton = document.getElementById('retryButton');
  const homeButton = document.getElementById('homeButton');
  const soundButton = document.getElementById('soundButton');
  const hud = document.getElementById('hud');
  const stackNode = document.getElementById('stack');
  const bestStackNode = document.getElementById('bestStack');
  const balanceNode = document.getElementById('balance');
  const startBest = document.getElementById('startBest');
  const countdown = document.getElementById('countdown');
  const tapGuide = document.getElementById('tapGuide');
  const firstTip = document.getElementById('firstTip');
  const finalStack = document.getElementById('finalStack');
  const finalJumps = document.getElementById('finalJumps');
  const finalPerfect = document.getElementById('finalPerfect');
  const newBest = document.getElementById('newBest');

  const WORLD_W = 390;
  const WORLD_H = 720;
  const TAU = Math.PI * 2;
  const START_Y = 648;
  const FOOT = 27;
  const HIT_EDGE_EPSILON = .35;
  const PLAYER_SCALE = .8;
  const MIN_TARGET_RISE = 92;
  const MAX_TARGET_RISE = 128;
  const JUMP_SPEED = 545;
  const GRAVITY = 980;
  const PLAYER_LOAD = .2;
  const FIXED_DT = 1 / 120;
  const SOLVER_ITERATIONS = 14;
  const STORAGE_KEY = 'anime-creator-expo-tower-best-score';

  const BLOCK_TYPES = [
    { type: 'blue', width: 156, height: 40, minHeight: 32, maxHeight: 50, color: '#68cef0', edge: '#35a9da', density: 1.08 },
    { type: 'orange', width: 126, height: 44, minHeight: 34, maxHeight: 56, color: '#ff8658', edge: '#e95e39', density: 1.14 },
    { type: 'blueWide', width: 176, height: 36, minHeight: 28, maxHeight: 46, color: '#68cef0', edge: '#35a9da', density: 1.02 },
    { type: 'green', width: 150, height: 22, minHeight: 18, maxHeight: 28, color: '#43d99c', edge: '#1dbb79', density: .92 },
    { type: 'square', width: 120, height: 100, minHeight: 92, maxHeight: 108, color: '#ff9b61', edge: '#dc6545', density: 1.18 },
  ];
  const BLOCK_SEQUENCE = [0, 0, 1, 2, 0, 3, 1, 0, 2, 4, 0, 3, 0];

  let state = 'title';
  let stateTime = 0;
  let elapsed = 0;
  let lastTime = 0;
  let accumulator = 0;
  let cameraY = 0;
  let stackCount = 0;
  let jumps = 0;
  let perfectCount = 0;
  let best = readBest();
  let towerBalance = 100;
  let bodySerial = 0;
  let blocks = [];
  let activeBlock = null;
  let spawnTimer = 0;
  let particles = [];
  let tapRipples = [];
  let shake = 0;
  let flash = 0;
  let soundEnabled = true;
  let audioContext = null;
  let firstJumpDone = false;
  let fallReason = '';
  let unreachableTimer = 0;

  const player = {
    x: WORLD_W / 2,
    y: START_Y - 38,
    vx: 0,
    vy: 0,
    angle: 0,
    omega: 0,
    mode: 'standing',
    support: null,
    localX: 0,
    slideV: 0,
    squash: 0,
    wing: 0,
  };

  const stars = Array.from({ length: 82 }, (_, index) => ({
    x: (index * 83.17 + 23) % WORLD_W,
    y: (index * 47.31 + 41) % 880 - 70,
    r: .55 + (index % 7) * .16,
    phase: index * .67,
    depth: .025 + (index % 5) * .018,
  }));

  function readBest() {
    try { return Number(localStorage.getItem(STORAGE_KEY)) || 0; }
    catch (_error) { return 0; }
  }

  function saveBest(value) {
    try { localStorage.setItem(STORAGE_KEY, String(value)); }
    catch (_error) { /* Storage can be unavailable in private contexts. */ }
  }

  function reportScore(final = false) {
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'creator-expo-game-score', score: stackCount, final }, '*');
  }

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function roundedRect(x, y, width, height, radius) {
    const safeRadius = Math.max(0, Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2));
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, safeRadius);
      return;
    }
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + width - safeRadius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
    ctx.lineTo(x + width, y + height - safeRadius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
    ctx.lineTo(x + safeRadius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  }
  function dot(a, b) { return a.x * b.x + a.y * b.y; }
  function cross(a, b) { return a.x * b.y - a.y * b.x; }
  function length(vector) { return Math.hypot(vector.x, vector.y); }

  function resize() {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function worldTransform() {
    const rect = card.getBoundingClientRect();
    const scale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
    ctx.translate((rect.width - WORLD_W * scale) / 2, (rect.height - WORLD_H * scale) / 2);
    ctx.scale(scale, scale);
  }

  function initAudio() {
    const userActivated = navigator.userActivation?.isActive ?? true;
    if (!audioContext && !userActivated) return;
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext?.state === 'suspended' && userActivated) audioContext.resume();
  }

  function tone(frequency, duration, type = 'sine', volume = .035, delay = 0) {
    if (!soundEnabled || !audioContext || audioContext.state !== 'running') return;
    const now = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function playJump() {
    tone(350, .09, 'triangle', .035);
    tone(610, .12, 'sine', .023, .035);
  }

  function playCatch() {
    tone(540, .1, 'triangle', .04);
    tone(810, .16, 'sine', .025, .05);
  }

  function playStack(perfect) {
    tone(perfect ? 660 : 470, .12, 'triangle', .045);
    tone(perfect ? 990 : 700, .2, 'sine', .028, .055);
    if (perfect) tone(1320, .24, 'sine', .02, .13);
  }

  function playCollapse() {
    tone(155, .32, 'sawtooth', .045);
    tone(88, .45, 'square', .019, .07);
  }

  function makeBody(options) {
    const isStatic = Boolean(options.isStatic);
    const density = options.density || 1;
    const mass = isStatic ? Infinity : Math.max(.5, options.width * options.height * density / 1050);
    const inertia = isStatic ? Infinity : mass * (options.width ** 2 + options.height ** 2) / 12;
    bodySerial += 1;
    return {
      id: bodySerial,
      x: options.x,
      y: options.y,
      width: options.width,
      height: options.height,
      color: options.color,
      edge: options.edge,
      type: options.type || 'blue',
      index: options.index || 0,
      isBase: Boolean(options.isBase),
      isStatic,
      collisionEnabled: options.collisionEnabled !== false,
      angle: options.angle || 0,
      vx: options.vx || 0,
      vy: options.vy || 0,
      omega: options.omega || 0,
      mass,
      invMass: isStatic ? 0 : 1 / mass,
      inertia,
      invInertia: isStatic ? 0 : 1 / inertia,
      friction: options.friction ?? .62,
      restitution: options.restitution ?? .005,
      mode: options.mode || (isStatic ? 'base' : 'dynamic'),
      preciselyStacked: false,
      locked: false,
      sleeping: false,
      sleepTime: 0,
      supported: false,
      supportBody: null,
      firstContactBody: null,
      landingAge: 0,
      dropAge: 0,
      gravityScale: options.gravityScale ?? 1,
    };
  }

  function bodyAxes(body) {
    const cosine = Math.cos(body.angle);
    const sine = Math.sin(body.angle);
    return [
      { x: cosine, y: sine },
      { x: -sine, y: cosine },
    ];
  }

  function worldPoint(body, localX, localY) {
    const cosine = Math.cos(body.angle);
    const sine = Math.sin(body.angle);
    return {
      x: body.x + cosine * localX - sine * localY,
      y: body.y + sine * localX + cosine * localY,
    };
  }

  function localPoint(body, point) {
    const cosine = Math.cos(body.angle);
    const sine = Math.sin(body.angle);
    const dx = point.x - body.x;
    const dy = point.y - body.y;
    return {
      x: cosine * dx + sine * dy,
      y: -sine * dx + cosine * dy,
    };
  }

  function bodyVertices(body) {
    const halfW = body.width / 2;
    const halfH = body.height / 2;
    return [
      worldPoint(body, -halfW, -halfH),
      worldPoint(body, halfW, -halfH),
      worldPoint(body, halfW, halfH),
      worldPoint(body, -halfW, halfH),
    ];
  }

  function pointInside(body, point, epsilon = .35) {
    const local = localPoint(body, point);
    return Math.abs(local.x) <= body.width / 2 + epsilon && Math.abs(local.y) <= body.height / 2 + epsilon;
  }

  function segmentIntersection(a, b, c, d) {
    const r = { x: b.x - a.x, y: b.y - a.y };
    const s = { x: d.x - c.x, y: d.y - c.y };
    const denominator = cross(r, s);
    if (Math.abs(denominator) < 1e-7) return null;
    const ca = { x: c.x - a.x, y: c.y - a.y };
    const t = cross(ca, s) / denominator;
    const u = cross(ca, r) / denominator;
    if (t < -.001 || t > 1.001 || u < -.001 || u > 1.001) return null;
    return { x: a.x + r.x * t, y: a.y + r.y * t };
  }

  function supportPoint(body, direction) {
    const vertices = bodyVertices(body);
    let bestPoint = vertices[0];
    let bestProjection = dot(bestPoint, direction);
    for (let index = 1; index < vertices.length; index += 1) {
      const projection = dot(vertices[index], direction);
      if (projection > bestProjection) {
        bestProjection = projection;
        bestPoint = vertices[index];
      }
    }
    return bestPoint;
  }

  function contactPoints(a, b, normal) {
    const verticesA = bodyVertices(a);
    const verticesB = bodyVertices(b);
    const candidates = [];
    const addUnique = (point) => {
      if (!candidates.some((existing) => Math.hypot(existing.x - point.x, existing.y - point.y) < .8)) candidates.push(point);
    };

    for (const point of verticesA) if (pointInside(b, point)) addUnique(point);
    for (const point of verticesB) if (pointInside(a, point)) addUnique(point);
    for (let aIndex = 0; aIndex < 4; aIndex += 1) {
      const aNext = (aIndex + 1) % 4;
      for (let bIndex = 0; bIndex < 4; bIndex += 1) {
        const bNext = (bIndex + 1) % 4;
        const point = segmentIntersection(verticesA[aIndex], verticesA[aNext], verticesB[bIndex], verticesB[bNext]);
        if (point) addUnique(point);
      }
    }

    if (candidates.length === 0) {
      const pointA = supportPoint(a, normal);
      const pointB = supportPoint(b, { x: -normal.x, y: -normal.y });
      return [{ x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 }];
    }
    if (candidates.length <= 2) return candidates;

    const tangent = { x: -normal.y, y: normal.x };
    candidates.sort((first, second) => dot(first, tangent) - dot(second, tangent));
    return [candidates[0], candidates[candidates.length - 1]];
  }

  function collide(a, b) {
    if (!a.collisionEnabled || !b.collisionEnabled) return null;
    if ((a.isStatic || a.locked) && (b.isStatic || b.locked)) return null;
    const axesA = bodyAxes(a);
    const axesB = bodyAxes(b);
    const axes = [...axesA, ...axesB];
    const delta = { x: b.x - a.x, y: b.y - a.y };
    let minimumOverlap = Infinity;
    let bestAxis = null;

    for (const axis of axes) {
      const radiusA = a.width / 2 * Math.abs(dot(axesA[0], axis)) + a.height / 2 * Math.abs(dot(axesA[1], axis));
      const radiusB = b.width / 2 * Math.abs(dot(axesB[0], axis)) + b.height / 2 * Math.abs(dot(axesB[1], axis));
      const distance = Math.abs(dot(delta, axis));
      const overlap = radiusA + radiusB - distance;
      if (overlap <= 0) return null;
      if (overlap < minimumOverlap) {
        minimumOverlap = overlap;
        const sign = dot(delta, axis) < 0 ? -1 : 1;
        bestAxis = { x: axis.x * sign, y: axis.y * sign };
      }
    }

    return {
      normal: bestAxis,
      penetration: minimumOverlap,
      contacts: contactPoints(a, b, bestAxis),
    };
  }

  function velocityAt(body, radius) {
    return {
      x: body.vx - body.omega * radius.y,
      y: body.vy + body.omega * radius.x,
    };
  }

  function wake(body) {
    if (body.isStatic || body.locked) return;
    body.sleeping = false;
    body.sleepTime = 0;
  }

  function applyImpulse(body, impulse, radius, direction) {
    if (body.isStatic || body.locked) return;
    body.vx += impulse.x * body.invMass * direction;
    body.vy += impulse.y * body.invMass * direction;
    body.omega += cross(radius, impulse) * body.invInertia * direction;
  }

  function resolveImpulse(a, b, manifold) {
    const normal = manifold.normal;
    const contactCount = manifold.contacts.length;
    const inverseMassA = a.locked ? 0 : a.invMass;
    const inverseMassB = b.locked ? 0 : b.invMass;
    const inverseInertiaA = a.locked ? 0 : a.invInertia;
    const inverseInertiaB = b.locked ? 0 : b.invInertia;
    for (const contact of manifold.contacts) {
      const radiusA = { x: contact.x - a.x, y: contact.y - a.y };
      const radiusB = { x: contact.x - b.x, y: contact.y - b.y };
      const velocityA = velocityAt(a, radiusA);
      const velocityB = velocityAt(b, radiusB);
      const relativeVelocity = { x: velocityB.x - velocityA.x, y: velocityB.y - velocityA.y };
      const normalVelocity = dot(relativeVelocity, normal);
      if (normalVelocity > .25) continue;

      const radiusCrossA = cross(radiusA, normal);
      const radiusCrossB = cross(radiusB, normal);
      const normalMass = inverseMassA + inverseMassB
        + radiusCrossA * radiusCrossA * inverseInertiaA
        + radiusCrossB * radiusCrossB * inverseInertiaB;
      if (normalMass <= 0) continue;

      const restitution = Math.min(a.restitution, b.restitution);
      const impulseMagnitude = -(1 + restitution) * normalVelocity / normalMass / contactCount;
      const impulse = { x: normal.x * impulseMagnitude, y: normal.y * impulseMagnitude };
      applyImpulse(a, impulse, radiusA, -1);
      applyImpulse(b, impulse, radiusB, 1);

      const newVelocityA = velocityAt(a, radiusA);
      const newVelocityB = velocityAt(b, radiusB);
      const newRelative = { x: newVelocityB.x - newVelocityA.x, y: newVelocityB.y - newVelocityA.y };
      const tangentVelocity = {
        x: newRelative.x - normal.x * dot(newRelative, normal),
        y: newRelative.y - normal.y * dot(newRelative, normal),
      };
      const tangentLength = length(tangentVelocity);
      if (tangentLength < 1e-6) continue;
      const tangent = { x: tangentVelocity.x / tangentLength, y: tangentVelocity.y / tangentLength };
      const tangentCrossA = cross(radiusA, tangent);
      const tangentCrossB = cross(radiusB, tangent);
      const tangentMass = inverseMassA + inverseMassB
        + tangentCrossA * tangentCrossA * inverseInertiaA
        + tangentCrossB * tangentCrossB * inverseInertiaB;
      if (tangentMass <= 0) continue;
      let frictionMagnitude = -dot(newRelative, tangent) / tangentMass / contactCount;
      const frictionLimit = Math.abs(impulseMagnitude) * Math.sqrt(a.friction * b.friction);
      frictionMagnitude = clamp(frictionMagnitude, -frictionLimit, frictionLimit);
      const frictionImpulse = { x: tangent.x * frictionMagnitude, y: tangent.y * frictionMagnitude };
      applyImpulse(a, frictionImpulse, radiusA, -1);
      applyImpulse(b, frictionImpulse, radiusB, 1);

      if (Math.abs(impulseMagnitude) > .12) {
        wake(a);
        wake(b);
      }
    }
  }

  function correctPositions(a, b, manifold) {
    const inverseMassA = a.locked ? 0 : a.invMass;
    const inverseMassB = b.locked ? 0 : b.invMass;
    const inverseMass = inverseMassA + inverseMassB;
    if (inverseMass <= 0) return;
    const correctionSize = Math.max(manifold.penetration - .18, 0) * .68 / inverseMass;
    const correction = { x: manifold.normal.x * correctionSize, y: manifold.normal.y * correctionSize };
    if (!a.isStatic && !a.locked) {
      a.x -= correction.x * inverseMassA;
      a.y -= correction.y * inverseMassA;
    }
    if (!b.isStatic && !b.locked) {
      b.x += correction.x * inverseMassB;
      b.y += correction.y * inverseMassB;
    }
  }

  function markSupport(a, b, manifold) {
    if (manifold.normal.y > .48) {
      a.supported = true;
      a.supportBody = b;
      if (!a.firstContactBody) a.firstContactBody = b;
    }
    if (manifold.normal.y < -.48) {
      b.supported = true;
      b.supportBody = a;
      if (!b.firstContactBody) b.firstContactBody = a;
    }
  }

  function addPlayerLoad(dt) {
    const support = player.support;
    if (!support || support.isStatic || support.locked || support.sleeping || (player.mode !== 'standing' && player.mode !== 'riding')) return;
    const anchor = worldPoint(support, player.localX, -support.height / 2);
    const force = { x: 0, y: PLAYER_LOAD * GRAVITY };
    const radius = { x: anchor.x - support.x, y: anchor.y - support.y };
    support.vy += force.y * support.invMass * dt;
    support.omega += cross(radius, force) * support.invInertia * dt;
  }

  function stabilizeAlignedBody(body) {
    const support = body.supportBody;
    if (body.mode !== 'settled' || !body.preciselyStacked || !body.supported || !support || body.locked) return;
    const centerOffset = Math.abs(body.x - support.x);
    const alignmentLimit = 6;
    const angleOffset = Math.abs(body.angle - support.angle);
    const supportVx = support.isStatic || support.locked ? 0 : support.vx;
    const supportOmega = support.isStatic || support.locked ? 0 : support.omega;
    const relativeVx = body.vx - supportVx;
    const relativeOmega = body.omega - supportOmega;
    const calm = Math.abs(relativeVx) < 12 && Math.abs(relativeOmega) < .34;
    if (centerOffset > alignmentLimit || angleOffset > .055 || !calm) return;
    body.vx = supportVx + relativeVx * .62;
    body.omega = supportOmega + relativeOmega * .56;
    if (Math.abs(body.vx - supportVx) < .12) body.vx = supportVx;
    if (Math.abs(body.omega - supportOmega) < .006) body.omega = supportOmega;
  }

  function physicsStep(dt) {
    const dynamicBodies = blocks.filter((body) => !body.isStatic);
    for (const body of dynamicBodies) {
      body.supported = false;
      body.supportBody = null;
      body.firstContactBody = null;
    }

    addPlayerLoad(dt);
    for (const body of dynamicBodies) {
      if (body.sleeping || body.locked) continue;
      body.vy += GRAVITY * body.gravityScale * dt;
      body.vx *= .992;
      body.vy *= .996;
      body.omega *= .98;
      body.x += body.vx * dt;
      body.y += body.vy * dt;
      body.angle += body.omega * dt;
    }

    for (let iteration = 0; iteration < SOLVER_ITERATIONS; iteration += 1) {
      for (let first = 0; first < blocks.length; first += 1) {
        for (let second = first + 1; second < blocks.length; second += 1) {
          const a = blocks[first];
          const b = blocks[second];
          const manifold = collide(a, b);
          if (!manifold) continue;
          markSupport(a, b, manifold);
          resolveImpulse(a, b, manifold);
        }
      }
    }

    for (let first = 0; first < blocks.length; first += 1) {
      for (let second = first + 1; second < blocks.length; second += 1) {
        const a = blocks[first];
        const b = blocks[second];
        const manifold = collide(a, b);
        if (manifold) correctPositions(a, b, manifold);
      }
    }

    for (const body of dynamicBodies) stabilizeAlignedBody(body);

    for (const body of dynamicBodies) {
      const slow = Math.hypot(body.vx, body.vy) < 14 && Math.abs(body.omega) < .24;
      if (body.supported && slow) {
        body.sleepTime += dt;
        if (body.sleepTime > .28 && body !== activeBlock) {
          body.vx = 0;
          body.vy = 0;
          body.omega = 0;
          body.sleeping = true;
        }
      } else {
        body.sleepTime = 0;
        body.sleeping = false;
      }
    }
  }

  function simulatePhysics(dt) {
    accumulator = Math.min(accumulator + dt, .08);
    while (accumulator >= FIXED_DT) {
      physicsStep(FIXED_DT);
      accumulator -= FIXED_DT;
    }
  }

  function topSurfaceAt(body, worldX) {
    const sine = Math.sin(body.angle);
    const cosine = Math.cos(body.angle);
    if (Math.abs(cosine) < .18) return null;
    const localX = (worldX - body.x - sine * body.height / 2) / cosine;
    if (Math.abs(localX) > body.width / 2 + HIT_EDGE_EPSILON) return null;
    const point = worldPoint(body, localX, -body.height / 2);
    return { x: point.x, y: point.y, localX };
  }

  function blockTop(body) {
    const vertices = bodyVertices(body);
    return Math.min(...vertices.map((point) => point.y));
  }

  function blockBottom(body) {
    const vertices = bodyVertices(body);
    return Math.max(...vertices.map((point) => point.y));
  }

  function attachPlayer(body, localX = 0, mode = 'standing') {
    player.support = body;
    player.localX = clamp(localX, -body.width / 2, body.width / 2);
    player.slideV = 0;
    player.vx = 0;
    player.vy = 0;
    player.omega = 0;
    player.mode = mode;
    syncPlayerToSupport();
  }

  function syncPlayerToSupport() {
    const body = player.support;
    if (!body) return;
    const anchor = worldPoint(body, player.localX, -body.height / 2);
    const topNormal = { x: Math.sin(body.angle), y: -Math.cos(body.angle) };
    player.x = anchor.x + topNormal.x * FOOT;
    player.y = anchor.y + topNormal.y * FOOT;
    player.angle = body.angle;
    const pointVelocity = velocityAt(body, { x: anchor.x - body.x, y: anchor.y - body.y });
    player.vx = pointVelocity.x;
    player.vy = pointVelocity.y;
  }

  function chooseBlockType() {
    const sequenceIndex = BLOCK_SEQUENCE[stackCount % BLOCK_SEQUENCE.length];
    const base = BLOCK_TYPES[sequenceIndex];
    const widthVariance = base.type === 'green' ? 0 : (Math.random() - .5) * 6;
    const height = base.minHeight + Math.random() * (base.maxHeight - base.minHeight);
    return { ...base, width: base.width + widthVariance, height };
  }

  function spawnActiveBlock() {
    if (!player.support || state === 'collapsing' || state === 'gameover') return;
    const shape = chooseBlockType();
    const surface = worldPoint(player.support, clamp(player.localX, -player.support.width / 2, player.support.width / 2), -player.support.height / 2);
    const fromRight = stackCount % 2 === 1;
    const padding = 10;
    const randomRise = MIN_TARGET_RISE + Math.random() * (MAX_TARGET_RISE - MIN_TARGET_RISE);
    const targetRise = clamp(Math.max(randomRise, shape.height + 18), MIN_TARGET_RISE, MAX_TARGET_RISE);
    activeBlock = makeBody({
      x: fromRight ? WORLD_W - shape.width / 2 - padding : shape.width / 2 + padding,
      y: surface.y - targetRise + shape.height / 2,
      width: shape.width,
      height: shape.height,
      color: shape.color,
      edge: shape.edge,
      type: shape.type,
      density: shape.density,
      index: stackCount + 1,
      collisionEnabled: false,
      mode: 'moving',
      friction: shape.type === 'green' ? .42 : shape.type === 'square' ? .52 : .62,
    });
    activeBlock.targetRise = targetRise;
    activeBlock.direction = fromRight ? -1 : 1;
    const speedVariation = (Math.random() - .5) * 44;
    activeBlock.speed = clamp(91 + stackCount * 3.4 + speedVariation, 75, 180);
    activeBlock.minX = shape.width / 2 + padding;
    activeBlock.maxX = WORLD_W - shape.width / 2 - padding;
    spawnTimer = 0;
  }

  function resetWorld() {
    cameraY = 0;
    accumulator = 0;
    bodySerial = 0;
    stackCount = 0;
    jumps = 0;
    perfectCount = 0;
    towerBalance = 100;
    particles = [];
    tapRipples = [];
    fallReason = '';
    unreachableTimer = 0;
    blocks = [makeBody({
      x: WORLD_W / 2,
      y: START_Y,
      width: 220,
      height: 19,
      color: '#f5e942',
      edge: '#c6bd22',
      type: 'base',
      isBase: true,
      isStatic: true,
    })];
    attachPlayer(blocks[0]);
    player.squash = 0;
    player.wing = 0;
    activeBlock = null;
    spawnActiveBlock();
    firstJumpDone = false;
    tapGuide.classList.remove('subtle');
    updateHud();
  }

  function updateHud() {
    stackNode.textContent = stackCount;
    bestStackNode.textContent = Math.max(best, stackCount);
    balanceNode.textContent = Math.max(0, Math.round(towerBalance));
    balanceNode.style.color = towerBalance < 25 ? '#ff8b83' : towerBalance < 50 ? '#ffb75e' : '';
  }

  function showTitle() {
    state = 'title';
    stateTime = 0;
    resetWorld();
    startBest.textContent = best;
    startScreen.classList.remove('hidden');
    gameoverScreen.classList.add('hidden');
    countdown.classList.add('hidden');
    firstTip.classList.add('hidden');
    hud.classList.remove('visible');
    tapGuide.classList.remove('visible', 'ready', 'pulse');
  }

  function startGame() {
    window.GameFullscreen?.enter();
    initAudio();
    state = 'countdown';
    stateTime = 0;
    resetWorld();
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    hud.classList.add('visible');
    tapGuide.classList.add('visible');
    countdown.textContent = 'READY';
    countdown.classList.remove('hidden');
    firstTip.classList.remove('hidden');
    tone(440, .1, 'sine', .025);
  }

  function predictedActiveX() {
    if (!activeBlock || activeBlock.mode !== 'moving') return null;
    const targetY = activeBlock.y - activeBlock.height / 2 - FOOT;
    const a = GRAVITY / 2;
    const b = -JUMP_SPEED;
    const c = player.y - targetY;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return null;
    const landingTime = (-b + Math.sqrt(discriminant)) / (2 * a);
    let x = activeBlock.x;
    let direction = activeBlock.direction;
    let remaining = landingTime;
    while (remaining > 0) {
      const boundary = direction > 0 ? activeBlock.maxX : activeBlock.minX;
      const timeToBoundary = Math.abs(boundary - x) / activeBlock.speed;
      if (timeToBoundary >= remaining) {
        x += direction * activeBlock.speed * remaining;
        break;
      }
      x = boundary;
      remaining -= timeToBoundary;
      direction *= -1;
    }
    return x;
  }

  function landingWindow(extra = 0) {
    const predicted = predictedActiveX();
    if (predicted === null) return false;
    return Math.abs(predicted - player.x) <= activeBlock.width / 2 + HIT_EDGE_EPSILON + extra;
  }

  function handleJump() {
    if (state !== 'playing' || player.mode !== 'standing' || !activeBlock || activeBlock.mode !== 'moving') return;
    initAudio();
    const supportVelocity = player.support
      ? velocityAt(player.support, { x: player.x - player.support.x, y: player.y + FOOT - player.support.y })
      : { x: 0, y: 0 };
    player.mode = 'jumping';
    player.support = null;
    player.vx = 0;
    player.vy = -JUMP_SPEED + Math.min(0, supportVelocity.y);
    player.omega = (Math.random() - .5) * .45;
    player.squash = -.2;
    player.wing = 1;
    jumps += 1;
    tapRipples.push({ x: player.x, y: player.y + FOOT, life: .4, maxLife: .4 });
    dustBurst(player.x, player.y + FOOT, 8);
    if (!firstJumpDone) {
      firstJumpDone = true;
      firstTip.classList.add('hidden');
    }
    tapGuide.classList.add('pulse');
    window.setTimeout(() => tapGuide.classList.remove('pulse'), 120);
    playJump();
  }

  function captureMovingBlock() {
    const caught = activeBlock;
    caught.mode = 'dropping';
    caught.collisionEnabled = true;
    caught.vx = 0;
    caught.vy = 0;
    caught.omega = 0;
    caught.gravityScale = .55;
    caught.dropAge = 0;
    caught.landingAge = 0;
    blocks.push(caught);
    const local = localPoint(caught, { x: player.x, y: caught.y - caught.height / 2 });
    attachPlayer(caught, local.x, 'riding');
    player.squash = .18;
    player.wing = 1;
    starBurst(player.x, blockTop(caught), 10);
    playCatch();
  }

  function findPlayerLanding(previousFoot, foot) {
    let bestLanding = null;
    for (const body of blocks) {
      if (!body.collisionEnabled || body === activeBlock || Math.abs(body.angle) > .78) continue;
      const surface = topSurfaceAt(body, player.x);
      if (!surface) continue;
      if (Math.abs(surface.localX) > body.width / 2 + HIT_EDGE_EPSILON) continue;
      if (previousFoot <= surface.y + 2.5 && foot >= surface.y - 2.5) {
        if (!bestLanding || surface.y < bestLanding.surface.y) bestLanding = { body, surface };
      }
    }
    return bestLanding;
  }

  function landPlayerOnTower(landing) {
    attachPlayer(landing.body, landing.surface.localX, 'standing');
    player.squash = .24;
    dustBurst(player.x, landing.surface.y, 6);
    tone(300, .08, 'triangle', .025);
  }

  function beginCollapse(reason = '塔が崩れた！') {
    if (state === 'collapsing' || state === 'gameover') return;
    state = 'collapsing';
    stateTime = 0;
    fallReason = reason;
    for (const body of blocks) {
      if (body.isStatic) continue;
      body.locked = false;
      body.sleeping = false;
      body.sleepTime = 0;
    }
    player.mode = 'falling';
    player.support = null;
    player.omega += (player.vx >= 0 ? 1 : -1) * 2.8;
    towerBalance = 0;
    updateHud();
    shake = .42;
    playCollapse();
  }

  function activeBlockReachability() {
    if (!activeBlock || activeBlock.mode !== 'moving') {
      return {
        canReach: true,
        horizontal: true,
        vertical: true,
        requiredRise: 0,
        maximumRise: JUMP_SPEED * JUMP_SPEED / (2 * GRAVITY),
      };
    }
    const sweepLeft = activeBlock.minX - activeBlock.width / 2 - HIT_EDGE_EPSILON;
    const sweepRight = activeBlock.maxX + activeBlock.width / 2 + HIT_EDGE_EPSILON;
    const horizontal = player.x >= sweepLeft && player.x <= sweepRight;
    const targetY = activeBlock.y - activeBlock.height / 2 - FOOT;
    const requiredRise = player.y - targetY;
    const supportVelocity = player.support
      ? velocityAt(player.support, { x: player.x - player.support.x, y: player.y + FOOT - player.support.y })
      : { y: 0 };
    const upwardSpeed = JUMP_SPEED - Math.min(0, supportVelocity.y);
    const maximumRise = upwardSpeed * upwardSpeed / (2 * GRAVITY);
    const vertical = requiredRise <= maximumRise + 1;
    return { canReach: horizontal && vertical, horizontal, vertical, requiredRise, maximumRise };
  }

  function activeBlockCanReachPlayer() {
    return activeBlockReachability().canReach;
  }

  function forceUnreachableCollapse() {
    if (state !== 'playing') return;
    const reachability = activeBlockReachability();
    const outward = player.x < WORLD_W / 2 ? -1 : 1;
    const reason = !reachability.vertical
      ? '次のブロックが高すぎて届かない！'
      : '端まで流され、次のブロックへ届かない！';
    beginCollapse(reason);
    player.vx += outward * 42;
    for (const body of blocks) {
      if (body.isStatic) continue;
      const layerForce = 16 + Math.min(22, body.index * 1.8);
      body.vx += outward * layerForce;
      body.omega += outward * (.28 + Math.min(.34, body.index * .025));
    }
  }

  function updateReachability(dt) {
    const shouldCheck = state === 'playing'
      && player.mode === 'standing'
      && activeBlock?.mode === 'moving';
    if (!shouldCheck || activeBlockCanReachPlayer()) {
      unreachableTimer = 0;
      return;
    }
    unreachableTimer += dt;
    if (unreachableTimer >= .2) forceUnreachableCollapse();
  }

  function updateMovingBlock(dt) {
    if (!activeBlock || activeBlock.mode !== 'moving') return;
    activeBlock.x += activeBlock.direction * activeBlock.speed * dt;
    if (activeBlock.x >= activeBlock.maxX) {
      activeBlock.x = activeBlock.maxX;
      activeBlock.direction = -1;
    } else if (activeBlock.x <= activeBlock.minX) {
      activeBlock.x = activeBlock.minX;
      activeBlock.direction = 1;
    }
  }

  function updateJumpingPlayer(dt) {
    const previousFoot = player.y + FOOT;
    player.vy += GRAVITY * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.angle += player.omega * dt;
    player.omega *= Math.pow(.25, dt);
    player.angle += (0 - player.angle) * Math.min(1, dt * 3.2);
    const foot = player.y + FOOT;

    if (player.vy > 0 && activeBlock?.mode === 'moving') {
      const targetTop = activeBlock.y - activeBlock.height / 2;
      const crossedTarget = previousFoot <= targetTop + 2 && foot >= targetTop - 2;
      const feetInside = Math.abs(player.x - activeBlock.x) <= activeBlock.width / 2 + HIT_EDGE_EPSILON;
      if (crossedTarget && feetInside) {
        captureMovingBlock();
        return;
      }
    }

    if (player.vy > 0) {
      const landing = findPlayerLanding(previousFoot, foot);
      if (landing) {
        landPlayerOnTower(landing);
        return;
      }
    }

    if (player.y - cameraY > WORLD_H + 90) beginCollapse('ブロックをつかめなかった！');
  }

  function detachFromSupport(reason) {
    const body = player.support;
    if (body) {
      const anchor = worldPoint(body, player.localX, -body.height / 2);
      const radius = { x: anchor.x - body.x, y: anchor.y - body.y };
      const pointVelocity = velocityAt(body, radius);
      const tangent = bodyAxes(body)[0];
      player.vx = pointVelocity.x + tangent.x * player.slideV;
      player.vy = pointVelocity.y + tangent.y * player.slideV;
      player.omega = body.omega + Math.sign(player.slideV || body.angle || 1) * 1.8;
    }
    beginCollapse(reason);
  }

  function updateSupportedPlayer(dt) {
    const body = player.support;
    if (!body) return;
    if (player.mode === 'standing') {
      const slopeForce = GRAVITY * Math.sin(body.angle);
      const normalForce = GRAVITY * Math.max(0, Math.cos(body.angle));
      const staticLimit = normalForce * .92;
      if (Math.abs(slopeForce) <= staticLimit && Math.abs(player.slideV) < 5) {
        player.slideV = 0;
      } else {
        const frictionDirection = Math.sign(player.slideV || slopeForce);
        player.slideV += (slopeForce - frictionDirection * normalForce * .72) * dt;
      }
      player.localX += player.slideV * dt;
    }

    syncPlayerToSupport();
    const edgeLimit = body.width / 2 + HIT_EDGE_EPSILON;
    if (player.mode === 'standing' && (Math.abs(player.localX) > edgeLimit || Math.abs(body.angle) > .82)) {
      detachFromSupport('足場から滑り落ちた！');
      return;
    }
    if (player.y - cameraY > WORLD_H + 80 || player.x < -70 || player.x > WORLD_W + 70) {
      detachFromSupport('塔ごと崩れ落ちた！');
    }
  }

  function finalizeDroppedBlock() {
    if (!activeBlock || activeBlock.mode !== 'dropping') return;
    const landed = activeBlock;
    const support = landed.supportBody || landed.firstContactBody;
    landed.gravityScale = 1;
    landed.vx *= .16;
    landed.vy *= .12;
    landed.omega *= .18;
    if (support && !support.isStatic) {
      support.vx *= .7;
      support.vy *= .7;
      support.omega *= .7;
    }
    for (const body of blocks) {
      if (body.isStatic || body === landed) continue;
      body.vx *= .3;
      body.vy *= .3;
      body.omega *= .28;
    }
    landed.mode = 'settled';
    stackCount += 1;
    reportScore();
    const settledBodies = blocks.filter((body) => !body.isStatic && body.mode === 'settled');
    const freeLayerCount = stackCount < 15 ? 3 : 4;
    for (let index = 0; index < settledBodies.length; index += 1) {
      const body = settledBodies[index];
      const shouldLock = index < settledBodies.length - freeLayerCount;
      if (shouldLock) {
        body.locked = true;
        body.sleeping = true;
        body.vx = 0;
        body.vy = 0;
        body.omega = 0;
      } else if (body.locked) {
        body.locked = false;
        body.sleeping = false;
        body.sleepTime = 0;
      }
    }
    player.mode = 'standing';
    player.slideV = 0;
    const centerOffset = support ? Math.abs(landed.x - support.x) : landed.width;
    const perfect = Boolean(support) && centerOffset <= 5 && Math.abs(landed.angle - support.angle) < .045;
    landed.preciselyStacked = perfect;
    if (perfect) {
      perfectCount += 1;
      landed.vx = support.isStatic || support.locked ? 0 : support.vx;
      landed.vy = support.isStatic || support.locked ? 0 : support.vy;
      landed.omega = support.isStatic || support.locked ? 0 : support.omega;
    }
    activeBlock = null;
    towerBalance = calculateBalance();
    updateHud();
    shake = perfect ? .13 : .085;
    flash = perfect ? .15 : .06;
    dustBurst(landed.x, blockBottom(landed), 14);
    starBurst(player.x, blockTop(landed), perfect ? 23 : 12);
    playStack(perfect);
    spawnTimer = .7;
  }

  function updateDroppingBlock(dt) {
    if (!activeBlock || activeBlock.mode !== 'dropping') return;
    activeBlock.dropAge += dt;
    if (activeBlock.supported) activeBlock.landingAge += dt;
    else activeBlock.landingAge = 0;
    const manageableImpact = Math.hypot(activeBlock.vx, activeBlock.vy) < 75 && Math.abs(activeBlock.omega) < 2.8;
    if (activeBlock.landingAge > .13 && manageableImpact) finalizeDroppedBlock();
  }

  function calculateBalance() {
    if (state === 'collapsing' || player.mode === 'falling') return 0;
    let score = 100;
    for (const body of blocks) {
      if (body.isStatic || body.y - cameraY > WORLD_H + 40) continue;
      const movementPenalty = Math.min(34, Math.hypot(body.vx, body.vy) * .48 + Math.abs(body.omega) * 17);
      const anglePenalty = Math.min(68, Math.abs(Math.sin(body.angle)) * 88);
      score = Math.min(score, 100 - movementPenalty - anglePenalty);
    }
    if (player.support) {
      const edgeRatio = Math.abs(player.localX) / Math.max(1, player.support.width / 2);
      score -= Math.max(0, edgeRatio - .55) * 42;
    }
    return clamp(score, 0, 100);
  }

  function updateFallingPlayer(dt) {
    player.vy += GRAVITY * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.angle += player.omega * dt;
    if (stateTime > 1.35 || player.y - cameraY > WORLD_H + 110) showGameOver();
  }

  function showGameOver() {
    if (state === 'gameover') return;
    state = 'gameover';
    stateTime = 0;
    tapGuide.classList.remove('visible', 'ready');
    firstTip.classList.add('hidden');
    const isNewBest = stackCount > best;
    if (isNewBest) {
      best = stackCount;
      saveBest(best);
    }
    finalStack.textContent = stackCount;
    finalJumps.textContent = jumps;
    finalPerfect.textContent = perfectCount;
    newBest.classList.toggle('hidden', !isNewBest || stackCount === 0);
    bestStackNode.textContent = best;
    reportScore(true);
    window.setTimeout(() => gameoverScreen.classList.remove('hidden'), 260);
  }

  function dustBurst(x, y, count) {
    for (let index = 0; index < count; index += 1) {
      particles.push({
        type: 'dust', x: x + (Math.random() - .5) * 34, y: y - 2,
        vx: (Math.random() - .5) * 85, vy: -20 - Math.random() * 42,
        life: .46, maxLife: .46, size: 1.5 + Math.random() * 3, color: '#fff0c5',
      });
    }
  }

  function starBurst(x, y, count) {
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * TAU;
      const speed = 42 + Math.random() * 105;
      particles.push({
        type: 'star', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 35,
        life: .68 + Math.random() * .3, maxLife: .98, size: 1.8 + Math.random() * 2.8,
        color: index % 3 === 0 ? '#ff9b50' : index % 3 === 1 ? '#fff7dc' : '#ffd75a',
      });
    }
  }

  function updateEffects(dt) {
    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += (particle.type === 'dust' ? 45 : 85) * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);
    for (const ripple of tapRipples) ripple.life -= dt;
    tapRipples = tapRipples.filter((ripple) => ripple.life > 0);
  }

  function update(dt) {
    elapsed += dt;
    stateTime += dt;
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt);
    player.squash += (0 - player.squash) * Math.min(1, dt * 11);
    player.wing += (0 - player.wing) * Math.min(1, dt * 3.6);

    if (state === 'title') {
      updateMovingBlock(dt * .72);
      attachPlayer(blocks[0]);
      player.y += Math.sin(elapsed * 2.2) * 3;
      player.angle = Math.sin(elapsed * 1.5) * .045;
    }

    if (state === 'countdown') {
      updateMovingBlock(dt);
      if (stateTime > .42 && stateTime < .8) countdown.textContent = 'STACK!';
      if (stateTime >= .88) {
        state = 'playing';
        stateTime = 0;
        countdown.classList.add('hidden');
      }
    }

    if (state === 'playing') {
      updateMovingBlock(dt);
      simulatePhysics(dt);
      if (player.mode === 'jumping') updateJumpingPlayer(dt);
      else if (player.mode === 'standing' || player.mode === 'riding') updateSupportedPlayer(dt);
      updateDroppingBlock(dt);

      if (!activeBlock && player.mode === 'standing') {
        spawnTimer -= dt;
        if (spawnTimer <= 0) spawnActiveBlock();
      }

      updateReachability(dt);

      towerBalance += (calculateBalance() - towerBalance) * Math.min(1, dt * 5);
      updateHud();
      const towerTopY = player.y - FOOT;
      if (towerTopY - cameraY < 470) {
        const targetCamera = towerTopY - 470;
        cameraY += (targetCamera - cameraY) * Math.min(1, dt * 3.8);
      }
    }

    if (state === 'collapsing') {
      updateMovingBlock(dt);
      simulatePhysics(dt);
      updateFallingPlayer(dt);
    }

    tapGuide.classList.toggle('ready', state === 'playing' && player.mode === 'standing' && landingWindow());
    tapGuide.classList.toggle('subtle', stackCount >= 1);
    updateEffects(dt);
  }

  function ellipse(x, y, rx, ry, color, rotation = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, TAU);
    ctx.fill();
  }

  function drawBackground() {
    const altitudeTint = clamp(-cameraY / 1100, 0, 1);
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, altitudeTint > .6 ? '#080d2d' : '#13183d');
    sky.addColorStop(.54, altitudeTint > .75 ? '#181945' : '#383363');
    sky.addColorStop(1, '#9b5f6c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const glowY = 148 - cameraY * .035;
    const glow = ctx.createRadialGradient(310, glowY, 5, 310, glowY, 120);
    glow.addColorStop(0, 'rgba(255,231,165,.18)');
    glow.addColorStop(1, 'rgba(255,231,165,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(180, glowY - 130, 260, 260);

    for (const star of stars) {
      const y = ((star.y - cameraY * star.depth) % 880 + 880) % 880 - 70;
      ctx.globalAlpha = .38 + Math.sin(elapsed * 2 + star.phase) * .2;
      ctx.fillStyle = star.r > 1.25 ? '#ffe68a' : '#fff8dc';
      ctx.beginPath();
      ctx.arc(star.x, y, star.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(310, glowY);
    ctx.fillStyle = '#ffe9ab';
    ctx.shadowColor = '#ffe19166';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(0, 0, 32, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ellipse(-10, -8, 5, 5, '#b68b6b2e');
    ellipse(12, 7, 6, 6, '#b68b6b2e');
    ctx.restore();

    const mountainOffset = clamp(-cameraY * .18, 0, 230);
    drawMountainLayer(555 + mountainOffset, '#51436c', 78, .2);
    drawMountainLayer(610 + mountainOffset * 1.25, '#303451', 96, .34);

    const vignette = ctx.createRadialGradient(WORLD_W / 2, WORLD_H * .43, 135, WORLD_W / 2, WORLD_H * .46, 430);
    vignette.addColorStop(0, 'rgba(3,6,24,0)');
    vignette.addColorStop(1, 'rgba(3,6,24,.48)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    if (state === 'title') {
      ctx.fillStyle = 'rgba(7,10,35,.22)';
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
  }

  function drawMountainLayer(baseY, color, amplitude, drift) {
    const segment = 104;
    const shift = ((-cameraY * drift) % segment + segment) % segment;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-segment, WORLD_H);
    ctx.lineTo(-segment, baseY);
    for (let x = -segment - shift; x <= WORLD_W + segment; x += segment) {
      const variant = (Math.floor((x + shift) / segment) % 3 + 3) % 3;
      ctx.lineTo(x + segment * .5, baseY - amplitude * (.78 + variant * .09));
      ctx.lineTo(x + segment, baseY + 7);
    }
    ctx.lineTo(WORLD_W + segment, WORLD_H);
    ctx.closePath();
    ctx.fill();
  }

  function drawBlockShape(body, options = {}) {
    const { alpha = 1, glow = false, label = '', screenSpace = false } = options;
    const y = body.y - (screenSpace ? 0 : cameraY);
    if (y < -100 || y > WORLD_H + 110) return;
    const halfW = body.width / 2;
    const halfH = body.height / 2;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(body.x, y);
    ctx.rotate(body.angle || 0);

    if (body.isBase || body.type === 'base') {
      ctx.shadowColor = '#111c50aa';
      ctx.shadowBlur = 11;
      ctx.shadowOffsetY = 7;
      ctx.fillStyle = body.edge || '#c6bd22';
      ctx.beginPath();
      roundedRect(-halfW - 2, -halfH - 1, body.width + 4, body.height + 3, halfH + 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = body.color;
      ctx.beginPath();
      roundedRect(-halfW, -halfH, body.width, body.height, halfH);
      ctx.fill();
      for (const offset of [-25, 0, 25]) {
        ellipse(offset, 0, 6, 5, '#253b79');
        ellipse(offset - 1, -1, 2.4, 2, '#ffffff55');
      }
    } else {
      ctx.shadowColor = glow ? '#fff0a899' : '#101b4c99';
      ctx.shadowBlur = glow ? 20 : 10;
      ctx.shadowOffsetY = glow ? 0 : 7;
      ctx.fillStyle = body.edge;
      ctx.beginPath();
      roundedRect(-halfW - 1.5, -halfH - 1, body.width + 3, body.height + 3, 4);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillStyle = body.color;
      ctx.beginPath();
      roundedRect(-halfW, -halfH, body.width, body.height, 3);
      ctx.fill();
      ctx.fillStyle = '#ffffff38';
      ctx.beginPath();
      roundedRect(-halfW + 4, -halfH + 3, Math.max(7, body.width - 8), 4, 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff22';
      const moteCount = body.type === 'green' ? 2 : 3;
      for (let index = 0; index < moteCount; index += 1) {
        const moteX = -halfW + body.width * (index + 1) / (moteCount + 1);
        ctx.beginPath();
        ctx.arc(moteX, Math.min(halfH - 5, 6), 1.6, 0, TAU);
        ctx.fill();
      }
    }

    if (label) {
      ctx.fillStyle = '#ffe783';
      ctx.font = '900 9px Avenir Next, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, -halfH - 12);
    }
    ctx.restore();
  }

  function drawTitleDecorations() {
    const decorations = [
      { ...BLOCK_TYPES[0], x: 334, y: 123, width: 92, height: 38, angle: -.12 },
      { ...BLOCK_TYPES[1], x: 58, y: 248, width: 70, height: 40, angle: .16 },
      { ...BLOCK_TYPES[3], x: 342, y: 368, width: 88, height: 22, angle: -.14 },
      { ...BLOCK_TYPES[4], x: 342, y: 617, width: 64, height: 62, angle: -.1 },
    ];
    for (const item of decorations) drawBlockShape(item, { alpha: .94, screenSpace: true });
  }

  function drawTower() {
    for (const body of blocks) drawBlockShape(body);
  }

  function drawActiveBlock() {
    if (state === 'title' || !activeBlock || activeBlock.mode !== 'moving') return;
    drawBlockShape(activeBlock, { glow: landingWindow() });
  }

  function drawJumpGuide() {
    if (state !== 'playing' || stackCount > 0 || !activeBlock || activeBlock.mode !== 'moving' || player.mode !== 'standing') return;
    const predicted = predictedActiveX();
    if (predicted === null) return;
    ctx.save();
    ctx.globalAlpha = landingWindow() ? .55 : .16;
    ctx.strokeStyle = landingWindow() ? '#ffe783' : '#fff7dc';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 8]);
    ctx.beginPath();
    ctx.moveTo(player.x, activeBlock.y - activeBlock.height / 2 - cameraY + 12);
    ctx.lineTo(player.x, player.y - cameraY - 35);
    ctx.stroke();
    ctx.restore();
  }

  function drawTapRipples() {
    for (const ripple of tapRipples) {
      const progress = 1 - ripple.life / ripple.maxLife;
      ctx.save();
      ctx.globalAlpha = (1 - progress) * .68;
      ctx.strokeStyle = '#ffe783';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(ripple.x, ripple.y - cameraY, 18 + progress * 30, 6 + progress * 8, 0, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawPlayer() {
    const screenY = player.y - cameraY;
    ctx.save();
    ctx.translate(player.x, screenY);
    ctx.rotate(player.angle);
    ctx.scale(PLAYER_SCALE * (1 + player.squash * .22), PLAYER_SCALE * (1 - player.squash * .2));
    const bob = state === 'title' ? Math.sin(elapsed * 12) * .6 : 0;
    const wingLift = player.wing * 4;

    ctx.save();
    ctx.translate(-13, 6 + bob);
    ctx.rotate(-.46 - wingLift * .025);
    ellipse(-18, 5, 29, 14, '#965f48', .18);
    ellipse(-20, 1, 21, 7, '#d48d60', .18);
    ctx.restore();
    ellipse(0, 5 + bob, 21, 25, '#c47b52', -.04);
    ellipse(4, 9 + bob, 13, 18, '#efbb76', .08);
    ctx.save();
    ctx.translate(5, 1 + bob);
    ctx.rotate(.22 + wingLift * .045);
    ellipse(17, 4, 22, 9, '#b66d4c', -.08);
    ellipse(17, 2, 15, 4.5, '#e9aa69', -.08);
    ctx.restore();
    ellipse(5, -17 + bob, 18, 18, '#bd714e');
    ctx.fillStyle = '#d98a59';
    ctx.beginPath();
    ctx.moveTo(-8, -28 + bob); ctx.lineTo(-5, -42 + bob); ctx.lineTo(3, -29 + bob);
    ctx.moveTo(12, -31 + bob); ctx.lineTo(21, -42 + bob); ctx.lineTo(21, -24 + bob);
    ctx.fill();
    ctx.fillStyle = '#704338';
    ctx.beginPath();
    ctx.moveTo(-4, -29 + bob); ctx.lineTo(-3, -37 + bob); ctx.lineTo(1, -30 + bob);
    ctx.moveTo(15, -31 + bob); ctx.lineTo(19, -37 + bob); ctx.lineTo(19, -26 + bob);
    ctx.fill();
    ellipse(10, -13 + bob, 11, 10, '#ffcc7b', .13);
    ellipse(10, -20 + bob, 3.2, 3.2, '#17162a');
    ellipse(11, -21 + bob, 1.05, 1.05, '#fff8d9');
    ellipse(22, -12 + bob, 3, 3, '#382133');
    ellipse(0, -32 + bob, 18, 5, '#6f412f', -.08);
    ctx.fillStyle = '#e7ae4e';
    ctx.beginPath();
    ctx.moveTo(-12, -33 + bob);
    ctx.quadraticCurveTo(0, -50 + bob, 15, -34 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9e623d';
    ctx.lineWidth = 2;
    ctx.stroke();
    ellipse(-8, 30 + bob, 8, 4.5, '#714432', -.08);
    ellipse(9, 30 + bob, 8, 4.5, '#714432', .08);
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of particles) {
      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y - cameraY);
      ctx.fillStyle = particle.color;
      if (particle.type === 'star') {
        ctx.rotate(elapsed * 5 + particle.x);
        const size = particle.size;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.8); ctx.lineTo(size * .45, -size * .45); ctx.lineTo(size * 1.8, 0);
        ctx.lineTo(size * .45, size * .45); ctx.lineTo(0, size * 1.8); ctx.lineTo(-size * .45, size * .45);
        ctx.lineTo(-size * 1.8, 0); ctx.lineTo(-size * .45, -size * .45); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * alpha, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function render() {
    const rect = card.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    worldTransform();
    if (shake > 0) ctx.translate((Math.random() - .5) * shake * 17, (Math.random() - .5) * shake * 17);
    drawBackground();
    if (state === 'title') drawTitleDecorations();
    drawJumpGuide();
    drawTower();
    drawActiveBlock();
    drawTapRipples();
    drawParticles();
    drawPlayer();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,241,190,${flash * 1.8})`;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min(.033, (now - lastTime) / 1000 || 0);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  function runBalanceBenchmark(runCount = 24, timingSigma = 12, stackLimit = 40) {
    let randomState = 0x5f3759df;
    const random = () => {
      randomState = (randomState * 1664525 + 1013904223) >>> 0;
      return (randomState + 1) / 4294967297;
    };
    const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, random()))) * Math.cos(TAU * random());
    const results = [];
    const failures = [];
    const previousSound = soundEnabled;
    soundEnabled = false;

    for (let run = 0; run < runCount; run += 1) {
      resetWorld();
      state = 'playing';
      stateTime = 0;
      let attemptKey = '';
      let targetError = 0;
      let simulatedTime = 0;

      while (state !== 'gameover' && stackCount < stackLimit && simulatedTime < 210) {
        if (player.mode === 'standing' && activeBlock?.mode === 'moving') {
          const key = `${activeBlock.id}:${jumps}`;
          if (key !== attemptKey) {
            attemptKey = key;
            targetError = clamp(gaussian() * timingSigma, -timingSigma * 2.4, timingSigma * 2.4);
          }
          const predictedError = predictedActiveX() - player.x - targetError;
          if (Math.abs(predictedError) < 1.15) handleJump();
        }
        update(1 / 120);
        simulatedTime += 1 / 120;
      }
      results.push(stackCount);
      failures.push({
        stack: stackCount,
        reason: fallReason,
        playerX: Number(player.x.toFixed(1)),
        bodies: blocks.slice(-5).map((body) => ({
          type: body.type,
          x: Number(body.x.toFixed(1)),
          y: Number(body.y.toFixed(1)),
          angle: Number(body.angle.toFixed(2)),
          supported: body.supported,
        })),
      });
    }

    soundEnabled = previousSound;
    const average = results.reduce((sum, value) => sum + value, 0) / Math.max(1, results.length);
    const sorted = [...results].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    showTitle();
    return {
      runs: results.length,
      timingSigma,
      average: Number(average.toFixed(2)),
      median,
      minimum: Math.min(...results),
      maximum: Math.max(...results),
      results,
      failures,
    };
  }

  startButton.addEventListener('click', (event) => { event.stopPropagation(); startGame(); });
  retryButton.addEventListener('click', (event) => { event.stopPropagation(); startGame(); });
  homeButton.addEventListener('click', (event) => { event.stopPropagation(); showTitle(); });
  soundButton.addEventListener('click', (event) => {
    event.stopPropagation();
    soundEnabled = !soundEnabled;
    soundButton.classList.toggle('muted', !soundEnabled);
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.setAttribute('aria-label', soundEnabled ? '音をオフにする' : '音をオンにする');
    if (soundEnabled) { initAudio(); tone(600, .1, 'sine', .035); }
  });

  card.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    event.preventDefault();
    handleJump();
  });

  window.addEventListener('keydown', (event) => {
    if (['Space', 'Enter', 'ArrowUp'].includes(event.code)) event.preventDefault();
    if (state === 'title' && ['Space', 'Enter'].includes(event.code)) { startGame(); return; }
    if (state === 'gameover' && ['Space', 'Enter'].includes(event.code)) { startGame(); return; }
    if (event.code === 'Space' || event.code === 'ArrowUp') handleJump();
  });

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { lastTime = performance.now(); accumulator = 0; });

  window.__hoshikuzuTower = {
    start: startGame,
    jump: handleJump,
    benchmark: runBalanceBenchmark,
    snapshot: () => ({
      state,
      stack: stackCount,
      balance: Math.round(towerBalance),
      jumps,
      perfect: perfectCount,
      fallReason,
      player: {
        x: Number(player.x.toFixed(1)), y: Number(player.y.toFixed(1)),
        vx: Number(player.vx.toFixed(1)), vy: Number(player.vy.toFixed(1)),
        mode: player.mode, localX: Number(player.localX.toFixed(1)),
      },
      active: activeBlock ? {
        type: activeBlock.type,
        x: Number(activeBlock.x.toFixed(1)), y: Number(activeBlock.y.toFixed(1)),
        width: Number(activeBlock.width.toFixed(1)), height: Number(activeBlock.height.toFixed(1)),
        speed: Number((activeBlock.speed || 0).toFixed(1)),
        targetRise: Number((activeBlock.targetRise || 0).toFixed(1)),
        direction: activeBlock.direction || 0,
        angle: Number(activeBlock.angle.toFixed(3)), mode: activeBlock.mode,
        landingWindow: landingWindow(), predictedX: Number((predictedActiveX() || 0).toFixed(1)),
        canReachPlayer: activeBlockCanReachPlayer(),
        reachability: (() => {
          const reachability = activeBlockReachability();
          return {
            horizontal: reachability.horizontal,
            vertical: reachability.vertical,
            requiredRise: Number(reachability.requiredRise.toFixed(1)),
            maximumRise: Number(reachability.maximumRise.toFixed(1)),
          };
        })(),
      } : null,
      bodies: blocks.map((body) => ({
        id: body.id, type: body.type, x: Number(body.x.toFixed(1)), y: Number(body.y.toFixed(1)),
        width: Number(body.width.toFixed(1)), height: Number(body.height.toFixed(1)),
        angle: Number(body.angle.toFixed(3)), vx: Number(body.vx.toFixed(1)), vy: Number(body.vy.toFixed(1)),
        omega: Number(body.omega.toFixed(3)), supported: body.supported, sleeping: body.sleeping,
        locked: body.locked,
      })),
    }),
  };

  resize();
  showTitle();
  requestAnimationFrame(loop);
  if (new URLSearchParams(window.location.search).has('playtest')) window.setTimeout(startGame, 80);
})();
