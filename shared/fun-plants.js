/* Brainy Break — cartoon plant and nature characters for Fun Facts. Each character faces left, is centred on (0,0) and has .eye/.pup/.smile/.mouth parts so it can blink and lip-sync. */
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

  /* ---------- guide: Fern the kid gardener ---------- */
  function fern(o) {
    var sk = '#F2C29B', s = P('M-74,120 C-80,60 -54,34 0,34 C54,34 80,60 74,120Z', '#6DC36B', '#3b8f45') + P('M-30,40 L-30,120 M30,40 L30,120', 'none', '#3b8f45', 4).replace('fill="none"', 'fill="none"') + P('M-24,60 h48 v36 h-48Z', '#4FA84F', '#3b8f45', 3) + E(0, -20, 52, 54, sk, '#b9805a');
    s += P('M-96,-44 C-60,-70 60,-70 96,-44 C60,-34 -60,-34 -96,-44Z', '#F4D35E', '#b8963c', 4) + P('M-52,-48 C-52,-104 52,-104 52,-48 C30,-56 -30,-56 -52,-48Z', '#F4D35E', '#b8963c', 4) + P('M-52,-62 h104', 'none', '#E0434F', 8);
    s += eye(-22, -18, 11) + eye(22, -18, 11) + blush(-37, 8) + blush(37, 8) + mouth(0, 14, 8, 5) + dots([[-14, 8, 1.5], [14, 6, 1.5]], 1.5, '#b9805a');
    return wrap('fern', o, s);
  }

  /* ---------- plants ---------- */
  function tree(o) {
    var s = P('M-22,110 C-18,60 -14,30 -10,10 L10,10 C14,30 18,60 22,110Z', '#9A6B3F', '#5f3f22') + P('M0,60 C20,40 40,34 52,10', 'none', '#9A6B3F', 10).replace('fill="none"', 'fill="none" stroke-linecap="round"');
    s += E(0, -34, 100, 78, '#59B85B', '#2f7a36') + E(-60, -6, 52, 44, '#6FCB6B', '#2f7a36') + E(60, -4, 54, 44, '#6FCB6B', '#2f7a36') + dots([[-44, -64, 8], [30, -70, 7], [58, -30, 6]], 7, '#E0434F', '#8f1f2a');
    s += face(0, -34, 12, 28);
    return wrap('tree', o, s);
  }
  function pine(o) {
    var s = P('M-12,112 h24 v-30 h-24Z', '#9A6B3F', '#5f3f22') + P('M0,-112 L58,-34 L30,-34 L78,26 L38,26 L92,88 L-92,88 L-38,26 L-78,26 L-30,-34 L-58,-34Z', '#2f9a62', '#1b6b40');
    s += P('M0,-112 L18,-86 L-18,-86Z', '#fff', 0) + dots([[-24, 44, 5], [30, -2, 5], [-8, -50, 5]], 5, '#E0434F');
    s += face(0, 8, 11, 26);
    return wrap('pine', o, s);
  }
  function sunflower(o) {
    var r = '', i; for (i = 0; i < 14; i++) r += '<ellipse cx="0" cy="-78" rx="15" ry="32" fill="#FFD23F" stroke="#d99a10" stroke-width="3" transform="rotate(' + (i * 360 / 14) + ')"/>';
    var s = L('M0,40 C-6,80 6,100 0,124', '#4FA84F', 12) + P('M0,90 C30,70 56,80 60,100 C34,108 14,104 0,90Z', '#6FCB6B', '#2f7a36', 3) + r + ball(52, '#8a5a2b', '#5f3a16') + dots([[-30, -28, 3], [28, -30, 3], [0, -38, 3], [-38, 6, 3], [36, 8, 3]], 3, '#5f3a16');
    s += face(0, -6, 10, 22).replace(/#fff/g, '#fff');
    return wrap('sunflower', o, s);
  }
  function daisy(o) {
    var r = '', i; for (i = 0; i < 10; i++) r += '<ellipse cx="0" cy="-70" rx="18" ry="34" fill="#FFB7D5" stroke="#d6709b" stroke-width="3" transform="rotate(' + (i * 36) + ')"/>';
    return wrap('daisy', o, L('M0,44 C6,80 -4,100 2,124', '#4FA84F', 12) + P('M0,96 C-34,76 -58,86 -62,106 C-36,114 -14,110 0,96Z', '#6FCB6B', '#2f7a36', 3) + r + ball(40, '#FFE066', '#d9a010') + face(0, -2, 8, 18));
  }
  function cactus(o) {
    var s = P('M-24,100 C-34,20 -34,-60 0,-90 C34,-60 34,20 24,100Z', '#4FB06E', '#2c7a48') + P('M-24,10 C-60,8 -64,-30 -58,-50 C-40,-46 -34,-20 -24,-16Z', '#4FB06E', '#2c7a48') + P('M24,30 C60,28 66,-4 60,-26 C42,-22 36,0 24,4Z', '#4FB06E', '#2c7a48');
    s += L('M-10,-60 v-10 M10,-50 v-10 M-8,60 v10 M10,70 v10 M-50,-30 l-8,-6 M54,-6 l8,-6', '#e8f5d8', 3);
    s += P('M-14,-92 C-8,-118 8,-118 14,-92Z', '#FF8FB1', '#c14d78', 3) + P('M-42,100 h84 l-8,22 h-68Z', '#C9783B', '#8a4a1e', 4);
    s += face(0, -20, 11, 26);
    return wrap('cactus', o, s);
  }
  function mushroom(o) {
    var s = P('M-30,10 C-34,60 -28,100 -14,108 L14,108 C28,100 34,60 30,10Z', '#F5EBDD', '#b0a088') + P('M-110,10 C-110,-70 -50,-110 0,-110 C50,-110 110,-70 110,10 C60,24 -60,24 -110,10Z', '#E0434F', '#8f1f2a');
    s += dots([[-64, -30, 14], [0, -70, 12], [60, -28, 16], [-20, -20, 9], [34, -64, 8]], 10, '#fff');
    s += face(0, 56, 10, 24);
    return wrap('mushroom', o, s);
  }
  function sprout(o) {
    var s = L('M0,40 C-4,10 4,-20 0,-50', '#4FA84F', 12) + P('M0,-50 C-40,-80 -88,-60 -92,-30 C-60,-20 -20,-30 0,-50Z', '#6FCB6B', '#2f7a36', 4) + P('M0,-56 C30,-96 82,-90 92,-64 C60,-44 20,-40 0,-56Z', '#6FCB6B', '#2f7a36', 4);
    s += P('M-86,52 C-60,30 60,30 86,52 C80,90 40,112 0,112 C-40,112 -80,90 -86,52Z', '#8a5a2b', '#5f3a16') + P('M-70,56 C-40,40 40,40 70,56', 'none', '#6b4220', 5);
    s += face(0, 70, 11, 24);
    return wrap('sprout', o, s);
  }
  function leaf(o) {
    var s = P('M-6,110 C-10,60 -12,10 -8,-30', 'none', '#4FA84F', 8) + P('M0,-110 C90,-70 100,40 0,100 C-100,40 -90,-70 0,-110Z', '#6FCB6B', '#2f7a36') + L('M0,-96 L0,96 M0,-40 L-40,-70 M0,0 L-50,-30 M0,40 L-40,10 M0,-40 L40,-70 M0,0 L50,-30 M0,40 L40,10', '#4FA84F', 4);
    s += face(0, 8, 12, 28);
    return wrap('leaf', o, s);
  }
  function flytrap(o) {
    var s = P('M-8,112 C-12,70 -8,50 0,40 C8,50 12,70 8,112Z', '#4FA84F', '#2f7a36') + P('M-100,40 C-110,-40 -60,-90 0,-80 C60,-90 110,-40 100,40 C60,70 -60,70 -100,40Z', '#7BD66B', '#2f7a36');
    s += P('M-100,40 C-60,70 60,70 100,40 L90,24 L74,46 L56,22 L36,52 L16,24 L-4,54 L-22,24 L-40,52 L-58,22 L-76,46 L-90,24Z', '#E0434F', '#8f1f2a', 3) + L('M-92,-4 L-72,-20 M92,-4 L72,-20 M-80,-34 l12,-14 M80,-34 l-12,-14', '#4aa84a', 4);
    s += eye(-28, -14, 13) + eye(28, -14, 13) + blush(-48, 14) + blush(48, 14) + '<path d="M-24,28 Q0,46 24,28" fill="none" stroke="' + K + '" stroke-width="3.2" stroke-linecap="round"/>';
    return wrap('flytrap', o, s);
  }
  function bamboo(o) {
    var s = '', i; for (i = 0; i < 4; i++) s += P('M-26,' + (-100 + i * 54) + ' h52 v50 h-52Z', '#8ED06F', '#4a8a3a') + '<rect x="-30" y="' + (-104 + i * 54 + 46) + '" width="60" height="8" rx="4" fill="#6bb04f" stroke="#4a8a3a" stroke-width="3"/>';
    s += P('M26,-60 C60,-72 84,-60 92,-40 C62,-34 40,-42 26,-60Z', '#6FCB6B', '#2f7a36', 3) + P('M-26,-10 C-60,-22 -84,-10 -92,10 C-62,16 -40,8 -26,-10Z', '#6FCB6B', '#2f7a36', 3);
    s += face(0, -24, 10, 24);
    return wrap('bamboo', o, s);
  }
  function apple(o) {
    var s = L('M0,-76 C-2,-96 4,-108 10,-116', '#7a4a22', 8) + P('M10,-96 C40,-120 80,-104 84,-84 C54,-72 24,-80 10,-96Z', '#6FCB6B', '#2f7a36', 3);
    s += P('M0,-70 C-40,-100 -104,-70 -100,0 C-98,70 -52,108 0,96 C52,108 98,70 100,0 C104,-70 40,-100 0,-70Z', '#E8454F', '#9a1f2a') + P('M-62,-40 C-80,-20 -82,10 -74,30', 'none', '#FF9AA2', 8).replace('fill="none"', 'fill="none" stroke-linecap="round"');
    s += face(0, -6, 13, 30);
    return wrap('apple', o, s);
  }

  /* ---------- weather and earth ---------- */
  function cloud(o) {
    var s = P('M-100,60 C-130,60 -130,10 -90,10 C-96,-40 -40,-60 -10,-34 C10,-76 80,-60 76,-10 C120,-14 130,50 96,60Z', '#FFFFFF', '#9fb8d8');
    s += face(-4, 8, 12, 26);
    return wrap('cloud', o, s);
  }
  function raindrop(o) {
    var s = P('M0,-110 C40,-50 80,-10 80,30 C80,76 44,100 0,100 C-44,100 -80,76 -80,30 C-80,-10 -40,-50 0,-110Z', '#5BB8F5', '#2a7ab8') + P('M-50,20 C-54,40 -44,62 -26,72', 'none', '#B9E4FF', 8).replace('fill="none"', 'fill="none" stroke-linecap="round"');
    s += face(0, 22, 12, 26);
    return wrap('raindrop', o, s);
  }
  function bolt(o) {
    var s = P('M20,-118 L-62,14 L-6,14 L-30,118 L66,-26 L8,-26Z', '#FFD84A', '#d99a10', 5);
    s += face(0, -8, 10, 22);
    return wrap('bolt', o, s);
  }
  function snowflake(o) {
    var s = '', i; for (i = 0; i < 6; i++) s += '<g transform="rotate(' + (i * 60) + ')"><path d="M0,0 L0,-100 M0,-64 l-22,-18 M0,-64 l22,-18 M0,-86 l-12,-10 M0,-86 l12,-10" stroke="#8FD0F5" stroke-width="9" stroke-linecap="round" fill="none"/></g>';
    return wrap('snowflake', o, s + ball(46, '#EAF7FF', '#8FD0F5') + face(0, -2, 8, 18));
  }
  function rainbow(o) {
    var cols = ['#FF5C5C', '#FFA64D', '#FFE066', '#6FCB6B', '#5BB8F5', '#9B7BE8'], s = '', i;
    for (i = 0; i < cols.length; i++) s += '<path d="M' + (-110 + i * 12) + ',70 A' + (110 - i * 12) + ',' + (110 - i * 12) + ' 0 0 1 ' + (110 - i * 12) + ',70" fill="none" stroke="' + cols[i] + '" stroke-width="13"/>';
    s += E(-110, 80, 32, 20, '#fff', '#9fb8d8', 3) + E(110, 80, 32, 20, '#fff', '#9fb8d8', 3) + face(0, 36, 10, 24);
    return wrap('rainbow', o, s);
  }
  function volcano(o) {
    var s = P('M-30,-70 C-40,-110 -10,-130 0,-110 C14,-134 44,-104 30,-70Z', '#FF7A3D', '#b83a10') + P('M-120,100 L-34,-76 L34,-76 L120,100Z', '#8a6a4f', '#4f3a28') + P('M-34,-76 C-14,-60 14,-60 34,-76 L26,-90 L-26,-90Z', '#FF9F43', '#b83a10', 3) + L('M-10,-60 C-16,-30 -8,0 -20,30', '#FF7A3D', 6);
    s += face(0, 22, 12, 28);
    return wrap('volcano', o, s);
  }
  function mountain(o) {
    var s = P('M-130,100 L-20,-100 L40,-20 L70,-60 L130,100Z', '#8D9BB0', '#4f5e75') + P('M-20,-100 L-52,-48 L-30,-60 L-14,-40 L2,-62 L22,-48Z', '#fff', '#b8c8dc', 3) + P('M70,-60 L50,-26 L66,-34 L80,-24 L92,-32Z', '#fff', 0);
    s += face(-8, 24, 12, 28);
    return wrap('mountain', o, s);
  }
  function tornado(o) {
    var s = '', i, w; for (i = 0; i < 6; i++) { w = 100 - i * 15; s += E(i % 2 ? 8 : -8, -90 + i * 36, w, 16, i % 2 ? '#B7C3D4' : '#9FB0C6', '#6b7c94', 3); }
    s += face(0, -30, 10, 22);
    return wrap('tornado', o, s);
  }
  function wave(o) {
    var s = P('M-120,100 C-120,10 -70,-70 10,-86 C60,-92 100,-60 90,-30 C74,-42 54,-38 52,-22 C50,0 70,20 120,24 L120,100Z', '#4CB4F0', '#1f7ab8') + P('M10,-86 C60,-92 100,-60 90,-30 C74,-42 54,-38 52,-22 C40,-60 20,-80 10,-86Z', '#E8F7FF', 0);
    s += dots([[40, -60, 4], [72, -50, 3], [28, -40, 3]], 3, '#fff') + face(-30, 26, 12, 26);
    return wrap('wave', o, s);
  }

  var R = function (k, fn, name, slot, pitch) { window.__ffReg(k, fn, name, slot, pitch); };
  [['fern', fern, 'Fern', 'ollie', 1.2],
   ['tree', tree, 'Oakley', 'finn', .8], ['pine', pine, 'Piney', 'finn', .9], ['sunflower', sunflower, 'Sunny', 'ollie', 1.1], ['daisy', daisy, 'Daisy', 'ollie', 1.3], ['cactus', cactus, 'Cory', 'finn', .85], ['mushroom', mushroom, 'Morel', 'finn', 1.05], ['sprout', sprout, 'Sprout', 'ollie', 1.4], ['leaf', leaf, 'Leafy', 'ollie', 1.15], ['flytrap', flytrap, 'Chomp', 'finn', .7], ['bamboo', bamboo, 'Bambi', 'ollie', .95], ['apple', apple, 'Annie', 'ollie', 1.0],
   ['cloud', cloud, 'Nimbus', 'finn', 1.0], ['raindrop', raindrop, 'Drippy', 'ollie', 1.35], ['bolt', bolt, 'Zap', 'finn', 1.25], ['snowflake', snowflake, 'Flurry', 'ollie', 1.3], ['rainbow', rainbow, 'Ruby', 'ollie', 1.1], ['volcano', volcano, 'Vulcan', 'finn', .65], ['mountain', mountain, 'Monty', 'finn', .75], ['tornado', tornado, 'Twister', 'finn', .9], ['wave', wave, 'Wavy', 'ollie', .9]
  ].forEach(function (a) { R(a[0], a[1], a[2], a[3], a[4]); });
})();
