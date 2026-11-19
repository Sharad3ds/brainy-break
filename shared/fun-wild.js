/* Brainy Break — cartoon wild animals for Fun Facts. Each character faces left, is centred on (0,0) and has .eye/.pup/.smile/.mouth parts so it can blink and lip-sync. */
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

  /* ---------- parrot guide ---------- */
  function kiki(o) {
    var s = L('M30,60 q30,60 10,100', '#e63946', 14) + L('M44,56 q40,50 30,96', '#2a9d8f', 12) + P('M-34,-8 C-54,50 -22,100 10,100 C46,100 56,40 36,-4 C20,-34 -20,-34 -34,-8Z', '#4CC26A', '#1f7a3a');
    s += E(-8, 40, 26, 40, '#FFE27A') + P('M20,6 C70,10 80,60 52,92 C38,60 28,40 20,6Z', '#2a9d8f', '#1b6f65', 3) + L('M30,40 l26,26 M24,22 l34,30', '#1b6f65', 3);
    s += E(-30, -42, 34, 32, '#4CC26A', '#1f7a3a') + P('M-26,-74 q4,-30 22,-34 q-2,18 6,34z', '#e63946', '#a61b2a', 3) + E(-14, -32, 11, 8, '#e63946', 0).replace('fill=', 'opacity=".5" fill=');
    s += P('M-56,-48 C-84,-52 -86,-22 -60,-14 C-52,-24 -50,-36 -56,-48Z', '#FFB703', '#c47d00', 3) + P('M-60,-14 C-70,-6 -66,4 -56,0 C-52,-6 -54,-10 -60,-14Z', '#e89400', '#c47d00', 3);
    s += eye(-38, -50, 8) + mouth(-60, -22, 4, 3) + L('M-6,104 l-4,12 M6,104 l-2,12', '#FFB703', 5) + L('M-12,116 l-6,2 M-4,116 l6,2', '#FFB703', 4);
    return wrap('kiki', o, s);
  }

  /* ---------- cats ---------- */
  function cat(kind) {
    var C = {
      lion: ['#E8A74B', '#F6D38E', '#9c6a22'], tiger: ['#F28C28', '#FFF1DC', '#b2551a'], cheetah: ['#E9B35D', '#FFF0CF', '#9a6a1f'],
      leopard: ['#E5B25D', '#FFF0CF', '#8a5a1b'], snowleopard: ['#C9D1D8', '#F3F6F8', '#5b6670']
    }[kind];
    return function (o) {
      var s = '', fur = C[0], bel = C[1], dk = C[2];
      s += L('M98,8 C150,-4 176,-40 160,-84', fur, 18) + (kind === 'snowleopard' ? L('M98,8 C150,-4 176,-40 160,-84', fur, 26) : '') + (kind === 'tiger' ? L('M142,-20 l12,-10 M152,-44 l14,-6 M160,-66 l14,-2', '#3a1d0d', 6) : L('M160,-84 l-2,-4', '#3a1d0d', 12));
      s += E(-62, 56, 17, 34, fur, dk) + E(86, 56, 17, 34, fur, dk) + E(10, 12, 106, 56, fur, dk) + E(8, 38, 84, 24, bel) + E(-34, 60, 17, 34, fur, dk) + E(60, 60, 17, 34, fur, dk);
      s += E(-58, 90, 19, 8, bel, dk, 3) + E(-34, 94, 19, 8, bel, dk, 3) + E(60, 94, 19, 8, bel, dk, 3) + E(86, 90, 19, 8, bel, dk, 3);
      if (kind === 'tiger') s += L('M-40,-40 q8,30 -4,60 M-6,-44 q10,34 -2,70 M30,-42 q10,34 0,70 M64,-34 q8,30 -2,56 M-70,-20 q6,24 -2,44', '#3a1d0d', 7);
      if (kind === 'cheetah') s += dots(SP, 5, '#3a2610');
      if (kind === 'leopard' || kind === 'snowleopard') s += SP.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="' + (kind === 'leopard' ? '#d9923b' : '#b3bcc4') + '" stroke="#3a2610" stroke-width="4" stroke-dasharray="14 5"/>'; }).join('');
      if (kind === 'lion') {
        for (var i = 0; i < 12; i++) { var a = i / 12 * 6.283; s += E(-104 + Math.cos(a) * 46, -16 + Math.sin(a) * 46, 26, 22, '#B5651D', '#7a3f10', 3); }
        s += E(-104, -16, 42, 40, '#8B4A14', 0);
      }
      s += E(-76, -58, 14, 14, fur, dk, 3) + E(-130, -60, 14, 14, fur, dk, 3) + E(-76, -57, 7, 7, '#f4a6b0', 0) + E(-130, -59, 7, 7, '#f4a6b0', 0);
      s += E(-104, -16, 42, 38, fur, dk) + E(-112, 4, 30, 22, bel) + P('M-124,-6 L-100,-6 L-112,4Z', '#5a2a32', '#3a1a20', 3);
      if (kind === 'tiger') s += L('M-104,-52 v14 M-116,-50 l-4,12 M-92,-50 l4,12 M-146,-24 l14,4 M-146,-10 l14,2 M-66,-24 l-14,4', '#3a1d0d', 5);
      if (kind === 'cheetah') s += L('M-124,-14 q-4,12 4,26 M-92,-14 q4,12 -4,26', '#3a2610', 4);
      if (kind === 'leopard' || kind === 'snowleopard') s += dots([[-90, -44], [-120, -46], [-80, -26], [-134, -30]], 3.5, '#3a2610');
      s += eye(-124, -22, 8) + eye(-92, -22, 8) + blush(-140, -4) + blush(-80, -4) + mouth(-112, 16, 8, 5);
      return wrap(kind, o, s);
    };
  }

  /* ---------- dogs ---------- */
  function dog(kind) {
    var C = { wolf: ['#8E98A3', '#E6EBEF', '#4a525a'], hyena: ['#C9A878', '#E8D5B0', '#6b4f2a'] }[kind];
    return function (o) {
      var s = '', fur = C[0], bel = C[1], dk = C[2];
      s += P('M96,0 C140,-14 176,6 172,44 C150,28 120,30 96,28Z', fur, dk, 4);
      s += E(-62, 56, 15, 34, fur, dk) + E(86, 56, 15, 34, fur, dk) + E(10, 10, 104, 48, fur, dk) + E(6, 32, 80, 20, bel) + E(-34, 60, 15, 34, fur, dk) + E(60, 60, 15, 34, fur, dk);
      s += E(-62, 90, 17, 7, dk, 0) + E(-34, 94, 17, 7, dk, 0) + E(60, 94, 17, 7, dk, 0) + E(86, 90, 17, 7, dk, 0);
      if (kind === 'wolf') s += P('M-70,-30 C-30,-44 40,-40 90,-22 C60,-14 -20,-8 -70,-12Z', '#6a737c', 0);
      if (kind === 'hyena') s += dots(SP.slice(0, 11), 6, '#4a3418') + L('M-60,-40 l-6,-14 M-30,-46 l-4,-14 M0,-48 l-2,-14 M30,-44 l0,-14 M60,-38 l2,-14', '#4a3418', 5);
      var ear = kind === 'hyena' ? E(-78, -58, 18, 18, fur, dk, 3) + E(-130, -58, 18, 18, fur, dk, 3) : P('M-90,-44 L-80,-92 L-58,-52Z', fur, dk, 3) + P('M-132,-44 L-138,-92 L-112,-52Z', fur, dk, 3);
      s += ear + E(-104, -14, 40, 36, fur, dk);
      s += P('M-120,-6 C-150,-14 -180,-4 -184,10 C-178,26 -140,30 -118,22Z', kind === 'hyena' ? '#4a3418' : bel, dk, 4) + E(-182, 6, 9, 7, '#1b1b22', 0);
      s += eye(-122, -26, 8) + eye(-94, -26, 8) + mouth(-150, 22, 9, 5);
      return wrap(kind, o, s);
    };
  }

  /* ---------- bears ---------- */
  function bear(kind) {
    var C = { polar: ['#F4F8FC', '#D6E3F0', '#6f88a6'], brown: ['#8B5A2B', '#C9A27A', '#4a2d12'], panda: ['#FFFFFF', '#E9EDF2', '#1b1b22'] }[kind];
    return function (o) {
      var s = '', fur = C[0], mz = C[1], dk = C[2], armc = kind === 'panda' ? '#1b1b22' : fur;
      s += E(98, 24, 18, 14, fur, dk, 3);
      s += E(-58, 58, 22, 34, armc, kind === 'panda' ? '#000' : dk) + E(84, 58, 22, 34, armc, kind === 'panda' ? '#000' : dk) + E(10, 16, 108, 62, fur, dk);
      if (kind === 'panda') s += P('M-70,-30 C-30,-40 -10,-20 -4,10 C-30,0 -60,0 -86,12Z', '#1b1b22', 0) + P('M64,-30 C90,-24 112,-4 114,16 C90,6 70,6 56,16Z', '#1b1b22', 0);
      if (kind === 'brown') s += E(-36, -40, 30, 18, '#7a4c22', 0);
      s += E(-34, 62, 22, 34, armc, kind === 'panda' ? '#000' : dk) + E(60, 62, 22, 34, armc, kind === 'panda' ? '#000' : dk);
      s += E(-58, 92, 20, 8, kind === 'panda' ? '#000' : mz, 0) + E(-34, 96, 20, 8, kind === 'panda' ? '#000' : mz, 0) + E(60, 96, 20, 8, kind === 'panda' ? '#000' : mz, 0) + E(84, 92, 20, 8, kind === 'panda' ? '#000' : mz, 0);
      s += E(-72, -52, 16, 16, kind === 'panda' ? '#1b1b22' : fur, dk, 3) + E(-134, -52, 16, 16, kind === 'panda' ? '#1b1b22' : fur, dk, 3);
      s += E(-104, -10, 46, 42, fur, dk);
      if (kind === 'panda') s += E(-122, -20, 14, 17, '#1b1b22', 0, 0, -20) + E(-86, -20, 14, 17, '#1b1b22', 0, 0, 20);
      s += E(-114, 8, 30, 22, mz) + E(-126, -2, 9, 6, '#1b1b22', 0);
      s += (kind === 'panda' ? '<circle cx="-122" cy="-22" r="7" fill="#fff"/><circle cx="-86" cy="-22" r="7" fill="#fff"/>' : '') + eye(-122, -22, kind === 'panda' ? 6 : 7.5) + eye(-88, -22, kind === 'panda' ? 6 : 7.5) + mouth(-112, 20, 8, 5);
      if (has(o, 'bamboo')) s += L('M-170,40 L-170,-40', '#5CB85C', 9) + L('M-170,0 h-12 M-170,-20 h12', '#2e7d32', 4);
      return wrap(kind, o, s);
    };
  }

  var R = function (k, fn, name, slot, pitch) { window.__ffReg(k, fn, name, slot, pitch); };
  [['kiki', kiki, 'Kiki', 'ollie', 1.3],
   ['lion', cat('lion'), 'Leo', 'finn', .72], ['tiger', cat('tiger'), 'Tara', 'ollie', .85], ['cheetah', cat('cheetah'), 'Chip', 'finn', 1.2], ['leopard', cat('leopard'), 'Lola', 'ollie', .95], ['snowleopard', cat('snowleopard'), 'Sasha', 'ollie', .9],
   ['wolf', dog('wolf'), 'Wyatt', 'finn', .8], ['hyena', dog('hyena'), 'Hazel', 'ollie', 1.2],
   ['polar', bear('polar'), 'Polly', 'ollie', .95], ['brown', bear('brown'), 'Barney', 'finn', .7], ['panda', bear('panda'), 'Pandy', 'ollie', 1.15]
  ].forEach(function (a) { R(a[0], a[1], a[2], a[3], a[4]); });
})();
