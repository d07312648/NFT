(() => {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const card = document.querySelector('.game-card');
  const startScreen = document.getElementById('startScreen');
  const gameoverScreen = document.getElementById('gameoverScreen');
  const startButton = document.getElementById('startButton');
  const retryButton = document.getElementById('retryButton');
  const homeButton = document.getElementById('homeButton');
  const soundButton = document.getElementById('soundButton');
  const scoreboard = document.getElementById('scoreboard');
  const scoreNode = document.getElementById('score');
  const startBest = document.getElementById('startBest');
  const finalScore = document.getElementById('finalScore');
  const finalBest = document.getElementById('finalBest');
  const newBest = document.getElementById('newBest');
  const tapGuide = document.getElementById('tapGuide');

  const WORLD_W = 390;
  const WORLD_H = 720;
  const PLAYER_X = 102;
  const STORAGE_KEY = 'hoshiwatari-momo-best';
  const TAU = Math.PI * 2;

  let viewScale = 1;
  let state = 'title';
  let score = 0;
  let best = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  let lastTime = 0;
  let elapsed = 0;
  let spawnTimer = 0;
  let introTimer = 0;
  let shake = 0;
  let flash = 0;
  let soundEnabled = true;
  let audioContext = null;
  let obstacles = [];
  let particles = [];

  function reportScore(final = false) {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: 'nova-live-game-score',
      score,
      final,
    }, '*');
  }

  const player = {
    x: PLAYER_X,
    y: WORLD_H * 0.48,
    vy: 0,
    rotation: 0,
    wing: 0,
  };

  const stars = Array.from({ length: 52 }, (_, i) => ({
    x: (i * 83.7 + 17) % WORLD_W,
    y: (i * 47.3 + 23) % 460,
    r: 0.5 + ((i * 13) % 12) / 10,
    phase: i * 0.73,
    depth: 0.18 + (i % 4) * 0.09,
  }));

  startBest.textContent = best;

  function resize() {
    const rect = card.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    viewScale = Math.max(rect.width / WORLD_W, rect.height / WORLD_H);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function worldTransform() {
    const rect = card.getBoundingClientRect();
    const scale = Math.min(rect.width / WORLD_W, rect.height / WORLD_H);
    const ox = (rect.width - WORLD_W * scale) / 2;
    const oy = (rect.height - WORLD_H * scale) / 2;
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    viewScale = scale;
  }

  function initAudio() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioContext = new AudioCtx();
    }
    if (audioContext?.state === 'suspended') audioContext.resume();
  }

  function tone(frequency, duration, type = 'sine', volume = 0.05, delay = 0) {
    if (!soundEnabled || !audioContext) return;
    const now = audioContext.currentTime + delay;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playFlap() {
    tone(350, 0.08, 'triangle', 0.04);
    tone(520, 0.1, 'sine', 0.025, 0.025);
  }

  function playScore() {
    tone(660, 0.13, 'sine', 0.055);
    tone(990, 0.18, 'sine', 0.04, 0.07);
  }

  function playCrash() {
    tone(120, 0.32, 'sawtooth', 0.06);
    tone(75, 0.42, 'square', 0.03, 0.05);
  }

  function resetPlayer() {
    player.x = PLAYER_X;
    player.y = WORLD_H * 0.47;
    player.vy = 0;
    player.rotation = 0;
    player.wing = 0;
  }

  function showTitle() {
    state = 'title';
    obstacles = [];
    particles = [];
    resetPlayer();
    startBest.textContent = best;
    startScreen.classList.remove('hidden');
    gameoverScreen.classList.add('hidden');
    scoreboard.classList.remove('visible');
    tapGuide.classList.add('hidden');
  }

  function startGame() {
    initAudio();
    state = 'playing';
    score = 0;
    elapsed = 0;
    spawnTimer = 0.55;
    introTimer = 1.8;
    obstacles = [];
    particles = [];
    resetPlayer();
    scoreNode.textContent = '0';
    reportScore(false);
    startScreen.classList.add('hidden');
    gameoverScreen.classList.add('hidden');
    scoreboard.classList.add('visible');
    tapGuide.classList.remove('hidden');
    flap();
  }

  function flap() {
    if (state !== 'playing') return;
    player.vy = -365;
    player.wing = 1;
    playFlap();
    for (let i = 0; i < 5; i += 1) {
      particles.push({
        type: 'dust',
        x: player.x - 21,
        y: player.y + 9,
        vx: -35 - Math.random() * 65,
        vy: -15 + Math.random() * 50,
        life: 0.45,
        maxLife: 0.45,
        size: 1.5 + Math.random() * 2.5,
      });
    }
  }

  function handleAction(event) {
    if (event?.target?.closest?.('button')) return;
    if (state === 'playing') {
      event?.preventDefault?.();
      initAudio();
      flap();
    }
  }

  function spawnObstacle() {
    const minGapY = 190;
    const maxGapY = 520;
    const gapSize = Math.max(158, 190 - score * 1.15);
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);
    obstacles.push({ x: WORLD_W + 40, gapY, gapSize, width: 67, passed: false });
  }

  function gameOver() {
    if (state !== 'playing') return;
    state = 'gameover';
    shake = 0.42;
    flash = 0.16;
    playCrash();
    tapGuide.classList.add('hidden');
    scoreboard.classList.remove('visible');

    const isNewBest = score > best;
    if (isNewBest) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
    }
    finalScore.textContent = score;
    finalBest.textContent = best;
    newBest.classList.toggle('hidden', !isNewBest || score === 0);
    reportScore(true);
    window.setTimeout(() => gameoverScreen.classList.remove('hidden'), 430);
  }

  function update(dt) {
    elapsed += dt;
    player.wing = Math.max(0, player.wing - dt * 3.5);
    shake = Math.max(0, shake - dt);
    flash = Math.max(0, flash - dt);

    if (state === 'title') {
      player.y = WORLD_H * 0.46 + Math.sin(elapsed * 2.1) * 9;
      player.rotation = Math.sin(elapsed * 1.6) * 0.06;
    }

    if (state === 'playing') {
      introTimer -= dt;
      if (introTimer <= 0) tapGuide.classList.add('hidden');

      const speed = Math.min(238, 164 + score * 4.2);
      player.vy += 920 * dt;
      player.vy = Math.min(player.vy, 560);
      player.y += player.vy * dt;
      player.rotation += ((Math.max(-0.4, Math.min(1.05, player.vy / 440))) - player.rotation) * Math.min(1, dt * 8);

      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = Math.max(1.18, 1.58 - score * 0.012);
      }

      for (const obstacle of obstacles) {
        obstacle.x -= speed * dt;
        if (!obstacle.passed && obstacle.x + obstacle.width * 0.5 < player.x) {
          obstacle.passed = true;
          score += 1;
          scoreNode.textContent = score;
          reportScore(false);
          playScore();
          for (let i = 0; i < 12; i += 1) {
            const a = Math.random() * TAU;
            particles.push({
              type: 'star', x: player.x + 8, y: player.y,
              vx: Math.cos(a) * (30 + Math.random() * 70),
              vy: Math.sin(a) * (30 + Math.random() * 70),
              life: 0.65, maxLife: 0.65, size: 2 + Math.random() * 2,
            });
          }
        }
      }
      obstacles = obstacles.filter((obstacle) => obstacle.x > -100);

      const px = player.x;
      const py = player.y;
      const pr = 18;
      for (const obstacle of obstacles) {
        const left = obstacle.x - obstacle.width / 2 + 6;
        const right = obstacle.x + obstacle.width / 2 - 6;
        if (px + pr > left && px - pr < right) {
          const gapTop = obstacle.gapY - obstacle.gapSize / 2;
          const gapBottom = obstacle.gapY + obstacle.gapSize / 2;
          if (py - pr < gapTop || py + pr > gapBottom) gameOver();
        }
      }
      if (player.y < 72 || player.y > 676) gameOver();
    }

    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += (particle.type === 'dust' ? 40 : 85) * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);
  }

  function roundedRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, radius);
      return;
    }

    // roundRect未対応の旧iOS Safariでもゲーム描画を継続する。
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y + h - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  function drawBackground() {
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, '#14183e');
    sky.addColorStop(0.48, '#343064');
    sky.addColorStop(0.72, '#b36d72');
    sky.addColorStop(1, '#e5a36d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const glow = ctx.createRadialGradient(300, 214, 10, 300, 214, 150);
    glow.addColorStop(0, 'rgba(255,226,155,.19)');
    glow.addColorStop(1, 'rgba(255,226,155,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(140, 50, 250, 330);

    for (const star of stars) {
      const drift = (elapsed * 11 * star.depth) % (WORLD_W + 12);
      const x = (star.x - drift + WORLD_W + 12) % (WORLD_W + 12) - 6;
      const alpha = 0.42 + Math.sin(elapsed * 2.2 + star.phase) * 0.2;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = star.r > 1.3 ? '#ffe68a' : '#fff8dc';
      ctx.beginPath();
      ctx.arc(x, star.y, star.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(301 - (elapsed * 3) % 10, 137);
    ctx.fillStyle = '#ffe9ab';
    ctx.shadowColor = 'rgba(255,225,145,.35)';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.arc(0, 0, 37, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(182,139,107,.18)';
    ctx.beginPath();
    ctx.arc(-11, -9, 5, 0, TAU);
    ctx.arc(14, 8, 7, 0, TAU);
    ctx.arc(7, -17, 3, 0, TAU);
    ctx.fill();
    ctx.restore();

    drawCloud(20 - (elapsed * 5) % 470, 192, 0.72, 0.1);
    drawCloud(310 - (elapsed * 8) % 520, 277, 0.9, 0.09);

    drawMountainLayer(465, '#51436c', 0.035, 70, 0.7);
    drawMountainLayer(520, '#393557', 0.06, 91, 1.1);
    drawForest(555, '#222d46', 0.12, 23);
    drawForest(610, '#15243a', 0.2, 31);
    drawGround();
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

  function drawMountainLayer(baseY, color, depth, amplitude, phase) {
    const offset = (elapsed * 25 * depth) % 160;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-180 - offset, WORLD_H);
    for (let x = -180 - offset; x <= WORLD_W + 200; x += 80) {
      const peak = baseY - amplitude * (0.72 + ((x / 80 + phase) % 3 + 3) % 3 * 0.12);
      ctx.lineTo(x + 40, peak);
      ctx.lineTo(x + 80, baseY + 10);
    }
    ctx.lineTo(WORLD_W + 200, WORLD_H);
    ctx.closePath();
    ctx.fill();
  }

  function drawForest(baseY, color, depth, size) {
    const spacing = size * 1.35;
    const offset = (elapsed * 45 * depth) % spacing;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H);
    ctx.lineTo(0, baseY);
    for (let x = -spacing - offset; x < WORLD_W + spacing; x += spacing) {
      const h = size * (1.2 + ((Math.floor(x / spacing) * 7) % 5) * 0.1);
      ctx.lineTo(x, baseY);
      ctx.lineTo(x + spacing * 0.5, baseY - h);
      ctx.lineTo(x + spacing, baseY);
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.closePath();
    ctx.fill();
  }

  function drawGround() {
    ctx.fillStyle = '#111d30';
    ctx.fillRect(0, 665, WORLD_W, 55);
    ctx.fillStyle = '#1d3540';
    ctx.beginPath();
    ctx.moveTo(0, 667);
    for (let x = 0; x <= WORLD_W; x += 18) {
      ctx.lineTo(x, 665 - Math.sin(x * 0.3 + elapsed) * 3);
    }
    ctx.lineTo(WORLD_W, 681);
    ctx.lineTo(0, 681);
    ctx.fill();
  }

  function drawObstacles() {
    for (const o of obstacles) {
      const topEnd = o.gapY - o.gapSize / 2;
      const bottomStart = o.gapY + o.gapSize / 2;
      drawLanternPillar(o.x, -10, topEnd + 10, true, o.width);
      drawLanternPillar(o.x, bottomStart, WORLD_H - bottomStart + 20, false, o.width);

      ctx.save();
      const glow = ctx.createLinearGradient(o.x - 55, 0, o.x + 55, 0);
      glow.addColorStop(0, 'rgba(255,211,100,0)');
      glow.addColorStop(0.5, 'rgba(255,211,100,.1)');
      glow.addColorStop(1, 'rgba(255,211,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(o.x - 55, topEnd, 110, o.gapSize);
      ctx.restore();
    }
  }

  function drawLanternPillar(x, y, height, hangsDown, width) {
    const left = x - width / 2;
    const stone = ctx.createLinearGradient(left, 0, left + width, 0);
    stone.addColorStop(0, '#263247');
    stone.addColorStop(0.5, '#3e4354');
    stone.addColorStop(1, '#202b3d');
    ctx.fillStyle = stone;
    roundedRect(left + 8, y, width - 16, height, 7);
    ctx.fill();

    ctx.fillStyle = '#172337';
    const capY = hangsDown ? y + height - 18 : y;
    roundedRect(left, capY, width, 18, 5);
    ctx.fill();
    ctx.fillStyle = '#4d5060';
    ctx.fillRect(left + 8, capY + (hangsDown ? 3 : 12), width - 16, 3);

    const lampY = hangsDown ? capY - 15 : capY + 31;
    ctx.save();
    ctx.shadowColor = '#ffd463';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#ffcf58';
    roundedRect(x - 11, lampY - 9, 22, 18, 4);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#171e32';
    ctx.lineWidth = 4;
    ctx.strokeRect(x - 12, lampY - 10, 24, 20);
    ctx.beginPath();
    ctx.moveTo(x - 14, lampY - 11);
    ctx.lineTo(x, lampY - 19);
    ctx.lineTo(x + 14, lampY - 11);
    ctx.stroke();

    ctx.fillStyle = 'rgba(132,157,153,.16)';
    for (let sy = y + 28; sy < y + height - 35; sy += 48) {
      ctx.beginPath();
      ctx.ellipse(x - 10 + (sy % 3) * 5, sy, 8, 4, -0.4, 0, TAU);
      ctx.fill();
    }
  }

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.rotation);

    const bob = Math.sin(elapsed * 13) * 1.2;
    const wingLift = player.wing * 13 + Math.sin(elapsed * 12) * 2;

    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#0c1028';
    ctx.beginPath();
    ctx.ellipse(-2, 28, 30, 7, 0, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.translate(-7, 4 + bob);
    ctx.rotate(-0.45 - wingLift * 0.025);
    ctx.fillStyle = '#9d644a';
    ctx.beginPath();
    ctx.ellipse(-17, 5, 28, 14, 0.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#d69262';
    ctx.beginPath();
    ctx.ellipse(-18, 2, 20, 7, 0.2, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#c47b52';
    ctx.beginPath();
    ctx.ellipse(1, 7 + bob, 25, 22, -0.04, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#f0bd79';
    ctx.beginPath();
    ctx.ellipse(5, 11 + bob, 16, 14, 0.1, 0, TAU);
    ctx.fill();

    ctx.save();
    ctx.translate(10, 5 + bob);
    ctx.rotate(0.55 + wingLift * 0.02);
    ctx.fillStyle = '#b66d4c';
    ctx.beginPath();
    ctx.ellipse(17, 0, 29, 12, -0.12, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#e9aa69';
    ctx.beginPath();
    ctx.ellipse(16, -1, 20, 6, -0.12, 0, TAU);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = '#bd714e';
    ctx.beginPath();
    ctx.arc(6, -13 + bob, 19, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#d98a59';
    ctx.beginPath();
    ctx.moveTo(-8, -24 + bob);
    ctx.lineTo(-5, -42 + bob);
    ctx.lineTo(4, -27 + bob);
    ctx.moveTo(13, -29 + bob);
    ctx.lineTo(23, -41 + bob);
    ctx.lineTo(23, -21 + bob);
    ctx.fill();
    ctx.fillStyle = '#704338';
    ctx.beginPath();
    ctx.moveTo(-5, -27 + bob);
    ctx.lineTo(-3, -36 + bob);
    ctx.lineTo(1, -28 + bob);
    ctx.moveTo(16, -29 + bob);
    ctx.lineTo(21, -36 + bob);
    ctx.lineTo(21, -24 + bob);
    ctx.fill();

    ctx.fillStyle = '#ffcc7b';
    ctx.beginPath();
    ctx.ellipse(11, -10 + bob, 12, 11, 0.15, 0, TAU);
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
    ctx.ellipse(1, -29 + bob, 18, 6, -0.08, 0, TAU);
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
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.type === 'star' ? '#ffe27b' : '#f6d49e';
      if (p.type === 'star') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(elapsed * 6);
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.7);
        ctx.lineTo(p.size * 0.45, -p.size * 0.45);
        ctx.lineTo(p.size * 1.7, 0);
        ctx.lineTo(p.size * 0.45, p.size * 0.45);
        ctx.lineTo(0, p.size * 1.7);
        ctx.lineTo(-p.size * 0.45, p.size * 0.45);
        ctx.lineTo(-p.size * 1.7, 0);
        ctx.lineTo(-p.size * 0.45, -p.size * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawVignette() {
    const gradient = ctx.createRadialGradient(WORLD_W / 2, WORLD_H * 0.42, 130, WORLD_W / 2, WORLD_H * 0.45, 420);
    gradient.addColorStop(0, 'rgba(3,6,24,0)');
    gradient.addColorStop(1, 'rgba(3,6,24,.42)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    if (state === 'title') {
      const shade = ctx.createLinearGradient(0, 0, 0, WORLD_H);
      shade.addColorStop(0, 'rgba(7,10,35,.08)');
      shade.addColorStop(0.42, 'rgba(7,10,35,.08)');
      shade.addColorStop(1, 'rgba(7,10,35,.38)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
  }

  function render() {
    const rect = card.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.save();
    worldTransform();

    if (shake > 0) {
      const amount = shake * 15;
      ctx.translate((Math.random() - 0.5) * amount, (Math.random() - 0.5) * amount);
    }

    drawBackground();
    drawObstacles();
    drawParticles();
    drawPlayer();
    drawVignette();
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,240,210,${flash * 2.5})`;
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
    }
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000 || 0);
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
      tone(600, 0.1, 'sine', 0.035);
    }
  });

  card.addEventListener('pointerdown', handleAction);
  window.addEventListener('keydown', (event) => {
    if (event.code !== 'Space' && event.code !== 'ArrowUp') return;
    event.preventDefault();
    if (state === 'title') startGame();
    else if (state === 'playing') flap();
    else if (state === 'gameover' && !gameoverScreen.classList.contains('hidden')) startGame();
  });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => { lastTime = performance.now(); });

  resize();
  showTitle();
  requestAnimationFrame(loop);
})();
