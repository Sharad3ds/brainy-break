/* Brainy Break — cartoon body parts for Fun Facts. Each character faces left, is centred on (0,0) and has .eye/.pup/.smile/.mouth parts so it can blink and lip-sync. */
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

  /* ---------- guide: Dot the kid scientist ---------- */
  function doc(o) {
    var sk = '#F2C29B', sd = '#b9805a', s = P('M-70,120 C-76,60 -50,34 0,34 C50,34 76,60 70,120Z', '#FFFFFF', '#9fb0d0') + P('M-18,34 L0,86 L18,34Z', '#6C8CF0', 0) + L('M-30,40 C-40,86 -10,100 4,84', '#4a5568', 4) + dots([[4, 86, 7]], 7, '#C9D2E3', '#4a5568');
    s += E(0, -22, 52, 54, sk, sd) + P('M-54,-30 C-60,-82 -8,-88 10,-70 C40,-84 60,-60 54,-30 C40,-52 10,-56 -54,-30Z', '#6b3f22', '#3d2312') + E(-54, -52, 14, 14, '#6b3f22', '#3d2312', 3) + E(54, -52, 14, 14, '#6b3f22', '#3d2312', 3);
    s += '<circle cx="-24" cy="-22" r="19" fill="#fff" fill-opacity=".35" stroke="#2b3a67" stroke-width="4"/><circle cx="24" cy="-22" r="19" fill="#fff" fill-opacity=".35" stroke="#2b3a67" stroke-width="4"/>' + L('M-5,-24 h10', '#2b3a67', 4) + eye(-24, -22, 11) + eye(24, -22, 11) + blush(-38, 6) + blush(38, 6) + mouth(0, 14, 8, 5);
    return wrap('doc', o, s);
  }

  /* ---------- organs ---------- */
  function heart(o) {
    var s = P('M-14,-56 C-22,-96 -6,-110 10,-100 L14,-56Z', '#4C7BE0', '#27489a', 4) + P('M14,-60 C20,-98 50,-108 60,-90 C58,-76 40,-70 34,-56Z', '#E0434F', '#8f1f2a', 4);
    s += P('M0,92 C-132,16 -100,-84 -44,-72 C-18,-68 -4,-52 0,-40 C4,-52 18,-68 44,-72 C100,-84 132,16 0,92Z', '#F0505F', '#a0202e') + P('M-60,-40 C-80,-30 -86,0 -74,20', '#FF9AA2', 0).replace('fill="#FF9AA2"', 'fill="none" stroke="#FF9AA2" stroke-width="8" stroke-linecap="round"');
    s += eye(-30, -4, 14) + eye(30, -4, 14) + blush(-52, 24) + blush(52, 24) + mouth(0, 30, 10, 7);
    return wrap('heart', o, s);
  }
  function brain(o) {
    var s = P('M-12,70 C-14,96 -6,110 8,112 C16,100 16,86 14,66Z', '#E9A0B6', '#a44f6c', 3) + P('M-100,-4 C-110,-60 -64,-96 -20,-84 C20,-100 90,-80 98,-20 C112,30 76,68 30,62 C0,78 -60,76 -86,44 C-102,34 -102,16 -100,-4Z', '#F5B3C8', '#a44f6c');
    s += L('M-62,-56 C-40,-40 -70,-20 -50,-4 M-14,-72 C0,-52 -26,-40 -8,-22 M36,-72 C56,-56 30,-42 54,-26 M80,-34 C66,-20 84,-4 70,10 M-76,24 C-56,16 -44,36 -26,28', '#d77f9c', 4);
    s += eye(-30, 8, 13) + eye(24, 8, 13) + blush(-48, 32) + blush(42, 32) + mouth(-3, 34, 10, 6);
    return wrap('brain', o, s);
  }
  function lungs(o) {
    var s = L('M0,-100 L0,-52 M0,-52 C-14,-44 -30,-36 -40,-24 M0,-52 C14,-44 30,-36 40,-24', '#8FB3E8', 14) + L('M0,-100 L0,-52', '#6c94d8', 4);
    s += P('M-8,-40 C-50,-56 -104,-20 -106,30 C-106,76 -78,92 -44,86 C-18,82 -8,60 -8,30Z', '#F59AA8', '#a8465a') + P('M8,-40 C50,-56 104,-20 106,30 C106,76 78,92 44,86 C18,82 8,60 8,30Z', '#F59AA8', '#a8465a');
    s += L('M-40,-4 C-56,10 -64,30 -62,50 M-34,20 C-50,30 -56,44 -54,58 M40,-4 C56,10 64,30 62,50 M34,20 C50,30 56,44 54,58', '#d67084', 4);
    s += eye(-34, 6, 13) + eye(34, 6, 13) + blush(-50, 30) + blush(50, 30) + mouth(0, 34, 10, 7);
    return wrap('lungs', o, s);
  }
  function stomach(o) {
    var s = L('M-30,-96 C-30,-70 -34,-60 -34,-44', '#F0A090', 16) + P('M-52,-52 C-110,-30 -120,60 -50,96 C10,120 100,90 100,30 C100,-10 60,-26 34,-8 C10,8 -10,-34 -20,-56 C-30,-66 -44,-60 -52,-52Z', '#F7A89A', '#b05a4c');
    s += dots([[-70, 40, 8], [-40, 76, 6], [60, 60, 7], [70, 20, 5]], 5, '#FFD1C8') + L('M-60,10 C-40,16 -50,32 -34,36', '#dc8070', 4) + eye(-28, 34, 13) + eye(24, 34, 13) + blush(-46, 58) + blush(42, 58) + mouth(-2, 62, 10, 7);
    return wrap('stomach', o, s);
  }
  function gut(o) {
    var d = 'M-70,-52 H70 C108,-52 108,-8 70,-8 H-70 C-108,-8 -108,36 -70,36 H70 C108,36 108,80 70,80 H-40', s = L(d, '#b0604f', 36) + L(d, '#F7B0A6', 28) + L('M-60,-50 H60 M-60,-6 H60 M-60,38 H60', '#FFD0C8', 4);
    s += E(-86, -52, 36, 34, '#F7B0A6', '#b0604f') + eye(-98, -56, 11) + eye(-70, -56, 11) + blush(-112, -36) + blush(-58, -36) + mouth(-84, -34, 8, 5);
    return wrap('gut', o, s);
  }
  function liver(o) {
    var s = P('M-110,-20 C-96,-66 -20,-84 50,-70 C100,-60 116,-30 110,10 C100,60 40,86 -24,78 C-70,70 -92,50 -110,-20Z', '#B85A3C', '#6e2e1c') + L('M60,-68 C50,-40 54,-20 70,-4', '#8f432b', 5);
    s += eye(-34, -8, 13) + eye(26, -8, 13) + blush(-52, 16) + blush(44, 16) + mouth(-4, 22, 10, 7);
    return wrap('liver', o, s);
  }
  function kidney(o) {
    var s = L('M30,60 C34,96 20,110 10,112', '#F1B38C', 12) + P('M-16,-86 C-92,-86 -112,-20 -86,36 C-62,84 -4,96 40,66 C60,50 36,20 34,0 C32,-20 52,-34 56,-50 C60,-72 30,-86 -16,-86Z', '#A8504A', '#5e2420');
    s += P('M-10,-76 C-60,-74 -84,-30 -70,10', '#C86A62', 0).replace('fill="#C86A62"', 'fill="none" stroke="#C86A62" stroke-width="7" stroke-linecap="round"') + eye(-46, -22, 13) + eye(2, -14, 13) + blush(-62, 8) + blush(14, 12) + mouth(-24, 16, 9, 6);
    return wrap('kidney', o, s);
  }
  function hand(o) {
    var sk = '#F2C29B', sd = '#b9805a', s = '';
    s += E(-92, 10, 14, 34, sk, sd, 4, 60) + E(-60, -60, 15, 42, sk, sd, 4, -12) + E(-22, -84, 15, 46, sk, sd, 4, 0) + E(18, -78, 15, 44, sk, sd, 4, 6) + E(54, -56, 14, 36, sk, sd, 4, 16);
    s += P('M-76,0 C-80,60 -40,100 4,100 C50,100 76,60 70,-10 C60,-40 -60,-40 -76,0Z', sk, sd) + L('M-24,-84 l0,18 M16,-78 l0,16', '#ffe6cf', 6) + eye(-26, 12, 13) + eye(26, 12, 13) + blush(-44, 36) + blush(44, 36) + mouth(0, 40, 10, 7);
    return wrap('hand', o, s);
  }
  function eyeball(o) {
    var s = E(0, 0, 96, 90, '#FFFFFF', '#b3bcd0') + L('M-84,30 C-70,24 -62,32 -50,28 M80,-20 C68,-14 62,-22 52,-20 M-80,-30 C-68,-26 -60,-34 -48,-30', '#F29A9A', 3);
    s += '<g class="eye"><circle cx="-4" cy="-4" r="46" fill="#4FA3E0" stroke="#27608f" stroke-width="3"/><circle cx="-4" cy="-4" r="34" fill="#7CC4F2" opacity=".6"/><circle class="pup" cx="-4" cy="-4" r="20" fill="#12192e"/><circle cx="-18" cy="-20" r="8" fill="#fff"/><circle cx="8" cy="8" r="4" fill="#fff"/></g>';
    s += blush(-60, 40) + blush(52, 40) + mouth(-4, 56, 12, 8) + L('M-60,-70 q-12,-12 -24,-12 M-30,-84 q-4,-16 -14,-22 M10,-88 q4,-16 -2,-24 M44,-76 q14,-12 22,-12', '#1b2440', 5);
    return wrap('eyeball', o, s);
  }
  function ear(o) {
    var sk = '#F2C29B', sd = '#b9805a', s = P('M-6,-100 C-90,-112 -108,-20 -70,34 C-56,56 -62,98 -20,104 C20,108 44,76 48,48 C60,10 96,-8 80,-52 C66,-92 30,-98 -6,-100Z', sk, sd);
    s += L('M-10,-78 C-70,-80 -86,-10 -56,30 M10,-70 C46,-66 58,-40 46,-16 C40,0 16,10 14,28', '#d99f78', 6) + eye(-30, -6, 12) + eye(18, -6, 12) + blush(-44, 20) + blush(32, 20) + mouth(-6, 22, 9, 6);
    return wrap('ear', o, s);
  }
  function nose(o) {
    var sk = '#F2C29B', sd = '#b9805a', s = P('M-90,-24 C-46,-50 46,-50 90,-24 C106,-6 98,22 70,30 C60,60 -60,60 -70,30 C-98,22 -106,-6 -90,-24Z', sk, sd) + P('M-24,-96 C-16,-60 -22,-34 -34,-14 L34,-14 C22,-34 16,-60 24,-96 C10,-104 -10,-104 -24,-96Z', sk, sd, 0).replace('stroke-width="0"', '');
    s += E(-30, 30, 14, 9, '#5a3a2a', 0, 0, -10) + E(30, 30, 14, 9, '#5a3a2a', 0, 0, 10) + eye(-30, -66, 11) + eye(30, -66, 11) + blush(-50, -38) + blush(50, -38) + mouth(0, 44, 10, 6);
    return wrap('nose', o, s);
  }
  function tongue(o) {
    var s = P('M-80,-50 C-110,-4 -90,70 -36,92 C0,104 50,100 72,70 C102,28 84,-40 40,-60 C10,-72 -50,-70 -80,-50Z', '#F0707F', '#a63444') + L('M0,-66 C-4,-30 4,0 0,40', '#c8485a', 5);
    s += dots([[-56, -24, 5], [-44, -4, 5], [-60, 18, 5], [40, -30, 5], [56, -6, 5], [48, 20, 5], [-24, -38, 4], [26, -50, 4]], 5, '#FFA0AA', '#d85a6c') + eye(-30, 14, 13) + eye(24, 14, 13) + blush(-46, 38) + blush(42, 38) + mouth(-2, 44, 10, 7);
    return wrap('tongue', o, s);
  }
  function tooth(o) {
    var s = P('M-40,40 C-52,92 -44,118 -26,118 C-10,118 -8,80 0,66 C8,80 10,118 26,118 C44,118 52,92 40,40Z', '#F2EDE0', '#a8a08c') + P('M-84,-46 C-90,-92 -40,-100 0,-84 C40,-100 90,-92 84,-46 C80,0 62,40 40,56 C20,64 -20,64 -40,56 C-62,40 -80,0 -84,-46Z', '#FFFFFF', '#a8b0c8');
    s += P('M-60,-70 C-70,-50 -60,-20 -50,-10', '#fff', 0).replace('fill="#fff"', 'fill="none" stroke="#D8E6FA" stroke-width="7" stroke-linecap="round"') + eye(-30, -20, 14) + eye(30, -20, 14) + blush(-50, 8) + blush(50, 8) + mouth(0, 10, 11, 8) + '<path d="M62,-82 l4,-12 l4,12 l12,4 l-12,4 l-4,12 l-4,-12 l-12,-4z" fill="#FFE27A"/>';
    return wrap('tooth', o, s);
  }
  function bone(o) {
    var B = '#F4EAD2', Bd = '#a89868', s = P('M-110,-30 C-130,-50 -116,-84 -86,-74 C-78,-92 -46,-92 -42,-66 L40,-62 C46,-90 78,-88 84,-70 C112,-80 134,-48 110,-28 C130,-8 116,36 88,28 C84,52 52,54 44,36 L-40,40 C-46,62 -80,60 -84,42 C-114,48 -128,2 -110,-30Z', B, Bd);
    s += eye(-26, -12, 12) + eye(22, -12, 12) + blush(-42, 10) + blush(38, 10) + mouth(-2, 12, 9, 6) + L('M-96,-52 q8,-8 16,-8', '#fff', 5);
    return wrap('bone', o, s);
  }
  function skull(o) {
    var B = '#F6F1E3', Bd = '#a89868', s = P('M-24,60 L-24,100 L24,100 L24,60Z', B, Bd) + P('M-94,-6 C-102,-80 -50,-104 0,-104 C50,-104 102,-80 94,-6 C90,24 62,44 44,52 L44,66 L-44,66 L-44,52 C-62,44 -90,24 -94,-6Z', B, Bd);
    s += E(-36, -10, 24, 26, '#2b2f40', 0) + E(36, -10, 24, 26, '#2b2f40', 0) + P('M0,18 l-9,22 h18z', '#2b2f40', 0) + eye(-36, -12, 15) + eye(36, -12, 15) + L('M-30,66 v34 M-10,66 v34 M10,66 v34 M30,66 v34', Bd, 3) + mouth(0, 56, 11, 5) + L('M-60,-70 q20,-14 40,-16', '#fff', 5);
    return wrap('skull', o, s);
  }
  function muscle(o) {
    var sk = '#F2C29B', sd = '#b9805a', s = L('M-70,-66 L-40,20', sd, 54) + L('M-70,-66 L-40,20', sk, 46) + L('M-40,24 L96,42', sd, 54) + L('M-40,24 L96,42', sk, 46);
    s += E(-72, -84, 30, 32, sk, sd) + L('M-88,-100 l6,10 M-72,-106 l0,12 M-56,-100 l-4,10', sd, 3) + E(6, -6, 52, 48, sk, sd) + P('M-30,-30 C-10,-52 30,-52 50,-30', '#F9D8B8', 0).replace('fill="#F9D8B8"', 'fill="none" stroke="#F9D8B8" stroke-width="7" stroke-linecap="round"');
    s += eye(-12, -8, 12) + eye(26, -8, 12) + blush(-26, 16) + blush(40, 16) + mouth(6, 18, 9, 6);
    return wrap('muscle', o, s);
  }
  function redcell(o) {
    var s = E(0, 0, 100, 86, '#E23B48', '#8f1f2a') + E(0, 0, 58, 46, '#C32B39', 0) + E(0, 2, 40, 30, '#F0505F', 0, 0) + P('M-70,-50 C-60,-70 -30,-80 -10,-76', '#FF9AA2', 0).replace('fill="#FF9AA2"', 'fill="none" stroke="#FF9AA2" stroke-width="7" stroke-linecap="round"');
    s += eye(-26, -8, 13) + eye(24, -8, 13) + blush(-44, 18) + blush(40, 18) + mouth(-2, 18, 10, 7);
    return wrap('redcell', o, s);
  }
  function whitecell(o) {
    var s = P('M0,-96 C40,-110 84,-84 96,-44 C112,0 90,50 60,76 C34,100 -20,108 -60,84 C-100,56 -110,10 -92,-34 C-80,-70 -40,-90 0,-96Z', '#E9F2FF', '#7c9bd0') + P('M-20,-70 C-50,-60 -70,-30 -52,-6 C-34,-20 -10,-30 -20,-70Z', '#B79AE8', '#6c4ab0', 3) + dots([[54, 52, 8], [66, 34, 6], [-62, 60, 6]], 6, '#B79AE8');
    s += eye(-22, 6, 14) + eye(30, 6, 14) + blush(-42, 32) + blush(46, 32) + mouth(4, 34, 11, 7) + P('M-96,-8 l-14,-8 l-4,14z M90,60 l14,10 l-8,8z', '#E9F2FF', '#7c9bd0', 3);
    return wrap('whitecell', o, s);
  }
  function neuron(o) {
    var s = L('M-52,-34 C-90,-60 -96,-90 -110,-100 M-60,-8 C-100,-12 -120,-30 -126,-50 M-52,24 C-90,44 -104,70 -100,92 M-36,-50 C-40,-80 -30,-100 -20,-108', '#B79AE8', 8) + L('M44,4 C100,4 120,-20 160,-10', '#B79AE8', 10) + dots([[78, 2, 14], [118, -8, 12]], 12, '#F6D872', '#a8861a');
    s += '<ellipse cx="0" cy="0" rx="66" ry="60" fill="#D8C6F5" stroke="#6c4ab0" stroke-width="4"/>' + eye(-24, -6, 13) + eye(24, -6, 13) + blush(-42, 20) + blush(40, 20) + mouth(0, 22, 10, 7) + L('M-70,-100 l8,-14 M-130,-50 l-14,2', '#6c4ab0', 3);
    return wrap('neuron', o, s);
  }
  function cell(o) {
    var s = P('M0,-100 C60,-106 110,-60 104,0 C98,70 40,104 -20,98 C-80,92 -112,40 -104,-20 C-96,-76 -44,-96 0,-100Z', '#C8F0DC', '#4a9a78') + E(-6, 0, 46, 44, '#9EE0C0', '#4a9a78', 4);
    s += dots([[-72, -46, 8], [70, -52, 7], [76, 44, 9], [-64, 58, 7], [40, 76, 6]], 7, '#F6B8A0', '#c06a4e') + L('M-20,-30 q8,-10 16,0 q8,10 16,0', '#4a9a78', 3) + eye(-22, -8, 12) + eye(14, -8, 12) + blush(-36, 14) + blush(30, 14) + mouth(-4, 16, 9, 6);
    return wrap('cell', o, s);
  }

  var R = function (k, fn, name, slot, pitch) { window.__ffReg(k, fn, name, slot, pitch); };
  [['doc', doc, 'Dot', 'ollie', 1.2],
   ['heart', heart, 'Harry', 'finn', .9], ['brain', brain, 'Brian', 'finn', 1.1], ['lungs', lungs, 'Luna', 'ollie', 1], ['stomach', stomach, 'Stella', 'ollie', .85], ['gut', gut, 'Gus', 'finn', .8], ['liver', liver, 'Liv', 'ollie', .8], ['kidney', kidney, 'Kenny', 'finn', 1.2],
   ['hand', hand, 'Hank', 'finn', 1.0], ['eyeball', eyeball, 'Iris', 'ollie', 1.1], ['ear', ear, 'Earl', 'finn', .75], ['nose', nose, 'Nosey', 'finn', 1.3], ['tongue', tongue, 'Tilly', 'ollie', 1.2], ['tooth', tooth, 'Tobi', 'finn', 1.35],
   ['bone', bone, 'Bo', 'finn', .8], ['skull', skull, 'Skully', 'finn', .7], ['muscle', muscle, 'Max', 'finn', .65], ['redcell', redcell, 'Rosie', 'ollie', 1.25], ['whitecell', whitecell, 'Wendy', 'ollie', 1.05], ['neuron', neuron, 'Nerys', 'ollie', 1.3], ['cell', cell, 'Cello', 'finn', 1.15]
  ].forEach(function (a) { R(a[0], a[1], a[2], a[3], a[4]); });
})();
