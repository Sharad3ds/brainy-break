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
  function dilly(o) {
    var c = o.cls || '', B = '#5FA3E8', D = '#2F6FB5', L = '#EAF5FF', brain = '';
    if (o.xray) brain = '<g class="brain" transform="translate(-6 -128) scale(1.7)"><path d="M0,-26 C-34,-36 -58,-2 -32,24 C-16,36 -4,28 0,18Z" fill="#9FB3D9" stroke="#51638f" stroke-width="3"/><path class="awake" d="M0,-26 C34,-36 58,-2 32,24 C16,36 4,28 0,18Z" fill="#FFD166" stroke="#c98b00" stroke-width="3"/><text x="-30" y="0" font-size="20" font-weight="800" fill="#34406b" text-anchor="middle">z z</text><circle cx="26" cy="-2" r="4" fill="#fff"/><circle cx="26" cy="-2" r="2" fill="#2B1B54"/></g>';
    var eye = /closed/.test(c) ? '<path d="M-83,-12 q12,10 24,0" fill="none" stroke="#12315a" stroke-width="4" stroke-linecap="round"/>' :
      '<g class="eye"><ellipse cx="-70" cy="-14" rx="13" ry="15" fill="#fff" stroke="' + D + '" stroke-width="2"/><circle class="pup" cx="-73" cy="-12" r="7.5" fill="#12315a"/><circle cx="-76" cy="-16" r="2.8" fill="#fff"/></g>';
    return '<g class="ff-dilly' + (c ? ' ' + c : '') + '"><g class="dbob">' +
      '<path class="tail" d="M92,-6 Q132,-14 148,-44 Q134,-6 152,26 Q118,10 92,18Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M-6,-44 Q22,-98 58,-38Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M-96,2 C-88,-30 -50,-52 0,-52 C60,-52 92,-28 100,6 C92,32 50,48 -4,48 C-50,48 -84,32 -96,2Z" fill="' + B + '" stroke="' + D + '" stroke-width="4"/>' +
      '<path d="M-92,12 C-70,40 -30,48 0,48 C50,48 88,32 98,10 C70,28 20,28 -30,24 C-60,22 -80,16 -92,12Z" fill="' + L + '"/>' +
      '<path d="M-90,-4 C-120,-8 -150,-2 -158,10 C-152,22 -120,24 -86,18Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path class="smile" d="M-154,12 Q-120,28 -88,14" fill="none" stroke="#12315a" stroke-width="3.5" stroke-linecap="round"/><ellipse class="mouth" cx="-128" cy="16" rx="11" ry="7" fill="#5B1F46"/>' +
      '<path d="M-30,26 Q-52,66 -8,58 Q2,42 -6,28Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      eye + '<ellipse cx="-52" cy="8" rx="9" ry="5.5" fill="#FF8FB1" opacity=".7"/>' + brain + '</g></g>';
  }
  function sunny(o) {
    var B = '#7C98B3', D = '#41576e', L = '#F2F6FA', t = '';
    for (var i = 0; i < 9; i++) t += 'l4.2,11 l4.2,-11 ';
    return '<g class="ff-sunny' + (o.cls ? ' ' + o.cls : '') + '"><g class="dbob">' +
      '<path class="tail" d="M100,-4 L160,-60 Q144,-6 166,54 L100,14Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M-6,-48 L36,-114 L54,-44Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M-132,8 C-112,-32 -50,-56 20,-50 C72,-46 102,-22 110,0 C100,28 60,46 0,48 C-60,50 -114,36 -132,8Z" fill="' + B + '" stroke="' + D + '" stroke-width="4"/>' +
      '<path d="M-124,14 C-100,40 -50,48 0,48 C58,46 96,28 106,6 C70,26 10,30 -50,26 C-84,24 -108,20 -124,14Z" fill="' + L + '"/>' +
      '<path d="M-34,-12 q8,12 0,26 M-24,-14 q8,12 0,28 M-14,-14 q8,12 0,28" fill="none" stroke="' + D + '" stroke-width="3" stroke-linecap="round" opacity=".6"/>' +
      '<path d="M-36,28 Q-70,84 -6,66Z" fill="' + B + '" stroke="' + D + '" stroke-width="4" stroke-linejoin="round"/>' +
      '<ellipse class="mouth" cx="-100" cy="22" rx="24" ry="10" fill="#5B1F46"/><path d="M-126,14 ' + t + '" fill="#fff" stroke="#9aa" stroke-width="1"/>' +
      '<path class="smile" d="M-128,14 Q-100,30 -72,14" fill="none" stroke="#1d2b3a" stroke-width="3.5" stroke-linecap="round"/>' +
      '<g class="eye"><ellipse cx="-84" cy="-12" rx="13" ry="15" fill="#fff" stroke="' + D + '" stroke-width="2"/><circle class="pup" cx="-87" cy="-10" r="7.5" fill="#12212f"/><circle cx="-90" cy="-14" r="2.8" fill="#fff"/></g>' +
      '<ellipse cx="-64" cy="6" rx="9" ry="5.5" fill="#FF8FB1" opacity=".7"/></g></g>';
  }
  var CHARS = { ollie: ollie, finn: finn, dilly: dilly, sunny: sunny };
  window.__ffReg = function (k, fn, name, slot, pitch) { CHARS[k] = fn; NAMES[k] = name; VSLOT[k] = slot; PITCH[k] = pitch; };
  var NAMES = { ollie: 'Ollie', finn: 'Finn', dilly: 'Dilly', sunny: 'Sunny' }, VSLOT = { ollie: 'ollie', dilly: 'ollie', finn: 'finn', sunny: 'finn' }, PITCH = { ollie: 1.12, dilly: 1.18, finn: .98, sunny: .78 };

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
    var idx = -1, playing = false, elapsed = 0, dur = 8000, last = 0, raf = 0, speed = 1, narrate = true, sound = true, beatTimer = 0, speechDone = true, started = false;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    hydrate(root);
    scenes.forEach(function (s, i) { var d = document.createElement('button'); d.type = 'button'; d.className = 'ff-dot'; d.setAttribute('aria-label', 'Go to scene ' + (i + 1) + ': ' + (s.getAttribute('data-title') || '')); d.addEventListener('click', function () { start(); go(i); }); dots.appendChild(d); });
    /* ---- voices: rank by naturalness (neural/online/premium first); user can also pick per character (remembered) */
    var voices = { ollie: null, finn: null }, saved = {};
    try { saved = JSON.parse(localStorage.getItem('ffVoices') || '{}'); } catch (e) {}
    var FEM = /female|samantha|aria|jenny|ava|allison|karen|moira|serena|zira|susan|sonia|libby|emma|michelle|nova|siri.*(female|voice 1|voice 4)|google uk english female|google us english/i,
        MAL = /(^|[^a-z])male|daniel|guy|ryan|davis|alex|fred|aaron|arthur|george|mark|david|brian|eric|roger|google uk english male/i;
    function scoreV(v) {
      if (!/^en/i.test(v.lang)) return -1; var n = v.name, sc = 0;
      if (/natural|neural/i.test(n)) sc += 80; if (/online/i.test(n)) sc += 40; if (/premium|enhanced/i.test(n)) sc += 45; if (/siri/i.test(n)) sc += 35; if (/google/i.test(n)) sc += 25;
      if (/en[-_](US|GB|AU|IN)/i.test(v.lang)) sc += 5; if (v.localService === false) sc += 3; if (/espeak|compact|novelty|bad news|whisper|zarvox|trinoids|bells|organ|cellos|albert|boing|bubbles|deranged|hysterical|junior|kathy|ralph|superstar/i.test(n)) sc -= 60; return sc;
    }
    var allVoices = [];
    function pickVoices() {
      if (!('speechSynthesis' in window)) return; allVoices = speechSynthesis.getVoices().filter(function (v) { return scoreV(v) >= 0; }).sort(function (a, b) { return scoreV(b) - scoreV(a); });
      if (!allVoices.length) return;
      function byName(n) { return allVoices.filter(function (v) { return v.name === n; })[0]; }
      voices.ollie = byName(saved.ollie) || allVoices.filter(function (v) { return FEM.test(v.name) && !MAL.test(v.name); })[0] || allVoices[0];
      voices.finn = byName(saved.finn) || allVoices.filter(function (v) { return MAL.test(v.name) && v !== voices.ollie; })[0] || allVoices.filter(function (v) { return v !== voices.ollie; })[0] || allVoices[0];
      buildPicker();
    }
    function buildPicker() {
      var old = root.parentNode.querySelector('.ff-voices'); if (old) old.remove(); if (!allVoices.length) return;
      var box = document.createElement('div'); box.className = 'ff-voices';
      box.innerHTML = '<b>🎙 Voices</b> <span>Pick the most natural-sounding voice on your device (names with “Natural”, “Neural” or “Premium” sound best).</span>';
      ['ollie', 'finn'].forEach(function (k) {
        var l = document.createElement('label'), sel = document.createElement('select'); l.textContent = (k === 'ollie' ? 'Ollie 🐙 ' : 'Finn 🐠 ');
        allVoices.forEach(function (v) { var o = document.createElement('option'); o.value = v.name; o.textContent = v.name.replace(/^Microsoft /, '') + ' (' + v.lang + ')'; if (voices[k] === v) o.selected = true; sel.appendChild(o); });
        sel.addEventListener('change', function () { voices[k] = allVoices.filter(function (v) { return v.name === sel.value; })[0]; saved[k] = sel.value; try { localStorage.setItem('ffVoices', JSON.stringify(saved)); } catch (e) {} testSay(k); });
        l.appendChild(sel); box.appendChild(l);
      });
      var anchor = root.nextElementSibling && root.nextElementSibling.classList.contains('ff-note') ? root.nextElementSibling : root; anchor.parentNode.insertBefore(box, anchor.nextSibling);
    }
    function testSay(k) { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(k === 'ollie' ? "Hi, I'm Ollie the octopus!" : "Hi, I'm Finn the clownfish!"); if (voices[k]) { u.voice = voices[k]; u.lang = voices[k].lang; } u.pitch = k === 'ollie' ? 1.12 : 1; u.rate = .95; speechSynthesis.speak(u); }
    if ('speechSynthesis' in window) { pickVoices(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pickVoices); }
    /* ---- lip-sync: mouth opens on each spoken word (word-boundary events), steady talking if the voice sends none */
    var lip = { on: false, until: 0, bounded: false, startedAt: 0, who: 'finn', raf: 0 };
    function mouths() { return root.querySelectorAll('.is-' + lip.who + ' .mouth'); }
    function setMouth(v) { var m = mouths(); for (var i = 0; i < m.length; i++) m[i].style.transform = 'scaleY(' + v.toFixed(2) + ')'; }
    function lipLoop(now) {
      if (!lip.on) { setMouth(.12); lip.raf = 0; return; }
      var open;
      if (lip.bounded) open = now < lip.until ? .3 + .7 * Math.abs(Math.sin(now / 70)) : .1;
      else if (now - lip.startedAt > 500) open = .25 + .75 * Math.abs(Math.sin(now / 85));
      else open = .1;
      setMouth(open); lip.raf = requestAnimationFrame(lipLoop);
    }
    function lipStart(who) { lip.who = who; lip.on = true; lip.startedAt = performance.now(); root.classList.add('vs'); if (!lip.raf) lip.raf = requestAnimationFrame(lipLoop); }
    function lipStop() { lip.on = false; root.classList.remove('vs'); [].forEach.call(root.querySelectorAll('.mouth'), function (m) { m.style.transform = ''; }); }
    /* ---- speech: spoken sentence by sentence with natural rhythm (questions lift, exclamations brighten, slight variation so it is not monotone) */
    var gen = 0, sp = null, keep = [], wd = 0;
    function say(i) {
      if (!sp) return; var my = sp.my; if (my !== gen) return; clearTimeout(wd); sp.i = i;
      if (i >= sp.parts.length) { speechDone = true; lipStop(); sp = null; return; }
      var seg = sp.parts[i].trim(); if (!seg) { say(i + 1); return; }
      var who = sp.who, u = new SpeechSynthesisUtterance(seg), v = voices[VSLOT[who] || 'finn'], tries = sp.tries[i] || 0, fin = false;
      if (v && tries < 2) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      var q = /\?$/.test(seg), ex = /!$/.test(seg), wob = (i % 2 ? .03 : -.02), baseP = PITCH[who] || 1, baseR = (VSLOT[who] === 'ollie') ? .98 : .93;
      u.pitch = Math.max(.6, Math.min(1.7, baseP + (q ? .14 : 0) + (ex ? .08 : 0) + wob)); u.rate = Math.min(1.35, (baseR + (ex ? .04 : 0) - (q ? .02 : 0)) * speed); u.volume = 1;
      keep.push(u); if (keep.length > 8) keep.shift();   /* hold a reference: Chrome can silently drop speech if the utterance is garbage-collected */
      function next() { if (fin) return; fin = true; clearTimeout(wd); lip.on = false; setMouth(.12); if (my === gen) setTimeout(function () { say(i + 1); }, /[.!?]$/.test(seg) ? 140 : 40); }
      function retry() { if (fin || my !== gen) return; fin = true; clearTimeout(wd); try { speechSynthesis.cancel(); } catch (e) {} sp.tries[i] = tries + 1; if (sp.tries[i] > 2) { say(i + 1); return; } setTimeout(function () { if (my === gen) say(i); }, 120); }
      u.onstart = function () { if (my === gen) { lipStart(who); clearTimeout(wd); wd = setTimeout(retry, Math.max(4500, seg.split(/\s+/).length * 900 / u.rate)); } };
      u.onboundary = function (e) { if (my !== gen || (e.name && e.name !== 'word')) return; lip.bounded = true; var m = seg.slice(e.charIndex).match(/^[^\s,.!?]+/), len = m ? m[0].length : 3; lip.until = performance.now() + Math.max(130, len * 80 / u.rate); clearTimeout(wd); wd = setTimeout(retry, 5000); };
      u.onend = next;
      u.onerror = function (e) { if (my !== gen) return; if (e && (e.error === 'canceled' || e.error === 'interrupted')) return; retry(); };
      wd = setTimeout(retry, 3500);   /* never started: retry (falls back to the default voice) */
      try { speechSynthesis.speak(u); } catch (e) { retry(); }
    }
    function speak(t) {
      lipStop(); gen++; clearTimeout(wd); sp = null;
      if (!narrate || !('speechSynthesis' in window) || !t) { speechDone = true; return; }
      try { speechSynthesis.cancel(); } catch (e) {} speechDone = false;
      sp = { my: gen, who: scenes[idx] ? (scenes[idx].getAttribute('data-who') || 'finn') : 'finn', parts: (t.replace(/(\d)\.(\d)/g, '$1\u2024$2').match(/[^.!?]+[.!?]*/g) || [t]).map(function (x) { return x.replace(/\u2024/g, '.'); }), i: 0, tries: {}, paused: false };
      var my = gen; setTimeout(function () { if (my === gen && sp && !sp.paused) say(0); }, 80);   /* small gap after cancel() — speaking instantly after cancel can be dropped */
    }
    function holdSpeech() { if (sp && !speechDone) { sp.paused = true; gen++; clearTimeout(wd); try { speechSynthesis.cancel(); } catch (e) {} lipStop(); } }
    function resumeSpeech() { if (sp && sp.paused && narrate) { sp.paused = false; gen++; sp.my = gen; setTimeout(function () { if (sp && sp.my === gen) say(sp.i); }, 80); } }
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
      who.textContent = NAMES[speaker] || 'Finn'; bubbleText.textContent = say;
      root.setAttribute('data-speaker', speaker); sceneName.textContent = (i + 1) + '/' + scenes.length + ' · ' + (s.getAttribute('data-title') || '');
      end.hidden = true; speak(say); enterSfx(s); bar.style.width = '0%'; stage.classList.remove('ended');
    }
    function tick(now) {
      if (!playing) return; var dt = Math.min(80, now - last) * speed; last = now; elapsed += dt;
      bar.style.width = Math.min(100, (idx + Math.min(1, elapsed / dur)) / scenes.length * 100) + '%';
      if (elapsed >= dur && speechDone) { go(idx + 1); }
      raf = requestAnimationFrame(tick);
    }
    function isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || root.classList.contains('ff-fs'); }
    function syncFull() { var f = isFull(), b = root.querySelector('[data-act=full]'); if (b) { b.textContent = f ? '🗗' : '⛶'; b.setAttribute('aria-label', f ? 'Exit full screen' : 'Full screen'); b.setAttribute('aria-pressed', f); } }
    function toggleFull() {
      var rf = root.requestFullscreen || root.webkitRequestFullscreen, ex = document.exitFullscreen || document.webkitExitFullscreen;
      if (document.fullscreenElement || document.webkitFullscreenElement) { ex.call(document); return; }
      if (root.classList.contains('ff-fs')) { root.classList.remove('ff-fs'); document.documentElement.classList.remove('ff-lock'); syncFull(); return; }
      var done = false;
      if (rf) { try { var r = rf.call(root); if (r && r.catch) r.catch(function () { cssFull(); }); done = true; } catch (e) {} }
      if (!done) cssFull();
    }
    function cssFull() { root.classList.add('ff-fs'); document.documentElement.classList.add('ff-lock'); syncFull(); }
    document.addEventListener('fullscreenchange', syncFull); document.addEventListener('webkitfullscreenchange', syncFull);
    function start() { if (started) return; started = true; cover.hidden = true; ctx(); }
    function play() { start(); if (idx < 0 || !end.hidden) { go(0); } playing = true; root.classList.add('playing'); root.classList.remove('paused'); last = performance.now(); cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); playBtn.textContent = '⏸'; playBtn.setAttribute('aria-label', 'Pause'); resumeSpeech(); }
    function pause() { playing = false; root.classList.remove('playing'); root.classList.add('paused'); cancelAnimationFrame(raf); playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'Play'); holdSpeech(); }
    function finish() {
      playing = false; cancelAnimationFrame(raf); clearBeat(); root.classList.remove('playing'); root.classList.add('paused'); bar.style.width = '100%'; end.hidden = false; bubble.hidden = true; playBtn.textContent = '▶';
      [].forEach.call(dots.children, function (d) { d.classList.add('done'); d.classList.remove('now'); }); if (sound) SFX.win(); idx = scenes.length - 1; if ('speechSynthesis' in window) speechSynthesis.cancel(); lipStop();
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return; var a = b.getAttribute('data-act');
      if (a === 'play') { playing ? pause() : play(); }
      else if (a === 'cover') { play(); }
      else if (a === 'full') { toggleFull(); }
      else if (a === 'next') { start(); go(Math.min(scenes.length - 1, idx + 1)); if (!playing) { play(); } }
      else if (a === 'prev') { start(); go(Math.max(0, idx - 1)); if (!playing) { play(); } }
      else if (a === 'replay') { end.hidden = true; idx = -1; play(); }
      else if (a === 'speed') { speed = speed === 1 ? .75 : (speed === .75 ? 1.5 : 1); b.textContent = speed + '×'; }
      else if (a === 'voice') { narrate = !narrate; b.setAttribute('aria-pressed', narrate); b.classList.toggle('on', narrate); if (narrate && playing) speak(scenes[idx].getAttribute('data-say')); else { gen++; sp = null; clearTimeout(wd); speechDone = true; lipStop(); if ('speechSynthesis' in window) speechSynthesis.cancel(); } }
      else if (a === 'sound') { sound = !sound; b.setAttribute('aria-pressed', sound); b.classList.toggle('on', sound); if (!sound) clearBeat(); else if (playing) enterSfx(scenes[idx]); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.target.closest('button') && e.key === ' ') return;
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); playing ? pause() : play(); }
      else if (e.key === 'f' || e.key === 'F') { toggleFull(); }
      else if (e.key === 'Escape' && root.classList.contains('ff-fs')) { toggleFull(); }
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
    function celebrate(score, total) {
      var old = box.querySelector('.ff-result'); if (old) old.remove();
      var hero = box.getAttribute('data-hero') || 'ollie', who = { ollie: 'Ollie', dilly: 'Dilly', sunny: 'Sunny' }[hero] || 'Ollie', tier = score === total ? 'perfect' : (score >= total - 1 ? 'great' : 'try'), r = document.createElement('div'); r.className = 'ff-result ' + tier;
      var msg = tier === 'perfect' ? who + ' is dancing with joy!' : (tier === 'great' ? who + ' is clapping for you!' : who + ' says: you can do it!');
      var svg = '<svg viewBox="0 0 400 230" role="img" aria-label="' + msg + '"><g data-bg="shallow" transform="scale(.5 .51)"></g>' +
        '<g class="rj"><g data-char="' + hero + '" data-x="' + (hero === 'ollie' ? 200 : 215) + '" data-y="' + (hero === 'ollie' ? 128 : 150) + '" data-s="' + (hero === 'ollie' ? .78 : .68) + '"' + (tier === 'perfect' && hero === 'ollie' ? ' data-xray' : '') + '></g></g>' +
        '<g data-char="finn" data-x="62" data-y="190" data-s=".5"></g>';
      if (tier === 'perfect') svg += '<text class="ff-cap fx-in rt" x="200" y="34" text-anchor="middle">🏆 PERFECT! 🏆</text>';
      else if (tier === 'great') svg += '<text class="ff-cap fx-in rt" x="200" y="34" text-anchor="middle">⭐ Great job! ⭐</text>';
      else svg += '<text class="ff-cap fx-in rt" x="200" y="34" text-anchor="middle">💪 Keep going!</text>';
      r.innerHTML = svg + '</svg>'; var n = tier === 'perfect' ? 36 : (tier === 'great' ? 16 : 0), cols = ['#FF4F86', '#FFD166', '#4cc9f0', '#9F7AEA', '#22b573', '#FF8A2B'];
      for (var i = 0; i < n; i++) { var c = document.createElement('i'); c.className = 'ff-conf'; c.style.cssText = 'left:' + (Math.random() * 100) + '%;background:' + cols[i % 6] + ';animation-delay:' + (Math.random() * 1.6).toFixed(2) + 's;animation-duration:' + (2.2 + Math.random() * 1.6).toFixed(2) + 's;' + (i % 3 ? '' : 'border-radius:50%;'); r.appendChild(c); }
      if (tier === 'try') for (var j = 0; j < 6; j++) { var h = document.createElement('i'); h.className = 'ff-up'; h.textContent = '💙'; h.style.cssText = 'left:' + (12 + j * 15) + '%;animation-delay:' + (j * .4) + 's'; r.appendChild(h); }
      box.insertBefore(r, qEl); hydrate(r); r.classList.add('go');
      if (tier === 'perfect') { SFX.win(); setTimeout(SFX.win, 700); } else if (tier === 'great') SFX.ok(); else SFX.pop();
    }
    function show() {
      var rr = box.querySelector('.ff-result'); if (rr) rr.remove();
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
      var stars = score === data.length ? '🌟🌟🌟' : (score >= data.length - 1 ? '🌟🌟' : '🌟'); qEl.textContent = stars + ' You scored ' + score + ' out of ' + data.length + '!'; aEl.innerHTML = ''; fb.textContent = score === data.length ? (box.getAttribute('data-expert') || 'Perfect! You are an expert!') : 'Watch the cartoon again and try once more!'; fb.className = 'ff-fb good'; prog.textContent = 'Quiz complete'; celebrate(score, data.length);
      next.textContent = 'Try again'; next.onclick = function () { i = 0; score = 0; next.onclick = null; show(); }; 
    }); show();
  }

  window.FF = { init: function (sel) { var el = document.querySelector(sel || '.ff-player'); var p = new Player(el); window.FF.player = p; return p; }, quiz: function (sel) { document.querySelectorAll(sel || '.ff-quiz').forEach(Quiz); }, hydrate: hydrate };
})();
