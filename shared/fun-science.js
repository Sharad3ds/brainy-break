/* Brainy Break — cartoon science characters for Fun Facts. Each character faces left, is centred on (0,0) and has .eye/.pup/.smile/.mouth parts so it can blink and lip-sync. */
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
  var cu = 0;
  function clip(id, r) { return '<clipPath id="cp-' + id + '"><circle r="' + r + '"/></clipPath>'; }


  var cu = 0;
  function clipId(p) { return p + (++cu); }


  /* ---------- guide: Sparky the kid scientist ---------- */
  function sparky(o) {
    var sk = '#F2C29B', s = P('M-74,120 C-80,60 -54,34 0,34 C54,34 80,60 74,120Z', '#FFFFFF', '#9fb0d0') + P('M0,34 L0,120 M-14,40 L0,64 L14,40', 'none', '#9fb0d0', 4) + E(0, -20, 52, 54, sk, '#b9805a');
    s += P('M-56,-34 C-70,-90 -30,-108 0,-100 C30,-108 70,-90 56,-34 C40,-70 -40,-70 -56,-34Z', '#F28C38', '#b8601c', 4) + P('M-50,-58 C-34,-72 34,-72 50,-58', 'none', '#6C8CF0', 12) + E(-26, -60, 17, 12, '#BFE3FF', '#3a6aa8', 4) + E(26, -60, 17, 12, '#BFE3FF', '#3a6aa8', 4);
    s += eye(-22, -14, 11) + eye(22, -14, 11) + blush(-37, 12) + blush(37, 12) + mouth(0, 18, 8, 5);
    return wrap('sparky', o, s);
  }

  /* ---------- heroes ---------- */
  function magnet(o) {
    var s = P('M-90,100 L-90,-20 C-90,-120 90,-120 90,-20 L90,100 L40,100 L40,-14 C40,-52 -40,-52 -40,-14 L-40,100Z', '#E0434F', '#8f1f2a') + P('M-90,100 h50 v-34 h-50Z', '#E8EEF8', '#8a96ad', 3) + P('M40,100 h50 v-34 h-50Z', '#E8EEF8', '#8a96ad', 3);
    s += face(0, -86, 10, 24);
    return wrap('magnet', o, s);
  }
  function bulb(o) {
    var s = P('M-34,70 h68 v16 h-68Z', '#B9C2D4', '#6b7790', 4) + P('M-28,86 h56 v14 h-56Z', '#8D97AD', '#6b7790', 4) + P('M0,-112 C60,-112 94,-66 82,-14 C76,14 40,30 34,70 L-34,70 C-40,30 -76,14 -82,-14 C-94,-66 -60,-112 0,-112Z', '#FFE66D', '#d9a010') + L('M-12,70 C-16,40 -4,30 0,20 C4,30 16,40 12,70', '#F2A93B', 4);
    s += face(0, -40, 11, 24);
    return wrap('bulb', o, s);
  }
  function battery(o) {
    var s = P('M-56,-100 h112 v200 h-112Z', '#4FA84F', '#2f7a36') + P('M-56,-100 h112 v50 h-112Z', '#FFD23F', '#b8963c') + P('M-20,-124 h40 v24 h-40Z', '#B9C2D4', '#6b7790', 4) + L('M-30,-76 h22 M-19,-87 v22 M14,-76 h22', '#8a5a2b', 5);
    s += face(0, 10, 11, 24);
    return wrap('battery', o, s);
  }
  function flame(o) {
    var s = P('M0,-118 C20,-70 78,-50 78,24 C78,78 40,108 0,108 C-40,108 -78,78 -78,24 C-78,-24 -30,-40 0,-118Z', '#FF8A3D', '#c4501c') + P('M0,-30 C14,0 44,14 44,50 C44,84 22,100 0,100 C-22,100 -44,84 -44,50 C-44,14 -14,0 0,-30Z', '#FFD84A', '#e0a010', 3);
    s += face(0, 40, 9, 20);
    return wrap('flame', o, s);
  }
  function ice(o) {
    var s = P('M-76,-60 L56,-76 L88,-36 L76,76 L-60,90 L-90,40Z', '#BFE8FF', '#5aa8d8') + P('M-76,-60 L56,-76 L40,-44 L-60,-30Z', '#E8F7FF', '#8fcff0', 3) + L('M-50,56 L-30,30 M44,40 L58,14', '#fff', 5);
    s += face(0, 8, 11, 24);
    return wrap('ice', o, s);
  }
  function balloon(o) {
    var s = P('M0,108 C-8,124 8,132 0,148', 'none', '#8a96ad', 3) + P('M0,-110 C70,-110 96,-40 70,20 C54,56 24,86 0,92 C-24,86 -54,56 -70,20 C-96,-40 -70,-110 0,-110Z', '#E8454F', '#9a1f2a') + P('M-12,92 L12,92 L8,106 L-8,106Z', '#E8454F', '#9a1f2a', 3) + P('M-48,-60 C-62,-34 -60,-4 -52,16', 'none', '#FF9AA2', 8);
    s += face(0, -10, 12, 26);
    return wrap('balloon', o, s);
  }
  function bubble(o) {
    var s = ball(100, 'rgba(160,220,255,.35)', '#6cb8e8') + '<path d="M-70,-30 C-62,-62 -34,-80 -8,-80" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".9"/><path d="M30,-60 C50,-50 62,-30 64,-12" fill="none" stroke="#FFB7D5" stroke-width="6" stroke-linecap="round" opacity=".8"/><path d="M-40,70 C-10,86 30,80 54,56" fill="none" stroke="#B9F0C8" stroke-width="6" stroke-linecap="round" opacity=".8"/>';
    s += face(0, -4, 12, 26);
    return wrap('bubble', o, s);
  }
  function magnifier(o) {
    var s = P('M44,52 L96,108', 'none', '#8a5a2b', 18) + ball(80, '#DFF3FF', '#6a7790').replace('stroke-width="4"', 'stroke-width="12"') + '<path d="M-56,-30 C-50,-52 -30,-66 -8,-68" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>';
    s += face(0, -4, 11, 24);
    return wrap('magnifier', o, s);
  }
  function prism(o) {
    var s = P('M0,-100 L96,70 L-96,70Z', '#DFF3FF', '#6a9ccb') + L('M-70,40 L-20,-10', '#fff', 5) + L('M40,24 L120,0', '#FF5C5C', 6) + L('M42,34 L120,22', '#FFD23F', 6) + L('M44,44 L120,44', '#6FCB6B', 6) + L('M46,54 L120,66', '#5BB8F5', 6);
    s += face(-6, 22, 10, 22);
    return wrap('prism', o, s);
  }
  function gear(o) {
    var t = '', i; for (i = 0; i < 10; i++) t += '<rect x="-14" y="-110" width="28" height="30" rx="5" fill="#9AA6BE" stroke="#5b6785" stroke-width="4" transform="rotate(' + (i * 36) + ')"/>';
    var s = t + ball(86, '#B9C4DA', '#5b6785') + ball(24, '#6b7790', '#4b5670', 0, 0).replace('r="24"', 'r="0"');
    s += face(0, -4, 12, 26);
    return wrap('gear', o, s);
  }
  function thermometer(o) {
    var s = P('M-24,-100 C-24,-124 24,-124 24,-100 L24,40 C46,52 56,70 56,88 C56,116 30,126 0,126 C-30,126 -56,116 -56,88 C-56,70 -46,52 -24,40Z', '#F5FAFF', '#6a7790') + P('M-10,-70 h20 v100 h-20Z', '#E8454F', 0) + ball(30, '#E8454F', '#9a1f2a', 0, 88).replace('stroke-width="4"', 'stroke-width="0"') + L('M24,-70 h12 M24,-40 h12 M24,-10 h12', '#6a7790', 3);
    s += eye(-2, 70, 9) + mouth(0, 100, 7, 4);
    return wrap('thermometer', o, s);
  }
  function flask(o) {
    var s = P('M-22,-110 h44 v56 L84,70 C92,92 80,108 60,108 L-60,108 C-80,108 -92,92 -84,70 L-22,-54Z', '#E8F7FF', '#6a9ccb') + P('M-66,40 C-30,26 30,54 70,38 L84,70 C92,92 80,108 60,108 L-60,108 C-80,108 -92,92 -84,70Z', '#9BE8B0', '#4aa86a', 3) + dots([[-20, 56, 6], [24, 76, 5], [8, 30, 4]], 5, '#fff') + P('M-30,-110 h60', 'none', '#6a9ccb', 8);
    s += face(0, 60, 10, 22);
    return wrap('flask', o, s);
  }
  function soccer(o) {
    var s = ball(96, '#FFFFFF', '#2b3550') + P('M0,-34 L32,-10 L20,28 L-20,28 L-32,-10Z', '#2b3550', 0) + L('M0,-34 L0,-92 M32,-10 L84,-30 M20,28 L52,76 M-20,28 L-52,76 M-32,-10 L-84,-30', '#2b3550', 4);
    s += face(0, -4, 10, 22).replace(/#fff/g, '#fff');
    return wrap('soccer', o, s);
  }
  function speaker(o) {
    var s = P('M-90,-40 h60 L40,-104 v208 L-30,40 h-60Z', '#5B6B8C', '#2b3550') + L('M62,-50 C88,-24 88,24 62,50', '#6C8CF0', 8) + L('M84,-80 C128,-36 128,36 84,80', '#6C8CF0', 8);
    s += eye(-46, -6, 9) + mouth(-44, 20, 6, 4);
    return wrap('speaker', o, s);
  }
  function microscope(o) {
    var s = P('M-70,108 h140 v-16 h-140Z', '#5B6B8C', '#2b3550') + P('M-8,92 C-70,80 -70,-20 -20,-50', 'none', '#8D97AD', 20) + P('M-34,-100 L20,-60 L4,-30 L-50,-70Z', '#C7CFDF', '#5b6785') + P('M-10,52 h60 v10 h-60Z', '#8D97AD', '#5b6785', 4);
    s += eye(-2, 12, 10) + eye(32, 14, 10) + mouth(14, 38, 7, 4);
    return wrap('microscope', o, s);
  }
  function scale(o) {
    var s = P('M-6,-96 h12 v176 h-12Z', '#8D97AD', '#5b6785', 3) + P('M-94,-60 h188', 'none', '#5b6785', 8) + L('M-84,-56 L-110,-4 M-84,-56 L-58,-4 M84,-56 L58,-4 M84,-56 L110,-4', '#5b6785', 3) + P('M-122,-4 h76 l-10,22 h-56Z', '#FFD23F', '#b8963c') + P('M46,-4 h76 l-10,22 h-56Z', '#FFD23F', '#b8963c') + P('M-50,100 h100 l-14,-22 h-72Z', '#8D97AD', '#5b6785', 4);
    s += face(0, 40, 9, 20);
    return wrap('scale', o, s);
  }
  function rocket(o) {
    var s = P('M0,-118 C50,-80 56,-20 40,50 L-40,50 C-56,-20 -50,-80 0,-118Z', '#F5FAFF', '#6a7790') + P('M-40,10 L-86,66 L-40,50Z', '#E0434F', '#8f1f2a', 4) + P('M40,10 L86,66 L40,50Z', '#E0434F', '#8f1f2a', 4) + P('M0,-118 C20,-104 34,-92 40,-78 L-40,-78 C-34,-92 -20,-104 0,-118Z', '#E0434F', '#8f1f2a', 3) + P('M-26,50 L0,112 L26,50Z', '#FFB53D', '#c4701c', 3);
    s += face(0, -30, 9, 20);
    return wrap('rocket', o, s);
  }
  function spring(o) {
    var s = '', i; for (i = 0; i < 6; i++) s += '<path d="M-70,' + (-92 + i * 34) + ' C-70,' + (-110 + i * 34) + ' 70,' + (-110 + i * 34) + ' 70,' + (-92 + i * 34) + ' C70,' + (-72 + i * 34) + ' -70,' + (-72 + i * 34) + ' -70,' + (-58 + i * 34) + '" fill="none" stroke="#9AA6BE" stroke-width="14" stroke-linecap="round"/>';
    s += P('M-80,108 h160 v-12 h-160Z', '#5B6B8C', '#2b3550', 3) + ball(26, '#fff', '#9fb0d0', 0, -8).replace('r="26"', 'r="0"') + face(0, -2, 10, 22);
    return wrap('spring', o, s);
  }

  var R = function (k, fn, name, slot, pitch) { window.__ffReg(k, fn, name, slot, pitch); };
  [['sparky', sparky, 'Sparky', 'ollie', 1.2],
   ['magnet', magnet, 'Maggie', 'ollie', 1.0], ['bulb', bulb, 'Lumi', 'ollie', 1.25], ['battery', battery, 'Volt', 'finn', 1.0], ['flame', flame, 'Blaze', 'finn', .9], ['ice', ice, 'Frosty', 'finn', 1.1], ['balloon', balloon, 'Poppy', 'ollie', 1.35], ['bubble', bubble, 'Bubbles', 'ollie', 1.4], ['magnifier', magnifier, 'Looky', 'ollie', 1.05], ['prism', prism, 'Prizzy', 'ollie', 1.15], ['gear', gear, 'Cogsworth', 'finn', .8], ['thermometer', thermometer, 'Thermo', 'finn', 1.05], ['flask', flask, 'Fizz', 'ollie', 1.2], ['soccer', soccer, 'Kicker', 'finn', 1.0], ['speaker', speaker, 'Boomer', 'finn', .85], ['microscope', microscope, 'Micro', 'finn', 1.1], ['scale', scale, 'Balance', 'finn', .95], ['rocket', rocket, 'Zoom', 'finn', 1.2], ['spring', spring, 'Boing', 'ollie', 1.3]
  ].forEach(function (a) { R(a[0], a[1], a[2], a[3], a[4]); });
})();
