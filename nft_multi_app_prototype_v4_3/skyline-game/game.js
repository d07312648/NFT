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
  const scoreNode = document.getElementById('score');
  const bestScoreNode = document.getElementById('bestScore');
  const comboNode = document.getElementById('combo');
  const startBest = document.getElementById('startBest');
  const countdown = document.getElementById('countdown');
  const controls = document.getElementById('controls');
  const leftControl = document.getElementById('leftControl');
  const rightControl = document.getElementById('rightControl');
  const attitudeNeedle = document.querySelector('#attitude i');
  const finalScore = document.getElementById('finalScore');
  const finalLandings = document.getElementById('finalLandings');
  const finalCombo = document.getElementById('finalCombo');
  const newBest = document.getElementById('newBest');

  const WORLD_W = 390;
  const WORLD_H = 720;
  const TAU = Math.PI * 2;
  const START_Y = 646;
  const PLAYER_SCALE = .85;
  const FOOT = 29;
  const BAR_HALF = 8;
  const GRAVITY = 470;
  const BOUNCE_SPEED = 470;
  const MIN_UPWARD_BOUNCE = .24;
  const MAX_HORIZONTAL_SPEED = 470;
  const SIDE_FALL_MARGIN = 42;
  const VERTICAL_GAP_BONUS = 42;
  const STORAGE_KEY = 'skyline-music-fest-bounce-best-score';
  const BAR_COLORS = ['#2858d7', '#d82bb4', '#ec4054', '#31a461', '#c8db2f', '#efa62d'];
  const DISTANCE_PROFILES = [
    { min: 155, max: 180, heightScale: .92 },
    { min: 190, max: 220, heightScale: .86 },
    { min: 230, max: 255, heightScale: .78 },
  ];
  const COURSE = [
    { gap: 112, angle: -.15, width: 144 },
    { gap: 118, angle: .17, width: 140 },
    { gap: 110, angle: -.14, width: 146 },
    { gap: 122, angle: .16, width: 138 },
    { gap: 108, angle: -.13, width: 148 },
    { gap: 120, angle: .15, width: 136 },
    { gap: 112, angle: -.17, width: 144 },
    { gap: 124, angle: .14, width: 140 },
    { gap: 110, angle: -.15, width: 134 },
    { gap: 118, angle: .13, width: 148 },
    { gap: 110, angle: -.16, width: 142 },
    { gap: 122, angle: .17, width: 140 },
  ];

  let state = 'title';
  let stateTime = 0;
  let elapsed = 0;
  let lastTime = 0;
  let cameraY = 0;
  let score = 0;
  let height = 0;
  let maxHeight = 0;
  let landings = 0;
  let combo = 0;
  let maxCombo = 0;
  let best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  let platformSerial = 0;
  let platforms = [];
  const touchedPlatformIds = new Set();
  let currentPlatform = null;
  let particles = [];
  let trails = [];
  let shake = 0;
  let flash = 0;
  let soundEnabled = true;
  let audioContext = null;
  let keyLeft = false;
  let keyRight = false;
  const pointerInputs = new Map();

  function reportScore(final = false) {
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'skyline-fest-game-score', score, final }, '*');
  }

  const player = {
    x: WORLD_W / 2,
    y: START_Y - FOOT,
    vx: 0,
    vy: 0,
    angle: 0,
    omega: 0,
    squash: 0,
    wing: 0,
  };

  const stars = Array.from({ length: 76 }, (_, index) => ({
    x: (index * 83.17 + 23) % WORLD_W,
    y: (index * 47.31 + 41) % 860 - 70,
    r: .55 + (index % 7) * .16,
    phase: index * .67,
    depth: .025 + (index % 5) * .018,
  }));

  startBest.textContent = best;

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

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }

  function normalizeAngle(angle) {
    let result = angle % TAU;
    if (result > Math.PI) result -= TAU;
    if (result < -Math.PI) result += TAU;
    return result;
  }

  function initAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext?.state === 'suspended') audioContext.resume();
  }

  function tone(frequency, duration, type = 'sine', volume = .035, delay = 0) {
    if (!soundEnabled || !audioContext) return;
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

  function playBounce(perfect) {
    tone(perfect ? 610 : 440, .11, 'triangle', .045);
    tone(perfect ? 920 : 650, .18, 'sine', .03, .055);
    if (perfect) tone(1240, .22, 'sine', .022, .13);
  }

  function playCrash() {
    tone(145, .27, 'sawtooth', .04);
    tone(82, .36, 'square', .018, .06);
  }

  function playBump() {
    tone(205, .09, 'square', .025);
    tone(150, .13, 'triangle', .02, .035);
  }

  function makePlatform(x, y, width, isStart = false, angle = 0, color = BAR_COLORS[0]) {
    platformSerial += 1;
    return { id: platformSerial, x, y, width, isStart, reached: isStart, angle, color };
  }

  function highestPlatform() {
    return platforms.reduce((highest, platform) => platform.y < highest.y ? platform : highest, platforms[0]);
  }

  function generatePlatforms() {
    if (!platforms.length) return;
    let top = highestPlatform();
    while (top.y > cameraY - 460) {
      const courseIndex = platformSerial - 1;
      const pattern = COURSE[courseIndex % COURSE.length];
      const cycle = Math.floor(courseIndex / COURSE.length);
      const width = Math.max(132, pattern.width - Math.min(8, cycle * 1.5));
      // Randomize the distance from the previous bar, not an unrelated screen
      // position. Farther jumps also rise less, keeping every result reachable.
      const profile = courseIndex === 0
        ? DISTANCE_PROFILES[0]
        : DISTANCE_PROFILES[Math.floor(Math.random() * DISTANCE_PROFILES.length)];
      const distance = courseIndex === 0
        ? 155
        : profile.min + Math.random() * (profile.max - profile.min);
      const targetRight = courseIndex % 2 === 0;
      const rawX = top.x + (targetRight ? distance : -distance);
      const sideMin = targetRight ? WORLD_W * .60 : width / 2 - 12;
      const sideMax = targetRight ? WORLD_W - width / 2 + 12 : WORLD_W * .40;
      const x = clamp(rawX, sideMin, sideMax);
      const verticalGap = (pattern.gap + VERTICAL_GAP_BONUS) * profile.heightScale;
      const angle = pattern.angle;
      const color = BAR_COLORS[(courseIndex + Math.floor(courseIndex / 3)) % BAR_COLORS.length];
      top = makePlatform(x, top.y - verticalGap, width, false, angle, color);
      platforms.push(top);
    }
  }

  function placePlayerOnPlatform(platform, alignToPlatform = false) {
    if (alignToPlatform) player.angle = platform.angle;
    const distance = BAR_HALF + FOOT;
    player.x = platform.x + Math.sin(platform.angle) * distance;
    player.y = platform.y - Math.cos(platform.angle) * distance;
  }

  function resetWorld() {
    platformSerial = 0;
    touchedPlatformIds.clear();
    cameraY = 0;
    const start = makePlatform(WORLD_W / 2, START_Y, 164, true, .14, BAR_COLORS[0]);
    platforms = [start];
    currentPlatform = start;
    particles = [];
    trails = [];
    placePlayerOnPlatform(start);
    player.vx = 0;
    player.vy = 0;
    player.angle = 0;
    player.omega = 0;
    player.squash = 0;
    player.wing = 0;
    generatePlatforms();
  }

  function clearInput() {
    pointerInputs.clear();
    keyLeft = false;
    keyRight = false;
    updateControlClasses();
  }

  function inputDirection() {
    const pointerTotal = [...pointerInputs.values()].reduce((sum, value) => sum + value, 0);
    return clamp(pointerTotal + (keyLeft ? -1 : 0) + (keyRight ? 1 : 0), -1, 1);
  }

  function updateControlClasses() {
    const direction = inputDirection();
    leftControl.classList.toggle('active', direction < 0);
    rightControl.classList.toggle('active', direction > 0);
  }

  function updateHud() {
    scoreNode.textContent = score;
    bestScoreNode.textContent = Math.max(best, score);
    comboNode.textContent = combo;
  }

  function showTitle() {
    state = 'title';
    stateTime = 0;
    score = 0;
    height = 0;
    maxHeight = 0;
    landings = 0;
    combo = 0;
    maxCombo = 0;
    clearInput();
    resetWorld();
    startBest.textContent = best;
    startScreen.classList.remove('hidden');
    gameoverScreen.classList.add('hidden');
    countdown.classList.add('hidden');
    hud.classList.remove('visible');
    controls.classList.remove('visible');
  }

  function startGame() {
    window.GameFullscreen?.enter();
    initAudio();
    score = 0;
    height = 0;
    maxHeight = 0;
    landings = 0;
    combo = 0;
    maxCombo = 0;
    stateTime = 0;
    clearInput();
    resetWorld();
    state = 'countdown';
    updateHud();
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    hud.classList.add('visible');
    controls.classList.add('visible');
    countdown.textContent = 'READY';
    countdown.classList.remove('hidden');
    tone(440, .1, 'sine', .025);
  }

  function launchPlayer() {
    state = 'playing';
    stateTime = 0;
    countdown.classList.add('hidden');
    placePlayerOnPlatform(currentPlatform, true);
    const speed = BOUNCE_SPEED + clamp(maxHeight * .045, 0, 12);
    applyAngleBounce(speed);
    player.omega += .18;
    player.wing = 1;
    player.squash = -.15;
    playBounce(false);
    dustBurst(player.x, currentPlatform.y, 9);
  }

  function playerPoint(localX, localY, x = player.x, y = player.y, angle = player.angle) {
    return {
      x: x + Math.cos(angle) * localX - Math.sin(angle) * localY,
      y: y + Math.sin(angle) * localX + Math.cos(angle) * localY,
    };
  }

  function footPositions(x = player.x, y = player.y, angle = player.angle) {
    return [
      playerPoint(-7, FOOT, x, y, angle),
      playerPoint(7, FOOT, x, y, angle),
    ];
  }

  function upperCollisionPositions(x = player.x, y = player.y, angle = player.angle) {
    return [
      playerPoint(-6, -25, x, y, angle),
      playerPoint(6, -25, x, y, angle),
      playerPoint(0, -11, x, y, angle),
    ];
  }

  function platformLocalPoint(platform, point) {
    const dx = point.x - platform.x;
    const dy = point.y - platform.y;
    return {
      x: Math.cos(platform.angle) * dx + Math.sin(platform.angle) * dy,
      y: -Math.sin(platform.angle) * dx + Math.cos(platform.angle) * dy,
    };
  }

  function registerPlatformTouch(platform) {
    if (platform.isStart || touchedPlatformIds.has(platform.id)) return;
    touchedPlatformIds.add(platform.id);
    score = touchedPlatformIds.size;
    updateHud();
    reportScore();
    tone(880, .12, 'sine', .025);
  }

  // The character's posture is the launch vector: leaning farther sends Momo
  // farther sideways. Even an extreme/inverted posture keeps a small upward
  // component so touching a bar never counts as a failure by itself.
  function applyAngleBounce(speed) {
    const launchAngle = normalizeAngle(player.angle);
    const horizontal = Math.sin(launchAngle);
    const upward = Math.max(MIN_UPWARD_BOUNCE, Math.abs(Math.cos(launchAngle)));
    player.vx = horizontal * speed;
    player.vy = -upward * speed;
  }

  function handleLanding(platform, angleError, landingFoot) {
    const degrees = Math.round(angleError * 180 / Math.PI);
    const perfect = degrees <= 12;
    const good = degrees <= 35;
    const isNewPlatform = platform.id !== currentPlatform.id && platform.y < currentPlatform.y - 3;

    const footLocal = platformLocalPoint(platform, landingFoot);
    const correction = -BAR_HALF - footLocal.y - .5;
    player.x += -Math.sin(platform.angle) * correction;
    player.y += Math.cos(platform.angle) * correction;
    const speed = BOUNCE_SPEED + clamp(maxHeight * .045, 0, 12);
    applyAngleBounce(speed);
    player.squash = .3;
    player.wing = 1;
    registerPlatformTouch(platform);

    const relativeAngle = normalizeAngle(player.angle - platform.angle);
    if (perfect) {
      player.angle = platform.angle + relativeAngle * .08;
      player.omega *= .12;
      flash = .16;
      shake = .08;
    } else if (good) {
      player.angle = platform.angle + relativeAngle * .35;
      player.omega *= .3;
    } else {
      player.angle = platform.angle + relativeAngle * .55;
      player.omega *= -.28;
    }

    if (isNewPlatform) {
      currentPlatform = platform;
      platform.reached = true;
      landings += 1;
      combo = perfect ? combo + 1 : Math.max(1, combo);
      if (!good) combo = 0;
      maxCombo = Math.max(maxCombo, combo);
    } else {
      combo = 0;
    }

    player.omega += (Math.random() * 2 - 1) * (.3 + Math.min(.3, landings * .012));
    playBounce(perfect);
    starBurst(player.x, platform.y - 4, perfect ? 25 : 13);
    updateHud();
  }

  function handleUndersideHit(platform, hitPoint, normalSpeed) {
    const local = platformLocalPoint(platform, hitPoint);
    const correction = BAR_HALF - local.y + .75;
    player.x += -Math.sin(platform.angle) * correction;
    player.y += Math.cos(platform.angle) * correction;

    const tangentSpeed = Math.cos(platform.angle) * player.vx + Math.sin(platform.angle) * player.vy;
    const reboundSpeed = clamp(Math.abs(normalSpeed) * .46, 115, 220);
    player.vx = Math.cos(platform.angle) * tangentSpeed * .78 - Math.sin(platform.angle) * reboundSpeed;
    player.vy = Math.sin(platform.angle) * tangentSpeed * .78 + Math.cos(platform.angle) * reboundSpeed;
    player.omega += clamp(local.x / (platform.width / 2), -1, 1) * 1.15;
    player.squash = -.18;
    shake = Math.max(shake, .12);
    registerPlatformTouch(platform);
    playBump();
    dustBurst(hitPoint.x, hitPoint.y, 5);
  }

  function beginCrash() {
    if (state !== 'playing') return;
    state = 'crashing';
    stateTime = 0;
    combo = 0;
    player.vy = Math.min(player.vy, -105);
    player.omega += player.angle >= 0 ? 2.2 : -2.2;
    shake = .35;
    playCrash();
    updateHud();
  }

  function showGameOver() {
    state = 'gameover';
    stateTime = 0;
    clearInput();
    controls.classList.remove('visible');
    countdown.classList.add('hidden');
    const isNewBest = score > best;
    if (isNewBest) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
    }
    finalScore.textContent = score;
    finalLandings.textContent = score;
    finalCombo.textContent = maxCombo;
    newBest.classList.toggle('hidden', !isNewBest || score === 0);
    bestScoreNode.textContent = best;
    reportScore(true);
    window.setTimeout(() => gameoverScreen.classList.remove('hidden'), 260);
  }

  function dustBurst(x, y, count) {
    for (let index = 0; index < count; index += 1) {
      particles.push({
        type: 'dust', x: x + (Math.random() - .5) * 30, y: y - 4,
        vx: (Math.random() - .5) * 75, vy: -20 - Math.random() * 38,
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

  function updateParticles(dt) {
    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += (particle.type === 'dust' ? 40 : 85) * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);
    for (const trail of trails) trail.life -= dt;
    trails = trails.filter((trail) => trail.life > 0);
  }

  function checkPlatformCollision(previousX, previousY, previousAngle) {
    const previousFeet = footPositions(previousX, previousY, previousAngle);
    const feet = footPositions();
    const previousUpperPoints = upperCollisionPositions(previousX, previousY, previousAngle);
    const upperPoints = upperCollisionPositions();
    const previousBodyPoints = [
      ...previousFeet,
      ...previousUpperPoints,
      playerPoint(-17, 2, previousX, previousY, previousAngle),
      playerPoint(17, 2, previousX, previousY, previousAngle),
      playerPoint(0, 3, previousX, previousY, previousAngle),
    ];
    const bodyPoints = [
      ...feet,
      ...upperPoints,
      playerPoint(-17, 2),
      playerPoint(17, 2),
      playerPoint(0, 3),
    ];
    const candidates = platforms
      .filter((platform) => Math.abs(platform.y - player.y) < 72)
      .sort((a, b) => a.y - b.y);

    for (const platform of candidates) {
      const half = platform.width / 2;
      const normalSpeed = -Math.sin(platform.angle) * player.vx + Math.cos(platform.angle) * player.vy;

      if (normalSpeed < 0) {
        for (let index = 0; index < upperPoints.length; index += 1) {
          const previousLocal = platformLocalPoint(platform, previousUpperPoints[index]);
          const local = platformLocalPoint(platform, upperPoints[index]);
          const crossedBottom = previousLocal.y >= BAR_HALF - 2 && local.y <= BAR_HALF + 2;
          const insideBar = Math.abs(local.x) <= half + 2;
          if (crossedBottom && insideBar) {
            handleUndersideHit(platform, upperPoints[index], normalSpeed);
            return;
          }
        }
        continue;
      }

      for (let index = 0; index < bodyPoints.length; index += 1) {
        const previousLocal = platformLocalPoint(platform, previousBodyPoints[index]);
        const local = platformLocalPoint(platform, bodyPoints[index]);
        const crossedTop = previousLocal.y <= -BAR_HALF + 2 && local.y >= -BAR_HALF - 2;
        const insideBar = Math.abs(local.x) <= half + 2;
        const angleError = Math.abs(normalizeAngle(player.angle - platform.angle));
        if (crossedTop && insideBar) {
          handleLanding(platform, angleError, bodyPoints[index]);
          return;
        }
      }
    }
  }

  function update(dt) {
    elapsed += dt;
    stateTime += dt;
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt);
    player.squash += (0 - player.squash) * Math.min(1, dt * 10);
    player.wing += (0 - player.wing) * Math.min(1, dt * 3.4);

    if (state === 'title') {
      player.y = currentPlatform.y - BAR_HALF - FOOT + Math.sin(elapsed * 2.2) * 3;
      player.angle = Math.sin(elapsed * 1.5) * .055;
    }

    if (state === 'countdown' && stateTime > .72) launchPlayer();

    if (state === 'playing') {
      const direction = inputDirection();
      const previousX = player.x;
      const previousY = player.y;
      const previousAngle = player.angle;

      player.omega += direction * 7.2 * dt;
      player.omega *= Math.pow(.55, dt);
      player.omega = clamp(player.omega, -3.2, 3.2);
      player.angle += player.omega * dt;

      const braking = direction !== 0 && Math.abs(player.vx) > 20 && Math.sign(player.vx) !== direction;
      player.vx += direction * (braking ? 150 : 70) * dt;
      player.vx += Math.sin(normalizeAngle(player.angle)) * 8 * dt;
      player.vx *= Math.pow(.58, dt);
      player.vx = clamp(player.vx, -MAX_HORIZONTAL_SPEED, MAX_HORIZONTAL_SPEED);
      player.vy += GRAVITY * dt;
      player.x += player.vx * dt;
      player.y += player.vy * dt;

      checkPlatformCollision(previousX, previousY, previousAngle);

      const climbed = Math.max(0, START_Y - player.y);
      height = Math.floor(climbed / 10);
      maxHeight = Math.max(maxHeight, height);
      updateHud();

      if (player.y - cameraY < 310) {
        const targetCamera = player.y - 310;
        cameraY += (targetCamera - cameraY) * Math.min(1, dt * 3.6);
      }

      if (Math.abs(player.vy) > 150 && Math.floor(elapsed * 24) !== Math.floor((elapsed - dt) * 24)) {
        trails.push({ x: player.x, y: player.y, angle: player.angle, life: .24, maxLife: .24 });
      }

      generatePlatforms();
      platforms = platforms.filter((platform) => platform === currentPlatform || platform.y < cameraY + WORLD_H + 170);

      if (player.x < -SIDE_FALL_MARGIN || player.x > WORLD_W + SIDE_FALL_MARGIN) {
        beginCrash();
      } else if (player.y - cameraY > WORLD_H + 85) {
        beginCrash();
      }
    }

    if (state === 'crashing') {
      player.vy += GRAVITY * .72 * dt;
      player.x += player.vx * .65 * dt;
      player.y += player.vy * dt;
      player.angle += player.omega * dt;
      if (stateTime > .72 || player.y - cameraY > WORLD_H + 100) showGameOver();
    }

    attitudeNeedle.style.transform = `rotate(${normalizeAngle(player.angle)}rad)`;
    updateParticles(dt);
  }

  function ellipse(x, y, rx, ry, color, rotation = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, TAU);
    ctx.fill();
  }

  function drawBackground() {
    const altitudeTint = clamp(-cameraY / 2600, 0, 1);
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, altitudeTint > .55 ? '#080d2d' : '#13183d');
    sky.addColorStop(.54, altitudeTint > .7 ? '#181945' : '#383363');
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
      const y = ((star.y - cameraY * star.depth) % 860 + 860) % 860 - 70;
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
      ctx.fillStyle = 'rgba(7,10,35,.2)';
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

  function drawPlatforms() {
    for (const platform of platforms) {
      if (state === 'title' && !platform.isStart) continue;
      const y = platform.y - cameraY;
      if (y < -55 || y > WORLD_H + 75) continue;
      const half = platform.width / 2;

      ctx.save();
      ctx.translate(platform.x, y);
      ctx.rotate(platform.angle);
      ctx.shadowColor = '#123b8090';
      ctx.shadowBlur = 11;
      ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#123d8a88';
      ctx.beginPath();
      ctx.roundRect(-half, -BAR_HALF, platform.width, BAR_HALF * 2, BAR_HALF);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = platform.color;
      ctx.beginPath();
      ctx.roundRect(-half, -BAR_HALF, platform.width, BAR_HALF * 2, BAR_HALF);
      ctx.fill();

      ctx.globalAlpha = .24;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-half + 5, -BAR_HALF + 2, platform.width - 10, 3, 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      const holeCount = clamp(Math.round(platform.width / 25), 3, 5);
      const holeSpan = platform.width - 35;
      for (let index = 0; index < holeCount; index += 1) {
        const holeX = holeCount === 1 ? 0 : -holeSpan / 2 + holeSpan * index / (holeCount - 1);
        ellipse(holeX, 1, 4.2, 4.2, '#12337a99');
        ellipse(holeX - .7, 0, 2.2, 2.2, '#ffffff35');
      }

      if (platform.reached && !platform.isStart) {
        ctx.strokeStyle = '#fff7dca8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-half - 2, -BAR_HALF - 2, platform.width + 4, BAR_HALF * 2 + 4, BAR_HALF + 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawTrails() {
    for (const trail of trails) {
      const alpha = trail.life / trail.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha * .13;
      ctx.translate(trail.x, trail.y - cameraY);
      ctx.rotate(trail.angle);
      ellipse(0, 0, 22, 29, '#ffe5a5');
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

    // Tail: the broad curled tail is the clearest silhouette from the original Momo.
    ctx.save();
    ctx.translate(-13, 6 + bob);
    ctx.rotate(-.46 - wingLift * .025);
    ellipse(-18, 5, 29, 14, '#965f48', .18);
    ellipse(-20, 1, 21, 7, '#d48d60', .18);
    ctx.restore();

    // Body and pale belly.
    ellipse(0, 5 + bob, 21, 25, '#c47b52', -.04);
    ellipse(4, 9 + bob, 13, 18, '#efbb76', .08);

    // Gliding arms.
    ctx.save();
    ctx.translate(5, 1 + bob);
    ctx.rotate(.22 + wingLift * .045);
    ellipse(17, 4, 22, 9, '#b66d4c', -.08);
    ellipse(17, 2, 15, 4.5, '#e9aa69', -.08);
    ctx.restore();

    // Head, ears and face.
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

    // Momo's yellow travel hat.
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

    // Two landing feet make the required posture instantly readable.
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
    drawPlatforms();
    drawTrails();
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

  function pointerDirection(event) {
    const rect = card.getBoundingClientRect();
    return event.clientX < rect.left + rect.width / 2 ? -1 : 1;
  }

  function setPointerInput(event, direction) {
    if (!['playing', 'countdown'].includes(state)) return;
    event.preventDefault();
    initAudio();
    pointerInputs.set(event.pointerId, direction);
    event.currentTarget?.setPointerCapture?.(event.pointerId);
    updateControlClasses();
  }

  function releasePointer(event) {
    if (!pointerInputs.has(event.pointerId)) return;
    pointerInputs.delete(event.pointerId);
    updateControlClasses();
  }

  function bindControl(button, direction) {
    button.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      setPointerInput(event, direction);
    });
    button.addEventListener('pointerup', releasePointer);
    button.addEventListener('pointercancel', releasePointer);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
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

  bindControl(leftControl, -1);
  bindControl(rightControl, 1);

  card.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    setPointerInput(event, pointerDirection(event));
  });
  card.addEventListener('pointermove', (event) => {
    if (!pointerInputs.has(event.pointerId) || event.target.closest('button')) return;
    pointerInputs.set(event.pointerId, pointerDirection(event));
    updateControlClasses();
  });
  card.addEventListener('pointerup', releasePointer);
  card.addEventListener('pointercancel', releasePointer);
  // Keep long presses focused on gameplay instead of opening selection/callout UI.
  ['contextmenu', 'selectstart', 'dragstart'].forEach((eventName) => {
    card.addEventListener(eventName, (event) => event.preventDefault());
  });

  window.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'].includes(event.code)) event.preventDefault();
    if (state === 'title' && ['Space', 'Enter'].includes(event.code)) { startGame(); return; }
    if (state === 'gameover' && ['Space', 'Enter'].includes(event.code)) { startGame(); return; }
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') keyLeft = true;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') keyRight = true;
    updateControlClasses();
  });
  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') keyLeft = false;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') keyRight = false;
    updateControlClasses();
  });
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  window.addEventListener('blur', clearInput);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { lastTime = performance.now(); clearInput(); });

  resize();
  showTitle();
  requestAnimationFrame(loop);
})();
