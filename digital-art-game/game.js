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
  const livesNode = document.getElementById('lives');
  const totalScoreNode = document.getElementById('totalScore');
  const landingCountNode = document.getElementById('landingCount');
  const powerWrap = document.getElementById('powerWrap');
  const powerFill = document.getElementById('powerFill');
  const powerNumber = document.getElementById('powerNumber');
  const actionLabel = document.getElementById('actionLabel');
  const readyCopy = document.getElementById('readyCopy');
  const roundResult = document.getElementById('roundResult');
  const resultLabel = document.getElementById('resultLabel');
  const roundPoints = document.getElementById('roundPoints');
  const resultNote = document.getElementById('resultNote');
  const lifeLost = document.getElementById('lifeLost');
  const finalTitle = document.getElementById('finalTitle');
  const finalScore = document.getElementById('finalScore');
  const finalLandings = document.getElementById('finalLandings');
  const finalPerfects = document.getElementById('finalPerfects');
  const newBest = document.getElementById('newBest');
  const startBest = document.getElementById('startBest');

  function reportScore(final = false) {
    if (window.parent === window) return;
    window.parent.postMessage({ type: 'digital-art-game-score', score, final }, '*');
  }

  const WORLD_W = 390;
  const WORLD_H = 720;
  const TAU = Math.PI * 2;
  const GRAVITY = 850;
  const FOOT = 28;
  const STORAGE_KEY = 'tokyo-digital-art-night-jump-best';

  let state = 'title';
  let lastTime = 0;
  let elapsed = 0;
  let stateTime = 0;
  let cameraX = 0;
  let cameraZoom = 1;
  let lives = 5;
  let score = 0;
  let landings = 0;
  let perfects = 0;
  let best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  let power = 0;
  let chargeTime = 0;
  let pointerId = null;
  let soundEnabled = true;
  let audioContext = null;
  let shake = 0;
  let flash = 0;
  let particles = [];
  let platforms = [];
  let currentPlatform = null;
  let targetPlatform = null;
  let platformSerial = 0;

  const player = {
    x: 90, y: 540, vx: 0, vy: 0, rotation: 0, scale: 1, wing: 0,
  };

  const stars = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 137.3 + 19) % 900,
    y: 30 + (i * 47.7) % 390,
    r: .5 + ((i * 13) % 12) / 10,
    phase: i * .73,
    depth: .05 + (i % 4) * .025,
  }));

  startBest.textContent = best.toLocaleString('ja-JP');

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

  function tone(frequency, duration, type = 'sine', volume = .04, delay = 0) {
    if (!soundEnabled || !audioContext) return;
    const now = audioContext.currentTime + delay;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playCharge() { tone(250 + power * 300, .055, 'triangle', .018); }
  function playJump() {
    tone(300, .12, 'triangle', .05);
    tone(510, .17, 'sine', .032, .055);
  }
  function playLanding(perfect) {
    tone(perfect ? 720 : 520, .13, 'sine', .05);
    tone(perfect ? 1080 : 760, .2, 'sine', .035, .07);
    if (perfect) tone(1380, .28, 'sine', .03, .16);
  }
  function playMiss() {
    tone(150, .28, 'sawtooth', .045);
    tone(90, .36, 'square', .02, .06);
  }

  function makePlatform(x, y, isStart = false, radius = 54) {
    platformSerial += 1;
    return { id: platformSerial, x, y, rx: isStart ? 78 : radius, isStart, landed: isStart };
  }

  function makeNextPlatform(from) {
    const difficulty = Math.min(1, landings / 18);
    const distance = 250 + difficulty * 70 + Math.random() * (62 + difficulty * 18);
    const heightRange = 58 + difficulty * 38;
    const yChange = -heightRange + Math.random() * heightRange * 2;
    const y = Math.max(405, Math.min(590, from.y + yChange));
    const radius = Math.max(31, 53 - landings * 1.15);
    return makePlatform(from.x + distance, y, false, radius);
  }

  function resetPlayerOnCurrent() {
    player.x = currentPlatform.x;
    player.y = currentPlatform.y - FOOT;
    player.vx = 0;
    player.vy = 0;
    player.rotation = 0;
    player.scale = 1;
    player.wing = 0;
  }

  function resetWorld() {
    platformSerial = 0;
    currentPlatform = makePlatform(88, 570, true);
    targetPlatform = makePlatform(346, 520, false, 54);
    platforms = [currentPlatform, targetPlatform];
    cameraX = 0;
    cameraZoom = 1;
    resetPlayerOnCurrent();
  }

  function requiredCameraZoom() {
    if (!currentPlatform || !targetPlatform || state === 'title') return 1;
    const horizontalSpan = targetPlatform.x - currentPlatform.x + targetPlatform.rx;
    const verticalSpan = Math.abs(targetPlatform.y - currentPlatform.y);
    const horizontalZoom = 282 / Math.max(282, horizontalSpan);
    const verticalZoom = 150 / Math.max(150, verticalSpan + 55);
    return Math.max(.66, Math.min(1, horizontalZoom, verticalZoom));
  }

  function updateHud() {
    livesNode.textContent = lives;
    totalScoreNode.textContent = score.toLocaleString('ja-JP');
    landingCountNode.textContent = landings;
  }

  function showTitle() {
    state = 'title';
    stateTime = 0;
    lives = 5;
    score = 0;
    landings = 0;
    perfects = 0;
    power = 0;
    particles = [];
    resetWorld();
    startBest.textContent = best.toLocaleString('ja-JP');
    startScreen.classList.remove('hidden');
    gameoverScreen.classList.add('hidden');
    roundResult.classList.add('hidden');
    lifeLost.classList.add('hidden');
    hud.classList.remove('visible');
    powerWrap.classList.remove('visible');
    readyCopy.classList.remove('visible');
  }

  function startGame() {
    initAudio();
    lives = 5;
    score = 0;
    landings = 0;
    perfects = 0;
    particles = [];
    resetWorld();
    updateHud();
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    roundResult.classList.add('hidden');
    lifeLost.classList.add('hidden');
    hud.classList.add('visible');
    prepareJump();
  }

  function prepareJump() {
    state = 'ready';
    stateTime = 0;
    chargeTime = 0;
    power = 0;
    pointerId = null;
    resetPlayerOnCurrent();
    updatePowerUI();
    actionLabel.textContent = '長押しでパワーをためる';
    powerWrap.classList.add('visible');
    readyCopy.classList.add('visible');
  }

  function beginCharge(event) {
    if (state !== 'ready' || event?.target?.closest?.('button')) return;
    event?.preventDefault?.();
    initAudio();
    state = 'charging';
    stateTime = 0;
    chargeTime = 0;
    power = 0;
    pointerId = event?.pointerId ?? null;
    if (pointerId !== null) card.setPointerCapture?.(pointerId);
    readyCopy.classList.remove('visible');
    actionLabel.textContent = '指を離してジャンプ！';
    playCharge();
  }

  function releaseCharge(event) {
    if (state !== 'charging') return;
    if (pointerId !== null && event?.pointerId !== undefined && event.pointerId !== pointerId) return;
    event?.preventDefault?.();
    if (chargeTime < .08) power = Math.max(power, .08);
    launch();
  }

  function launch() {
    state = 'flying';
    stateTime = 0;
    pointerId = null;
    powerWrap.classList.remove('visible');
    readyCopy.classList.remove('visible');
    player.vx = 205 + power * 210;
    player.vy = -(320 + power * 180);
    player.wing = 1;
    playJump();
    for (let i = 0; i < 8; i += 1) {
      particles.push({
        type: 'dust', x: player.x - 18, y: player.y + 18,
        vx: -30 - Math.random() * 65, vy: -25 + Math.random() * 45,
        life: .5, maxLife: .5, size: 1.5 + Math.random() * 2.5, color: '#f6d49e',
      });
    }
  }

  function updatePowerUI() {
    const percentage = Math.round(power * 100);
    powerFill.style.width = `${percentage}%`;
    powerNumber.textContent = `${percentage}%`;
  }

  function landOnTarget() {
    const offset = player.x - targetPlatform.x;
    const distance = Math.abs(offset);
    const perfectRange = Math.max(4, targetPlatform.rx * .12);
    const perfect = distance <= perfectRange;
    let points = 100;
    let label = 'SAFE!';
    if (perfect) { points = 1000; label = 'PERFECT!'; }
    else if (distance <= targetPlatform.rx * .38) { points = 500; label = 'GREAT!'; }
    else if (distance <= targetPlatform.rx * .72) { points = 250; label = 'GOOD!'; }

    state = 'landed';
    stateTime = 0;
    player.y = targetPlatform.y - FOOT;
    player.vx = 0;
    player.vy = 0;
    player.rotation = 0;
    targetPlatform.landed = true;
    currentPlatform = targetPlatform;
    landings += 1;
    score += points;
    reportScore();
    if (perfect) perfects += 1;
    updateHud();

    resultLabel.textContent = label;
    roundPoints.textContent = points.toLocaleString('ja-JP');
    resultNote.textContent = perfect ? 'ど真ん中！' : `中心から ${Math.round(distance)}cm`;
    roundResult.classList.remove('hidden');
    playLanding(perfect);
    flash = perfect ? .25 : .1;
    shake = perfect ? .2 : 0;
    burst(player.x, currentPlatform.y - 8, perfect ? 34 : 18);

    targetPlatform = makeNextPlatform(currentPlatform);
    platforms.push(targetPlatform);
    platforms = platforms.filter((platform) => platform.x > cameraX - 180);
  }

  function missTarget() {
    if (state !== 'flying') return;
    state = 'falling';
    stateTime = 0;
    playMiss();
  }

  function loseLife() {
    lives -= 1;
    updateHud();
    lifeLost.classList.remove('hidden');
    shake = .35;
    if (lives <= 0) {
      state = 'gameoverPending';
      window.setTimeout(showGameOver, 900);
    } else {
      state = 'retrying';
      stateTime = 0;
    }
  }

  function showGameOver() {
    state = 'gameover';
    lifeLost.classList.add('hidden');
    powerWrap.classList.remove('visible');
    readyCopy.classList.remove('visible');
    const isNewBest = score > best;
    if (isNewBest) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
    }
    finalTitle.textContent = landings >= 20 ? '星わたり名人！' : landings >= 10 ? 'ナイスジャンプ！' : 'もう一度チャレンジ！';
    finalScore.textContent = score.toLocaleString('ja-JP');
    finalLandings.textContent = landings;
    finalPerfects.textContent = perfects;
    newBest.classList.toggle('hidden', !isNewBest || score === 0);
    reportScore(true);
    gameoverScreen.classList.remove('hidden');
  }

  function burst(x, y, count) {
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * TAU;
      const speed = 35 + Math.random() * 100;
      particles.push({
        type: 'star', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 35,
        life: .7 + Math.random() * .35, maxLife: 1.05, size: 2 + Math.random() * 3,
        color: i % 3 === 0 ? '#ff9b50' : i % 3 === 1 ? '#fff7dc' : '#ffd75a',
      });
    }
  }

  function update(dt) {
    elapsed += dt;
    stateTime += dt;
    flash = Math.max(0, flash - dt);
    shake = Math.max(0, shake - dt);

    if (state === 'title') {
      player.y = currentPlatform.y - FOOT + Math.sin(elapsed * 2.1) * 4;
      player.rotation = Math.sin(elapsed * 1.7) * .035;
    }

    if (state === 'ready') {
      player.y = currentPlatform.y - FOOT + Math.sin(elapsed * 3) * 1.5;
      player.wing = Math.max(0, player.wing - dt * 3);
    }

    if (state === 'charging') {
      chargeTime += dt;
      const cycle = (chargeTime * .72) % 2;
      power = cycle <= 1 ? cycle : 2 - cycle;
      player.wing = Math.min(1, player.wing + dt * 2.4);
      player.y = currentPlatform.y - FOOT + Math.sin(chargeTime * 20) * Math.min(3, chargeTime * 3.5);
      updatePowerUI();
      if (Math.floor(chargeTime * 10) !== Math.floor((chargeTime - dt) * 10)) playCharge();
    }

    if (state === 'flying') {
      const previousBottom = player.y + FOOT;
      player.vy += GRAVITY * dt;
      player.x += player.vx * dt;
      player.y += player.vy * dt;
      player.rotation += ((Math.max(-.5, Math.min(.75, player.vy / 560))) - player.rotation) * Math.min(1, dt * 7);
      player.wing = Math.max(.2, player.wing - dt * .65);

      const surface = targetPlatform.y - 3;
      const playerBottom = player.y + FOOT;
      const overTarget = player.x >= targetPlatform.x - targetPlatform.rx && player.x <= targetPlatform.x + targetPlatform.rx;
      if (player.vy > 0 && previousBottom <= surface && playerBottom >= surface && overTarget) {
        landOnTarget();
      } else if (player.y > WORLD_H + 80 || (player.x > targetPlatform.x + targetPlatform.rx + 80 && player.vy > 0)) {
        missTarget();
      }
    }

    if (state === 'falling') {
      player.vy += GRAVITY * .7 * dt;
      player.x += player.vx * .55 * dt;
      player.y += player.vy * dt;
      player.rotation += dt * 2.2;
      player.wing = 0;
      if (player.y > WORLD_H + 130) loseLife();
    }

    if (state === 'landed') {
      player.x += (currentPlatform.x - player.x) * Math.min(1, dt * 4.5);
      player.y = currentPlatform.y - FOOT - Math.sin(Math.min(1, stateTime / .28) * Math.PI) * 9;
      player.scale = 1 + Math.sin(Math.min(1, stateTime / .28) * Math.PI) * .08;
      player.wing = Math.max(0, player.wing - dt * 3);
      if (stateTime > 1.25) {
        roundResult.classList.add('hidden');
        player.scale = 1;
        prepareJump();
      }
    }

    if (state === 'retrying' && stateTime > 1.05) {
      lifeLost.classList.add('hidden');
      prepareJump();
    }

    const wantedCamera = Math.max(0, player.x - 88);
    if (state !== 'title' && state !== 'falling' && state !== 'gameover') {
      cameraX += (wantedCamera - cameraX) * Math.min(1, dt * 3.6);
    }
    const wantedZoom = requiredCameraZoom();
    cameraZoom += (wantedZoom - cameraZoom) * Math.min(1, dt * 4.2);

    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += (particle.type === 'dust' ? 45 : 95) * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, '#13183d');
    sky.addColorStop(.47, '#383363');
    sky.addColorStop(.74, '#a56870');
    sky.addColorStop(1, '#e5a36d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const moonX = 310 - (cameraX * .025) % 520;
    const glow = ctx.createRadialGradient(moonX, 150, 5, moonX, 150, 125);
    glow.addColorStop(0, 'rgba(255,231,165,.2)');
    glow.addColorStop(1, 'rgba(255,231,165,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(moonX - 130, 20, 260, 270);

    for (const star of stars) {
      const x = ((star.x - cameraX * star.depth) % 900 + 900) % 900 - 100;
      ctx.globalAlpha = .38 + Math.sin(elapsed * 2 + star.phase) * .18;
      ctx.fillStyle = star.r > 1.3 ? '#ffe68a' : '#fff8dc';
      ctx.beginPath();
      ctx.arc(x, star.y, star.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(moonX, 144);
    ctx.fillStyle = '#ffe9ab';
    ctx.shadowColor = '#ffe19166';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(0, 0, 34, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#b68b6b2e';
    ctx.beginPath();
    ctx.arc(-10, -8, 5, 0, TAU);
    ctx.arc(13, 7, 6, 0, TAU);
    ctx.fill();
    ctx.restore();

    drawCloud(80 - (cameraX * .08) % 550, 240, .75, .1);
    drawCloud(350 - (cameraX * .12) % 680, 325, .95, .08);
    drawMountainLayer(545, '#51436c', 76, cameraX * .1, 0);
    drawMountainLayer(590, '#393557', 96, cameraX * .18, 1);
    drawForest(620, '#222d46', 28, cameraX * .3);

    const abyss = ctx.createLinearGradient(0, 565, 0, WORLD_H);
    abyss.addColorStop(0, 'rgba(13,27,43,0)');
    abyss.addColorStop(1, '#07101f');
    ctx.fillStyle = abyss;
    ctx.fillRect(0, 545, WORLD_W, 175);
  }

  function drawCloud(x, y, scale, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#fff6da';
    ctx.beginPath();
    ctx.ellipse(0, 0, 52, 12, 0, 0, TAU);
    ctx.ellipse(-28, -6, 25, 13, 0, 0, TAU);
    ctx.ellipse(18, -7, 31, 16, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawMountainLayer(baseY, color, amplitude, offset, phase) {
    const segment = 115;
    const shift = ((offset % segment) + segment) % segment;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-segment, WORLD_H);
    ctx.lineTo(-segment, baseY);
    for (let x = -segment - shift; x <= WORLD_W + segment; x += segment) {
      const n = Math.floor((x + shift) / segment);
      ctx.lineTo(x + segment * .5, baseY - amplitude * (.74 + ((n + phase) % 3 + 3) % 3 * .1));
      ctx.lineTo(x + segment, baseY + 8);
    }
    ctx.lineTo(WORLD_W + segment, WORLD_H);
    ctx.closePath();
    ctx.fill();
  }

  function drawForest(baseY, color, size, offset) {
    const spacing = size * 1.3;
    const shift = ((offset % spacing) + spacing) % spacing;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H);
    ctx.lineTo(0, baseY);
    for (let x = -spacing - shift; x < WORLD_W + spacing; x += spacing) {
      ctx.lineTo(x, baseY);
      ctx.lineTo(x + spacing * .5, baseY - size * (1.1 + ((Math.floor(x / spacing) % 4 + 4) % 4) * .08));
      ctx.lineTo(x + spacing, baseY);
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.closePath();
    ctx.fill();
  }

  function ellipse(x, y, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fill();
  }

  function drawPlatforms() {
    for (const platform of platforms) {
      const x = platform.x - cameraX;
      if (x < -130 || x > WORLD_W + 130) continue;
      ctx.save();
      ctx.shadowColor = '#050c1a88';
      ctx.shadowBlur = 18;
      ellipse(x + 2, platform.y + 14, platform.rx + 3, 18, '#07101f99');
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#263e43';
      ctx.beginPath();
      ctx.ellipse(x, platform.y + 7, platform.rx, 17, 0, 0, Math.PI);
      ctx.lineTo(x - platform.rx, platform.y - 2);
      ctx.ellipse(x, platform.y - 2, platform.rx, 17, 0, Math.PI, TAU);
      ctx.closePath();
      ctx.fill();

      if (platform.isStart) {
        ellipse(x, platform.y - 3, platform.rx, 16, '#5e7d67');
        ellipse(x, platform.y - 5, platform.rx - 8, 12, '#88a36f');
      } else {
        const ratio = platform.rx / 54;
        ellipse(x, platform.y - 3, platform.rx, Math.max(9, 16 * ratio), '#fff2cf');
        ellipse(x, platform.y - 3, platform.rx * .74, Math.max(7, 12 * ratio), '#e77962');
        ellipse(x, platform.y - 3, platform.rx * .47, Math.max(4.5, 8 * ratio), '#ffe073');
        ellipse(x, platform.y - 3, platform.rx * .23, Math.max(2.8, 4.5 * ratio), '#4f7d72');
        ellipse(x, platform.y - 3, Math.max(4, platform.rx * .09), Math.max(1.5, 2.2 * ratio), '#fff9df');
      }
      ctx.restore();
    }
  }

  function drawGuide() {
    if (state !== 'ready' && state !== 'charging') return;
    const fromX = currentPlatform.x - cameraX;
    const toX = targetPlatform.x - cameraX;
    ctx.save();
    ctx.setLineDash([5, 8]);
    ctx.lineDashOffset = -elapsed * 18;
    ctx.strokeStyle = state === 'charging' ? '#ffd75aca' : '#fff7dc69';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fromX + 18, currentPlatform.y - 40);
    ctx.quadraticCurveTo((fromX + toX) / 2, Math.min(currentPlatform.y, targetPlatform.y) - 165, toX, targetPlatform.y - 24);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fff7dcc0';
    ctx.font = '800 9px "Avenir Next", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NEXT', toX, targetPlatform.y - 33);
    ctx.restore();
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x - cameraX, player.y);
    ctx.rotate(player.rotation);
    ctx.scale(player.scale, player.scale);

    const bob = Math.sin(elapsed * 13) * 1.2;
    const wingLift = player.wing * 13 + Math.sin(elapsed * 12) * 2;

    ctx.globalAlpha = .22;
    ctx.fillStyle = '#0c1028';
    ctx.beginPath();
    ctx.ellipse(-2, 28, 30, 7, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(-7, 4 + bob);
    ctx.rotate(-.45 - wingLift * .025);
    ctx.fillStyle = '#9d644a';
    ctx.beginPath();
    ctx.ellipse(-17, 5, 28, 14, .2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#d69262';
    ctx.beginPath();
    ctx.ellipse(-18, 2, 20, 7, .2, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#c47b52';
    ctx.beginPath();
    ctx.ellipse(1, 7 + bob, 25, 22, -.04, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#f0bd79';
    ctx.beginPath();
    ctx.ellipse(5, 11 + bob, 16, 14, .1, 0, TAU);
    ctx.fill();

    ctx.save();
    ctx.translate(10, 5 + bob);
    ctx.rotate(.55 + wingLift * .02);
    ctx.fillStyle = '#b66d4c';
    ctx.beginPath();
    ctx.ellipse(17, 0, 29, 12, -.12, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#e9aa69';
    ctx.beginPath();
    ctx.ellipse(16, -1, 20, 6, -.12, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#bd714e';
    ctx.beginPath();
    ctx.arc(6, -13 + bob, 19, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#d98a59';
    ctx.beginPath();
    ctx.moveTo(-8, -24 + bob); ctx.lineTo(-5, -42 + bob); ctx.lineTo(4, -27 + bob);
    ctx.moveTo(13, -29 + bob); ctx.lineTo(23, -41 + bob); ctx.lineTo(23, -21 + bob);
    ctx.fill();
    ctx.fillStyle = '#704338';
    ctx.beginPath();
    ctx.moveTo(-5, -27 + bob); ctx.lineTo(-3, -36 + bob); ctx.lineTo(1, -28 + bob);
    ctx.moveTo(16, -29 + bob); ctx.lineTo(21, -36 + bob); ctx.lineTo(21, -24 + bob);
    ctx.fill();

    ctx.fillStyle = '#ffcc7b';
    ctx.beginPath();
    ctx.ellipse(11, -10 + bob, 12, 11, .15, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#17162a';
    ctx.beginPath();
    ctx.arc(12, -17 + bob, 3.4, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#fff8d9';
    ctx.beginPath();
    ctx.arc(13, -18 + bob, 1.15, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#382133';
    ctx.beginPath();
    ctx.arc(24, -9 + bob, 3.1, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#6f412f';
    ctx.beginPath();
    ctx.ellipse(1, -29 + bob, 18, 6, -.08, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#e7ae4e';
    ctx.beginPath();
    ctx.moveTo(-13, -30 + bob);
    ctx.quadraticCurveTo(0, -52 + bob, 16, -31 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#9e623d';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of particles) {
      const x = particle.x - cameraX;
      const alpha = Math.max(0, particle.life / particle.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, particle.y);
      ctx.fillStyle = particle.color;
      if (particle.type === 'star') {
        ctx.rotate(elapsed * 5 + particle.x);
        const s = particle.size;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.8); ctx.lineTo(s * .45, -s * .45); ctx.lineTo(s * 1.8, 0);
        ctx.lineTo(s * .45, s * .45); ctx.lineTo(0, s * 1.8); ctx.lineTo(-s * .45, s * .45);
        ctx.lineTo(-s * 1.8, 0); ctx.lineTo(-s * .45, -s * .45); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, particle.size * alpha, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawVignette() {
    const gradient = ctx.createRadialGradient(WORLD_W / 2, WORLD_H * .43, 140, WORLD_W / 2, WORLD_H * .48, 430);
    gradient.addColorStop(0, 'rgba(3,6,24,0)');
    gradient.addColorStop(1, 'rgba(3,6,24,.45)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    if (state === 'title') {
      ctx.fillStyle = 'rgba(7,10,35,.22)';
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
  }

  function render() {
    const rect = card.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    worldTransform();
    if (shake > 0) ctx.translate((Math.random() - .5) * shake * 18, (Math.random() - .5) * shake * 18);
    drawBackground();
    ctx.save();
    const zoomAnchorY = currentPlatform ? currentPlatform.y - 20 : 520;
    ctx.translate(88, zoomAnchorY);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-88, -zoomAnchorY);
    drawPlatforms();
    drawGuide();
    drawParticles();
    drawPlayer();
    ctx.restore();
    drawVignette();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,241,190,${flash * 1.7})`;
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

  card.addEventListener('pointerdown', beginCharge);
  card.addEventListener('pointerup', releaseCharge);
  card.addEventListener('pointercancel', releaseCharge);
  window.addEventListener('keydown', (event) => {
    if (event.code !== 'Space' || event.repeat) return;
    event.preventDefault();
    if (state === 'title') startGame();
    else if (state === 'ready') beginCharge(event);
    else if (state === 'gameover' && !gameoverScreen.classList.contains('hidden')) startGame();
  });
  window.addEventListener('keyup', (event) => {
    if (event.code !== 'Space') return;
    event.preventDefault();
    releaseCharge(event);
  });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { lastTime = performance.now(); });

  resize();
  showTitle();
  requestAnimationFrame(loop);
})();
