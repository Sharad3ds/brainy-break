/* Brainy Break — Fun Facts engine: cartoon characters, scene player, sound effects, quiz.  (no dependencies) */
(function () {
  'use strict';
  var uid = 0;
  var NS = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------------ characters */
  function ollie(o) {
    var id = 'o' + (++uid), xray = !!o.xray, body = '#9F7AEA', dark = '#7C57D6', light = '#C9B3FF';
    var arms = '', bx = [-58, -41, -25, -8, 8, 25, 41, 58];
    for (var i = 0; i < 8; i++) {
      var b = bx[i], tx = b * 2.05, tipy = 96 + (i % 2) * 8, c = (i % 2 ? 1 : -1);
      arms += '<g class="arm a' + i + '"><path d="M' + b + ',34 Q' + (b * 1.45) + ',78 ' + tx + ',' + tipy + ' q' + (8 * c) + ',9 ' + (14 * c) + ',2" fill="none" stroke="' + dark + '" stroke-width="19" stroke-linecap="round"/>' +
        '<path d="M' + b + ',34 Q' + (b * 1.45) + ',78 ' + tx + ',' + tipy + ' q' + (8 * c) + ',9 ' + (14 * c) + ',2" fill="none" stroke="' + body + '" stroke-width="14" stroke-linecap="round"/>' +
        '<circle cx="' + (b * 1.3) + '" cy="68" r="2.6" fill="' + light + '"/><circle cx="' + (b * 1.65) + '" cy="86" r="2.3" fill="' + light + '"/></g>';
    }
    var s = '<g class="ff-ollie' + (o.cls ? ' ' + o.cls : '') + '">' + arms +
      '<path d="M-74,44 C-98,-42 -62,-118 0,-118 C62,-118 98,-42 74,44 Q0,66 -74,44 Z" fill="' + body + '" stroke="' + dark + '" stroke-width="4" style="opacity:' + (xray ? .55 : 1) + '"/>' +
      '<ellipse cx="-34" cy="-86" rx="18" ry="9" fill="#fff" opacity=".35" transform="rotate(-25 -34 -86)"/>' +
      '<circle cx="46" cy="-70" r="5" fill="' + light + '"/><circle cx="58" cy="-48" r="3.5" fill="' + light + '"/><circle cx="-56" cy="-60" r="4" fill="' + light + '"/><circle cx="30" cy="-96" r="3" fill="' + light + '"/>';
    if (xray) {
      s += '<g class="xr">' +
        '<path class="gill gl" d="M-70,-30 q-18,20 0,48 q18,-14 6,-48 z" fill="#FFC1DA" stroke="#E06AA0" stroke-width="2.5"/>' +
        '<path class="gill gr" d="M70,-30 q18,20 0,48 q-18,-14 -6,-48 z" fill="#FFC1DA" stroke="#E06AA0" stroke-width="2.5"/>' +
        heart(-52, 12, .62, 'hg hl') + heart(52, 12, .62, 'hg hr') + heart(0, -84, .95, 'hm') + '</g>';
    }
    s += '<g class="face">' +
      '<g class="eye"><ellipse cx="-30" cy="-34" rx="19" ry="22" fill="#fff" stroke="' + dark + '" stroke-width="2"/><circle class="pup" cx="-27" cy="-31" r="10" fill="#2B1B54"/><circle cx="-24" cy="-36" r="3.6" fill="#fff"/></g>' +
      '<g class="eye"><ellipse cx="30" cy="-34" rx="19" ry="22" fill="#fff" stroke="' + dark + '" stroke-width="2"/><circle class="pup" cx="33" cy="-31" r="10" fill="#2B1B54"/><circle cx="36" cy="-36" r="3.6" fill="#fff"/></g>' +
      '<ellipse cx="-52" cy="-6" rx="9" ry="5.5" fill="#FF8FB1" opacity=".75"/><ellipse cx="52" cy="-6" rx="9" ry="5.5" fill="#FF8FB1" opacity=".75"/>' +
      '<path class="smile" d="M-14,-8 Q0,8 14,-8" fill="none" stroke="#2B1B54" stroke-width="3.5" stroke-linecap="round"/>' +
      '<ellipse class="mouth" cx="0" cy="-2" rx="9" ry="8" fill="#5B1F46"/></g></g>';
    return s;
  }
  function heart(x, y, k, cls) {
    return '<g class="heart ' + cls + '" transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><g class="hb"><path d="M0,16 C-26,-2 -20,-26 -6,-22 C-2,-21 0,-18 0,-16 C0,-18 2,-21 6,-22 C20,-26 26,-2 0,16 Z" fill="#FF4F86" stroke="#B3134B" stroke-width="3" stroke-linejoin="round"/><ellipse cx="-8" cy="-12" rx="4.5" ry="3" fill="#fff" opacity=".55"/></g></g>';
  }
  function finn(o) {
    var id = 'f' + (++uid);
    return '<g class="ff-finn' + (o.cls ? ' ' + o.cls : '') + '"><g class="fbob">' +
      '<defs><clipPath id="' + id + '"><ellipse cx="0" cy="0" rx="66" ry="44"/></clipPath></defs>' +
      '<path class="tail" d="M58,0 L96,-30 Q104,0 96,30 Z" fill="#FF8A2B" stroke="#151515" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<path class="fin" d="M-6,-42 Q10,-72 38,-40 Z" fill="#FF8A2B" stroke="#151515" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<ellipse cx="0" cy="0" rx="66" ry="44" fill="#FF8A2B"/>' +
      '<g clip-path="url(#' + id + ')"><path d="M-30,-50 Q-18,0 -30,50 L-14,50 Q-2,0 -14,-50 Z" fill="#fff" stroke="#151515" stroke-width="3"/><path d="M14,-50 Q26,0 14,50 L32,50 Q44,0 32,-50 Z" fill="#fff" stroke="#151515" stroke-width="3"/></g>' +
      '<ellipse cx="0" cy="0" rx="66" ry="44" fill="none" stroke="#151515" stroke-width="3.5"/>' +
      '<path class="fin2" d="M-4,18 Q-24,46 -38,26 Q-22,14 -4,18 Z" fill="#FF8A2B" stroke="#151515" stroke-width="3" stroke-linejoin="round"/>' +
      '<g class="feye"><circle cx="-42" cy="-8" r="13" fill="#fff"/><circle class="pup" cx="-45" cy="-7" r="6.4" fill="#151515"/><circle cx="-47" cy="-10" r="2.3" fill="#fff"/></g>' +
      '<circle cx="-42" cy="-8" r="17" fill="rgba(180,230,255,.28)" stroke="#2B3A67" stroke-width="3.2"/><path d="M-25,-9 L-14,-12" stroke="#2B3A67" stroke-width="3" stroke-linecap="round"/>' +
      '<path class="smile" d="M-60,16 Q-50,24 -40,16" fill="none" stroke="#151515" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse class="mouth" cx="-52" cy="17" rx="6" ry="5" fill="#7A1C1C"/></g></g>';
  }
  var CHARS = { ollie: ollie, finn: finn };

  /* sea backgrounds */
  function bg(kind) {
    var deep = kind === 'deep', top = deep ? '#0b2a63' : '#4cc9f0', mid = deep ? '#06183d' : '#1d8fd8', bot = deep ? '#030b22' : '#0b5fa8', gid = 'g' + (++uid);
    var s = '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + top + '"/><stop offset=".55" stop-color="' + mid + '"/><stop offset="1" stop-color="' + bot + '"/></linearGradient></defs>' +
      '<rect width="800" height="450" fill="url(#' + gid + ')"/>';
    if (!deep) s += '<g class="rays" opacity=".18" fill="#fff"><path d="M120,0 L220,0 L330,450 L170,450Z"/><path d="M420,0 L500,0 L640,450 L470,450Z"/><path d="M640,0 L700,0 L800,330 L720,450Z"/></g>';
    s += '<g class="bubbles">';
    for (var i = 0; i < 9; i++) s += '<circle class="bub b' + i + '" cx="' + (60 + i * 85 + (i % 3) * 14) + '" cy="470" r="' + (4 + (i % 4) * 3) + '" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>';
    s += '</g>';
    s += '<path d="M0,392 Q120,360 240,392 T480,388 T800,380 L800,450 L0,450Z" fill="' + (deep ? '#1a1038' : '#e8c88a') + '"/>' +
      '<path d="M0,414 Q140,396 280,414 T560,410 T800,408 L800,450 L0,450Z" fill="' + (deep ? '#120a2b' : '#d9b574') + '"/>';
    if (!deep) s += '<g class="weed"><path d="M60,400 q-14,-40 0,-80 q14,40 0,80z" fill="#22b573"/><path d="M82,404 q-12,-30 4,-60 q10,30 -4,60z" fill="#169c61"/><path d="M730,402 q-14,-44 2,-86 q16,44 -2,86z" fill="#22b573"/><path d="M752,406 q-10,-28 4,-52 q8,26 -4,52z" fill="#169c61"/></g>' +
      '<g transform="translate(655 392)"><path d="M-22,0 Q-24,-26 0,-30 Q24,-26 22,0Z" fill="#ff9fb3" stroke="#d96a86" stroke-width="2"/><path d="M-12,-2 L-6,-22 M0,-2 L0,-28 M12,-2 L6,-22" stroke="#d96a86" stroke-width="2" fill="none"/></g>';
    else s += '<g class="glow"><circle cx="150" cy="330" r="6" fill="#7df9ff"/><circle cx="640" cy="300" r="5" fill="#ff7df2"/><circle cx="700" cy="350" r="4" fill="#7df9ff"/><circle cx="90" cy="250" r="4" fill="#ffe97d"/></g>';
    return s;
  }

  function hydrate(root) {
    root.querySelectorAll('[data-bg]').forEach(function (g) { g.innerHTML = bg(g.getAttribute('data-bg')); });
    root.querySelectorAll('[data-char]').forEach(function (g) {
      var k = g.getAttribute('data-char'), x = +g.getAttribute('data-x') || 0, y = +g.getAttribute('data-y') || 0, s = +g.getAttribute('data-s') || 1, fl = g.hasAttribute('data-flip');
      g.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + (fl ? -s : s) + ' ' + s + ')');
      g.innerHTML = CHARS[k]({ xray: g.hasAttribute('data-xray'), cls: g.getAttribute('data-cls') || '' });
      g.classList.add('ff-char', 'is-' + k);
    });
  }

  /* ------------------------------------------------------------------ sound */
  var ac = null;
  function ctx() { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = false; } } if (ac && ac.state === 'suspended') ac.resume(); return ac; }
  function tone(f0, f1, t0, dur, vol, type) {
    var c = ctx(); if (!c) return; var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + .05);
  }
  var SFX = {
    beat: function () { tone(95, 55, 0, .16, .5); tone(80, 48, .2, .2, .42); },
    pop: function () { tone(500, 900, 0, .12, .25, 'triangle'); },
    whoosh: function () { tone(900, 160, 0, .5, .12, 'sawtooth'); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0, i * .11, .22, .22, 'triangle'); }); },
    ok: function () { tone(660, 0, 0, .12, .25, 'triangle'); tone(990, 0, .1, .2, .25, 'triangle'); },
    no: function () { tone(220, 160, 0, .25, .25, 'sawtooth'); }
  };

  /* ------------------------------------------------------------------ player */
  function Player(root) {
    var self = this, scenes = [].slice.call(root.querySelectorAll('.ff-scene')), stage = root.querySelector('.ff-stage');
    var bubble = root.querySelector('.ff-bubble'), bubbleText = root.querySelector('.ff-bubble-text'), who = root.querySelector('.ff-bubble-who');
    var bar = root.querySelector('.ff-progress-bar'), dots = root.querySelector('.ff-dots'), playBtn = root.querySelector('[data-act=play]');
    var cover = root.querySelector('.ff-cover'), end = root.querySelector('.ff-end'), sceneName = root.querySelector('.ff-scene-name');
    var idx = -1, playing = false, elapsed = 0, dur = 8000, last = 0, raf = 0, speed = 1, narrate = false, sound = true, beatTimer = 0, speechDone = true, started = false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    hydrate(root);
    scenes.forEach(function (s, i) { var d = document.createElement('button'); d.type = 'button'; d.className = 'ff-dot'; d.setAttribute('aria-label', 'Go to scene ' + (i + 1) + ': ' + (s.getAttribute('data-title') || '')); d.addEventListener('click', function () { start(); go(i); }); dots.appendChild(d); });
    function speak(t) {
      if (!narrate || !('speechSynthesis' in window)) { speechDone = true; return; }
      speechSynthesis.cancel(); speechDone = false; var u = new SpeechSynthesisUtterance(t); u.rate = Math.min(1.1, .95 * speed); u.pitch = 1.15;
      u.onend = u.onerror = function () { speechDone = true; }; speechSynthesis.speak(u);
    }
    function clearBeat() { if (beatTimer) { clearInterval(beatTimer); beatTimer = 0; } }
    function enterSfx(s) {
      clearBeat(); if (!sound) return; var k = s.getAttribute('data-sfx');
      if (k === 'heart') { SFX.beat(); beatTimer = setInterval(function () { if (playing) SFX.beat(); }, 900); }
      else if (SFX[k]) SFX[k]();
    }
    function go(i) {
      if (i < 0) i = 0; if (i >= scenes.length) { finish(); return; }
      scenes.forEach(function (s, j) { s.classList.toggle('active', j === i); });
      [].forEach.call(dots.children, function (d, j) { d.classList.toggle('done', j < i); d.classList.toggle('now', j === i); });
      idx = i; elapsed = 0; var s = scenes[i]; dur = +s.getAttribute('data-dur') || 8000;
      var say = s.getAttribute('data-say') || '', speaker = s.getAttribute('data-who') || 'finn';
      bubble.className = 'ff-bubble ' + speaker + ' ' + (s.getAttribute('data-side') || 'top-left'); bubble.hidden = !say;
      who.textContent = speaker === 'ollie' ? 'Ollie' : 'Finn'; bubbleText.textContent = say;
      root.setAttribute('data-speaker', speaker); sceneName.textContent = (i + 1) + '/' + scenes.length + ' · ' + (s.getAttribute('data-title') || '');
      end.hidden = true; speak(say); enterSfx(s); bar.style.width = '0%'; stage.classList.remove('ended');
    }
    function tick(now) {
      if (!playing) return; var dt = Math.min(80, now - last) * speed; last = now; elapsed += dt;
      bar.style.width = Math.min(100, (idx + Math.min(1, elapsed / dur)) / scenes.length * 100) + '%';
      if (elapsed >= dur && speechDone) { go(idx + 1); }
      raf = requestAnimationFrame(tick);
    }
    function start() { if (started) return; started = true; cover.hidden = true; ctx(); }
    function play() { start(); if (idx < 0 || !end.hidden) { go(0); } playing = true; root.classList.add('playing'); root.classList.remove('paused'); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); playBtn.textContent = '⏸'; playBtn.setAttribute('aria-label', 'Pause'); if (narrate && 'speechSynthesis' in window && speechSynthesis.paused) speechSynthesis.resume(); }
    function pause() { playing = false; root.classList.remove('playing'); root.classList.add('paused'); cancelAnimationFrame(raf); playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'Play'); if ('speechSynthesis' in window) speechSynthesis.pause(); }
    function finish() {
      playing = false; cancelAnimationFrame(raf); clearBeat(); root.classList.remove('playing'); root.classList.add('paused'); bar.style.width = '100%'; end.hidden = false; bubble.hidden = true; playBtn.textContent = '▶';
      [].forEach.call(dots.children, function (d) { d.classList.add('done'); d.classList.remove('now'); }); if (sound) SFX.win(); idx = scenes.length - 1; if ('speechSynthesis' in window) speechSynthesis.cancel();
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return; var a = b.getAttribute('data-act');
      if (a === 'play') { playing ? pause() : play(); }
      else if (a === 'cover') { play(); }
      else if (a === 'next') { start(); go(Math.min(scenes.length - 1, idx + 1)); if (!playing) { play(); } }
      else if (a === 'prev') { start(); go(Math.max(0, idx - 1)); if (!playing) { play(); } }
      else if (a === 'replay') { end.hidden = true; idx = -1; play(); }
      else if (a === 'speed') { speed = speed === 1 ? .75 : (speed === .75 ? 1.5 : 1); b.textContent = speed + '×'; }
      else if (a === 'voice') { narrate = !narrate; b.setAttribute('aria-pressed', narrate); b.classList.toggle('on', narrate); if (narrate && playing) speak(scenes[idx].getAttribute('data-say')); else if ('speechSynthesis' in window) speechSynthesis.cancel(); }
      else if (a === 'sound') { sound = !sound; b.setAttribute('aria-pressed', sound); b.classList.toggle('on', sound); if (!sound) clearBeat(); else if (playing) enterSfx(scenes[idx]); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.target.closest('button') && e.key === ' ') return;
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); playing ? pause() : play(); }
      else if (e.key === 'ArrowRight') { start(); go(Math.min(scenes.length - 1, idx + 1)); }
      else if (e.key === 'ArrowLeft') { start(); go(Math.max(0, idx - 1)); }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden && playing) pause(); });
    self.go = function (i) { start(); go(i); }; self.pause = pause; self.play = play; self.scenes = scenes;
    self.state = function () { return { idx: idx, playing: playing }; };
    if (reduce) root.classList.add('reduce');
  }

  /* ------------------------------------------------------------------ quiz */
  function Quiz(box) {
    var data = JSON.parse(box.querySelector('script[type="application/json"]').textContent), i = 0, score = 0, locked = false;
    var qEl = box.querySelector('.ff-q'), aEl = box.querySelector('.ff-a'), fb = box.querySelector('.ff-fb'), prog = box.querySelector('.ff-qprog'), next = box.querySelector('.ff-qnext');
    function shuffle(a) { for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = a[k]; a[k] = a[j]; a[j] = t; } return a; }
    function show() {
      var d = data[i]; locked = false; qEl.textContent = d.q; aEl.innerHTML = ''; fb.textContent = ''; fb.className = 'ff-fb'; next.hidden = true; prog.textContent = 'Question ' + (i + 1) + ' of ' + data.length;
      shuffle(d.o.map(function (t, k) { return { t: t, ok: k === 0 }; })).forEach(function (o) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'ff-ans'; b.textContent = o.t;
        b.addEventListener('click', function () {
          if (locked) return; locked = true; if (o.ok) { score++; b.classList.add('right'); fb.textContent = '🎉 Correct! ' + d.why; fb.className = 'ff-fb good'; SFX.ok(); }
          else { b.classList.add('wrong'); [].forEach.call(aEl.children, function (x) { if (x.textContent === d.o[0]) x.classList.add('right'); }); fb.textContent = 'Not quite. ' + d.why; fb.className = 'ff-fb bad'; SFX.no(); }
          next.hidden = false; next.textContent = i === data.length - 1 ? 'See my score' : 'Next question →';
        }); aEl.appendChild(b);
      });
    }
    next.addEventListener('click', function () {
      if (i < data.length - 1) { i++; show(); return; }
      var stars = score === data.length ? '🌟🌟🌟' : (score >= data.length - 1 ? '🌟🌟' : '🌟'); qEl.textContent = stars + ' You scored ' + score + ' out of ' + data.length + '!'; aEl.innerHTML = ''; fb.textContent = score === data.length ? 'Perfect! You are an octopus expert.' : 'Watch the cartoon again and try once more!'; fb.className = 'ff-fb good'; prog.textContent = 'Quiz complete';
      next.textContent = 'Try again'; next.onclick = function () { i = 0; score = 0; next.onclick = null; show(); }; if (score === data.length) SFX.win();
    }); show();
  }

  window.FF = { init: function (sel) { var el = document.querySelector(sel || '.ff-player'); var p = new Player(el); window.FF.player = p; return p; }, quiz: function (sel) { document.querySelectorAll(sel || '.ff-quiz').forEach(Quiz); }, hydrate: hydrate };
})();
