/* Brainy Break — cartoon space characters for Fun Facts. Each character faces left, is centred on (0,0) and has .eye/.pup/.smile/.mouth parts so it can blink and lip-sync. */
(function () {
  'use strict';
  var K = '#1b2440';
  function eye(x, y, r) { r = r || 12; return '<g class="eye"><ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * 1.12) + '" fill="#fff" stroke="' + K + '" stroke-width="2"/><circle class="pup" cx="' + (x - r * .2) + '" cy="' + (y + r * .15) + '" r="' + (r * .55) + '" fill="#12192e"/><circle cx="' + (x - r * .45) + '" cy="' + (y - r * .25) + '" r="' + (r * .22) + '" fill="#fff"/></g>'; }
  function blush(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="5.5" fill="#FF8FB1" opacity=".6"/>'; }
  function mouth(x, y, rx, ry) { return '<path class="smile" d="M' + (x - rx * 1.4) + ',' + (y - 2) + ' Q' + x + ',' + (y + ry * 2.6) + ' ' + (x + rx * 1.4) + ',' + (y - 2) + '" fill="none" stroke="' + K + '" stroke-width="3.2" stroke-linecap="round"/><ellipse class="mouth" cx="' + x + '" cy="' + (y + 2) + '" rx="' + rx + '" ry="' + ry + '" fill="#5B1F46"/>'; }
  function P(d, f, s, w) { return '<path d="' + d + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 4) + '" stroke-linejoin="round" stroke-linecap="round"' : '') + '/>'; }
  function E(cx, cy, rx, ry, f, s, w, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="' + (w || 4) + '"' : '') + (rot ? ' transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"' : '') + '/>'; }
  function L(d, c, w) { return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function wrap(k, o, inner) { return '<g class="ff-' + k + (o.cls ? ' ' + o.cls : '') + '"><g class="dbob">' + inner + '</g></g>'; }
  function has(o, w) { return (o.cls || '').indexOf(w) > -1; }
  function dots(pts, r, f, s) { return pts.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (p[2] || r) + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="2"' : '') + '/>'; }).join(''); }
  var SP = [[-30, -24], [0, -34], [34, -28], [70, -16], [-52, 0], [-14, -6], [24, -2], [58, 8], [86, 12], [-40, 24], [-4, 22], [34, 26], [72, 30]];


  function face(x, y, er, my) { er = er || 12; return eye(x - er * 1.9, y, er) + eye(x + er * 1.9, y, er) + blush(x - er * 3.1, y + er * 1.9) + blush(x + er * 3.1, y + er * 1.9) + mouth(x, y + (my || er * 2.3), er * .8, er * .55); }
  function ball(r, f, s, x, y) { return '<circle cx="' + (x || 0) + '" cy="' + (y || 0) + '" r="' + r + '" fill="' + f + '" stroke="' + s + '" stroke-width="4"/>'; }
  function clip(id, r) { return '<clipPath id="cp-' + id + '"><circle r="' + r + '"/></clipPath>'; }

  /* ---------- guide: Nova the kid astronaut ---------- */
  function nova(o) {
    var sk = '#F2C29B', s = P('M-74,120 C-80,60 -54,34 0,34 C54,34 80,60 74,120Z', '#EDEFF7', '#8e9ab8') + P('M-40,70 h80 v26 h-80Z', '#6C8CF0', '#3b55b0', 3) + dots([[-22, 83, 5], [0, 83, 5], [22, 83, 5]], 5, '#FFD166', '#a8861a');
    s += '<circle cx="0" cy="-20" r="74" fill="#DDE6F7" fill-opacity=".45" stroke="#C7D2EA" stroke-width="10"/>' + E(0, -20, 54, 56, sk, '#b9805a') + P('M-52,-34 C-52,-78 52,-78 52,-34 C36,-52 -36,-52 -52,-34Z', '#2b3a67', '#18223f');
    s += eye(-22, -20, 11) + eye(22, -20, 11) + blush(-37, 6) + blush(37, 6) + mouth(0, 12, 8, 5) + P('M-46,-62 C-30,-78 -10,-82 6,-82', 'none', '#fff', 5).replace('fill="none"', 'fill="none" opacity=".7"');
    s += P('M-74,34 l-18,12 M74,34 l18,12', 'none', '#8e9ab8', 8);
    return wrap('nova', o, s);
  }

  /* ---------- sun & planets ---------- */
  function sun(o) {
    var r = '', i, a; for (i = 0; i < 12; i++) { a = i * 30; r += '<path d="M-14,-96 L0,-132 L14,-96Z" fill="#FFB02E" stroke="#d97706" stroke-width="3" stroke-linejoin="round" transform="rotate(' + a + ')"/>'; }
    return wrap('sun', o, r + ball(96, '#FFD84A', '#e0a010') + E(-30, -52, 30, 16, '#FFF3A8', 0, 0, -25) + face(0, -2, 14, 32));
  }
  function mercury(o) {
    return wrap('mercury', o, ball(86, '#B8B4B0', '#6f6a66') + dots([[-52, -34, 12], [54, -40, 9], [58, 40, 13], [-46, 58, 8], [4, 70, 7]], 8, '#9a9692', '#6f6a66') + face(0, -6, 13, 30));
  }
  function venus(o) {
    return wrap('venus', o, ball(92, '#F2C879', '#b98a2c') + L('M-80,-34 C-40,-52 0,-20 40,-40 C60,-48 74,-40 84,-28 M-86,24 C-50,6 -10,40 30,22 C56,12 74,20 82,30 M-60,64 C-30,52 0,70 36,58', '#E3A950', 8) + face(0, -6, 13, 30));
  }
  function earth(o) {
    var g = '<g clip-path="url(#cp-earth)">' + ball(94, '#4FA3E8', '#4FA3E8') + P('M-76,-30 C-60,-70 -24,-76 -8,-60 C0,-40 -30,-34 -26,-10 C-40,10 -70,14 -76,-30Z', '#6DC36B', '#3b8f45', 3) + P('M30,-56 C60,-64 86,-30 74,0 C62,-10 56,10 40,6 C32,-14 20,-36 30,-56Z', '#6DC36B', '#3b8f45', 3) + P('M20,50 C44,40 66,56 60,80 C40,92 14,80 20,50Z', '#6DC36B', '#3b8f45', 3) + E(-40, -70, 24, 8, '#fff', 0, 0, -10).replace('fill="#fff"', 'fill="#fff" opacity=".8"') + E(50, 30, 26, 8, '#fff', 0, 0, 8).replace('fill="#fff"', 'fill="#fff" opacity=".8"') + '</g>';
    return wrap('earth', o, clip('earth', 94) + g + '<circle r="94" fill="none" stroke="#2a6db0" stroke-width="4"/>' + face(0, -2, 13, 30));
  }
  function moon(o) {
    return wrap('moon', o, ball(92, '#E6E3DC', '#9a968c') + dots([[-54, -40, 14], [50, -52, 10], [60, 34, 16], [-50, 50, 11], [10, 74, 8], [-6, -74, 7]], 8, '#cfcbc2', '#9a968c') + face(0, -6, 13, 30));
  }
  function mars(o) {
    return wrap('mars', o, ball(88, '#E2724B', '#9a3d20') + E(0, -82, 28, 9, '#fff', 0, 0, 0) + P('M-64,24 C-40,6 -20,30 -8,16 C-30,56 -60,56 -64,24Z', '#B9522F', 0) + P('M30,-48 C56,-52 70,-30 62,-10 C44,-22 34,-30 30,-48Z', '#B9522F', 0) + dots([[56, 50, 10], [-44, -50, 8]], 8, '#C85F38', '#9a3d20') + face(0, -6, 13, 30));
  }
  function jupiter(o) {
    var b = '<g clip-path="url(#cp-jup)">' + ball(100, '#F0D2A4', '#F0D2A4') + '<rect x="-100" y="-76" width="200" height="22" fill="#D9A56A"/><rect x="-100" y="-30" width="200" height="14" fill="#C98A52"/><rect x="-100" y="38" width="200" height="20" fill="#D9A56A"/><rect x="-100" y="70" width="200" height="14" fill="#C98A52"/>' + E(54, 52, 28, 15, '#D8573C', '#9a2c1c', 3) + '</g>';
    return wrap('jupiter', o, clip('jup', 100) + b + '<circle r="100" fill="none" stroke="#a46a3a" stroke-width="4"/>' + face(-6, -8, 14, 32));
  }
  function saturn(o) {
    var ring = function (w, c) { return '<ellipse cx="0" cy="0" rx="148" ry="34" fill="none" stroke="' + c + '" stroke-width="' + w + '" transform="rotate(-18)"/>'; };
    return wrap('saturn', o, ring(14, '#E9C77A') + ball(78, '#F3DDA0', '#b8963c') + L('M-72,-44 C-30,-54 30,-54 72,-44', '#E5C477', 8) + face(0, -22, 11, 26) + '<path d="M-148,0 A148,34 0 0 0 148,0" fill="none" stroke="#E9C77A" stroke-width="14" stroke-linecap="round" transform="rotate(-18)"/>');
  }
  function uranus(o) {
    return wrap('uranus', o, '<ellipse cx="0" cy="0" rx="22" ry="128" fill="none" stroke="#B9E8EE" stroke-width="7" transform="rotate(12)"/>' + ball(80, '#9FE3E8', '#3f9aa8') + face(0, -6, 12, 28) 
    );
  }
  function neptune(o) {
    return wrap('neptune', o, ball(88, '#3F66E0', '#1f3a9a') + L('M-70,-30 C-30,-44 20,-24 74,-38', '#9DB5FF', 6) + E(46, 44, 24, 10, '#9DB5FF', 0, 0, -8) + face(0, -6, 13, 30));
  }
  function pluto(o) {
    return wrap('pluto', o, ball(66, '#C9A47E', '#7e5c3c') + P('M-6,-4 C-26,-24 -44,-6 -30,14 L-6,34 L18,14 C32,-6 12,-24 -6,-4Z', '#F2E3CF', 0) + face(0, -26, 9, 20));
  }
  function asteroid(o) {
    return wrap('asteroid', o, P('M-86,-10 C-90,-52 -50,-82 -10,-70 C30,-84 80,-56 84,-14 C94,26 60,66 14,70 C-20,86 -80,60 -86,-10Z', '#A9A39B', '#5e5851') + dots([[-52, -30, 12], [44, -34, 9], [46, 34, 13], [-36, 40, 8]], 8, '#8d877f', '#5e5851') + face(-2, -8, 12, 28));
  }
  function comet(o) {
    return wrap('comet', o, P('M30,-50 C130,-90 230,-110 330,-96 C240,-70 180,-30 330,-10 C220,10 150,40 330,70 C190,80 100,70 30,50Z', '#BFEFFF', 0).replace('fill="#BFEFFF"', 'fill="#BFEFFF" opacity=".55"') + ball(64, '#E9F6FF', '#7fb4d8', -10, 0) + dots([[-40, -30, 8], [14, 30, 7]], 7, '#cfe6f5', '#7fb4d8') + face(-12, -6, 10, 24));
  }
  function rocket(o) {
    var s = P('M-24,86 C-10,130 10,130 24,86Z', '#FF8A3D', '#c2501a', 3) + P('M-18,92 C-8,116 8,116 18,92Z', '#FFD84A', 0);
    s += P('M-62,40 L-86,96 L-30,70Z', '#E0434F', '#8f1f2a') + P('M62,40 L86,96 L30,70Z', '#E0434F', '#8f1f2a') + P('M0,-130 C60,-84 66,0 52,86 L-52,86 C-66,0 -60,-84 0,-130Z', '#F4F6FC', '#8e9ab8') + P('M0,-130 C26,-110 40,-90 46,-70 L-46,-70 C-40,-90 -26,-110 0,-130Z', '#E0434F', '#8f1f2a', 4);
    s += '<circle cx="0" cy="-20" r="38" fill="#BEE3FF" stroke="#6c8aa8" stroke-width="6"/>' + eye(-14, -24, 9) + eye(14, -24, 9) + mouth(0, -2, 7, 5) + L('M-30,56 h60', '#c7d0e6', 5);
    return wrap('rocket', o, s);
  }
  function satellite(o) {
    var pn = function (x) { return '<rect x="' + x + '" y="-40" width="82" height="80" rx="6" fill="#3F6FD8" stroke="#1f3a8a" stroke-width="4"/>' + L('M' + (x + 27) + ',-40 v80 M' + (x + 54) + ',-40 v80 M' + x + ',0 h82', '#8fb0f5', 3); };
    var s = pn(-166) + pn(84) + L('M-84,0 h20 M64,0 h20', '#8e9ab8', 8) + P('M-64,-48 h128 v96 h-128Z', '#E8ECF7', '#8e9ab8') + L('M0,-48 v-30', '#8e9ab8', 5) + E(0, -84, 18, 8, '#F4C95D', '#a8861a', 3) + face(0, -6, 11, 26);
    return wrap('satellite', o, s);
  }
  function star(o) {
    return wrap('star', o, P('M0,-108 L26,-34 L104,-32 42,16 64,92 0,48 -64,92 -42,16 -104,-32 -26,-34Z', '#FFD84A', '#d99a10', 5) + face(0, -2, 12, 26));
  }
  function galaxy(o) {
    var s = '<g transform="rotate(-24)"><ellipse rx="130" ry="64" fill="#5B3FB8" opacity=".55"/><ellipse rx="104" ry="48" fill="#8A63E0" opacity=".75"/><ellipse rx="70" ry="32" fill="#C9A8FF"/></g>' + L('M-120,10 C-80,-60 20,-60 60,-20 M120,-10 C80,60 -20,60 -60,20', '#E8D8FF', 4);
    s += dots([[-100, -30, 4], [90, 30, 4], [30, -54, 3], [-60, 50, 3], [110, -20, 3]], 3, '#fff') + face(0, -4, 12, 26);
    return wrap('galaxy', o, s);
  }
  function blackhole(o) {
    return wrap('blackhole', o, '<ellipse rx="150" ry="36" fill="none" stroke="#FF9F43" stroke-width="16" opacity=".9" transform="rotate(-14)"/><ellipse rx="150" ry="36" fill="none" stroke="#FFD27A" stroke-width="5" opacity=".9" transform="rotate(-14)"/>' + ball(76, '#0b0b17', '#6c5bd0') + face(0, -6, 12, 28));
  }
  function telescope(o) {
    var s = L('M-6,30 L-60,120 M-6,30 L48,120 M-6,30 L-6,124', '#8e6a4a', 8) + '<g transform="rotate(-28)">' + P('M-110,-30 h160 v60 h-160Z', '#4C6FD8', '#27408f') + P('M50,-42 h50 v84 h-50Z', '#8fb0f5', '#27408f') + P('M-120,-38 h22 v76 h-22Z', '#F4C95D', '#a8861a') + '</g>';
    return wrap('telescope', o, s + eye(-52, -44, 12) + eye(-14, -58, 12) + mouth(-34, -16, 9, 6) + blush(-62, -20));
  }

  var R = function (k, fn, name, slot, pitch) { window.__ffReg(k, fn, name, slot, pitch); };
  [['nova', nova, 'Nova', 'ollie', 1.2],
   ['sun', sun, 'Sunny', 'finn', .85], ['mercury', mercury, 'Mimi', 'ollie', 1.3], ['venus', venus, 'Venny', 'ollie', 1.05], ['earth', earth, 'Terra', 'ollie', 1], ['moon', moon, 'Moony', 'finn', 1.15], ['mars', mars, 'Marty', 'finn', 1.0],
   ['jupiter', jupiter, 'Jumbo', 'finn', .7], ['saturn', saturn, 'Ringo', 'finn', .9], ['uranus', uranus, 'Uri', 'finn', 1.25], ['neptune', neptune, 'Neppy', 'ollie', .9], ['pluto', pluto, 'Plu', 'ollie', 1.4],
   ['asteroid', asteroid, 'Rocky', 'finn', .75], ['comet', comet, 'Zippy', 'ollie', 1.35], ['rocket', rocket, 'Blast', 'finn', 1.1], ['satellite', satellite, 'Satty', 'ollie', 1.15], ['star', star, 'Twinkle', 'ollie', 1.25],
   ['galaxy', galaxy, 'Gala', 'ollie', .95], ['blackhole', blackhole, 'Inky', 'finn', .65], ['telescope', telescope, 'Scopey', 'finn', 1.05]
  ].forEach(function (a) { R(a[0], a[1], a[2], a[3], a[4]); });
})();
