/* Brainy Break — extra cartoon sea animals for Fun Facts. Each character faces left, is centred on (0,0) and has .eye/.pup/.smile/.mouth parts so it can blink and lip-sync. */
(function () {
  'use strict';
  var K = '#1b2440';
  function eye(x, y, r, k) { r = r || 12; return '<g class="eye"><ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 1.12) + '" fill="#fff" stroke="' + (k || K) + '" stroke-width="2"/><circle class="pup" cx="' + (x - r * .2) + '" cy="' + (y + r * .15) + '" r="' + (r * .55) + '" fill="#12192e"/><circle cx="' + (x - r * .45) + '" cy="' + (y - r * .25) + '" r="' + (r * .22) + '" fill="#fff"/></g>'; }
  function blush(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="5.5" fill="#FF8FB1" opacity=".7"/>'; }
  function mouth(x, y, rx, ry) { return '<path class="smile" d="M' + (x - rx * 1.4) + ',' + (y - 2) + ' Q' + x + ',' + (y + ry * 2.6) + ' ' + (x + rx * 1.4) + ',' + (y - 2) + '" fill="none" stroke="' + K + '" stroke-width="3.2" stroke-linecap="round"/><ellipse class="mouth" cx="' + x + '" cy="' + (y + 2) + '" rx="' + rx + '" ry="' + ry + '" fill="#5B1F46"/>'; }
  function P(d, f, s, w) { return '<path d="' + d + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 4) + '" stroke-linejoin="round" stroke-linecap="round"' : '') + '/>'; }
  function E(cx, cy, rx, ry, f, s, w, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 4) + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; }
  function L(d, c, w) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function wrap(k, o, inner) { return '<g class="ff-' + k + (o.cls ? ' ' + o.cls : '') + '"><g class="dbob">' + inner + '</g></g>'; }
  function has(o, w) { return (o.cls || '').indexOf(w) > -1; }

  /* ---------- whales ---------- */
  function whale(kind) {
    var C = { blue: ['#5C8DB8', '#D3E6F3', '#2D5D86'], hump: ['#4B6280', '#E6EEF6', '#243449'], orca: ['#232A38', '#FFFFFF', '#0D1118'], beluga: ['#F5F8FC', '#FFFFFF', '#9FB0C4'], narwhal: ['#A5B2C0', '#EEF3F8', '#58687A'], sperm: ['#76859A', '#B9C4D2', '#3F4C5E'] }[kind];
    return function (o) {
      var s = '';
      if (kind === 'narwhal') s += L('M-150,-4 L-262,-28', '#F6EEDC', 10) + L('M-190,-12 l6,10 M-214,-17 l6,10 M-238,-22 l6,10', '#d9c9a3', 3);
      s += P('M-150,6 C-140,-40 -70,-62 10,-58 C80,-54 120,-34 146,-16 L190,-54 Q182,-12 198,34 L146,8 C112,40 36,58 -40,54 C-104,50 -146,36 -150,6Z', C[0], C[2]);
      if (kind === 'sperm') s += P('M-162,-48 L-70,-62 L-40,42 L-152,48 Q-180,0 -162,-48Z', C[0], C[2]);
      if (kind === 'beluga') s += E(-128, -32, 30, 22, C[0], C[2]);
      s += P('M-146,12 C-120,40 -60,52 -20,52 C50,54 110,40 144,10 C100,30 30,34 -40,30 C-100,28 -130,22 -146,12Z', C[1]);
      if (kind === 'orca') s += E(-84, -26, 24, 10, '#fff', 0, 0, -20) + P('M16,-58 L48,-124 L78,-54Z', C[0], C[2]);
      if (kind === 'blue') s += P('M70,-52 l14,-18 l10,22z', C[0], C[2], 3);
      if (kind === 'hump') s += P('M60,-54 q14,-22 28,2z', C[0], C[2], 3) + '<circle cx="-120" cy="-36" r="4" fill="' + C[2] + '"/><circle cx="-104" cy="-44" r="4" fill="' + C[2] + '"/><circle cx="-136" cy="-26" r="4" fill="' + C[2] + '"/>';
      if (kind === 'narwhal') s += '<circle cx="-30" cy="-30" r="5" fill="#6b7b8c"/><circle cx="10" cy="-40" r="6" fill="#6b7b8c"/><circle cx="50" cy="-28" r="5" fill="#6b7b8c"/><circle cx="-60" cy="-16" r="4" fill="#6b7b8c"/><circle cx="80" cy="-18" r="4" fill="#6b7b8c"/>';
      s += P(kind === 'hump' ? 'M-44,24 Q-100,98 -6,70Z' : 'M-40,28 Q-70,80 -10,66Z', C[0], C[2]) + eye(-100, -8, 10) + blush(-92, 14) + mouth(-130, 22, 10, 6);
      if (has(o, 'spout')) s += '<g class="zz z1"><path d="M-70,-62 q-6,-40 -22,-54 M-70,-62 q6,-40 22,-54" fill="none" stroke="#bfe9ff" stroke-width="7" stroke-linecap="round"/></g>';
      return wrap(kind, o, s);
    };
  }
  /* ---------- seals, walrus, manatee ---------- */
  function pinniped(kind) {
    var C = { seal: ['#9AA7B4', '#E2E8EE', '#53606D'], sealion: ['#8B5E3C', '#B58863', '#4a2f1b'], walrus: ['#A9744F', '#C99B76', '#5b3a22'], eseal: ['#8E8B84', '#B8B5AD', '#4a4843'], manatee: ['#8896A6', '#B3BFCC', '#46535F'] }[kind];
    return function (o) {
      var s = '';
      s += kind === 'manatee' ? P('M120,6 C176,-26 188,56 118,50Z', C[0], C[2]) : P('M122,30 q30,-26 44,6 q-22,8 -44,-6Z', C[0], C[2]);
      s += P('M-100,22 C-110,-26 -40,-58 24,-50 C86,-44 118,-8 128,30 C96,52 -60,56 -100,22Z', C[0], C[2]);
      s += P('M-96,26 C-60,48 40,52 120,36 C80,40 -30,40 -96,26Z', C[1]);
      if (kind === 'seal') s += '<circle cx="10" cy="-20" r="5" fill="#66737f"/><circle cx="50" cy="-8" r="4" fill="#66737f"/><circle cx="-20" cy="-30" r="4" fill="#66737f"/><circle cx="80" cy="10" r="5" fill="#66737f"/>';
      if (kind === 'eseal') s += E(-106, -6, 24, 15, C[0], C[2], 3);
      if (kind === 'sealion') s += P('M-30,22 Q-62,-44 -18,-34Z', C[0], C[2]) + P('M-64,-40 q-8,-14 4,-14 q6,6 -4,14Z', C[2]);
      else s += P('M-44,30 q-14,32 20,28 q8,-14 -4,-30Z', C[0], C[2]);
      s += E(-100, 4, 7, 5, '#1b1b1b') + eye(-72, -16, kind === 'manatee' ? 7 : 11) + blush(-68, 8) + mouth(-88, 20, 8, 5);
      s += L('M-108,10 l-34,-6 M-108,14 l-34,10 M-108,6 l-30,-18', kind === 'walrus' ? '#f3e6c8' : '#e9e9e9', 2.5);
      if (kind === 'walrus') s += L('M-100,22 l-6,44 M-84,24 l-2,44', '#FFF8E0', 9) + E(-96, 14, 22, 12, '#D1A07A', 0) + '<circle cx="-110" cy="12" r="2" fill="#5b3a22"/><circle cx="-94" cy="10" r="2" fill="#5b3a22"/><circle cx="-102" cy="20" r="2" fill="#5b3a22"/>';
      return wrap(kind, o, s);
    };
  }
  function otter(o) {
    var s = L('M96,12 q50,-6 64,16', '#6b4526', 20) + E(0, 12, 104, 40, '#8B5E3C', '#4a2f1b') + E(-10, 18, 70, 22, '#B58863', 0);
    s += E(-100, -14, 36, 34, '#D9B48A', '#4a2f1b') + '<circle cx="-126" cy="-42" r="9" fill="#8B5E3C"/><circle cx="-74" cy="-42" r="9" fill="#8B5E3C"/>' + eye(-114, -20, 8) + eye(-86, -20, 8) + E(-100, -6, 8, 5, '#2a1a10') + mouth(-100, 6, 7, 4) + blush(-122, -4) + blush(-78, -4);
    s += E(-48, -8, 30, 13, '#8B5E3C', '#4a2f1b', 3, -20) + E(-34, -22, 11, 11, '#6b4526');
    if (has(o, 'rock')) s += E(-22, -34, 20, 14, '#9aa3ab', '#5c6770', 3);
    if (has(o, 'shell')) s += P('M-34,-36 q10,-22 22,0z', '#f4d9a6', '#b3834a', 3);
    s += '<path d="M-150,34 Q-110,22 -70,34 T10,34 T90,34 T170,34 L170,80 L-150,80Z" fill="#4cc9f0" opacity=".7"/>';
    return wrap('otter', o, s);
  }
  function penguin(o) {
    var s = E(-26, 94, 22, 9, '#FF9F1C') + E(26, 94, 22, 9, '#FF9F1C') + P('M-70,-10 Q-118,34 -86,64 Q-66,40 -66,10Z', '#1b2236', '#0b0f1c') + P('M70,-10 Q118,34 86,64 Q66,40 66,10Z', '#1b2236', '#0b0f1c');
    s += P('M0,-100 C60,-100 78,-40 72,20 C68,70 30,92 0,92 C-30,92 -68,70 -72,20 C-78,-40 -60,-100 0,-100Z', '#1b2236', '#0b0f1c') + E(0, 18, 48, 62, '#fff') + E(0, -48, 34, 16, '#FFD166', 0).replace('/>', ' opacity=".85"/>');
    s += eye(-22, -76, 9) + eye(22, -76, 9) + P('M-12,-64 L12,-64 L0,-42Z', '#FF9F1C', '#c4660a', 3) + blush(-40, -52) + blush(40, -52) + '<ellipse class="mouth" cx="0" cy="-52" rx="6" ry="3" fill="#5B1F46"/><path class="smile" d="M-8,-54 Q0,-46 8,-54" fill="none" stroke="' + K + '" stroke-width="2.5" stroke-linecap="round"/>';
    if (has(o, 'egg')) s += E(0, 92, 18, 22, '#fff', '#c8d3de', 3);
    return wrap('penguin', o, s);
  }
  /* ---------- fish ---------- */
  function seahorse(o) {
    var d = 'M10,-84 C50,-84 56,-36 28,-4 C0,28 6,66 44,74 C70,80 76,48 54,44', s = P('M50,-20 q44,6 24,50 q-24,-10 -24,-50Z', '#FFD6A5', '#d9822b', 3);
    s += L(d, '#b85f10', 46) + L(d, '#FFB347', 36) + L('M44,-46 q14,-4 18,-2 M40,-20 q14,-2 20,2 M24,6 q14,0 20,6', '#E07F10', 4);
    if (has(o, 'pouch')) s += E(26, 8, 22, 28, '#FFC9DE', '#e0709a', 3) + '<circle cx="22" cy="2" r="4" fill="#fff"/><circle cx="32" cy="12" r="4" fill="#fff"/><circle cx="20" cy="18" r="4" fill="#fff"/>';
    s += E(0, -88, 30, 26, '#FFB347', '#b85f10') + P('M-12,-98 L-62,-90 Q-70,-84 -62,-76 L-10,-72Z', '#FFB347', '#b85f10') + P('M-10,-112 l6,-16 l8,14 l8,-14 l4,18z', '#E07F10', '#b85f10', 3);
    return wrap('seahorse', o, s + eye(6, -92, 9) + blush(8, -74) + mouth(-60, -82, 4, 3));
  }
  function puffer(o) {
    var r = has(o, 'small') ? 46 : 70, s = '';
    if (!has(o, 'small')) for (var i = 0; i < 16; i++) { var a = i / 16 * 6.283, c = Math.cos(a), n = Math.sin(a); s += P('M' + (c * (r - 2) - n * 7) + ',' + (n * (r - 2) + c * 7) + ' L' + (c * (r + 18)) + ',' + (n * (r + 18)) + ' L' + (c * (r - 2) + n * 7) + ',' + (n * (r - 2) - c * 7) + 'Z', '#E0A800', '#b88300', 2); }
    s += P('M' + (r - 4) + ',0 l38,-26 v52z', '#F7C948', '#b88300', 3) + E(0, 0, r, r * .94, '#F7C948', '#b88300') + E(-4, r * .4, r * .75, r * .42, '#FFF2B8', 0) + P('M-6,' + (r * .66) + ' l-26,22 l36,-2z', '#F7C948', '#b88300', 3);
    s += '<circle cx="16" cy="-20" r="5" fill="#E0A800"/><circle cx="34" cy="2" r="4" fill="#E0A800"/><circle cx="10" cy="14" r="4" fill="#E0A800"/>' + eye(-r * .42, -r * .2, 13) + blush(-r * .6, r * .2) + mouth(-r * .78, r * .28, 6, 6);
    return wrap('puffer', o, s);
  }
  function angler(o) {
    var s = L('M-50,-52 C-60,-110 -110,-124 -122,-92', '#2c1c38', 5) + '<circle class="awake" cx="-122" cy="-92" r="26" fill="#FFF9A8" opacity=".35"/><circle cx="-122" cy="-92" r="13" fill="#FFF9A8" stroke="#e2c200" stroke-width="2"/>';
    s += P('M86,12 l54,-32 v64z', '#5A3E6B', '#2c1c38', 4) + E(0, 10, 90, 62, '#5A3E6B', '#2c1c38') + P('M-84,2 Q-44,52 4,26', 'rgba(0,0,0,0)', '#2c1c38', 5);
    var t = ''; for (var i = 0; i < 7; i++) t += 'M' + (-80 + i * 12) + ',' + (10 + i * 5) + ' l4,-12 l5,12 ';
    s += P(t, '#fff', '#9aa', 1) + E(-24, -14, 14, 15, '#FFE066', '#2c1c38', 3) + '<circle cx="-27" cy="-12" r="7" fill="#12192e"/><circle cx="-30" cy="-16" r="2.5" fill="#fff"/>' + blush(-48, 14) + mouth(-60, 28, 14, 8);
    return wrap('angler', o, s);
  }
  function manta(o) {
    var s = L('M0,64 Q6,110 -4,160', '#243a52', 8) + '<g class="wing">' + P('M0,-62 C60,-62 130,-72 192,-18 C150,-8 90,22 40,42 L0,70 L-40,42 C-90,22 -150,-8 -192,-18 C-130,-72 -60,-62 0,-62Z', '#2F4A66', '#162638') + P('M0,-30 C50,-30 100,-30 140,-12 C100,2 60,24 30,38 L0,56 L-30,38 C-60,24 -100,2 -140,-12 C-100,-30 -50,-30 0,-30Z', '#9FB7CF').replace('/>', ' opacity=".35"/>') + '</g>';
    s += P('M-26,-62 l-8,-24 l22,16z', '#2F4A66', '#162638', 3) + P('M26,-62 l8,-24 l-22,16z', '#2F4A66', '#162638', 3) + eye(-42, -36, 9) + eye(42, -36, 9) + '<circle cx="-14" cy="-20" r="3" fill="#162638"/><circle cx="14" cy="-20" r="3" fill="#162638"/>' + mouth(0, -52, 22, 7);
    return wrap('manta', o, s);
  }
  function wshark(o) {
    var s = P('M108,2 L160,-46 Q146,-6 164,42 L106,12Z', '#4A7FAE', '#27465f') + P('M-6,-42 L30,-100 L48,-38Z', '#4A7FAE', '#27465f') + P('M-140,6 C-130,-30 -60,-50 20,-46 C74,-42 104,-20 112,2 C102,26 60,42 0,44 C-70,46 -128,34 -140,6Z', '#4A7FAE', '#27465f') + P('M-134,12 C-100,34 -40,40 10,40 C60,40 98,28 108,8 C70,26 10,28 -50,24 C-90,22 -118,18 -134,12Z', '#EAF2F8');
    var sp = [[-60, -26], [-30, -34], [0, -24], [30, -34], [60, -22], [-44, -8], [-10, -10], [22, -8], [54, 0], [80, -10], [-76, 2], [-20, 8], [10, 4]];
    sp.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#fff"/>'; });
    s += P('M-34,24 Q-66,80 0,62Z', '#4A7FAE', '#27465f') + eye(-112, -10, 8) + blush(-100, 10) + mouth(-128, 14, 14, 5);
    return wrap('wshark', o, s);
  }
  function sword(o) {
    var s = P('M100,-6 L140,-42 Q130,0 142,42 L100,8Z', '#2c5380', '#17304d') + P('M-10,-30 Q30,-96 84,-16Z', '#2c5380', '#17304d') + P('M-64,-3 L-214,-9 L-64,7Z', '#6b7b8c', '#3f4c5e', 3) + P('M-66,0 C-46,-36 40,-42 102,-6 C40,38 -46,36 -66,0Z', '#3E6FA3', '#17304d') + P('M-60,10 C-30,32 40,28 98,-2 C40,14 -30,14 -60,10Z', '#DDEAF5') + eye(-40, -8, 11) + blush(-36, 12) + mouth(-60, 14, 5, 3);
    return wrap('sword', o, s);
  }
  function flyfish(o) {
    var s = P('M80,0 L120,-26 Q112,0 120,26Z', '#2d6a9f', '#17406a', 3) + P('M-10,-12 C20,-84 96,-96 140,-76 C86,-54 44,-22 24,0Z', '#BFE3FA', '#2d6a9f', 3) + P('M-10,8 C20,60 70,64 100,52 C64,40 36,24 24,6Z', '#BFE3FA', '#2d6a9f', 3);
    s += P('M-70,0 C-50,-32 50,-34 90,0 C50,30 -50,30 -70,0Z', '#5AA0D6', '#17406a') + P('M-62,6 C-30,26 40,24 86,2 C40,14 -30,14 -62,6Z', '#E9F5FD') + eye(-44, -5, 10) + blush(-36, 10) + mouth(-62, 8, 4, 3);
    return wrap('flyfish', o, s);
  }
  function moray(o) {
    var d = 'M130,60 C70,76 40,0 0,10 C-40,20 -52,-34 -92,-14', s = L(d, '#6b4a1e', 46) + L(d, '#C9A24B', 38);
    [[100, 58], [60, 36], [30, 8], [-10, 8], [-40, -8], [-64, -24]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="#7a5a1f"/>'; });
    s += E(-100, -22, 36, 25, '#C9A24B', '#6b4a1e', 4, -8) + P('M-126,-12 Q-96,10 -72,-6 L-74,14 Q-100,30 -128,10Z', '#E86B8B', '#8a2a45', 3) + '<ellipse class="mouth" cx="-110" cy="-8" rx="13" ry="3" fill="#5B1F46"/>';
    var t = ''; for (var i = 0; i < 5; i++) t += 'M' + (-128 + i * 11) + ',-12 l4,10 l4,-10 ';
    s += P(t, '#fff', '#9aa', 1) + eye(-94, -40, 9) + '<path class="smile" d="M-126,-4 Q-100,14 -74,-2" fill="none" stroke="' + K + '" stroke-width="3" stroke-linecap="round"/>' + blush(-84, -20);
    if (has(o, 'jaw')) s += E(-86, 4, 16, 9, '#FF9BB5', '#c4466b', 3) + '<path d="M-98,2 l5,-6 l5,6 M-86,2 l5,-6 l5,6" fill="#fff" stroke="#9aa" stroke-width="1"/>';
    return wrap('moray', o, s);
  }
  function remora(o) {
    var s = P('M70,0 L108,-24 Q100,0 108,24Z', '#5d6b78', '#2c363f', 3) + P('M-64,0 C-44,-30 40,-32 76,0 C40,26 -44,26 -64,0Z', '#7a8794', '#2c363f') + P('M-50,-24 Q-4,-40 44,-22 L40,-10 Q-4,-26 -46,-12Z', '#3c4752', '#1c232a', 3) + L('M-32,-26 v8 M-16,-28 v10 M0,-28 v10 M16,-27 v10 M30,-24 v10', '#aab4be', 2.5);
    return wrap('remora', o, s + eye(-40, -2, 9) + blush(-34, 12) + mouth(-58, 8, 4, 3));
  }
  /* ---------- soft animals ---------- */
  function jelly(o) {
    var c = has(o, 'blue') ? ['rgba(122,190,255,.8)', '#4a8fd6', '#cfe8ff'] : ['rgba(255,155,210,.8)', '#e0609f', '#ffd9ee'], s = '';
    [-48, -28, -8, 12, 32, 50].forEach(function (x, i) { s += '<g class="arm"><path d="M' + x + ',-2 q-14,40 0,70 q14,34 -4,66" fill="none" stroke="' + c[2] + '" stroke-width="6" stroke-linecap="round" opacity=".9"/></g>'; });
    s += '<g class="arm"><path d="M-14,0 q-18,50 4,90 M14,0 q20,50 -6,90" fill="none" stroke="' + c[1] + '" stroke-width="12" stroke-linecap="round" opacity=".8"/></g>';
    s += P('M-76,0 C-76,-82 76,-82 76,0 Q38,16 0,6 Q-38,16 -76,0Z', c[0], c[1]) + E(0, -34, 40, 22, '#fff', 0).replace('/>', ' opacity=".3"/>') + eye(-26, -26, 10) + eye(26, -26, 10) + blush(-44, -8) + blush(44, -8) + mouth(0, -6, 7, 4);
    return wrap('jelly', o, s);
  }
  function warship(o) {
    var s = '';
    [-40, -16, 8, 32, 56].forEach(function (x) { s += '<g class="arm"><path d="M' + x + ',14 q-16,50 0,92 q14,50 -6,100" fill="none" stroke="#4aa8ff" stroke-width="5" stroke-linecap="round"/></g>'; });
    s += P('M-92,4 C-70,-56 6,-72 84,-24 C50,-4 -44,16 -92,4Z', '#8BD3FF', '#2b79b8') + P('M-40,-44 C-20,-82 30,-92 60,-52 C30,-50 -10,-48 -40,-44Z', '#FF9BD2', '#c4468c', 3) + eye(-30, -14, 10) + eye(14, -18, 10) + blush(-48, 4) + mouth(-8, 4, 6, 4);
    return wrap('warship', o, s);
  }
  function star(o) {
    var pts = [], R = [96, 96, 96, 96, 96];
    if (has(o, 'regrow')) R[1] = 44;
    for (var i = 0; i < 10; i++) { var a = -1.5708 + i * .6283, r = i % 2 ? 42 : R[i >> 1]; pts.push((Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1)); }
    var s = '<polygon points="' + pts.join(' ') + '" fill="#FF8A3D" stroke="#c4501a" stroke-width="5" stroke-linejoin="round"/>';
    if (has(o, 'regrow')) s += '<ellipse cx="' + (Math.cos(-1.5708 + .6283 * 2) * 50).toFixed(1) + '" cy="' + (Math.sin(-1.5708 + .6283 * 2) * 50).toFixed(1) + '" rx="8" ry="6" fill="#FFB98A" stroke="#c4501a" stroke-width="2"/>';
    [[0, -70], [66, -22], [40, 58], [-40, 58], [-66, -22], [0, -36], [30, -4], [-30, -4]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#FFD0A8"/>'; });
    return wrap('star', o, s + eye(-14, -8, 10) + eye(14, -8, 10) + blush(-26, 10) + blush(26, 10) + mouth(0, 12, 6, 4));
  }
  function cucumber(o) {
    var s = '';
    for (var i = 0; i < 6; i++) s += L('M-126,' + (6 + (i - 2.5) * 5) + ' l-' + (14 + i % 2 * 6) + ',' + ((i - 2.5) * 6), '#C9D58A', 5);
    s += P('M-112,10 C-112,-34 -40,-42 20,-36 C90,-30 124,-6 116,22 C104,50 -20,54 -80,42 C-106,36 -112,24 -112,10Z', '#8FA85A', '#566B2C');
    [[-50, -26], [-10, -32], [30, -28], [66, -16], [-70, 26], [-20, 38], [40, 36], [86, 20]].forEach(function (p) { s += E(p[0], p[1], 7, 5, '#B7C97F', '#566B2C', 2); });
    return wrap('cucumber', o, s + eye(-80, -10, 10) + blush(-70, 14) + mouth(-102, 18, 8, 5));
  }
  function urchin(o) {
    var s = '';
    for (var i = 0; i < 30; i++) { var a = i / 30 * 6.283, l = 30 + (i % 3) * 8; s += L('M' + (Math.cos(a) * 46).toFixed(1) + ',' + (Math.sin(a) * 46).toFixed(1) + ' L' + (Math.cos(a) * (46 + l)).toFixed(1) + ',' + (Math.sin(a) * (46 + l)).toFixed(1), '#3b2a6b', 5); }
    s += E(0, 0, 54, 50, '#6B4BA8', '#3b2a6b') + P('M-20,48 l5,12 l5,-12z M-6,50 l5,12 l5,-12z M8,50 l5,12 l5,-12z', '#fff', '#9aa', 1.5);
    return wrap('urchin', o, s + eye(-18, -8, 10) + eye(18, -8, 10) + blush(-30, 12) + blush(30, 12) + mouth(0, 16, 6, 4));
  }
  function sponge(o) {
    var s = P('M-76,70 L-84,-8 Q-60,-34 -36,-8 L-26,70Z', '#F0B63A', '#a9741a') + P('M30,70 L24,10 Q48,-14 70,10 L80,70Z', '#F0B63A', '#a9741a') + P('M-50,76 L-60,-60 Q0,-92 56,-60 L48,76Z', '#F5C84C', '#a9741a');
    [[-30, -50], [20, -60], [-8, -34], [38, -30], [-40, -16], [-60, 30], [60, 40]].forEach(function (p) { s += E(p[0], p[1], 7, 5, '#a9741a', 0); });
    return wrap('sponge', o, s + eye(-20, -4, 11) + eye(20, -4, 11) + blush(-34, 18) + blush(34, 18) + mouth(0, 18, 8, 5));
  }
  function coral(o) {
    var br = ['M0,90 L0,-4', 'M0,40 L-52,-22', 'M0,18 L52,-42', 'M-52,-22 L-66,-78', 'M52,-42 L72,-88', 'M0,0 L12,-74'], s = '';
    br.forEach(function (d) { s += L(d, '#b84a68', 38); }); br.forEach(function (d) { s += L(d, '#FF7F9E', 28); });
    [[-66, -78], [72, -88], [12, -74], [-52, -22], [52, -42]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="11" fill="#FFC1D2" stroke="#b84a68" stroke-width="2"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="#fff"/>'; });
    s += E(0, 92, 56, 18, '#8a6a4a', '#5a432c');
    return wrap('coral', o, s + eye(-12, 42, 10) + eye(14, 42, 10) + blush(-24, 60) + blush(26, 60) + mouth(2, 64, 6, 4));
  }
  /* ---------- crustaceans ---------- */
  function crab(o) {
    var s = '';
    [-1, 1].forEach(function (d) { s += L('M' + d * 50 + ',20 q' + d * 40 + ',0 ' + d * 60 + ',30 M' + d * 46 + ',34 q' + d * 38 + ',10 ' + d * 50 + ',46', '#c93a24', 7); s += L('M' + d * 56 + ',-6 q' + d * 40 + ',-30 ' + d * 34 + ',-70', '#c93a24', 14) + P('M' + d * 34 + ',-70 q' + d * 30 + ',-40 ' + d * 4 + ',-52 q' + d * -2 + ',14 ' + d * -4 + ',24z', '#F0523A', '#8e2012', 3).replace('M', 'M'); });
    s += E(0, 10, 72, 48, '#F0523A', '#8e2012') + L('M-22,-34 v-20 M22,-34 v-20', '#c93a24', 6);
    return wrap('crab', o, s + eye(-22, -58, 11) + eye(22, -58, 11) + blush(-44, 22) + blush(44, 22) + mouth(0, 22, 8, 5));
  }
  function hermit(o) {
    var s = L('M-60,20 q-30,0 -50,26 M-50,34 q-30,10 -38,40', '#c93a24', 6) + P('M-96,6 q-26,-34 -10,-62 q18,-2 16,26z', '#F0523A', '#8e2012', 3);
    s += E(44, -6, 62, 58, '#F4D9A6', '#b3834a') + L('M44,-6 m0,0 q18,-6 14,12 q-8,20 -30,12 q-26,-14 -8,-40 q28,-24 56,2 q26,34 -4,60', '#b3834a', 4);
    s += E(-62, 16, 38, 30, '#F0523A', '#8e2012') + L('M-70,-6 v-16 M-52,-8 v-18', '#c93a24', 5) + eye(-70, -30, 9) + eye(-52, -32, 9) + blush(-82, 24) + mouth(-62, 28, 6, 4);
    return wrap('hermit', o, s);
  }
  function lobster(o) {
    var s = L('M-60,-14 q-60,-40 -112,-30 M-60,-8 q-70,-10 -120,10', '#a8321c', 3);
    s += L('M-70,10 q-30,10 -50,-6', '#c93a24', 16) + P('M-120,-6 q-36,-36 -4,-52 q-4,26 18,30z', '#D9482B', '#8e2012', 3) + P('M-120,-6 q-40,-6 -48,18 q26,10 42,-2z', '#D9482B', '#8e2012', 3);
    s += P('M80,-20 L150,-34 L158,0 L150,34 L80,20Z', '#C23A22', '#8e2012') + E(0, 0, 90, 40, '#D9482B', '#8e2012') + L('M20,-38 v76 M50,-36 v72 M80,-30 v60', '#a8321c', 3);
    [-30, -10, 10, 30].forEach(function (x) { s += L('M' + x + ',36 l-6,24', '#c93a24', 5); });
    return wrap('lobster', o, s + eye(-62, -22, 10) + blush(-60, 10) + mouth(-80, 12, 7, 4));
  }
  function shrimp(kind) {
    var col = kind === 'mantis' ? ['#2EC4B6', '#127a70'] : ['#FF9A57', '#b3501a'];
    return function (o) {
      var s = L('M-40,-22 q-40,-50 -90,-44 M-30,-24 q-20,-56 -80,-70', col[1], 3);
      s += P('M70,10 C96,0 120,16 112,44 C100,34 90,34 70,38Z', col[0], col[1], 3) + P('M-60,-6 C-40,-50 40,-56 74,-12 C80,16 20,44 -40,34 C-60,28 -66,10 -60,-6Z', col[0], col[1]);
      [[-20, 4], [10, 0], [40, 2]].forEach(function (p) { s += L('M' + p[0] + ',-30 q4,36 0,60', col[1], 3); });
      [-24, 0, 24].forEach(function (x) { s += L('M' + x + ',32 l-8,22', col[1], 5); });
      if (kind === 'mantis') s += L('M-60,10 l-40,16', '#FF7A3D', 12) + E(-104, 26, 14, 12, '#FF7A3D', col[1], 3) + L('M-66,-30 v-28 M-44,-40 v-28', '#127a70', 5) + E(-66, -62, 14, 16, '#FFD166', '#127a70', 3) + E(-44, -72, 14, 16, '#FFD166', '#127a70', 3);
      else s += L('M-58,14 l-46,14', col[1], 14) + P('M-100,16 q-28,-34 6,-42 q-2,26 20,32z', '#FF7A3D', col[1], 3) + P('M-100,30 q-36,0 -34,22 q22,6 38,-8z', '#FF7A3D', col[1], 3);
      return wrap(kind, o, s + eye(-44, -14, 10) + blush(-40, 10) + mouth(-56, 14, 5, 3));
    };
  }
  /* ---------- others ---------- */
  function squid(o) {
    var s = '';
    for (var i = 0; i < 8; i++) s += '<g class="arm"><path d="M-70,' + (-8 + i * 4) + ' q-50,' + (-26 + i * 12) + ' -' + (90 + i * 6) + ',' + (-30 + i * 14) + '" fill="none" stroke="#C94A3D" stroke-width="9" stroke-linecap="round"/></g>';
    s += L('M-70,2 q-90,-10 -170,-60', '#b03a2d', 6) + P('M120,-40 L170,-10 L150,0 L170,12 L120,42Z', '#C94A3D', '#7a1f16', 3) + P('M-26,-36 L140,-22 L152,0 L140,22 L-26,36 Q-56,0 -26,-36Z', '#E0584B', '#8e2a22');
    return wrap('squid', o, s + E(-52, -8, 34, 34, '#FFF1B0', '#7a1f16', 3) + '<circle cx="-58" cy="-6" r="20" fill="#12192e"/><circle cx="-66" cy="-14" r="6" fill="#fff"/>' + blush(-34, 20) + mouth(-62, 32, 8, 5));
  }
  function nautilus(o) {
    var s = '';
    for (var i = 0; i < 8; i++) s += '<g class="arm"><path d="M-70,' + (14 + i * 4) + ' q-30,' + (6 + i * 3) + ' -' + (40 + i * 3) + ',' + (14 + i * 6) + '" fill="none" stroke="#F4B183" stroke-width="6" stroke-linecap="round"/></g>';
    s += E(0, -8, 74, 70, '#FFF3E0', '#b3834a') + L('M0,-8 q16,-8 14,10 q-6,20 -30,12 q-26,-16 -6,-42 q26,-20 52,4 q24,34 -8,56', '#c97a3a', 4);
    for (var j = 0; j < 7; j++) { var a = -1.2 + j * .45; s += L('M' + (Math.cos(a) * 20) + ',' + (Math.sin(a) * 20 - 8) + ' L' + (Math.cos(a) * 72) + ',' + (Math.sin(a) * 70 - 8), '#D9843A', 8); }
    s += E(-74, 22, 26, 22, '#F4B183', '#b3703a', 3);
    return wrap('nautilus', o, s + eye(-82, 14, 9) + blush(-80, 34) + mouth(-74, 32, 6, 4));
  }
  function turtle(o) {
    var s = P('M-30,20 Q-86,66 -34,70 Q0,50 0,22Z', '#7FBF6E', '#2b5e37') + P('M30,22 q50,20 36,48 q-30,-6 -44,-38Z', '#7FBF6E', '#2b5e37') + P('M76,14 q30,2 36,14 q-24,4 -40,-4Z', '#7FBF6E', '#2b5e37', 3);
    s += P('M-76,12 L76,12 Q60,38 0,38 Q-60,38 -76,12Z', '#F2E3A0', '#a9923a') + P('M-72,14 C-72,-62 72,-62 72,14Z', '#4C9A5B', '#2b5e37') + L('M-40,14 q-6,-30 6,-46 M0,14 v-56 M40,14 q6,-30 -6,-46 M-60,-10 h120 M-48,-34 h96', '#2b5e37', 3);
    s += E(-98, -8, 30, 26, '#8DC27A', '#2b5e37') + eye(-106, -14, 9) + blush(-100, 6) + mouth(-114, 8, 6, 4);
    return wrap('turtle', o, s);
  }
  function iguana(o) {
    var s = P('M-60,60 C-20,30 60,30 110,60Z', '#7b7f86', '#444850') + P('M-100,6 C-70,-28 60,-30 110,-8 L176,8 L112,14 C60,28 -60,32 -100,12Z', '#4D5A5F', '#262d30');
    for (var i = 0; i < 8; i++) s += P('M' + (-60 + i * 22) + ',-22 l8,-16 l8,16z', '#2e383c', '#1a2124', 2);
    s += P('M-30,24 l-14,26 l24,0z M50,24 l14,26 l-24,0z', '#4D5A5F', '#262d30', 3) + E(-112, -2, 36, 24, '#566468', '#262d30') + P('M-96,-22 l4,-14 l8,12z M-80,-24 l6,-14 l6,12z', '#2e383c', '#1a2124', 2);
    ['-130,-18', '-110,-22', '-94,-14', '-118,-8'].forEach(function (c) { var q = c.split(','); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3" fill="#fff"/>'; });
    if (has(o, 'sneeze')) s += '<g class="zz z1"><circle cx="-150" cy="-20" r="5" fill="#fff"/><circle cx="-164" cy="-32" r="4" fill="#fff"/><circle cx="-160" cy="-8" r="3.5" fill="#fff"/><circle cx="-176" cy="-18" r="3" fill="#fff"/></g>';
    return wrap('iguana', o, s + eye(-118, -10, 8) + blush(-102, 8) + mouth(-134, 6, 7, 4));
  }

  var reg = window.__ffReg, R = function (k, fn, name, slot, pitch) { reg(k, fn, name, slot, pitch); };
  [['blue', whale('blue'), 'Bella', 'finn', .8], ['hump', whale('hump'), 'Hugo', 'finn', .85], ['orca', whale('orca'), 'Orla', 'ollie', .95], ['beluga', whale('beluga'), 'Bibi', 'ollie', 1.2], ['narwhal', whale('narwhal'), 'Nico', 'finn', .95], ['sperm', whale('sperm'), 'Sam', 'finn', .75],
   ['seal', pinniped('seal'), 'Pip', 'ollie', 1.2], ['sealion', pinniped('sealion'), 'Leo', 'finn', 1], ['walrus', pinniped('walrus'), 'Wally', 'finn', .72], ['eseal', pinniped('eseal'), 'Ellie', 'ollie', .9], ['manatee', pinniped('manatee'), 'Maggie', 'ollie', .95],
   ['otter', otter, 'Otto', 'finn', 1.1], ['penguin', penguin, 'Percy', 'finn', 1.1], ['seahorse', seahorse, 'Harry', 'finn', 1.1], ['puffer', puffer, 'Puff', 'ollie', 1.25], ['angler', angler, 'Angie', 'ollie', .85], ['manta', manta, 'Mandy', 'ollie', 1], ['wshark', wshark, 'Wanda', 'ollie', .9],
   ['sword', sword, 'Sid', 'finn', .95], ['flyfish', flyfish, 'Skye', 'ollie', 1.25], ['moray', moray, 'Morgan', 'finn', .8], ['remora', remora, 'Remy', 'finn', 1.2], ['jelly', jelly, 'Jojo', 'ollie', 1.2], ['warship', warship, 'Manny', 'finn', 1.05],
   ['star', star, 'Stella', 'ollie', 1.2], ['cucumber', cucumber, 'Cuke', 'finn', 1.1], ['urchin', urchin, 'Spike', 'finn', 1.15], ['sponge', sponge, 'Penny', 'ollie', 1.2], ['coral', coral, 'Coco', 'ollie', 1.15], ['crab', crab, 'Carl', 'finn', 1.05], ['hermit', hermit, 'Herman', 'finn', 1.1],
   ['lobster', lobster, 'Larry', 'finn', .9], ['mantis', shrimp('mantis'), 'Mia', 'ollie', 1.2], ['pistol', shrimp('pistol'), 'Snap', 'finn', 1.15], ['squid', squid, 'Gigi', 'ollie', .85], ['nautilus', nautilus, 'Nellie', 'ollie', 1], ['turtle', turtle, 'Tilly', 'ollie', 1.05], ['iguana', iguana, 'Iggy', 'finn', .9]
  ].forEach(function (a) { R(a[0], a[1], a[2], a[3], a[4]); });
})();
