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
  const startBest = document.getElementById('startBest');
  const rainStatus = document.getElementById('rainStatus');
  const rainLabel = document.getElementById('rainLabel');
  const rainTimer = document.getElementById('rainTimer');
  const scorePop = document.getElementById('scorePop');
  const dangerBanner = document.getElementById('dangerBanner');
  const tapHint = document.getElementById('tapHint');
  const countdown = document.getElementById('countdown');
  const finalScore = document.getElementById('finalScore');
  const newBest = document.getElementById('newBest');

  const WORLD_W = 390;
  const WORLD_H = 720;
  const TAU = Math.PI * 2;
  const WALL_W = 42;
  const RIGHT_WALL_X = WORLD_W - WALL_W;
  const TOP_LIMIT = 91;
  const BOTTOM_LIMIT = 685;
  const PLAYER_R = 19;
  const PLAYER_SCALE = .74;
  const GRAVITY = 650;
  const TAP_SPEED = 255;
  const RAIN_START = 10;
  const STORAGE_KEY = 'momo-spike-wall-best';

  let state = 'title';
  let stateTime = 0;
  let elapsed = 0;
  let gameTime = 0;
  let lastTime = 0;
  let score = 0;
  let best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  let rainStarted = false;
  let rainSpawnTimer = 0;
  let scorePopTimer = 0;
  let bannerTimer = 0;
  let shake = 0;
  let flash = 0;
  let soundEnabled = true;
  let audioContext = null;
  let hasTapped = false;
  let wallPulse = { left: 0, right: 0 };
  let wallSpikes = { left: [], right: [] };
  let fallingHazards = [];
  let particles = [];
  let ripples = [];

  function reportScore(final = false) {
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'light-show-game-score', score, final }, '*');
  }

  const player = {
    x: WORLD_W / 2,
    y: 365,
    vx: 150,
    vy: 0,
    direction: 1,
    rotation: 0,
    omega: 0,
    squash: 0,
    wing: 0,
  };

  const stars = Array.from({ length: 62 }, (_, index) => ({
    x: (index * 79.37 + 17) % WORLD_W,
    y: (index * 53.11 + 37) % WORLD_H,
    r: .5 + (index % 6) * .17,
    phase: index * .71,
  }));

  startBest.textContent = best;
  bestScoreNode.textContent = best;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffle(values) {
    for (let index = values.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [values[index], values[other]] = [values[other], values[index]];
    }
    return values;
  }

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

  function playTap() {
    tone(430, .075, 'triangle', .026);
    tone(650, .09, 'sine', .016, .025);
  }

  function playWallTouch() {
    tone(540, .08, 'square', .023);
    tone(820, .13, 'triangle', .03, .04);
    tone(1100, .12, 'sine', .015, .1);
  }

  function playWarning() {
    tone(230, .16, 'sawtooth', .027);
    tone(180, .2, 'square', .02, .18);
  }

  function playCrash() {
    tone(135, .3, 'sawtooth', .04);
    tone(74, .38, 'square', .018, .05);
  }

  function runSpeed() {
    return Math.min(225, 150 + score * 2.8);
  }

  function randomizeWallSpikes(side, safeY = null, titleMode = false) {
    const slots = Array.from({ length: 9 }, (_, index) => 139 + index * 59);
    let candidates = safeY == null ? slots : slots.filter((y) => Math.abs(y - safeY) > 70);
    if (candidates.length < 4) candidates = slots;
    const count = titleMode ? 3 : clamp(3 + Math.floor(score / 7), 3, 6);
    const selected = shuffle([...candidates]).slice(0, count).sort((a, b) => a - b);
    wallSpikes[side] = selected.map((y, index) => ({
      y: y + random(-7, 7),
      size: random(18.5, 23.5),
      appear: titleMode ? 1 : -index * .055,
      phase: random(0, TAU),
    }));
  }

  function resetWorld(titleMode = false) {
    score = 0;
    gameTime = 0;
    rainStarted = false;
    rainSpawnTimer = 0;
    scorePopTimer = 0;
    bannerTimer = 0;
    shake = 0;
    flash = 0;
    hasTapped = false;
    fallingHazards = [];
    particles = [];
    ripples = [];
    wallPulse = { left: 0, right: 0 };
    player.x = WORLD_W / 2;
    player.y = 365;
    player.vx = 150;
    player.vy = 0;
    player.direction = 1;
    player.rotation = 0;
    player.omega = 0;
    player.squash = 0;
    player.wing = 0;
    randomizeWallSpikes('left', player.y, titleMode);
    randomizeWallSpikes('right', player.y, titleMode);
    updateHud();
  }

  function updateHud() {
    scoreNode.textContent = score;
    bestScoreNode.textContent = Math.max(best, score);
    if (rainStarted) {
      rainLabel.textContent = 'トゲ雨';
      rainTimer.textContent = 'DANGER';
      rainStatus.classList.add('active');
    } else {
      rainLabel.textContent = 'トゲ雨まで';
      rainTimer.textContent = Math.max(0, RAIN_START - gameTime).toFixed(1);
      rainStatus.classList.remove('active');
    }
  }

  function showTitle() {
    state = 'title';
    stateTime = 0;
    resetWorld(true);
    startBest.textContent = best;
    startScreen.classList.remove('hidden');
    gameoverScreen.classList.add('hidden');
    hud.classList.remove('visible');
    countdown.classList.add('hidden');
    scorePop.classList.add('hidden');
    dangerBanner.classList.add('hidden');
    tapHint.classList.add('hidden');
  }

  function startGame() {
    initAudio();
    state = 'countdown';
    stateTime = 0;
    resetWorld(false);
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    scorePop.classList.add('hidden');
    dangerBanner.classList.add('hidden');
    tapHint.classList.add('hidden');
    hud.classList.add('visible');
    countdown.textContent = 'READY?';
    countdown.classList.remove('hidden');
    tone(420, .1, 'sine', .025);
  }

  function beginPlaying() {
    state = 'playing';
    stateTime = 0;
    player.vx = runSpeed();
    player.vy = -55;
    countdown.classList.add('hidden');
    tapHint.classList.remove('hidden');
    tone(700, .12, 'triangle', .032);
    tone(980, .15, 'sine', .022, .08);
  }

  function flap() {
    if (state !== 'playing') return;
    initAudio();
    player.vy = -TAP_SPEED;
    player.wing = 1;
    player.squash = -.16;
    player.omega += player.direction * -.18;
    hasTapped = true;
    tapHint.classList.add('hidden');
    ripples.push({ x: player.x, y: player.y + 6, life: .3, maxLife: .3, radius: 7 });
    for (let index = 0; index < 4; index += 1) {
      particles.push({
        type: 'dust',
        x: player.x - player.direction * random(8, 18),
        y: player.y + random(7, 18),
        vx: -player.direction * random(20, 58),
        vy: random(20, 58),
        life: random(.25, .42),
        maxLife: .42,
        size: random(1.5, 3.2),
        color: '#fff2be',
      });
    }
    playTap();
  }

  function burst(x, y, count, danger = false) {
    for (let index = 0; index < count; index += 1) {
      const angle = random(0, TAU);
      const speed = random(48, 145);
      particles.push({
        type: index % 3 === 0 ? 'diamond' : 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: random(.48, .8),
        maxLife: .8,
        size: random(1.8, 3.8),
        color: danger ? (index % 2 ? '#ff735f' : '#ffd054') : (index % 2 ? '#fff4bd' : '#ffd44f'),
      });
    }
  }

  function touchWall(side) {
    const isLeft = side === 'left';
    player.x = isLeft ? WALL_W + PLAYER_R : RIGHT_WALL_X - PLAYER_R;
    player.direction = isLeft ? 1 : -1;
    player.vx = player.direction * runSpeed();
    player.squash = .34;
    player.wing = 1;
    player.omega = player.direction * -.42;
    score += 1;
    wallPulse[side] = .3;
    shake = .11;
    flash = .07;
    scorePop.textContent = `+1  ${score}`;
    scorePop.classList.remove('hidden');
    scorePopTimer = .48;
    burst(player.x, player.y, 15);
    randomizeWallSpikes(side, player.y);
    updateHud();
    reportScore();
    playWallTouch();
  }

  function spikePolygon(side, spike) {
    const size = spike.size * clamp(spike.appear, 0, 1);
    if (side === 'left') {
      return [
        { x: WALL_W - 1, y: spike.y - size },
        { x: WALL_W + size, y: spike.y },
        { x: WALL_W - 1, y: spike.y + size },
      ];
    }
    return [
      { x: RIGHT_WALL_X + 1, y: spike.y - size },
      { x: RIGHT_WALL_X - size, y: spike.y },
      { x: RIGHT_WALL_X + 1, y: spike.y + size },
    ];
  }

  function pointInPolygon(x, y, points) {
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
      const a = points[i];
      const b = points[j];
      const intersects = ((a.y > y) !== (b.y > y)) &&
        (x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x);
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function distanceToSegmentSquared(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;
    const t = lengthSquared ? clamp(((px - ax) * dx + (py - ay) * dy) / lengthSquared, 0, 1) : 0;
    const x = ax + dx * t;
    const y = ay + dy * t;
    return (px - x) ** 2 + (py - y) ** 2;
  }

  function circlePolygonCollision(x, y, radius, points) {
    if (pointInPolygon(x, y, points)) return true;
    for (let index = 0; index < points.length; index += 1) {
      const a = points[index];
      const b = points[(index + 1) % points.length];
      if (distanceToSegmentSquared(x, y, a.x, a.y, b.x, b.y) <= radius ** 2) return true;
    }
    return false;
  }

  function checkWallSpikes() {
    for (const side of ['left', 'right']) {
      for (const spike of wallSpikes[side]) {
        if (spike.appear < .72) continue;
        const points = spikePolygon(side, spike);
        if (circlePolygonCollision(player.x, player.y, PLAYER_R * .8, points)) {
          beginCrash('壁のトゲにぶつかった！');
          return true;
        }
      }
    }
    return false;
  }

  function spawnFallingHazard() {
    let x = random(WALL_W + 43, RIGHT_WALL_X - 43);
    if (fallingHazards.length === 0 && Math.abs(x - player.x) < 58) {
      x = player.x < WORLD_W / 2 ? random(240, 305) : random(85, 150);
    }
    const radius = random(14, 19);
    fallingHazards.push({
      x,
      y: TOP_LIMIT - 45 - radius,
      radius,
      vy: random(150, 205) + Math.min(85, (gameTime - RAIN_START) * 2.5),
      drift: random(-18, 18),
      rotation: random(0, TAU),
      spin: random(-2.5, 2.5),
      pulse: random(0, TAU),
    });
  }

  function startRain() {
    rainStarted = true;
    rainSpawnTimer = .35;
    bannerTimer = 1.5;
    dangerBanner.classList.remove('hidden');
    rainStatus.classList.add('active');
    shake = .26;
    burst(WORLD_W / 2, TOP_LIMIT + 10, 20, true);
    playWarning();
    updateHud();
  }

  function checkFallingHazards() {
    for (const hazard of fallingHazards) {
      const dx = player.x - hazard.x;
      const dy = player.y - hazard.y;
      const hitRadius = PLAYER_R * .75 + hazard.radius * .74;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        beginCrash('降ってきたトゲにヒット！');
        return true;
      }
    }
    return false;
  }

  function beginCrash(reason) {
    if (state !== 'playing') return;
    state = 'crashing';
    stateTime = 0;
    player.vx *= -.35;
    player.vy = -125;
    player.omega = player.direction * 4.8;
    shake = .38;
    flash = .2;
    tapHint.classList.add('hidden');
    scorePop.textContent = 'OUCH!';
    scorePop.classList.remove('hidden');
    scorePopTimer = .72;
    scorePop.dataset.reason = reason;
    burst(player.x, player.y, 24, true);
    playCrash();
  }

  function showGameOver() {
    state = 'gameover';
    stateTime = 0;
    const isNewBest = score > best;
    if (isNewBest) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
    }
    finalScore.textContent = score;
    newBest.classList.toggle('hidden', !isNewBest || score === 0);
    bestScoreNode.textContent = best;
    startBest.textContent = best;
    hud.classList.remove('visible');
    dangerBanner.classList.add('hidden');
    reportScore(true);
    window.setTimeout(() => gameoverScreen.classList.remove('hidden'), 260);
  }

  function updateParticles(dt) {
    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += (particle.type === 'dust' ? 50 : 92) * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);
    for (const ripple of ripples) {
      ripple.life -= dt;
      ripple.radius += 80 * dt;
    }
    ripples = ripples.filter((ripple) => ripple.life > 0);
  }

  function update(dt) {
    elapsed += dt;
    stateTime += dt;
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt);
    wallPulse.left = Math.max(0, wallPulse.left - dt);
    wallPulse.right = Math.max(0, wallPulse.right - dt);
    player.squash += (0 - player.squash) * Math.min(1, dt * 11);
    player.wing += (0 - player.wing) * Math.min(1, dt * 4.4);

    for (const side of ['left', 'right']) {
      for (const spike of wallSpikes[side]) spike.appear = Math.min(1, spike.appear + dt * 5.2);
    }

    if (scorePopTimer > 0) {
      scorePopTimer -= dt;
      if (scorePopTimer <= 0) scorePop.classList.add('hidden');
    }
    if (bannerTimer > 0) {
      bannerTimer -= dt;
      if (bannerTimer <= 0) dangerBanner.classList.add('hidden');
    }

    if (state === 'title') {
      player.x = WORLD_W / 2 + Math.sin(elapsed * .9) * 21;
      player.y = 386 + Math.sin(elapsed * 2.1) * 7;
      player.direction = Math.sin(elapsed * .9) >= 0 ? 1 : -1;
      player.rotation = Math.sin(elapsed * 1.4) * .08;
      player.wing = .38 + Math.sin(elapsed * 3.4) * .15;
    }

    if (state === 'countdown' && stateTime > .72) beginPlaying();

    if (state === 'playing') {
      gameTime += dt;
      player.vy = Math.min(380, player.vy + GRAVITY * dt);
      player.x += player.vx * dt;
      player.y += player.vy * dt;
      const targetRotation = clamp(player.vy / 920, -.23, .32) * player.direction;
      player.rotation += (targetRotation - player.rotation) * Math.min(1, dt * 7);
      player.rotation += player.omega * dt;
      player.omega *= Math.pow(.025, dt);

      if (stateTime > 3 && !hasTapped) tapHint.classList.add('hidden');

      if (checkWallSpikes()) {
        updateParticles(dt);
        return;
      }

      const leftBound = WALL_W + PLAYER_R;
      const rightBound = RIGHT_WALL_X - PLAYER_R;
      if (player.vx < 0 && player.x <= leftBound) touchWall('left');
      if (player.vx > 0 && player.x >= rightBound) touchWall('right');

      if (player.y - PLAYER_R < TOP_LIMIT) {
        beginCrash('高く飛びすぎた！');
      } else if (player.y + PLAYER_R > BOTTOM_LIMIT) {
        beginCrash('下へ落ちちゃった！');
      }

      if (!rainStarted && gameTime >= RAIN_START) startRain();
      if (rainStarted && state === 'playing') {
        rainSpawnTimer -= dt;
        if (rainSpawnTimer <= 0) {
          spawnFallingHazard();
          rainSpawnTimer = Math.max(.62, 1.42 - (gameTime - RAIN_START) * .022);
        }
      }

      for (const hazard of fallingHazards) {
        hazard.y += hazard.vy * dt;
        hazard.x += hazard.drift * dt;
        hazard.rotation += hazard.spin * dt;
        if (hazard.x - hazard.radius < WALL_W + 4 || hazard.x + hazard.radius > RIGHT_WALL_X - 4) hazard.drift *= -1;
      }
      fallingHazards = fallingHazards.filter((hazard) => hazard.y - hazard.radius < WORLD_H + 35);
      if (state === 'playing') checkFallingHazards();
      updateHud();
    }

    if (state === 'crashing') {
      player.vy += GRAVITY * .65 * dt;
      player.x += player.vx * dt;
      player.y += player.vy * dt;
      player.rotation += player.omega * dt;
      for (const hazard of fallingHazards) {
        hazard.y += hazard.vy * dt;
        hazard.rotation += hazard.spin * dt;
      }
      if (stateTime > .78) showGameOver();
    }

    updateParticles(dt);
  }

  function ellipse(x, y, rx, ry, color, rotation = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, TAU);
    ctx.fill();
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, '#111538');
    sky.addColorStop(.47, '#38305c');
    sky.addColorStop(1, '#9b586a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const glow = ctx.createRadialGradient(301, 179, 6, 301, 179, 137);
    glow.addColorStop(0, 'rgba(255,225,149,.2)');
    glow.addColorStop(1, 'rgba(255,225,149,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(150, 25, 300, 300);

    for (const star of stars) {
      ctx.globalAlpha = .35 + Math.sin(elapsed * 1.8 + star.phase) * .17;
      ctx.fillStyle = star.r > 1.15 ? '#ffe27c' : '#fff8de';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(302, 179);
    ctx.fillStyle = '#ffe5a1';
    ctx.shadowColor = '#ffe18966';
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(0, 0, 31, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ellipse(-10, -8, 5, 5, '#b782612c');
    ellipse(11, 7, 6, 6, '#b782612c');
    ctx.restore();

    ctx.fillStyle = '#4b3c63';
    ctx.beginPath();
    ctx.moveTo(0, 610);
    for (let x = 0; x <= WORLD_W; x += 55) {
      ctx.lineTo(x, 610 - ((x / 55) % 3) * 17 - Math.sin(x * .055) * 27);
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.lineTo(0, WORLD_H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#292b48';
    ctx.beginPath();
    ctx.moveTo(0, 650);
    for (let x = 0; x <= WORLD_W; x += 48) ctx.lineTo(x, 637 - Math.sin(x * .047) * 35);
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.lineTo(0, WORLD_H);
    ctx.closePath();
    ctx.fill();

    const vignette = ctx.createRadialGradient(WORLD_W / 2, WORLD_H * .43, 125, WORLD_W / 2, WORLD_H * .46, 430);
    vignette.addColorStop(0, 'rgba(2,4,20,0)');
    vignette.addColorStop(1, 'rgba(2,4,20,.5)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    if (state === 'title') {
      ctx.fillStyle = 'rgba(7,8,29,.24)';
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
  }

  function drawWall(side) {
    const isLeft = side === 'left';
    const x = isLeft ? 0 : RIGHT_WALL_X;
    const pulse = wallPulse[side] / .3;
    ctx.save();
    ctx.shadowColor = pulse > 0 ? `rgba(255,213,79,${pulse * .8})` : '#08091999';
    ctx.shadowBlur = pulse > 0 ? 25 : 15;
    ctx.fillStyle = '#332a4d';
    ctx.fillRect(x, 0, WALL_W, WORLD_H);
    ctx.shadowBlur = 0;

    const wallGradient = ctx.createLinearGradient(x, 0, x + WALL_W, 0);
    if (isLeft) {
      wallGradient.addColorStop(0, '#4b3b62');
      wallGradient.addColorStop(1, pulse > 0 ? '#d39b58' : '#806684');
    } else {
      wallGradient.addColorStop(0, pulse > 0 ? '#d39b58' : '#806684');
      wallGradient.addColorStop(1, '#4b3b62');
    }
    ctx.fillStyle = wallGradient;
    ctx.fillRect(x, 0, WALL_W, WORLD_H);

    ctx.strokeStyle = '#c7a6bb2e';
    ctx.lineWidth = 1;
    for (let y = 14; y < WORLD_H; y += 34) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + WALL_W, y);
      ctx.stroke();
      const seamX = x + (((Math.floor(y / 34) % 2) * .5 + .25) * WALL_W);
      ctx.beginPath();
      ctx.moveTo(seamX, y);
      ctx.lineTo(seamX, y + 34);
      ctx.stroke();
    }

    ctx.fillStyle = pulse > 0 ? `rgba(255,226,113,${.35 + pulse * .55})` : '#d8b4b35c';
    ctx.fillRect(isLeft ? WALL_W - 3 : RIGHT_WALL_X, 0, 3, WORLD_H);
    ctx.restore();
  }

  function drawSpikes(side) {
    for (const spike of wallSpikes[side]) {
      const appear = clamp(spike.appear, 0, 1);
      if (appear <= 0) continue;
      const points = spikePolygon(side, spike);
      ctx.save();
      ctx.globalAlpha = appear;
      ctx.shadowColor = '#ff604f70';
      ctx.shadowBlur = 8;
      const gradient = ctx.createLinearGradient(points[0].x, spike.y, points[1].x, spike.y);
      gradient.addColorStop(0, '#9e4058');
      gradient.addColorStop(1, '#ff8a5c');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffd1a880';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawBoundaries() {
    const topFade = ctx.createLinearGradient(0, TOP_LIMIT - 30, 0, TOP_LIMIT + 18);
    topFade.addColorStop(0, '#ff63554a');
    topFade.addColorStop(1, '#ff635500');
    ctx.fillStyle = topFade;
    ctx.fillRect(WALL_W, TOP_LIMIT - 30, RIGHT_WALL_X - WALL_W, 50);
    const bottomFade = ctx.createLinearGradient(0, BOTTOM_LIMIT - 20, 0, BOTTOM_LIMIT + 30);
    bottomFade.addColorStop(0, '#ff635500');
    bottomFade.addColorStop(1, '#ff635552');
    ctx.fillStyle = bottomFade;
    ctx.fillRect(WALL_W, BOTTOM_LIMIT - 20, RIGHT_WALL_X - WALL_W, 50);
    ctx.setLineDash([4, 8]);
    ctx.strokeStyle = '#ffc18938';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(WALL_W, TOP_LIMIT);
    ctx.lineTo(RIGHT_WALL_X, TOP_LIMIT);
    ctx.moveTo(WALL_W, BOTTOM_LIMIT);
    ctx.lineTo(RIGHT_WALL_X, BOTTOM_LIMIT);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawFallingHazard(hazard) {
    ctx.save();
    ctx.translate(hazard.x, hazard.y);
    ctx.rotate(hazard.rotation);
    ctx.shadowColor = '#ff6c55a0';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#f36d5f';
    ctx.beginPath();
    const points = 16;
    for (let index = 0; index < points; index += 1) {
      const angle = -Math.PI / 2 + index * TAU / points;
      const radius = index % 2 === 0 ? hazard.radius * 1.38 : hazard.radius * .74;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ellipse(0, 0, hazard.radius * .72, hazard.radius * .72, '#7c3852');
    ellipse(-hazard.radius * .2, -hazard.radius * .24, hazard.radius * .16, hazard.radius * .12, '#ffb47480', -.3);
    ctx.restore();
  }

  function drawRipples() {
    for (const ripple of ripples) {
      const alpha = ripple.life / ripple.maxLife;
      ctx.globalAlpha = alpha * .6;
      ctx.strokeStyle = '#ffe287';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ripple.x, ripple.y, ripple.radius, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // This is the same hand-drawn Canvas character used by the original
  // hoshikuzu-jump game, adapted only to face its current travel direction.
  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);
    ctx.scale(player.direction * PLAYER_SCALE * (1 + player.squash * .2), PLAYER_SCALE * (1 - player.squash * .19));

    const bob = state === 'title' ? Math.sin(elapsed * 11) * .7 : 0;
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
      const alpha = clamp(particle.life / particle.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(particle.x, particle.y);
      ctx.fillStyle = particle.color;
      if (particle.type === 'diamond') {
        ctx.rotate(elapsed * 6 + particle.x);
        ctx.beginPath();
        ctx.moveTo(0, -particle.size * 1.8);
        ctx.lineTo(particle.size, 0);
        ctx.lineTo(0, particle.size * 1.8);
        ctx.lineTo(-particle.size, 0);
        ctx.closePath();
        ctx.fill();
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
    if (shake > 0) ctx.translate(random(-shake * 17, shake * 17), random(-shake * 17, shake * 17));
    drawBackground();
    drawBoundaries();
    drawWall('left');
    drawWall('right');
    drawSpikes('left');
    drawSpikes('right');
    for (const hazard of fallingHazards) drawFallingHazard(hazard);
    drawRipples();
    drawParticles();
    drawPlayer();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,225,159,${flash * 1.6})`;
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

  startButton.addEventListener('click', (event) => {
    event.stopPropagation();
    startGame();
  });
  retryButton.addEventListener('click', (event) => {
    event.stopPropagation();
    startGame();
  });
  homeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    showTitle();
  });
  soundButton.addEventListener('click', (event) => {
    event.stopPropagation();
    soundEnabled = !soundEnabled;
    soundButton.classList.toggle('muted', !soundEnabled);
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    soundButton.setAttribute('aria-label', soundEnabled ? '音をオフにする' : '音をオンにする');
    if (soundEnabled) {
      initAudio();
      tone(620, .1, 'sine', .032);
    }
  });

  card.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    event.preventDefault();
    flap();
  });

  window.addEventListener('keydown', (event) => {
    if (['Space', 'ArrowUp', 'Enter'].includes(event.code)) event.preventDefault();
    if (event.repeat) return;
    if (state === 'title' && ['Space', 'Enter'].includes(event.code)) {
      startGame();
      return;
    }
    if (state === 'gameover' && ['Space', 'Enter'].includes(event.code)) {
      startGame();
      return;
    }
    if (event.code === 'Space' || event.code === 'ArrowUp') flap();
  });

  window.addEventListener('resize', resize);
  window.addEventListener('blur', () => { lastTime = performance.now(); });
  document.addEventListener('visibilitychange', () => { lastTime = performance.now(); });

  resize();
  showTitle();
  requestAnimationFrame(loop);
})();
